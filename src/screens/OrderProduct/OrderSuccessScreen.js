import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { FileText } from 'lucide-react-native';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');

const OrderSuccessScreen = ({ route, navigation }) => {
  const { invoiceNumber, grandTotal, paymentMode, items, date } =
    route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goToInvoice = () => {
    navigation.navigate('InvoiceScreen', {
      invoiceNumber,
      items,
      total: grandTotal,
      paymentMode,
      date,
    });
  };

  const goToDashboard = () => navigation.navigate('Dashboard');
  const goToProductList = () => navigation.navigate('ProductList');

  return (
    <>
    <Header title={'Order Confirm'}/>
      <View style={styles.container}>
        {/* Lottie Animation */}
        <LottieView 
          source={require('../../assets/json/OrderSuccess.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
        />

        {/* Animated content fades/slides in below lottie */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>
            Your order has been placed successfully
          </Text>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Row label="Invoice No" value={invoiceNumber} />
            <Divider />
            <Row label="Payment Mode" value={paymentMode?.toUpperCase()} />
            <Divider />
            <Row
              label="Amount Paid"
              value={`₹${grandTotal}`}
              valueStyle={styles.amountText}
            />
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.primaryBtn} onPress={goToInvoice}>
            <FileText
              size={18}
              color="#fff"
              strokeWidth={2}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryText}>View Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineBtn} onPress={goToDashboard}>
            <Text style={styles.outlineText}>Back to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ghostBtn} onPress={goToProductList}>
            <Text style={styles.ghostText}>Book Another Order</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};

const Row = ({ label, value, valueStyle }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  lottie: {
    width: 200,
    height: 200,
  },

  content: {
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },

  infoBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 14,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowLabel: {
    fontSize: 13,
    color: '#666',
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  amountText: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },

  primaryBtn: {
    width: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  outlineBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 12,
  },
  outlineText: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: 14,
  },
  ghostBtn: {
    paddingVertical: 8,
  },
  ghostText: {
    color: '#888',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});

export default OrderSuccessScreen;
