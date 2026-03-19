// import React, { useRef, useEffect, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, Animated,
//   TextInput, Modal, ScrollView, KeyboardAvoidingView,
//   Platform, ActivityIndicator, Alert,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   lookupCustomer,
//   addCustomer,
//   resetCustomer,
//   clearAddState,
// } from '../../services/features/customer/customerSlice.js';
// import LottieView from 'lottie-react-native';
// import {
//   FileText, ChevronDown, X, User,
//   Truck, Calendar, Phone, UserPlus, CheckCircle,
// } from 'lucide-react-native';
// import Header from '../../components/Header';
// import styles from './OrderSucessStyle';

// const SALESPERSONS = [
//   { id: 1, name: 'Arjun Kumar' },
//   { id: 2, name: 'Priya Sharma' },
//   { id: 3, name: 'Rahul Verma' },
//   { id: 4, name: 'Sneha Nair' },
//   { id: 5, name: 'Manoj Das' },
// ];

// const formatDate = (iso) =>
//   new Date(iso).toLocaleDateString('en-IN', {
//     day: '2-digit', month: 'short', year: 'numeric',
//   });

// // ─────────────────────────────────────────────────────────
// const OrderSuccessScreen = ({ route, navigation }) => {
//   const { invoiceNumber, grandTotal, paymentMode, items, date } =
//     route.params || {};

//   const dispatch = useDispatch();
//   const {
//     data:        customer,
//     lookupState,
//     addState,
//     error,
//   } = useSelector(s => s.customer);

//   // ── Phone ──────────────────────────────────────────────
//   const [buyerPhone, setBuyerPhone] = useState('');
//   const [phoneError, setPhoneError] = useState(false);

//   // ── Add Customer Form ──────────────────────────────────
//   const [addModalVisible, setAddModalVisible] = useState(false);
//   const [newName,         setNewName]         = useState('');
//   const [newAddress,      setNewAddress]      = useState('');
//   const [newCity,         setNewCity]         = useState('');
//   const [newState,        setNewState]        = useState('');

//   // ── Other Form ─────────────────────────────────────────
//   const [courierCharge, setCourierCharge] = useState('80');
//   const [selectedSP,    setSelectedSP]    = useState(null);
//   const [dropdownOpen,  setDropdownOpen]  = useState(false);

//   // ── Confirm Modal ──────────────────────────────────────
//   const [confirmVisible, setConfirmVisible] = useState(false);

//   // ── Animations ─────────────────────────────────────────
//   const fadeAnim  = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(30)).current;
//   const shakeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;
//   const fadeBg    = useRef(new Animated.Value(0)).current;

//   // ── Entry animation + cleanup on unmount ───────────────
//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
//       Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
//     ]).start();
//     return () => { dispatch(resetCustomer()); };
//   }, [dispatch]);

//   // ── Auto-lookup when exactly 10 digits entered ─────────
//   useEffect(() => {
//     if (buyerPhone.length === 10) {
//       setPhoneError(false);
//       dispatch(lookupCustomer(buyerPhone));  // 🔍 hit the DB
//     } else {
//       dispatch(resetCustomer());             // reset if less than 10
//     }
//   }, [buyerPhone, dispatch]);

//   // ── Handle Add Customer result ─────────────────────────
//   useEffect(() => {
//     if (addState === 'success') {
//       // ✅ Saved to DB — close modal, clear form
//       setAddModalVisible(false);
//       setNewName('');
//       setNewAddress('');
//       setNewCity('');
//       setNewState('');
//       dispatch(clearAddState());
//     }
//     if (addState === 'error' && error) {
//       Alert.alert('Error', error);
//       dispatch(clearAddState());
//     }
//   }, [addState, error, dispatch]);

//   // ── Shake animation ────────────────────────────────────
//   const triggerShake = () => {
//     shakeAnim.setValue(0);
//     Animated.sequence([
//       Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: 8,   duration: 50, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: -8,  duration: 50, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: 0,   duration: 50, useNativeDriver: true }),
//     ]).start();
//   };

//   // ── View Invoice — validation gate ─────────────────────
//   const handleViewInvoice = () => {

//     // ❌ 1. Phone empty or incomplete
//     if (buyerPhone.length < 10) {
//       setPhoneError(true);
//       triggerShake();
//       Alert.alert(
//         '📱 Phone Required',
//         'Please enter a valid 10-digit phone number to continue.'
//       );
//       return;
//     }

//     // ⏳ 2. Still checking DB
//     if (lookupState === 'loading') {
//       Alert.alert('⏳ Please Wait', 'Verifying customer details…');
//       return;
//     }

//     // ❌ 3. Phone entered but no customer found — must add first
//     if (lookupState === 'notfound') {
//       setPhoneError(true);
//       triggerShake();
//       Alert.alert(
//         '👤 Customer Not Found',
//         'No customer registered with this number.\nPlease add customer details first.',
//         [
//           {
//             text: '+ Add Customer',
//             onPress: () => setAddModalVisible(true),
//           },
//           { text: 'Cancel', style: 'cancel' },
//         ]
//       );
//       return;
//     }

//     // ❌ 4. Network/server error
//     if (lookupState === 'error') {
//       setPhoneError(true);
//       Alert.alert(
//         '❌ Connection Error',
//         'Could not reach server. Please check your connection and try again.'
//       );
//       return;
//     }

//     // ✅ 5. Customer found — open confirm modal
//     if (lookupState === 'found') {
//       setPhoneError(false);
//       openConfirmModal();
//     }
//   };

//   // ── Save new customer to DB ────────────────────────────
//   const handleSaveNewCustomer = () => {
//     if (!newName.trim()) {
//       Alert.alert('Required', 'Customer name is required.');
//       return;
//     }
//     dispatch(addCustomer({
//       phone:   buyerPhone,
//       name:    newName.trim(),
//       address: newAddress.trim(),
//       city:    newCity.trim(),
//       state:   newState.trim(),
//     }));
//   };

//   // ── Confirm Modal ──────────────────────────────────────
//   const openConfirmModal = () => {
//     setConfirmVisible(true);
//     Animated.parallel([
//       Animated.timing(fadeBg,    { toValue: 1, duration: 300, useNativeDriver: true }),
//       Animated.spring(scaleAnim, { toValue: 1, tension: 70, friction: 10, useNativeDriver: true }),
//     ]).start();
//   };

//   const closeConfirmModal = () => {
//     Animated.parallel([
//       Animated.timing(fadeBg,    { toValue: 0, duration: 200, useNativeDriver: true }),
//       Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
//     ]).start(() => setConfirmVisible(false));
//   };

//   // ── Navigate to Invoice Screen ─────────────────────────
//   const goToInvoice = () => {
//     closeConfirmModal();
//     setTimeout(() => {
//       navigation.navigate('InvoiceScreen', {
//         invoiceNumber,
//         items,
//         total:         grandTotal,
//         paymentMode,
//         date,
//         buyerName:     customer?.name    || '',
//         buyerPhone,
//         buyerAddress:  customer?.address || '',
//         buyerCity:     customer?.city    || '',
//         buyerState:    customer?.state   || '',
//         courierCharge: parseFloat(courierCharge) || 0,
//         salesperson:   selectedSP?.name  || '',
//       });
//     }, 300);
//   };

//   const grandTotalWithCourier =
//     (grandTotal || 0) + (parseFloat(courierCharge) || 0);

//   // ── Phone Lookup Result Card ───────────────────────────
//   const renderLookupResult = () => {

//     // ⏳ Loading
//     if (lookupState === 'loading') {
//       return (
//         <View style={styles.statusRow}>
//           <ActivityIndicator size="small" color="#16a34a" />
//           <Text style={styles.statusText}>Checking customer database…</Text>
//         </View>
//       );
//     }

//     // ✅ Found — show customer details card
//     if (lookupState === 'found') {
//       return (
//         <View style={styles.foundCard}>
//           {/* Header row */}
//           <View style={styles.foundCardTop}>
//             <CheckCircle size={15} color="#16a34a" strokeWidth={2.5} />
//             <Text style={styles.foundLabel}>  Customer Found</Text>
//             <TouchableOpacity
//               style={styles.changeBtn}
//               onPress={() => {
//                 dispatch(resetCustomer());
//                 setBuyerPhone('');
//                 setPhoneError(false);
//               }}
//             >
//               <Text style={styles.changeBtnText}>Change</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Customer Details */}
//           <Text style={styles.customerName}>{customer?.name}</Text>
//           {customer?.address
//             ? <Text style={styles.customerSub}>📍 {customer.address}</Text>
//             : null}
//           {(customer?.city || customer?.state)
//             ? <Text style={styles.customerSub}>
//                 🏙 {[customer.city, customer.state].filter(Boolean).join(', ')}
//               </Text>
//             : null}
//         </View>
//       );
//     }

//     // ❌ Not Found — show Add Customer button
//     if (lookupState === 'notfound') {
//       return (
//         <View style={styles.notFoundBox}>
//           <Text style={styles.notFoundText}>
//             ⚠️  No customer found for this number.
//           </Text>
//           <TouchableOpacity
//             style={styles.addBtn}
//             onPress={() => setAddModalVisible(true)}
//           >
//             <UserPlus size={15} color="#fff" strokeWidth={2} />
//             <Text style={styles.addBtnText}>  Add Customer Details</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     // ❌ Network error — show Retry
//     if (lookupState === 'error') {
//       return (
//         <View style={styles.notFoundBox}>
//           <Text style={styles.notFoundText}>
//             ❌  Could not reach server. Check connection.
//           </Text>
//           <TouchableOpacity
//             style={[styles.addBtn, { backgroundColor: '#dc2626' }]}
//             onPress={() => dispatch(lookupCustomer(buyerPhone))}
//           >
//             <Text style={styles.addBtnText}>↺  Retry</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     return null;
//   };

//   // ─────────────────────────────────────────────────────────
//   return (
//     <>
//       <Header title="Order Confirm" />

//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <LottieView
//             source={require('../../assets/json/OrderSuccess.json')}
//             autoPlay
//             loop={false}
//             style={styles.lottie}
//           />

//           <Animated.View
//             style={[
//               styles.content,
//               { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
//             ]}
//           >
//             {/* ══ Order Summary Box ══ */}
//             <View style={styles.infoBox}>
//               <Row label="Invoice No"   value={invoiceNumber} />
//               <Divider />
//               <Row label="Payment Mode" value={paymentMode?.toUpperCase()} />
//               <Divider />
//               <Row
//                 label="Amount Paid"
//                 value={`₹${grandTotal}`}
//                 valueStyle={styles.amountText}
//               />
//             </View>

//             {/* ══ Form Card ══ */}
//             <View style={styles.formCard}>
//               <Text style={styles.formCardTitle}>
//                 Delivery & Invoice Details
//               </Text>

//               {/* Invoice Date */}
//               <View style={styles.fieldGroup}>
//                 <View style={styles.labelRow}>
//                   <Calendar size={14} color="#16a34a" strokeWidth={2} />
//                   <Text style={styles.label}>  Invoice Date</Text>
//                 </View>
//                 <View style={styles.readonlyField}>
//                   <Text style={styles.readonlyText}>
//                     {formatDate(date || new Date().toISOString())}
//                   </Text>
//                 </View>
//               </View>

//               {/* Salesperson Dropdown */}
//               <View style={styles.fieldGroup}>
//                 <View style={styles.labelRow}>
//                   <User size={14} color="#16a34a" strokeWidth={2} />
//                   <Text style={styles.label}>  Salesperson</Text>
//                 </View>
//                 <TouchableOpacity
//                   style={styles.dropdown}
//                   onPress={() => setDropdownOpen(o => !o)}
//                   activeOpacity={0.8}
//                 >
//                   <Text
//                     style={
//                       selectedSP
//                         ? styles.dropdownSelected
//                         : styles.dropdownPlaceholder
//                     }
//                   >
//                     {selectedSP ? selectedSP.name : 'Select salesperson…'}
//                   </Text>
//                   <ChevronDown
//                     size={16}
//                     color="#888"
//                     style={{
//                       transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }],
//                     }}
//                   />
//                 </TouchableOpacity>
//                 {dropdownOpen && (
//                   <View style={styles.dropdownList}>
//                     {SALESPERSONS.map(sp => (
//                       <TouchableOpacity
//                         key={sp.id}
//                         style={[
//                           styles.dropdownItem,
//                           selectedSP?.id === sp.id && styles.dropdownItemActive,
//                         ]}
//                         onPress={() => {
//                           setSelectedSP(sp);
//                           setDropdownOpen(false);
//                         }}
//                       >
//                         <Text
//                           style={[
//                             styles.dropdownItemText,
//                             selectedSP?.id === sp.id &&
//                               styles.dropdownItemTextActive,
//                           ]}
//                         >
//                           {sp.name}
//                         </Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 )}
//               </View>

//               {/* ══ Phone Number + Live Lookup ══ */}
//               <View style={styles.fieldGroup}>
//                 <View style={styles.labelRow}>
//                   <Phone
//                     size={14}
//                     color={phoneError ? '#dc2626' : '#16a34a'}
//                     strokeWidth={2}
//                   />
//                   <Text
//                     style={[
//                       styles.label,
//                       phoneError && { color: '#dc2626' },
//                     ]}
//                   >
//                     {'  Phone Number '}
//                     <Text style={{ color: '#dc2626' }}>*</Text>
//                   </Text>
//                 </View>

//                 {/* Shake wrapper */}
//                 <Animated.View
//                   style={{ transform: [{ translateX: shakeAnim }] }}
//                 >
//                   <TextInput
//                     style={[
//                       styles.input,
//                       phoneError && styles.inputError,
//                       lookupState === 'found' && styles.inputLocked,
//                     ]}
//                     placeholder="Enter 10-digit phone number"
//                     placeholderTextColor="#bbb"
//                     keyboardType="phone-pad"
//                     maxLength={10}
//                     value={buyerPhone}
//                     onChangeText={(t) => {
//                       setBuyerPhone(t);
//                       setPhoneError(false);
//                     }}
//                     editable={lookupState !== 'found'}
//                   />
//                 </Animated.View>

//                 {/* Inline error text */}
//                 {phoneError && buyerPhone.length < 10 && (
//                   <Text style={styles.errorText}>
//                     ⚠ Enter a valid 10-digit phone number
//                   </Text>
//                 )}

//                 {/* ✅ Dynamic result: loading / found / notfound / error */}
//                 {renderLookupResult()}
//               </View>

//               {/* Courier Charge */}
//               <View style={styles.fieldGroup}>
//                 <View style={styles.labelRow}>
//                   <Truck size={14} color="#16a34a" strokeWidth={2} />
//                   <Text style={styles.label}>  Courier Charge (₹)</Text>
//                 </View>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="e.g. 80"
//                   placeholderTextColor="#bbb"
//                   keyboardType="numeric"
//                   value={courierCharge}
//                   onChangeText={setCourierCharge}
//                 />
//               </View>

//               {/* Grand Total */}
//               <View style={styles.totalPreview}>
//                 <Text style={styles.totalPreviewLabel}>
//                   Grand Total (incl. courier)
//                 </Text>
//                 <Text style={styles.totalPreviewValue}>
//                   ₹{grandTotalWithCourier}
//                 </Text>
//               </View>
//             </View>

//             {/* ══ Action Buttons ══ */}
//             <TouchableOpacity
//               style={styles.primaryBtn}
//               onPress={handleViewInvoice}
//             >
//               <FileText
//                 size={18}
//                 color="#fff"
//                 strokeWidth={2}
//                 style={{ marginRight: 8 }}
//               />
//               <Text style={styles.primaryText}>View Invoice</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.outlineBtn}
//               onPress={() => navigation.navigate('Dashboard')}
//             >
//               <Text style={styles.outlineText}>Back to Dashboard</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.ghostBtn}
//               onPress={() => navigation.navigate('ProductList')}
//             >
//               <Text style={styles.ghostText}>Book Another Order</Text>
//             </TouchableOpacity>

//           </Animated.View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* ════════════════════════════════════════
//           ADD CUSTOMER — Bottom Sheet Modal
//           ════════════════════════════════════════ */}
//       <Modal
//         transparent
//         visible={addModalVisible}
//         animationType="slide"
//         onRequestClose={() => setAddModalVisible(false)}
//       >
//         <View style={styles.sheetOverlay}>
//           <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           >
//             <ScrollView keyboardShouldPersistTaps="handled">
//               <View style={styles.sheetCard}>

//                 {/* Header */}
//                 <View style={styles.sheetHeader}>
//                   <UserPlus size={18} color="#16a34a" strokeWidth={2} />
//                   <Text style={styles.sheetTitle}>  Add New Customer</Text>
//                   <TouchableOpacity
//                     onPress={() => setAddModalVisible(false)}
//                   >
//                     <X size={20} color="#888" strokeWidth={2} />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Phone pill — shows which number being registered */}
//                 <View style={styles.phonePill}>
//                   <Phone size={13} color="#16a34a" strokeWidth={2} />
//                   <Text style={styles.phonePillText}>  {buyerPhone}</Text>
//                 </View>

//                 {/* Form fields */}
//                 <TextInput
//                   style={styles.sheetInput}
//                   placeholder="Customer Name *"
//                   placeholderTextColor="#bbb"
//                   value={newName}
//                   onChangeText={setNewName}
//                 />
//                 <TextInput
//                   style={[
//                     styles.sheetInput,
//                     { height: 72, textAlignVertical: 'top' },
//                   ]}
//                   placeholder="Delivery Address"
//                   placeholderTextColor="#bbb"
//                   multiline
//                   value={newAddress}
//                   onChangeText={setNewAddress}
//                 />
//                 <View style={{ flexDirection: 'row', gap: 8 }}>
//                   <TextInput
//                     style={[styles.sheetInput, { flex: 1 }]}
//                     placeholder="City"
//                     placeholderTextColor="#bbb"
//                     value={newCity}
//                     onChangeText={setNewCity}
//                   />
//                   <TextInput
//                     style={[styles.sheetInput, { flex: 1 }]}
//                     placeholder="State"
//                     placeholderTextColor="#bbb"
//                     value={newState}
//                     onChangeText={setNewState}
//                   />
//                 </View>

//                 {/* Save button */}
//                 <TouchableOpacity
//                   style={[
//                     styles.saveBtn,
//                     addState === 'loading' && { opacity: 0.6 },
//                   ]}
//                   onPress={handleSaveNewCustomer}
//                   disabled={addState === 'loading'}
//                 >
//                   {addState === 'loading' ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text style={styles.saveBtnText}>Save Customer</Text>
//                   )}
//                 </TouchableOpacity>

//               </View>
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </View>
//       </Modal>

//       {/* ════════════════════════════════════════
//           CONFIRM INVOICE Modal
//           ════════════════════════════════════════ */}
//       <Modal
//         transparent
//         visible={confirmVisible}
//         animationType="none"
//         onRequestClose={closeConfirmModal}
//       >
//         <Animated.View style={[styles.backdrop, { opacity: fadeBg }]}>
//           <TouchableOpacity
//             style={StyleSheet.absoluteFill}
//             onPress={closeConfirmModal}
//           />
//         </Animated.View>

//         <View style={styles.centeredWrapper} pointerEvents="box-none">
//           <Animated.View
//             style={[
//               styles.popup,
//               { opacity: fadeBg, transform: [{ scale: scaleAnim }] },
//             ]}
//           >
//             <TouchableOpacity
//               style={styles.closeBtn}
//               onPress={closeConfirmModal}
//             >
//               <X size={18} color="#888" strokeWidth={2} />
//             </TouchableOpacity>

//             <View style={styles.popupLottieWrapper}>
//               <LottieView
//                 source={require('../../assets/json/OrderSuccess.json')}
//                 autoPlay
//                 loop={false}
//                 style={styles.popupLottie}
//               />
//             </View>

//             <Text style={styles.popupTitle}>Ready to Generate Invoice?</Text>
//             <Text style={styles.popupSubtitle}>
//               Please confirm the order details before proceeding.
//             </Text>

//             {/* Summary */}
//             <View style={styles.popupInfoBox}>
//               <Row label="Invoice No"  value={invoiceNumber} />
//               <Divider />
//               <Row label="Buyer"       value={customer?.name || '—'} />
//               <Divider />
//               <Row label="Phone"       value={buyerPhone || '—'} />
//               <Divider />
//               <Row
//                 label="Address"
//                 value={
//                   customer?.address
//                     ? [
//                         customer.address,
//                         customer.city,
//                         customer.state,
//                       ]
//                         .filter(Boolean)
//                         .join(', ')
//                     : '—'
//                 }
//               />
//               <Divider />
//               <Row label="Salesperson" value={selectedSP?.name || '—'} />
//               <Divider />
//               <Row
//                 label="Courier"
//                 value={`₹${parseFloat(courierCharge) || 0}`}
//               />
//               <Divider />
//               <Row
//                 label="Grand Total"
//                 value={`₹${grandTotalWithCourier}`}
//                 valueStyle={styles.amountText}
//               />
//             </View>

//             <TouchableOpacity
//               style={styles.primaryBtn}
//               onPress={goToInvoice}
//             >
//               <FileText
//                 size={18}
//                 color="#fff"
//                 strokeWidth={2}
//                 style={{ marginRight: 8 }}
//               />
//               <Text style={styles.primaryText}>
//                 Confirm & Generate Invoice
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.outlineBtn}
//               onPress={closeConfirmModal}
//             >
//               <Text style={styles.outlineText}>Go Back & Edit</Text>
//             </TouchableOpacity>

//           </Animated.View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// // ── Local Styles ───────────────────────────────────────────
// // const styles.= StyleSheet.create({
 
// // });

// const Row = ({ label, value, valueStyle }) => (
//   <View style={styles.row}>
//     <Text style={styles.rowLabel}>{label}</Text>
//     <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
//   </View>
// );

// const Divider = () => <View style={styles.divider} />;

// export default OrderSuccessScreen;

import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  TextInput, Modal, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  lookupCustomer,
  addCustomer,
  resetCustomer,
  clearAddState,
} from '../../services/features/customer/customerSlice.js';
import LottieView from 'lottie-react-native';
import {
  FileText, ChevronDown, X, User,
  Truck, Calendar, Phone, UserPlus, CheckCircle,
  MapPin, Building2, AlertTriangle, WifiOff,
} from 'lucide-react-native';
import Header from '../../components/Header';
import styles from './OrderSucessStyle';

const SALESPERSONS = [
  { id: 1, name: 'Arjun Kumar' },
  { id: 2, name: 'Priya Sharma' },
  { id: 3, name: 'Rahul Verma' },
  { id: 4, name: 'Sneha Nair' },
  { id: 5, name: 'Manoj Das' },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

// ─────────────────────────────────────────────────────────
const OrderSuccessScreen = ({ route, navigation }) => {
  const { invoiceNumber, grandTotal, paymentMode, items, date } =
    route.params || {};

  const dispatch = useDispatch();
  const {
    data:        customer,
    lookupState,
    addState,
    error,
  } = useSelector(s => s.customer);

  // ── Phone ──────────────────────────────────────────────
  const [buyerPhone, setBuyerPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);

  // ── Add Customer Form ──────────────────────────────────
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newName,         setNewName]         = useState('');
  const [newAddress,      setNewAddress]      = useState('');
  const [newCity,         setNewCity]         = useState('');
  const [newState,        setNewState]        = useState('');

  // ── Other Form ─────────────────────────────────────────
  const [courierCharge, setCourierCharge] = useState('80');
  const [selectedSP,    setSelectedSP]    = useState(null);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);

  // ── Confirm Modal ──────────────────────────────────────
  const [confirmVisible, setConfirmVisible] = useState(false);

  // ── Animations ─────────────────────────────────────────
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeBg    = useRef(new Animated.Value(0)).current;

  // ── Entry animation + cleanup on unmount ───────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    return () => { dispatch(resetCustomer()); };
  }, [dispatch]);

  // ── Auto-lookup when exactly 10 digits entered ─────────
  useEffect(() => {
    if (buyerPhone.length === 10) {
      setPhoneError(false);
      dispatch(lookupCustomer(buyerPhone));
    } else {
      dispatch(resetCustomer());
    }
  }, [buyerPhone, dispatch]);

  // ── Handle Add Customer result ─────────────────────────
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

  // ── Shake animation ────────────────────────────────────
  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // ── View Invoice — validation gate ─────────────────────
  const handleViewInvoice = () => {

    // 1. Phone empty or incomplete
    if (buyerPhone.length < 10) {
      setPhoneError(true);
      triggerShake();
      Alert.alert(
        'Phone Required',
        'Please enter a valid 10-digit phone number to continue.'
      );
      return;
    }

    // 2. Still checking DB
    if (lookupState === 'loading') {
      Alert.alert('Please Wait', 'Verifying customer details…');
      return;
    }

    // 3. Phone entered but no customer found
    if (lookupState === 'notfound') {
      setPhoneError(true);
      triggerShake();
      Alert.alert(
        'Customer Not Found',
        'No customer registered with this number.\nPlease add customer details first.',
        [
          { text: '+ Add Customer', onPress: () => setAddModalVisible(true) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    // 4. Network/server error
    if (lookupState === 'error') {
      setPhoneError(true);
      Alert.alert(
        'Connection Error',
        'Could not reach server. Please check your connection and try again.'
      );
      return;
    }

    // 5. Customer found — open confirm modal
    if (lookupState === 'found') {
      setPhoneError(false);
      openConfirmModal();
    }
  };

  // ── Save new customer to DB ────────────────────────────
  const handleSaveNewCustomer = () => {
    if (!newName.trim()) {
      Alert.alert('Required', 'Customer name is required.');
      return;
    }
    dispatch(addCustomer({
      phone:   buyerPhone,
      name:    newName.trim(),
      address: newAddress.trim(),
      city:    newCity.trim(),
      state:   newState.trim(),
    }));
  };

  // ── Confirm Modal ──────────────────────────────────────
  const openConfirmModal = () => {
    setConfirmVisible(true);
    Animated.parallel([
      Animated.timing(fadeBg,    { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 70, friction: 10, useNativeDriver: true }),
    ]).start();
  };

  const closeConfirmModal = () => {
    Animated.parallel([
      Animated.timing(fadeBg,    { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
    ]).start(() => setConfirmVisible(false));
  };

  // ── Navigate to Invoice Screen ─────────────────────────
  const goToInvoice = () => {
    closeConfirmModal();
    setTimeout(() => {
      navigation.navigate('InvoiceScreen', {
        invoiceNumber,
        items,
        total:         grandTotal,
        paymentMode,
        date,
        buyerName:     customer?.name    || '',
        buyerPhone,
        buyerAddress:  customer?.address || '',
        buyerCity:     customer?.city    || '',
        buyerState:    customer?.state   || '',
        courierCharge: parseFloat(courierCharge) || 0,
        salesperson:   selectedSP?.name  || '',
      });
    }, 300);
  };

  const grandTotalWithCourier =
    (grandTotal || 0) + (parseFloat(courierCharge) || 0);

  // ── Phone Lookup Result Card ───────────────────────────
  const renderLookupResult = () => {

    // Loading
    if (lookupState === 'loading') {
      return (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={styles.statusText}>Checking customer database…</Text>
        </View>
      );
    }

    // Found — show customer details card
    if (lookupState === 'found') {
      return (
        <View style={styles.foundCard}>
          <View style={styles.foundCardTop}>
            <CheckCircle size={15} color="#16a34a" strokeWidth={2.5} />
            <Text style={styles.foundLabel}>  Customer Found</Text>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => {
                dispatch(resetCustomer());
                setBuyerPhone('');
                setPhoneError(false);
              }}
            >
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.customerName}>{customer?.name}</Text>

          {customer?.address ? (
            <View style={ls.subRow}>
              <MapPin size={12} color="#555" strokeWidth={2} />
              <Text style={styles.customerSub}>  {customer.address}</Text>
            </View>
          ) : null}

          {(customer?.city || customer?.state) ? (
            <View style={ls.subRow}>
              <Building2 size={12} color="#555" strokeWidth={2} />
              <Text style={styles.customerSub}>
                {'  '}{[customer.city, customer.state].filter(Boolean).join(', ')}
              </Text>
            </View>
          ) : null}
        </View>
      );
    }

    // Not Found — show Add Customer button
    if (lookupState === 'notfound') {
      return (
        <View style={styles.notFoundBox}>
          <View style={ls.subRow}>
            <AlertTriangle size={13} color="#dc2626" strokeWidth={2} />
            <Text style={[styles.notFoundText, { marginLeft: 5 }]}>
              No customer found for this number.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setAddModalVisible(true)}
          >
            <UserPlus size={15} color="#fff" strokeWidth={2} />
            <Text style={styles.addBtnText}>  Add Customer Details</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Network error — show Retry
    if (lookupState === 'error') {
      return (
        <View style={styles.notFoundBox}>
          <View style={ls.subRow}>
            <WifiOff size={13} color="#dc2626" strokeWidth={2} />
            <Text style={[styles.notFoundText, { marginLeft: 5 }]}>
              Could not reach server. Check connection.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: '#dc2626' }]}
            onPress={() => dispatch(lookupCustomer(buyerPhone))}
          >
            <Text style={styles.addBtnText}>  Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  // ─────────────────────────────────────────────────────────
  return (
    <>
      <Header title="Order Confirm" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LottieView
            source={require('../../assets/json/OrderSuccess.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />

          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* ══ Order Summary Box ══ */}
            <View style={styles.infoBox}>
              <Row label="Invoice No"   value={invoiceNumber} />
              <Divider />
              <Row label="Payment Mode" value={paymentMode?.toUpperCase()} />
              <Divider />
              <Row
                label="Amount Paid"
                value={`₹${grandTotal}`}
                valueStyle={styles.amountText}
              />
            </View>

            {/* ══ Form Card ══ */}
            <View style={styles.formCard}>
              <Text style={styles.formCardTitle}>
                Delivery & Invoice Details
              </Text>

              {/* Invoice Date */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Calendar size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}>  Invoice Date</Text>
                </View>
                <View style={styles.readonlyField}>
                  <Text style={styles.readonlyText}>
                    {formatDate(date || new Date().toISOString())}
                  </Text>
                </View>
              </View>

              {/* Salesperson Dropdown */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <User size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}>  Salesperson</Text>
                </View>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setDropdownOpen(o => !o)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={
                      selectedSP
                        ? styles.dropdownSelected
                        : styles.dropdownPlaceholder
                    }
                  >
                    {selectedSP ? selectedSP.name : 'Select salesperson…'}
                  </Text>
                  <ChevronDown
                    size={16}
                    color="#888"
                    style={{
                      transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }],
                    }}
                  />
                </TouchableOpacity>
                {dropdownOpen && (
                  <View style={styles.dropdownList}>
                    {SALESPERSONS.map(sp => (
                      <TouchableOpacity
                        key={sp.id}
                        style={[
                          styles.dropdownItem,
                          selectedSP?.id === sp.id && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setSelectedSP(sp);
                          setDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedSP?.id === sp.id &&
                              styles.dropdownItemTextActive,
                          ]}
                        >
                          {sp.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* ══ Phone Number + Live Lookup ══ */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Phone
                    size={14}
                    color={phoneError ? '#dc2626' : '#16a34a'}
                    strokeWidth={2}
                  />
                  <Text
                    style={[
                      styles.label,
                      phoneError && { color: '#dc2626' },
                    ]}
                  >
                    {'  Phone Number '}
                    <Text style={{ color: '#dc2626' }}>*</Text>
                  </Text>
                </View>

                <Animated.View
                  style={{ transform: [{ translateX: shakeAnim }] }}
                >
                  <TextInput
                    style={[
                      styles.input,
                      phoneError && styles.inputError,
                      lookupState === 'found' && styles.inputLocked,
                    ]}
                    placeholder="Enter 10-digit phone number"
                    placeholderTextColor="#bbb"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={buyerPhone}
                    onChangeText={(t) => {
                      setBuyerPhone(t);
                      setPhoneError(false);
                    }}
                    editable={lookupState !== 'found'}
                  />
                </Animated.View>

                {phoneError && buyerPhone.length < 10 && (
                  <Text style={styles.errorText}>
                    Enter a valid 10-digit phone number
                  </Text>
                )}

                {renderLookupResult()}
              </View>

              {/* Courier Charge */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Truck size={14} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.label}>  Courier Charge (₹)</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 80"
                  placeholderTextColor="#bbb"
                  keyboardType="numeric"
                  value={courierCharge}
                  onChangeText={setCourierCharge}
                />
              </View>

              {/* Grand Total */}
              <View style={styles.totalPreview}>
                <Text style={styles.totalPreviewLabel}>
                  Grand Total (incl. courier)
                </Text>
                <Text style={styles.totalPreviewValue}>
                  ₹{grandTotalWithCourier}
                </Text>
              </View>
            </View>

            {/* ══ Action Buttons ══ */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleViewInvoice}
            >
              <FileText
                size={18}
                color="#fff"
                strokeWidth={2}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.primaryText}>View Invoice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Text style={styles.outlineText}>Back to Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ghostBtn}
              onPress={() => navigation.navigate('ProductList')}
            >
              <Text style={styles.ghostText}>Book Another Order</Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ════════════════════════════════════════
          ADD CUSTOMER — Bottom Sheet Modal
          ════════════════════════════════════════ */}
      <Modal
        transparent
        visible={addModalVisible}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.sheetOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.sheetCard}>

                <View style={styles.sheetHeader}>
                  <UserPlus size={18} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.sheetTitle}>  Add New Customer</Text>
                  <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                    <X size={20} color="#888" strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                <View style={styles.phonePill}>
                  <Phone size={13} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.phonePillText}>  {buyerPhone}</Text>
                </View>

                <TextInput
                  style={styles.sheetInput}
                  placeholder="Customer Name *"
                  placeholderTextColor="#bbb"
                  value={newName}
                  onChangeText={setNewName}
                />
                <TextInput
                  style={[
                    styles.sheetInput,
                    { height: 72, textAlignVertical: 'top' },
                  ]}
                  placeholder="Delivery Address"
                  placeholderTextColor="#bbb"
                  multiline
                  value={newAddress}
                  onChangeText={setNewAddress}
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    style={[styles.sheetInput, { flex: 1 }]}
                    placeholder="City"
                    placeholderTextColor="#bbb"
                    value={newCity}
                    onChangeText={setNewCity}
                  />
                  <TextInput
                    style={[styles.sheetInput, { flex: 1 }]}
                    placeholder="State"
                    placeholderTextColor="#bbb"
                    value={newState}
                    onChangeText={setNewState}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveBtn,
                    addState === 'loading' && { opacity: 0.6 },
                  ]}
                  onPress={handleSaveNewCustomer}
                  disabled={addState === 'loading'}
                >
                  {addState === 'loading' ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save Customer</Text>
                  )}
                </TouchableOpacity>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ════════════════════════════════════════
          CONFIRM INVOICE Modal
          ════════════════════════════════════════ */}
      <Modal
        transparent
        visible={confirmVisible}
        animationType="none"
        onRequestClose={closeConfirmModal}
      >
        <Animated.View style={[styles.backdrop, { opacity: fadeBg }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeConfirmModal}
          />
        </Animated.View>

        <View style={styles.centeredWrapper} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.popup,
              { opacity: fadeBg, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={closeConfirmModal}
            >
              <X size={18} color="#888" strokeWidth={2} />
            </TouchableOpacity>

            <View style={styles.popupLottieWrapper}>
              <LottieView
                source={require('../../assets/json/OrderSuccess.json')}
                autoPlay
                loop={false}
                style={styles.popupLottie}
              />
            </View>

            <Text style={styles.popupTitle}>Ready to Generate Invoice?</Text>
            <Text style={styles.popupSubtitle}>
              Please confirm the order details before proceeding.
            </Text>

            <View style={styles.popupInfoBox}>
              <Row label="Invoice No"  value={invoiceNumber} />
              <Divider />
              <Row label="Buyer"       value={customer?.name || '—'} />
              <Divider />
              <Row label="Phone"       value={buyerPhone || '—'} />
              <Divider />

              {/* ── Address — fixed alignment ── */}
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Address</Text>
                <Text style={[styles.rowValue, ls.addressValue]}>
                  {customer?.address
                    ? [customer.address, customer.city, customer.state]
                        .filter(Boolean)
                        .join(', ')
                    : '—'}
                </Text>
              </View>

              <Divider />
              <Row label="Salesperson" value={selectedSP?.name || '—'} />
              <Divider />
              <Row
                label="Courier"
                value={`₹${parseFloat(courierCharge) || 0}`}
              />
              <Divider />
              <Row
                label="Grand Total"
                value={`₹${grandTotalWithCourier}`}
                valueStyle={styles.amountText}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={goToInvoice}
            >
              <FileText
                size={18}
                color="#fff"
                strokeWidth={2}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.primaryText}>
                Confirm & Generate Invoice
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={closeConfirmModal}
            >
              <Text style={styles.outlineText}>Go Back & Edit</Text>
            </TouchableOpacity>

          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

// ── Only NEW local styles not in OrderSucessStyle ──────────
const ls = StyleSheet.create({
  // Icon + text row inside found card
  subRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginTop:     3,
  },
  // Address text in confirm modal — right aligned, wraps properly
  addressValue: {
    flex:       1,
    textAlign:  'right',
    flexWrap:   'wrap',
  },
});

const Row = ({ label, value, valueStyle }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

export default OrderSuccessScreen;