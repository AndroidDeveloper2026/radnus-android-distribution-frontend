import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  lookupCustomer,
  addCustomer,
  updateCustomer,               // ✅ for editing existing customer
  resetCustomer,
  clearAddState,
  clearUpdateState,            // ✅ reset update status
} from '../../services/features/customer/customerSlice.js';
import { reduceStock } from '../../services/features/products/productSlice';
import LottieView from 'lottie-react-native';
import {
  FileText,
  ChevronDown,
  X,
  User,
  Truck,
  Calendar,
  Phone,
  UserPlus,
  CheckCircle,
  MapPin,
  Building2,
  AlertTriangle,
  WifiOff,
  CreditCard,
  IndianRupee,
} from 'lucide-react-native';
import Header from '../../components/Header';
import API from '../../services/API/api';
import styles from './OrderSucessStyle';
import { createActivityLog } from '../../services/features/activity/activitySlice.js';

const SALESPERSONS = [
  { id: 1, name: 'SHANTHI' },
  { id: 2, name: 'HARIVARTHINI' },
  { id: 3, name: 'UMA MAM' },
  { id: 4, name: 'SHARMILA' },
  { id: 5, name: 'MOHANA AMBIGAI' },
  { id: 6, name: 'KALAIVANI' },
  { id: 7, name: 'SUNDER SIR' },
  { id: 8, name: 'Direct WalkIn'},
];

const PAYMENT_MODES = [
  { id: 1, label: 'Cash' },
  { id: 2, label: 'GPay' },
  { id: 3, label: 'Credit Card' },
  { id: 4, label: 'Debit Card' },
];

const formatDate = iso =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

// Generate invoice number based on financial year
const getInvoiceNumber = invoiceNum => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  let financialYear;
  if (month >= 4) {
    financialYear = `${year}-${year + 1}`;
  } else {
    financialYear = `${year - 1}-${year}`;
  }
  const sequence = invoiceNum?.split('/')?.pop() || '001';
  return `RC${financialYear}/${sequence}`;
};

const OrderSuccessScreen = ({ route, navigation }) => {
  // ✅ Now we receive cartItems instead of invoiceNumber
  const { cartItems, grandTotal, paymentMode, date } = route.params || {};
  const [referenceNo, setReferenceNo] = useState('');

  const dispatch = useDispatch();
  const { data: customer, lookupState, addState, updateState, error } = useSelector(s => s.customer);
  const user = useSelector(state => state.auth.user);

  // Phone
  const [buyerPhone, setBuyerPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);

  // Add Customer Form
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');

  // ✅ Edit Customer Form
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editShopName, setEditShopName] = useState('');
  const [editCustomerType, setEditCustomerType] = useState('customer');

  // Shipping Address fields
  const [sameAsBuyer, setSameAsBuyer] = useState(true);
  const [shipToName, setShipToName] = useState('');
  const [shipToPhone, setShipToPhone] = useState('');
  const [shipToAddress, setShipToAddress] = useState('');
  const [shipToCity, setShipToCity] = useState('');
  const [shipToState, setShipToState] = useState('');

  // Other form
  const [courierCharge, setCourierCharge] = useState('80');
  const [selectedSP, setSelectedSP] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Confirm Modal
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const [selectedPaymentMode, setSelectedPaymentMode] = useState(
    paymentMode ? { label: paymentMode } : null,
  );
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [customerType, setCustomerType] = useState('customer');
  const [shopName, setShopName] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeBg = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    return () => dispatch(resetCustomer());
  }, []);

  useEffect(() => {
    if (buyerPhone.length === 10) {
      setPhoneError(false);
      dispatch(lookupCustomer(buyerPhone));
    } else {
      dispatch(resetCustomer());
    }
  }, [buyerPhone, dispatch]);

  useEffect(() => {
    if (addState === 'success') {
      setAddModalVisible(false);
      setNewName('');
      setNewAddress('');
      setNewCity('');
      setNewState('');
      dispatch(clearAddState());
    }
    if (addState === 'error' && error) {
      Alert.alert('Error', error);
      dispatch(clearAddState());
    }
  }, [addState, error, dispatch]);

  // ✅ Watch updateCustomer state
  // useEffect(() => {
  //   if (updateState === 'success') {
  //     setEditModalVisible(false);
  //     // Refresh customer data after successful update
  //     dispatch(lookupCustomer(buyerPhone));
  //     dispatch(clearUpdateState());
  //     Alert.alert('Success', 'Customer details updated successfully.');
  //   }
  //   if (updateState === 'error' && error) {
  //     Alert.alert('Error', error);
  //     dispatch(clearUpdateState());
  //   }
  // }, [updateState, error, dispatch, buyerPhone]);

//   useEffect(() => {
//   if (updateState === 'success') {
//     setEditModalVisible(false);
//     // Refresh customer data after successful update
//     dispatch(lookupCustomer(buyerPhone));
    
//     // ✅ Log the customer edit activity
//     dispatch(createActivityLog({
//       action: 'EDIT_CUSTOMER',
//       productId: null,           // not applicable for customer edit
//       productName: null,
//     }));
    
//     dispatch(clearUpdateState());
//     Alert.alert('Success', 'Customer details updated successfully.');
//   }
//   if (updateState === 'error' && error) {
//     Alert.alert('Error', error);
//     dispatch(clearUpdateState());
//   }
// }, [updateState, error, dispatch, buyerPhone]);

useEffect(() => {
  if (updateState === 'success') {
    setEditModalVisible(false);
    // Refresh customer data after successful update
    dispatch(lookupCustomer(buyerPhone));
    
    // ✅ Log the customer edit activity WITH customer identifier
    dispatch(createActivityLog({
      action: 'EDIT_CUSTOMER',
      productId: null,
      productName: null,
      customerIdentifier: buyerPhone,   // ✅ store the phone number as identifier
    }));
    
    dispatch(clearUpdateState());
    Alert.alert('Success', 'Customer details updated successfully.');
  }
  if (updateState === 'error' && error) {
    Alert.alert('Error', error);
    dispatch(clearUpdateState());
  }
}, [updateState, error, dispatch, buyerPhone]);

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleViewInvoice = () => {
    if (buyerPhone.length < 10) {
      setPhoneError(true);
      triggerShake();
      Alert.alert('Phone Required', 'Please enter a valid 10-digit phone number to continue.');
      return;
    }
    if (lookupState === 'loading') {
      Alert.alert('Please Wait', 'Verifying customer details…');
      return;
    }
    if (lookupState === 'notfound') {
      setPhoneError(true);
      triggerShake();
      Alert.alert(
        'Customer Not Found',
        'No customer registered with this number.\nPlease add customer details first.',
        [
          { text: '+ Add Customer', onPress: () => setAddModalVisible(true) },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
      return;
    }
    if (lookupState === 'error') {
      setPhoneError(true);
      Alert.alert('Connection Error', 'Could not reach server. Please check your connection and try again.');
      return;
    }
    if (lookupState === 'found') {
      setPhoneError(false);
      openConfirmModal();
    }
  };

  const handleSaveNewCustomer = () => {
    if (!newName.trim()) {
      Alert.alert('Required', 'Customer name is required.');
      return;
    }
    if (customerType === 'shop' && !shopName.trim()) {
      Alert.alert('Required', 'Shop name is required.');
      return;
    }
    dispatch(
      addCustomer({
        phone: buyerPhone,
        name: newName.trim(),
        address: newAddress.trim(),
        city: newCity.trim(),
        state: newState.trim(),
        type: customerType,
        shopName: shopName.trim(),
      }),
    );
  };

  const openConfirmModal = () => {
    setConfirmVisible(true);
    Animated.parallel([
      Animated.timing(fadeBg, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 70, friction: 10, useNativeDriver: true }),
    ]).start();
  };

  const closeConfirmModal = () => {
    Animated.parallel([
      Animated.timing(fadeBg, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
    ]).start(() => setConfirmVisible(false));
  };

  // // ✅ Create invoice and reduce stock ONLY on final confirmation
  // const goToInvoice = async () => {
  //   setIsConfirming(true);
  //   closeConfirmModal();

  //   try {
  //     // 1. Create invoice with status = 'completed'
  //     const invoiceRes = await API.post("/api/invoices", {
  //       billerName: user?.name || "Unknown",
  //       items: cartItems,
  //       totalAmount: grandTotal,
  //       paymentMode: selectedPaymentMode?.label || paymentMode,
  //       status: "completed", // ✅ directly completed
  //     });

  //     const invoiceNumber = invoiceRes.data.invoice.invoiceNumber;

  //     // 2. Reduce stock
  //     await dispatch(reduceStock(cartItems)).unwrap();

  //     // 3. Prepare shipping address
  //     const finalShipToName = sameAsBuyer
  //       ? (customer?.type === 'shop' ? customer.shopName : customer?.name)
  //       : shipToName;
  //     const finalShipToPhone = sameAsBuyer ? buyerPhone : shipToPhone;
  //     const finalShipToAddress = sameAsBuyer ? (customer?.address || '') : shipToAddress;
  //     const finalShipToCity = sameAsBuyer ? (customer?.city || '') : shipToCity;
  //     const finalShipToState = sameAsBuyer ? (customer?.state || '') : shipToState;

  //     // 4. Navigate to final invoice view
  //     setTimeout(() => {
  //       navigation.navigate('InvoiceScreen', {
  //         invoiceNumber: getInvoiceNumber(invoiceNumber),
  //         items: cartItems,
  //         total: grandTotal,
  //         paymentMode: selectedPaymentMode?.label || paymentMode,
  //         date,
  //         buyerName: customer?.type === 'shop'
  //           ? `${customer.shopName} (${customer.name})`
  //           : customer?.name,
  //         buyerPhone,
  //         buyerAddress: customer?.address || '',
  //         buyerCity: customer?.city || '',
  //         buyerState: customer?.state || '',
  //         courierCharge: parseFloat(courierCharge) || 0,
  //         salesperson: selectedSP?.name || '',
  //         referenceNo,
  //         shipToName: finalShipToName,
  //         shipToPhone: finalShipToPhone,
  //         shipToAddress: finalShipToAddress,
  //         shipToCity: finalShipToCity,
  //         shipToState: finalShipToState,
  //       });
  //     }, 300);
  //   } catch (err) {
  //     console.error('Error creating invoice or reducing stock:', err);
  //     Alert.alert(
  //       'Error',
  //       err.message || 'Failed to confirm order. Please try again.',
  //       [{ text: 'OK', onPress: () => setIsConfirming(false) }]
  //     );
  //   }
  // };

  const goToInvoice = async () => {
  setIsConfirming(true);
  closeConfirmModal();

  try {
    // Prepare items in the format expected by backend
    const invoiceItems = cartItems.map(item => ({
      productId: item.id || item.productId,
      name: item.name,
      qty: item.qty,
      price: item.price,
    }));

    const subtotal = grandTotal;                           // without courier
    const courier = parseFloat(courierCharge) || 0;
    const totalWithCourier = subtotal + courier;

    // Prepare shipping address (Consignee)
    const finalShipToName = sameAsBuyer
      ? (customer?.type === 'shop' ? customer.shopName : customer?.name)
      : shipToName;
    const finalShipToPhone = sameAsBuyer ? buyerPhone : shipToPhone;
    const finalShipToAddress = sameAsBuyer ? (customer?.address || '') : shipToAddress;
    const finalShipToCity = sameAsBuyer ? (customer?.city || '') : shipToCity;
    const finalShipToState = sameAsBuyer ? (customer?.state || '') : shipToState;

    // Full payload for invoice creation
    const payload = {
      // Existing required fields
      billerName: user?.name || "Unknown",
      items: invoiceItems,
      totalAmount: totalWithCourier,        // grand total including courier
      paymentMode: selectedPaymentMode?.label || paymentMode,
      status: "completed",

      // Customer (Bill To) details
      customerPhone: buyerPhone,
      customerName: customer?.name,
      customerType: customer?.type,
      shopName: customer?.shopName,
      customerAddress: customer?.address,
      customerCity: customer?.city,
      customerState: customer?.state,

      // Consignee (Ship To)
      sameAsBuyer: sameAsBuyer,
      shippingAddress: {
        name: finalShipToName,
        phone: finalShipToPhone,
        address: finalShipToAddress,
        city: finalShipToCity,
        state: finalShipToState,
      },

      // Additional invoice metadata
      subtotal: subtotal,                   // without courier
      courierCharge: courier,
      salesperson: selectedSP?.name || '',
      referenceNo: referenceNo || '',
      invoiceDate: date || new Date().toISOString(),
    };

    // 1. Create invoice with full details
    const invoiceRes = await API.post("/api/invoices", payload);
    const invoiceNumber = invoiceRes.data.invoice.invoiceNumber; // already in format RC2025-2026/001

    // 2. Reduce stock
    await dispatch(reduceStock(cartItems)).unwrap();

    // 3. Navigate to InvoiceScreen with all data (including shipping address)
    navigation.navigate('InvoiceScreen', {
      invoiceNumber: invoiceNumber,
      items: cartItems,
      total: grandTotal,
      paymentMode: selectedPaymentMode?.label || paymentMode,
      date: date,
      buyerName: customer?.type === 'shop'
        ? `${customer.shopName} (${customer.name})`
        : customer?.name,
      buyerPhone: buyerPhone,
      buyerAddress: customer?.address || '',
      buyerCity: customer?.city || '',
      buyerState: customer?.state || '',
      courierCharge: courier,
      salesperson: selectedSP?.name || '',
      referenceNo: referenceNo,
      shipToName: finalShipToName,
      shipToPhone: finalShipToPhone,
      shipToAddress: finalShipToAddress,
      shipToCity: finalShipToCity,
      shipToState: finalShipToState,
    });
  } catch (err) {
    console.error('Error creating invoice or reducing stock:', err);
    Alert.alert(
      'Error',
      err.message || 'Failed to confirm order. Please try again.',
      [{ text: 'OK', onPress: () => setIsConfirming(false) }]
    );
  }
};

  const grandTotalWithCourier = (grandTotal || 0) + (parseFloat(courierCharge) || 0);

  const renderLookupResult = () => {
    if (lookupState === 'loading') {
      return (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={styles.statusText}>Checking customer database…</Text>
        </View>
      );
    }
    if (lookupState === 'found') {
      return (
        <View style={styles.foundCard}>
          <View style={styles.foundCardTop}>
            <CheckCircle size={15} color="#16a34a" strokeWidth={2.5} />
            <Text style={styles.foundLabel}> Customer Found</Text>
            {/* ✅ Edit button instead of Change */}
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => {
                // Pre-fill edit modal with current customer data
                setEditName(customer?.name || '');
                setEditAddress(customer?.address || '');
                setEditCity(customer?.city || '');
                setEditState(customer?.state || '');
                setEditShopName(customer?.shopName || '');
                setEditCustomerType(customer?.type || 'customer');
                setEditModalVisible(true);
              }}
            >
              <Text style={styles.changeBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.customerName}>
            {customer?.type === 'shop' ? `${customer.shopName} (${customer.name})` : customer?.name}
          </Text>
          {customer?.address ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              <MapPin size={12} color="#555" strokeWidth={2} />
              <Text style={styles.customerSub}> {customer.address}</Text>
            </View>
          ) : null}
          {customer?.city || customer?.state ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              <Building2 size={12} color="#555" strokeWidth={2} />
              <Text style={styles.customerSub}>
                {'  '}{[customer.city, customer.state].filter(Boolean).join(', ')}
              </Text>
            </View>
          ) : null}
        </View>
      );
    }
    if (lookupState === 'notfound') {
      return (
        <View style={styles.notFoundBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AlertTriangle size={13} color="#dc2626" strokeWidth={2} />
            <Text style={[styles.notFoundText, { marginLeft: 5 }]}>No customer found for this number.</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddModalVisible(true)}>
            <UserPlus size={15} color="#fff" strokeWidth={2} />
            <Text style={styles.addBtnText}> Add Customer Details</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (lookupState === 'error') {
      return (
        <View style={styles.notFoundBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <WifiOff size={13} color="#dc2626" strokeWidth={2} />
            <Text style={[styles.notFoundText, { marginLeft: 5 }]}>Could not reach server. Check connection.</Text>
          </View>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: '#dc2626' }]} onPress={() => dispatch(lookupCustomer(buyerPhone))}>
            <Text style={styles.addBtnText}> Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <Header title="Order Confirm" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <LottieView source={require('../../assets/json/OrderSuccess.json')} autoPlay loop={false} style={styles.lottie} />
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.formCard}>
              <Text style={styles.formCardTitle}>Delivery & Invoice Details</Text>

              {/* Payment Mode Dropdown */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <CreditCard size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}> Payment Mode</Text>
                </View>
                <TouchableOpacity style={styles.dropdown} onPress={() => setPaymentDropdownOpen(o => !o)} activeOpacity={0.8}>
                  <Text style={selectedPaymentMode ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                    {selectedPaymentMode ? selectedPaymentMode.label.toUpperCase() : 'Select payment mode…'}
                  </Text>
                  <ChevronDown size={16} color="#888" style={{ transform: [{ rotate: paymentDropdownOpen ? '180deg' : '0deg' }] }} />
                </TouchableOpacity>
                {paymentDropdownOpen && (
                  <View style={styles.dropdownList}>
                    {PAYMENT_MODES.map(mode => (
                      <TouchableOpacity key={mode.id} style={[styles.dropdownItem, selectedPaymentMode?.id === mode.id && styles.dropdownItemActive]} onPress={() => { setSelectedPaymentMode(mode); setPaymentDropdownOpen(false); }}>
                        <Text style={[styles.dropdownItemText, selectedPaymentMode?.id === mode.id && styles.dropdownItemTextActive]}>{mode.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Amount Paid */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <IndianRupee size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}> Amount Paid</Text>
                </View>
                <View style={styles.readonlyField}>
                  <Text style={[styles.readonlyText, styles.amountText]}>₹{grandTotal?.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              {/* Invoice Date */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Calendar size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}> Invoice Date</Text>
                </View>
                <View style={styles.readonlyField}>
                  <Text style={styles.readonlyText}>{formatDate(date || new Date().toISOString())}</Text>
                </View>
              </View>

              {/* Salesperson Dropdown */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <User size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}> Salesperson</Text>
                </View>
                <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen(o => !o)} activeOpacity={0.8}>
                  <Text style={selectedSP ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                    {selectedSP ? selectedSP.name : 'Select salesperson…'}
                  </Text>
                  <ChevronDown size={16} color="#888" style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }} />
                </TouchableOpacity>
                {dropdownOpen && (
                  <View style={styles.dropdownList}>
                    {SALESPERSONS.map(sp => (
                      <TouchableOpacity key={sp.id} style={[styles.dropdownItem, selectedSP?.id === sp.id && styles.dropdownItemActive]} onPress={() => { setSelectedSP(sp); setDropdownOpen(false); }}>
                        <Text style={[styles.dropdownItemText, selectedSP?.id === sp.id && styles.dropdownItemTextActive]}>{sp.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Reference No */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <FileText size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}> Reference No.</Text>
                </View>
                <TextInput style={styles.input} placeholder="e.g. PO-12345" placeholderTextColor="#bbb" value={referenceNo} onChangeText={setReferenceNo} />
              </View>

              {/* Phone Number + Lookup */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Phone size={14} color={phoneError ? '#dc2626' : '#16a34a'} strokeWidth={2} />
                  <Text style={[styles.label, phoneError && { color: '#dc2626' }]}>
                    {'  Phone Number '}
                    <Text style={{ color: '#dc2626' }}>*</Text>
                  </Text>
                </View>
                <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                  <TextInput
                    style={[styles.input, phoneError && styles.inputError, lookupState === 'found' && styles.inputLocked]}
                    placeholder="Enter 10-digit phone number"
                    placeholderTextColor="#bbb"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={buyerPhone}
                    onChangeText={t => { setBuyerPhone(t); setPhoneError(false); }}
                    editable={lookupState !== 'found'}
                  />
                </Animated.View>
                {phoneError && buyerPhone.length < 10 && <Text style={styles.errorText}>Enter a valid 10-digit phone number</Text>}
                {renderLookupResult()}
              </View>

              {/* Shipping Address Section */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Truck size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}> Shipping Address</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: '#555' }}>Same as buyer address</Text>
                  <Switch value={sameAsBuyer} onValueChange={setSameAsBuyer} trackColor={{ false: '#ccc', true: '#16a34a' }} />
                </View>
                {!sameAsBuyer && (
                  <>
                    <TextInput style={styles.input} placeholder="Ship to Name" placeholderTextColor="#bbb" value={shipToName} onChangeText={setShipToName} />
                    <TextInput style={styles.input} placeholder="Ship to Phone" placeholderTextColor="#bbb" keyboardType="phone-pad" value={shipToPhone} onChangeText={setShipToPhone} />
                    <TextInput style={[styles.input, { height: 72, textAlignVertical: 'top' }]} placeholder="Ship to Address" placeholderTextColor="#bbb" multiline value={shipToAddress} onChangeText={setShipToAddress} />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput style={[styles.input, { flex: 1 }]} placeholder="City" placeholderTextColor="#bbb" value={shipToCity} onChangeText={setShipToCity} />
                      <TextInput style={[styles.input, { flex: 1 }]} placeholder="State" placeholderTextColor="#bbb" value={shipToState} onChangeText={setShipToState} />
                    </View>
                  </>
                )}
              </View>

              {/* Courier Charge */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Truck size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}> Courier Charge (₹)</Text>
                </View>
                <TextInput style={styles.input} placeholder="e.g. 80" placeholderTextColor="#bbb" keyboardType="numeric" value={courierCharge} onChangeText={setCourierCharge} />
              </View>

              {/* Grand Total */}
              <View style={styles.totalPreview}>
                <Text style={styles.totalPreviewLabel}>Grand Total (incl. courier)</Text>
                <Text style={styles.totalPreviewValue}>₹{grandTotalWithCourier.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.primaryBtn, isConfirming && { opacity: 0.6 }]}
              onPress={handleViewInvoice}
              disabled={isConfirming}
            >
              <FileText size={18} color="#fff" strokeWidth={2} style={{ marginRight: 8 }} />
              <Text style={styles.primaryText}>View Invoice</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Add Customer Modal */}
      <Modal transparent visible={addModalVisible} animationType="slide" onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.sheetOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.sheetCard}>
                <View style={styles.sheetHeader}>
                  <UserPlus size={18} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.sheetTitle}> Add New Customer</Text>
                  <TouchableOpacity onPress={() => setAddModalVisible(false)}><X size={20} color="#888" strokeWidth={2} /></TouchableOpacity>
                </View>
                <View style={styles.phonePill}><Phone size={13} color="#16a34a" strokeWidth={2} /><Text style={styles.phonePillText}> {buyerPhone}</Text></View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <TouchableOpacity onPress={() => setCustomerType('customer')}><Text style={{ color: customerType === 'customer' ? '#16a34a' : '#888', fontWeight: '600' }}>Customer</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setCustomerType('shop')}><Text style={{ marginLeft: 20, color: customerType === 'shop' ? '#16a34a' : '#888', fontWeight: '600' }}>Shop</Text></TouchableOpacity>
                </View>
                <TextInput style={styles.sheetInput} placeholder="Customer Name *" placeholderTextColor="#bbb" value={newName} onChangeText={setNewName} />
                {customerType === 'shop' && <TextInput style={styles.sheetInput} placeholder="Shop Name *" placeholderTextColor="#bbb" value={shopName} onChangeText={setShopName} />}
                <TextInput style={[styles.sheetInput, { height: 72, textAlignVertical: 'top' }]} placeholder="Delivery Address" placeholderTextColor="#bbb" multiline value={newAddress} onChangeText={setNewAddress} />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput style={[styles.sheetInput, { flex: 1 }]} placeholder="City" placeholderTextColor="#bbb" value={newCity} onChangeText={setNewCity} />
                  <TextInput style={[styles.sheetInput, { flex: 1 }]} placeholder="State" placeholderTextColor="#bbb" value={newState} onChangeText={setNewState} />
                </View>
                <TouchableOpacity style={[styles.saveBtn, addState === 'loading' && { opacity: 0.6 }]} onPress={handleSaveNewCustomer} disabled={addState === 'loading'}>
                  {addState === 'loading' ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Customer</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ✅ Edit Customer Modal */}
      <Modal
        transparent
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.sheetOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.sheetCard}>
                <View style={styles.sheetHeader}>
                  <UserPlus size={18} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.sheetTitle}> Edit Customer Details</Text>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                    <X size={20} color="#888" strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                <View style={styles.phonePill}>
                  <Phone size={13} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.phonePillText}> {buyerPhone}</Text>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <TouchableOpacity onPress={() => setEditCustomerType('customer')}>
                    <Text style={{ color: editCustomerType === 'customer' ? '#16a34a' : '#888', fontWeight: '600' }}>
                      Customer
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditCustomerType('shop')}>
                    <Text style={{ marginLeft: 20, color: editCustomerType === 'shop' ? '#16a34a' : '#888', fontWeight: '600' }}>
                      Shop
                    </Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.sheetInput}
                  placeholder="Customer Name *"
                  placeholderTextColor="#bbb"
                  value={editName}
                  onChangeText={setEditName}
                />
                {editCustomerType === 'shop' && (
                  <TextInput
                    style={styles.sheetInput}
                    placeholder="Shop Name *"
                    placeholderTextColor="#bbb"
                    value={editShopName}
                    onChangeText={setEditShopName}
                  />
                )}
                <TextInput
                  style={[styles.sheetInput, { height: 72, textAlignVertical: 'top' }]}
                  placeholder="Delivery Address"
                  placeholderTextColor="#bbb"
                  multiline
                  value={editAddress}
                  onChangeText={setEditAddress}
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    style={[styles.sheetInput, { flex: 1 }]}
                    placeholder="City"
                    placeholderTextColor="#bbb"
                    value={editCity}
                    onChangeText={setEditCity}
                  />
                  <TextInput
                    style={[styles.sheetInput, { flex: 1 }]}
                    placeholder="State"
                    placeholderTextColor="#bbb"
                    value={editState}
                    onChangeText={setEditState}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.saveBtn, updateState === 'loading' && { opacity: 0.6 }]}
                  onPress={() => {
                    if (!editName.trim()) {
                      Alert.alert('Required', 'Customer name is required.');
                      return;
                    }
                    if (editCustomerType === 'shop' && !editShopName.trim()) {
                      Alert.alert('Required', 'Shop name is required.');
                      return;
                    }
                    dispatch(updateCustomer({
                      phone: buyerPhone,
                      data: {
                        name: editName.trim(),
                        address: editAddress.trim(),
                        city: editCity.trim(),
                        state: editState.trim(),
                        type: editCustomerType,
                        shopName: editShopName.trim(),
                      },
                    }));
                  }}
                  disabled={updateState === 'loading'}
                >
                  {updateState === 'loading' ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Confirm Modal */}
      <Modal transparent visible={confirmVisible} animationType="none" onRequestClose={closeConfirmModal}>
        <Animated.View style={[styles.backdrop, { opacity: fadeBg }]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeConfirmModal} />
        </Animated.View>
        <View style={styles.centeredWrapper} pointerEvents="box-none">
          <Animated.View style={[styles.popup, { opacity: fadeBg, transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={closeConfirmModal}><X size={18} color="#888" strokeWidth={2} /></TouchableOpacity>
            <View style={styles.popupLottieWrapper}><LottieView source={require('../../assets/json/OrderSuccess.json')} autoPlay loop={false} style={styles.popupLottie} /></View>
            <Text style={styles.popupTitle}>Ready to Generate Invoice?</Text>
            <Text style={styles.popupSubtitle}>Please confirm the order details before proceeding.</Text>
            <View style={styles.popupInfoBox}>
              <Row label="Buyer" value={customer?.type === 'shop' ? `${customer.shopName} (${customer.name})` : customer?.name || '—'} />
              <Divider />
              <Row label="Phone" value={buyerPhone || '—'} />
              <Divider />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Address</Text>
                <Text style={[styles.rowValue, { flex: 1, textAlign: 'right', flexWrap: 'wrap' }]}>
                  {customer?.address ? [customer.address, customer.city, customer.state].filter(Boolean).join(', ') : '—'}
                </Text>
              </View>
              <Divider />
              <Row label="Salesperson" value={selectedSP?.name || '—'} />
              <Divider />
              <Row label="Courier" value={`₹${parseFloat(courierCharge) || 0}`} />
              <Divider />
              <Row label="Grand Total" value={`₹${grandTotalWithCourier.toLocaleString('en-IN')}`} valueStyle={styles.amountText} />
            </View>
            <TouchableOpacity
              style={[styles.primaryBtn, isConfirming && { opacity: 0.6 }]}
              onPress={goToInvoice}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
              ) : (
                <FileText size={18} color="#fff" strokeWidth={2} style={{ marginRight: 8 }} />
              )}
              <Text style={styles.primaryText}>{isConfirming ? 'Processing…' : 'Confirm & Generate Invoice'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={closeConfirmModal}
              disabled={isConfirming}
            >
              <Text style={styles.outlineText}>Go Back & Edit</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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

export default OrderSuccessScreen;