import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import styles from './OrderCartStyle';
import Header from '../../components/Header';

// 🔐 Replace with login role later
const userRole = 'fse';

const OrderCart = ({ navigation }) => {
  const [cart, setCart] = useState([
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
  ]);

  /* 🔐 PRICE BASED ON ROLE */
  const getPrice = item => {
    return item.retailerPrice;
  };

  /* ➕➖ UPDATE QUANTITY */
  const updateQty = (id, type) => {
    setCart(prev =>
      prev.map(item => {
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

  /* 🧮 TOTAL */
  const totalAmount = cart.reduce(
    (sum, item) => sum + getPrice(item) * item.qty,
    0,
  );

  const placeOrder = () => {
    const payload = {
      items: cart,
      totalAmount,
    };

    console.log('Order Payload:', payload);

    Alert.alert('Success', 'Order placed successfully');
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Cart</Text>
      </View> */}

      <Header title={'Order Cart'} />

      <ScrollView>
        <View style={styles.content}>
          {cart.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardRow}>
                {/* IMAGE */}
                <View style={styles.imageBox}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                </View>

                {/* PRODUCT INFO */}
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
          ))}
        </View>
      </ScrollView>

      {/* FOOTER */}
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
