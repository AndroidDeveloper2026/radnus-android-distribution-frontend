import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../services/features/products/productSlice';
import { fetchInvoices } from '../../services/features/retailer/invoiceSlice';
import styles from './OrderCartStyle';
import Header from '../../components/Header';

const OrderCart = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { list: products, loading } = useSelector(state => state.products);
  const { data: invoices } = useSelector(state => state.invoice || { data: [] });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchInvoices("all"));
  }, [dispatch]);

  const mapProducts = list =>
    list.map(p => ({
      id: p._id,
      name: p.name ?? 'Unnamed Product',
      sku: p.sku ?? '-',
      retailerPrice: Number(p.retailerPrice) || 0,
      distributorPrice: Number(p.distributorPrice) || 0,
      mrp: Number(p.mrp) || 0,
      qty: 0,
      moq: Number(p.moq) || 1,
      currentStock: getCurrentStock(p._id, Number(p.moq) || 1),
      image: p.image ?? null,
    }));

  const getCurrentStock = (productId, moq) => {
    const totalSold = invoices.reduce((sum, invoice) => {
      if (invoice.status === 'draft') return sum;
      const item = invoice.items?.find(i => i.productId === productId);
      return sum + (item?.qty || 0);
    }, 0);
    return Math.max(0, moq - totalSold);
  };

  const initialCart = route?.params?.cartItems ?? mapProducts(products);
  const [cart, setCart] = useState(initialCart);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!route?.params?.cartItems && products.length > 0) {
      setCart(mapProducts(products));
    }
  }, [products]);

  const getPrice = item => item.retailerPrice;

  const filteredCart = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return cart;
    return cart.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query),
    );
  }, [cart, searchQuery]);

  const updateQty = (id, type) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          let newQty = type === 'inc' ? item.qty + 1 : item.qty - 1;
          if (newQty < 0) return item;
          return { ...item, qty: newQty };
        }
        return item;
      }),
    );
  };

  const totalAmount = cart.reduce((sum, item) => {
    const price = Number(getPrice(item)) || 0;
    const qty = Number(item.qty) || 0;
    return sum + price * qty;
  }, 0);

  // ✅ MODIFIED: Do NOT create invoice here – just navigate with cart data
  const placeOrder = async () => {
    const orderedItems = cart
      .filter(item => item.qty > 0)
      .map(item => ({
        productId: item.id,
        name: item.name,
        qty: item.qty,
        price: item.retailerPrice,
      }));

    if (orderedItems.length === 0) {
      Alert.alert('Empty Order', 'Please add at least one item.');
      return;
    }

    setIsPlacingOrder(true);
    try {
      // No API call – only navigate
      navigation.navigate('OrderSuccess', {
        cartItems: orderedItems,
        grandTotal: totalAmount,
        paymentMode: 'cash',
        date: new Date().toISOString(),
      });
    } catch (err) {
      Alert.alert("Error", "Failed to proceed to confirmation");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Header title={'Order Cart'} />

      <View style={styles.wrapper}>
        <View style={styles.inputBox}>
          <Search size={16} color="#999" strokeWidth={2} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Search by name or SKU…"
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={15} color="#999" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
        {searchQuery.length > 0 && (
          <Text style={styles.resultCount}>
            {filteredCart.length} result{filteredCart.length !== 1 ? 's' : ''} found
          </Text>
        )}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#e53935" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 8 }}>
          <View style={styles.content}>
            {filteredCart.length === 0 ? (
              <View style={styles.emptyBox}>
                <Search size={36} color="#ddd" strokeWidth={1.5} />
                <Text style={styles.emptyText}>No items match "{searchQuery}"</Text>
              </View>
            ) : (
              filteredCart.map(item => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={styles.imageBox}>
                      {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                      ) : (
                        <View style={[styles.productImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                          <Text style={{ fontSize: 10, color: '#aaa' }}>No Image</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.infoContainer}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.sku}>SKU: {item.sku}</Text>
                      <View style={styles.row}>
                        <Text style={styles.price}>₹{getPrice(item).toLocaleString('en-IN')}</Text>
                      </View>
                      <Text style={styles.moqText}>Stock: {item.currentStock} units</Text>
                    </View>
                    <View style={styles.stepperBtn}>
                      <View style={styles.qtyBox}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 'dec')}>
                          <Text>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.qty}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 'inc')}>
                          <Text>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      <View style={[styles.footer, { marginBottom: 0, paddingBottom: 16 }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeOrderBtn, isPlacingOrder && { opacity: 0.6 }]}
          onPress={placeOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>PLACE ORDER</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderCart;