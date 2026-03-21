import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import styles from './OrderCartStyle';
import Header from '../../components/Header';

const userRole = 'fse';

const OrderCart = ({ navigation, route }) => {
  // ✅ Accept cartItems passed from ProductList, fallback to default sample data
  const initialCart = route?.params?.cartItems ?? [
    {
      id: 1,
      name: 'Fast Charger 25W',
      sku: 'FC-25W-01',
      retailerPrice: 850,
      distributorPrice: 780,
      mrp: 999,
      qty: 5,
      moq: 5,
      image:
        'https://www.portronics.com/cdn/shop/files/Portronics_Adapto_100_Multiport_100w_Charger.png?v=1738651493',
    },
    {
      id: 2,
      name: 'Type-C Cable 1.5m',
      sku: 'TC-CABLE-15',
      retailerPrice: 320,
      distributorPrice: 290,
      mrp: 399,
      qty: 10,
      moq: 10,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr-qYBo49olQ7YpjOk9oO2t7j-sKiEB1TETw&s',
    },
  ];

  const [cart, setCart] = useState(initialCart);
  const [searchQuery, setSearchQuery] = useState('');

  const getPrice = (item) => item.retailerPrice;

  const filteredCart = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return cart;
    return cart.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query),
    );
  }, [cart, searchQuery]);

  const updateQty = (id, type) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let newQty = type === 'inc' ? item.qty + 1 : item.qty - 1;
          if (newQty < item.moq) {
            Alert.alert('MOQ Rule', `Minimum order quantity is ${item.moq}`);
            return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      }),
    );
  };

  // ✅ Total always from full cart, not filtered
  const totalAmount = cart.reduce(
    (sum, item) => sum + getPrice(item) * item.qty,
    0,
  );

  const placeOrder = () => {
    navigation.navigate('OrderSuccess', {
      invoiceNumber: 'INV-' + Date.now(),
      items: cart,
      grandTotal: totalAmount,
      paymentMode: 'cash',
      date: new Date().toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <Header title={'Order Cart'} />

      {/* ── Search Field ── */}
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
            {filteredCart.length} result{filteredCart.length !== 1 ? 's' : ''} found
          </Text>
        )}
      </View>

      <ScrollView>
        <View style={styles.content}>
          {filteredCart.length === 0 ? (
            <View style={styles.emptyBox}>
              <Search size={36} color="#ddd" strokeWidth={1.5} />
              <Text style={styles.emptyText}>
                No items match "{searchQuery}"
              </Text>
            </View>
          ) : (
            filteredCart.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={styles.imageBox}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.productImage}
                    />
                  </View>

                  <View style={styles.infoContainer}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.sku}>SKU: {item.sku}</Text>
                    <View style={styles.row}>
                      <Text style={styles.price}>₹{getPrice(item)}</Text>
                    </View>
                    <Text style={styles.moqText}>MOQ: {item.moq} units</Text>
                  </View>

                  <View style={styles.stepperBtn}>
                    <View style={styles.qtyBox}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQty(item.id, 'dec')}
                      >
                        <Text>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyText}>{item.qty}</Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQty(item.id, 'inc')}
                      >
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

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{totalAmount}</Text>
        </View>

        <TouchableOpacity style={styles.placeOrderBtn} onPress={placeOrder}>
          <Text style={styles.placeOrderText}>PLACE ORDER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderCart;