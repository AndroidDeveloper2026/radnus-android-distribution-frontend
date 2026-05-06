import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../services/features/products/productSlice';
import { fetchInvoices } from '../../services/features/retailer/invoiceSlice';
import styles from './OrderCartStyle';
import Header from '../../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Price Type Selector (Horizontal Buttons) ─────────────────
const PriceTypeSelector = ({ priceType, onSelectPriceType }) => {
  const options = [
    { label: 'Retailer', value: 'retailerPrice' },
    { label: 'Distributor', value: 'distributorPrice' },
    { label: 'Walk‑in', value: 'walkinPrice' },
    { label: 'MRP', value: 'mrp' },
  ];
  return (
    <View style={styles.priceSelectorRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.priceOption,
            priceType === opt.value && styles.priceOptionActive,
          ]}
          onPress={() => onSelectPriceType(opt.value)}
        >
          <Text
            style={[
              styles.priceOptionText,
              priceType === opt.value && styles.priceOptionTextActive,
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ─── Memoised Product Row Component (receives price prop) ─────
const ProductRow = React.memo(({ item, onUpdateQty, price }) => {
  const stock = Number(item.currentStock) || 0;
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.imageBox}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} />
          ) : (
            <View
              style={[
                styles.productImage,
                {
                  backgroundColor: '#f0f0f0',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={{ fontSize: 10, color: '#aaa' }}>No Image</Text>
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.sku}>SKU: {item.sku}</Text>
          <Text style={styles.price}>₹{price.toLocaleString('en-IN')}</Text>
          <Text style={styles.moqText}>Stock: {stock} units</Text>
        </View>
        <View style={styles.stepperBtn}>
          <View style={styles.qtyBox}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => onUpdateQty(item.id, 'dec')}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.qty}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => onUpdateQty(item.id, 'inc')}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const OrderCart = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.list);
  const invoices = useSelector(state => state.invoice.data);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [cart, setCart] = useState([]);
  const [priceType, setPriceType] = useState('retailerPrice'); // NEW: selected price field
  const isMounted = useRef(true);
  const hasInitialized = useRef(false);

  // Load data once
  useEffect(() => {
    isMounted.current = true;
    const loadData = async () => {
      try {
        const promises = [];
        if (!products?.length) promises.push(dispatch(fetchProducts()));
        if (!invoices?.length) promises.push(dispatch(fetchInvoices('all')));
        if (promises.length) await Promise.all(promises);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted.current = false;
    };
  }, [dispatch, products, invoices]);

  // Build sold quantities map (fast)
  const soldMap = useMemo(() => {
    const map = new Map();
    if (!invoices) return map;
    for (const inv of invoices) {
      if (inv.status === 'draft') continue;
      for (const it of inv.items || []) {
        const pid = it.productId;
        const qty = Number(it.qty) || 0;
        map.set(pid, (map.get(pid) || 0) + qty);
      }
    }
    return map;
  }, [invoices]);

  // Initial cart build – store ALL price fields
  useEffect(() => {
    if (!products?.length) return;
    if (hasInitialized.current) return;
    const newCart = products.map(p => {
      const moq = Number(p.moq) || 1;
      const sold = soldMap.get(p._id) || 0;
      return {
        id: p._id,
        name: p.name ?? 'Unnamed Product',
        sku: p.sku ?? '-',
        retailerPrice: Number(p.retailerPrice) || 0,
        distributorPrice: Number(p.distributorPrice) || 0,
        walkinPrice: Number(p.walkinPrice) || 0,
        mrp: Number(p.mrp) || 0,
        qty: 0,
        moq,
        currentStock: Math.max(0, moq - sold),
        image: p.image ?? null,
      };
    });
    setCart(newCart);
    hasInitialized.current = true;
  }, [products, soldMap]);

  // Fast quantity update
  const updateQty = useCallback((id, type) => {
    setCart(prevCart => {
      const index = prevCart.findIndex(item => item.id === id);
      if (index === -1) return prevCart;
      const oldItem = prevCart[index];
      let newQty = oldItem.qty;
      if (type === 'inc') newQty++;
      if (type === 'dec') newQty--;
      newQty = Math.max(0, Math.min(newQty, oldItem.currentStock));
      if (newQty === oldItem.qty) return prevCart;
      const newItem = { ...oldItem, qty: newQty };
      const newCart = [...prevCart];
      newCart[index] = newItem;
      return newCart;
    });
  }, []);

  // Filtered list for search
  const filteredCart = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return cart;
    return cart.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query),
    );
  }, [cart, searchQuery]);

  // Total amount – uses the selected price type
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const unitPrice = item[priceType] || 0;
      return sum + unitPrice * item.qty;
    }, 0);
  }, [cart, priceType]);

  // Place order – uses the current price type for each item
  const placeOrder = async () => {
    const orderedItems = cart
      .filter(item => item.qty > 0)
      .map(item => ({
        productId: item.id,
        name: item.name,
        qty: item.qty,
        price: item[priceType] || 0, // ✅ use selected price
      }));
    if (orderedItems.length === 0) {
      Alert.alert('Empty Order', 'Please add at least one item.');
      return;
    }
    setIsPlacingOrder(true);
    try {
      navigation.navigate('OrderSuccess', {
        cartItems: orderedItems,
        grandTotal: totalAmount,
        paymentMode: 'cash',
        date: new Date().toISOString(),
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to proceed to confirmation');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Order Cart" />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#e53935" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D32F2F' }}>
      <View style={[styles.container, { flex: 1 }]}>
        <Header title="Order Cart" />

        {/* Price Type Selector */}

        {/* Search Bar */}
        <View style={styles.wrapper}>
          <View style={styles.inputBox}>
            <Search
              size={16}
              color="#999"
              strokeWidth={2}
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Search by name or SKU…"
              placeholderTextColor="#bbb"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={15} color="#999" strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>
          {searchQuery.length > 0 && (
            <Text style={styles.resultCount}>
              {filteredCart.length} result{filteredCart.length !== 1 ? 's' : ''}{' '}
              found
            </Text>
          )}

          <PriceTypeSelector
            priceType={priceType}
            onSelectPriceType={setPriceType}
          />
        </View>

        {/* Fast FlatList with memoised rows */}
        <FlatList
          data={filteredCart}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductRow
              item={item}
              onUpdateQty={updateQty}
              price={item[priceType] || 0} // ✅ pass the effective price
            />
          )}
          initialNumToRender={20}
          maxToRenderPerBatch={30}
          windowSize={10}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Search size={36} color="#ddd" strokeWidth={1.5} />
              <Text style={styles.emptyText}>
                No items match "{searchQuery}"
              </Text>
            </View>
          }
        />

        {/* Footer */}
        <View style={[styles.footer, { marginBottom: 0, paddingBottom: 16 }]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </Text>
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
    </SafeAreaView>
  );
};

export default OrderCart;
