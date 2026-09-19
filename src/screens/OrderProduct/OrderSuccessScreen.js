// OrderSuccessScreen.js — Fixed with proper imports
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'; // ✅ IMPORT THIS
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
  Check,
} from 'lucide-react-native';

import Header from '../../components/Header';
import API from '../../services/API/api';
import {
  lookupCustomer,
  addCustomer,
  updateCustomer,
  resetCustomer,
} from '../../services/features/customer/customerSlice';
import { fetchProducts } from '../../services/features/products/productSlice';
import styles from './OrderSucessStyle';

// ─── Constants ────────────────────────────────────────────────
const ACCENT = '#D32F2F';
const WHITE = '#FFFFFF';
const GREY = '#555';
const GREEN = '#2E7D32';

const SALESPERSONS = [
  'SHANTHI',
  'HARIVARTHINI',
  'UMA MAM',
  'SHARMILA',
  'MOHANA AMBIGAI',
  'KALAIVANI',
  'SUNDER SIR',
  'PAVITHRA',
  'SARANYA',
  'VIJAYA LAKSHMI',
  'VENNILA',
  'ASHWINI',
  'PRIYADHARSHNI',
  'GOMATHI',
  'KAVIBHARATHI',
  'DHANALAKSHMI',
];

const PAYMENT_MODES = ['Cash', 'GPay', 'Credit Card', 'Debit Card', 'Office Use', 'Loan Amount'];
const ORDER_TYPES = ['OEM', 'TOOLS'];

const fmtDate = iso =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const fmt = v => Number(v || 0).toLocaleString('en-IN');

// ─── Picker Sheet Component ──────────────────────────────────
const PickerSheet = React.memo(({ visible, onClose, title, items, selected, onSelect }) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={20} color={GREY} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {items.map(item => (
            <TouchableOpacity
              key={item}
              style={[styles.sheetRow, selected === item && styles.sheetRowActive]}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text style={[styles.sheetRowText, selected === item && styles.sheetRowTextActive]}>
                {item}
              </Text>
              {selected === item && <CheckCircle size={15} color={ACCENT} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
));

// ─── Customer Modal Component ──────────────────────────────
const CustomerModal = React.memo(({ 
  visible, 
  onClose, 
  onSave, 
  saving, 
  title, 
  phone, 
  initial 
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [shop, setShop] = useState('');
  const [type, setType] = useState('customer');

  useEffect(() => {
    if (visible && initial) {
      setName(initial.name || '');
      setAddress(initial.address || '');
      setCity(initial.city || '');
      setState(initial.state || '');
      setShop(initial.shopName || '');
      setType(initial.type || 'customer');
    } else if (visible) {
      setName('');
      setAddress('');
      setCity('');
      setState('');
      setShop('');
      setType('customer');
    }
  }, [visible, initial]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Customer name is required.');
      return;
    }
    if (type === 'shop' && !shop.trim()) {
      Alert.alert('Validation', 'Shop name is required.');
      return;
    }
    onSave({ 
      name: name.trim(), 
      address: address.trim(), 
      city: city.trim(), 
      state: state.trim(), 
      shopName: shop.trim(), 
      type 
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { maxHeight: '88%' }]}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderLeft}>
              <UserPlus size={18} color={ACCENT} />
              <Text style={styles.sheetTitle}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={GREY} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.phonePill}>
              <Phone size={12} color={GREY} />
              <Text style={styles.phonePillText}>{phone}</Text>
            </View>
            
            <View style={styles.typeRow}>
              {['customer', 'shop'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeBtn, type === t && styles.typeBtnActive]}
                  onPress={() => setType(t)}
                >
                  <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
                    {t === 'customer' ? 'Customer' : 'Shop'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {[
              { label: 'Name *', key: 'name', value: name, set: setName },
              ...(type === 'shop' ? [{ label: 'Shop Name *', key: 'shop', value: shop, set: setShop }] : []),
            ].map(f => (
              <View key={f.key}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput 
                  style={styles.input} 
                  value={f.value} 
                  onChangeText={f.set} 
                  placeholder={f.label} 
                  placeholderTextColor="#aaa" 
                />
              </View>
            ))}
            
            <Text style={styles.label}>Delivery Address</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Street, landmark, area…"
              placeholderTextColor="#aaa"
              multiline
            />
            
            <View style={styles.rowFields}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>City</Text>
                <TextInput 
                  style={styles.input} 
                  value={city} 
                  onChangeText={setCity} 
                  placeholder="City" 
                  placeholderTextColor="#aaa" 
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>State</Text>
                <TextInput 
                  style={styles.input} 
                  value={state} 
                  onChangeText={setState} 
                  placeholder="State" 
                  placeholderTextColor="#aaa" 
                />
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={saving}>
              {saving ? 
                <ActivityIndicator size="small" color={WHITE} /> : 
                <CheckCircle size={14} color={WHITE} />
              }
              <Text style={styles.submitBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

// ─── Confirm Modal Component ────────────────────────────────
const ConfirmModal = React.memo(({ visible, onClose, onConfirm, confirming, data }) => {
  if (!data) return null;
  
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { maxHeight: '88%' }]}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderLeft}>
              <Check size={18} color={GREEN} />
              <Text style={styles.sheetTitle}>Ready to Generate Invoice?</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={GREY} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <Text style={styles.confirmSubtitle}>
              Please confirm the order details before proceeding.
            </Text>
            {[
              { label: 'Reference No', value: data.referenceNo },
              { label: 'Order Type', value: data.orderType },
              { label: 'Buyer', value: data.buyerName },
              { label: 'Phone', value: data.phone },
              { label: 'Address', value: data.address || '—' },
              { label: 'City / State', value: [data.city, data.state].filter(Boolean).join(', ') || '—' },
              { label: 'Salesperson', value: data.salesperson || '—' },
              { label: 'Payment Mode', value: data.paymentMode || '—' },
              { label: 'Courier', value: `₹${data.courier}` },
              ...(data.discount > 0 ? [{ label: 'Discount', value: `₹${data.discount}` }] : []),
              ...(data.gst > 0 ? [{ label: 'GST', value: `₹${data.gst}` }] : []),
              { label: 'Grand Total', value: `₹${fmt(data.grandTotal)}` },
            ].map(row => (
              <View key={row.label} style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>{row.label}</Text>
                <Text style={[
                  styles.confirmValue, 
                  row.label === 'Grand Total' && styles.confirmGrandTotal
                ]}>
                  {row.value}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={onConfirm} disabled={confirming}>
              {confirming ? 
                <ActivityIndicator size="small" color={WHITE} /> : 
                <FileText size={14} color={WHITE} />
              }
              <Text style={styles.submitBtnText}>
                {confirming ? 'Processing…' : 'Confirm & Invoice'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

// ─── Main Screen ──────────────────────────────────────────────
const OrderSuccess = ({ route }) => {
  const navigation = useNavigation(); // ✅ Now works with import
  const dispatch = useDispatch();
  
  const {
    cartItems = [],
    grandTotal = 0,
    paymentMode: initialPaymentMode,
    date,
    batchSelections = {},
    showBatchSelector = false,
    priceType = 'retailerPrice',
  } = route.params || {};

  const { lookupData: customer, lookupState, addLoading, addSuccess, updateLoading, updateSuccess } = 
    useSelector(s => s.customer);
  const user = useSelector(s => s.auth.user);

  // ── State ──
  const [referenceNo, setReferenceNo] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [paymentMode, setPaymentMode] = useState(initialPaymentMode || 'Cash');
  const [orderType, setOrderType] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [discount, setDiscount] = useState('0');
  const [courierCharge, setCourierCharge] = useState('0');
  const [gstAmount, setGstAmount] = useState('0');
  const [sameAsBuyer, setSameAsBuyer] = useState(true);
  const [shipToName, setShipToName] = useState('');
  const [shipToPhone, setShipToPhone] = useState('');
  const [shipToAddress, setShipToAddress] = useState('');
  const [shipToCity, setShipToCity] = useState('');
  const [shipToState, setShipToState] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Picker sheets
  const [pmSheet, setPmSheet] = useState(false);
  const [otSheet, setOtSheet] = useState(false);
  const [spSheet, setSpSheet] = useState(false);

  // ── Effects ──
  useEffect(() => {
    if (!cartItems.length) {
      navigation.goBack();
    }
    return () => {
      dispatch(resetCustomer());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (addSuccess) {
      setAddModal(false);
      dispatch(lookupCustomer(buyerPhone));
    }
  }, [addSuccess, buyerPhone, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      setEditModal(false);
      dispatch(lookupCustomer(buyerPhone));
      Alert.alert('Success', 'Customer updated.');
    }
  }, [updateSuccess, buyerPhone, dispatch]);

  // ── Calculations ──
  const subtotal = cartItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);
  const discountAmt = parseFloat(discount) || 0;
  const courierAmt = parseFloat(courierCharge) || 0;
  const gstAmt = parseFloat(gstAmount) || 0;
  const grandTotalNet = Math.max(subtotal - discountAmt, 0) + courierAmt + gstAmt;

  // ── Helpers ──
  const getBatchAllocations = useCallback(
    item => batchSelections[item.id]?.batchAllocations || item.batchAllocations || [],
    [batchSelections]
  );

  // ── Validation ──
  const handleViewInvoice = () => {
    if (!referenceNo.trim()) {
      Alert.alert('Validation', 'Reference number is required.');
      return;
    }
    if (!orderType) {
      Alert.alert('Validation', 'Please select an order type.');
      return;
    }
    if (buyerPhone.length < 10) {
      setPhoneError(true);
      Alert.alert('Validation', 'Enter a valid 10-digit phone number.');
      return;
    }
    if (lookupState === 'loading') {
      Alert.alert('Please wait', 'Verifying customer details…');
      return;
    }
    if (lookupState === 'notfound') {
      setPhoneError(true);
      Alert.alert('Customer not found', 'Would you like to add this customer?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add Customer', onPress: () => setAddModal(true) },
      ]);
      return;
    }
    if (lookupState === 'error') {
      Alert.alert('Error', 'Could not reach server. Check your connection.');
      return;
    }
    if (lookupState === 'found' && customer) {
      setConfirmModal(true);
    }
  };

  // ── Create Invoice ──
  const goToInvoice = async () => {
    setIsConfirming(true);
    setConfirmModal(false);
    try {
      const finalShipName = sameAsBuyer ? customer?.name || '' : shipToName;
      const finalShipPhone = sameAsBuyer ? buyerPhone : shipToPhone;
      const finalShipAddress = sameAsBuyer ? customer?.address || '' : shipToAddress;
      const finalShipCity = sameAsBuyer ? customer?.city || '' : shipToCity;
      const finalShipState = sameAsBuyer ? customer?.state || '' : shipToState;

      const invoiceItems = cartItems.map(item => {
        const alloc = getBatchAllocations(item);
        const hasValidBatches = alloc.length > 0 && 
          alloc.some(a => a.batchNumber && a.batchNumber !== 'default');
        const base = {
          productId: item.id,
          name: item.name,
          qty: item.qty || 0,
          price: item.price || 0,
          useDefaultPrice: !hasValidBatches,
        };
        if (hasValidBatches) {
          base.batchAllocations = alloc
            .filter(a => a.batchNumber && a.batchNumber !== 'default')
            .map(a => ({
              batchNumber: a.batchNumber,
              qty: a.qty || item.qty,
              purchaseCost: a.purchaseCost || 0,
              sellingPrice: a.sellingPrice || item.price,
            }));
        }
        return base;
      });

      const payload = {
        billerName: user?.name || 'Unknown',
        items: invoiceItems,
        totalAmount: grandTotalNet,
        paymentMode: paymentMode || 'Cash',
        status: 'completed',
        customerPhone: buyerPhone,
        customerName: customer?.name || 'Guest',
        customerType: customer?.type || 'customer',
        shopName: customer?.shopName || '',
        customerAddress: customer?.address || '',
        customerCity: customer?.city || '',
        customerState: customer?.state || '',
        sameAsBuyer,
        shippingAddress: {
          name: finalShipName,
          phone: finalShipPhone,
          address: finalShipAddress,
          city: finalShipCity,
          state: finalShipState,
        },
        subtotal,
        discount: discountAmt,
        courierCharge: courierAmt,
        gstAmount: gstAmt,
        salesperson: salesperson || '',
        referenceNo: referenceNo || '',
        invoiceDate: date || new Date().toISOString(),
        orderType: orderType || '',
        priceType: priceType || 'retailerPrice',
        allowDefaultBatches: true,
        hasDefaultBatches: invoiceItems.some(i => i.useDefaultPrice),
      };

      const res = await API.post('/api/invoices', payload);
      const invoiceNumber = res.data.invoice.invoiceNumber;
      await dispatch(fetchProducts());

      navigation.navigate('InvoiceScreen', {
        invoiceNumber,
        items: cartItems,
        total: grandTotalNet,
        paymentMode,
        date,
        buyerName: customer?.name || '—',
        buyerPhone,
        buyerAddress: customer?.address || '',
        buyerCity: customer?.city || '',
        buyerState: customer?.state || '',
        courierCharge: courierAmt,
        discount: discountAmt,
        gstAmount: gstAmt,
        salesperson,
        referenceNo,
        shipToName: finalShipName,
        shipToPhone: finalShipPhone,
        shipToAddress: finalShipAddress,
        shipToCity: finalShipCity,
        shipToState: finalShipState,
        customerType: customer?.type,
        shopName: customer?.shopName,
        orderType,
        batchSelections,
        showBatchSelector,
        priceType,
      });
    } catch (err) {
      let msg = 'Failed to confirm order. Please try again.';
      if (err?.response?.data?.message) {
        msg = err.response.data.code === 'INSUFFICIENT_STOCK'
          ? `Insufficient stock: ${err.response.data.message}`
          : err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      Alert.alert('Error', msg);
    } finally {
      setIsConfirming(false);
    }
  };

  const confirmData = {
    referenceNo,
    orderType,
    buyerName: customer?.type === 'shop' 
      ? `${customer?.name} (${customer?.shopName})` 
      : customer?.name || '—',
    phone: buyerPhone,
    address: customer?.address || '—',
    city: customer?.city || '',
    state: customer?.state || '',
    salesperson,
    paymentMode,
    courier: courierAmt,
    discount: discountAmt,
    gst: gstAmt,
    grandTotal: grandTotalNet,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* ── Header Component ── */}
      <Header title="Order Confirm" showBackArrow={true} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Batch Summary ── */}
          {showBatchSelector && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Batch Allocations</Text>
              {cartItems.map(item => {
                const alloc = getBatchAllocations(item);
                const hasValid = alloc.length > 0 && 
                  alloc.some(a => a.batchNumber && a.batchNumber !== 'default');
                return (
                  <View key={item.id} style={styles.batchSummaryItem}>
                    <Text style={styles.batchSummaryProduct} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.batchTagsContainer}>
                      {hasValid ? (
                        alloc
                          .filter(a => a.batchNumber && a.batchNumber !== 'default')
                          .map((a, i) => (
                            <View key={i} style={styles.batchTag}>
                              <Text style={styles.batchTagText}>
                                {a.batchNumber}: {a.qty || item.qty} units
                              </Text>
                            </View>
                          ))
                      ) : (
                        <View style={[styles.batchTag, styles.batchTagDefault]}>
                          <Text style={[styles.batchTagText, styles.batchTagTextDefault]}>
                            Default price (no batch)
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* ── Form ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery & Invoice Details</Text>

            {/* Reference No */}
            <Text style={styles.label}>Reference No. *</Text>
            <TextInput
              style={[styles.input, !referenceNo.trim() && styles.inputError]}
              placeholder="e.g. PO-12345 (Required)"
              placeholderTextColor="#aaa"
              value={referenceNo}
              onChangeText={setReferenceNo}
            />
            {!referenceNo.trim() && <Text style={styles.errorText}>Reference number is required</Text>}

            {/* Order Type */}
            <Text style={styles.label}>Order Type *</Text>
            <TouchableOpacity
              style={[styles.picker, !orderType && styles.pickerError]}
              onPress={() => setOtSheet(true)}
            >
              <FileText size={14} color={GREY} />
              <Text style={[styles.pickerText, !orderType && styles.pickerPlaceholder]}>
                {orderType || 'Select order type…'}
              </Text>
              <ChevronDown size={14} color={GREY} />
            </TouchableOpacity>
            {!orderType && <Text style={styles.errorText}>Order type is required</Text>}

            {/* Payment Mode */}
            <Text style={styles.label}>Payment Mode</Text>
            <TouchableOpacity style={styles.picker} onPress={() => setPmSheet(true)}>
              <CreditCard size={14} color={GREY} />
              <Text style={styles.pickerText}>{paymentMode}</Text>
              <ChevronDown size={14} color={GREY} />
            </TouchableOpacity>

            {/* Subtotal */}
            <Text style={styles.label}>Subtotal</Text>
            <View style={styles.readonlyField}>
              <Text style={styles.readonlyText}>₹{fmt(subtotal)}</Text>
            </View>

            {/* Discount */}
            <Text style={styles.label}>Discount (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={discount}
              onChangeText={setDiscount}
              placeholder="0"
              placeholderTextColor="#aaa"
            />

            {/* Invoice Date */}
            <Text style={styles.label}>Invoice Date</Text>
            <View style={styles.readonlyField}>
              <Calendar size={13} color={GREY} />
              <Text style={styles.readonlyText}>{fmtDate(date || new Date().toISOString())}</Text>
            </View>

            {/* Salesperson */}
            <Text style={styles.label}>Salesperson</Text>
            <TouchableOpacity style={styles.picker} onPress={() => setSpSheet(true)}>
              <User size={14} color={GREY} />
              <Text style={[styles.pickerText, !salesperson && styles.pickerPlaceholder]}>
                {salesperson || 'Select salesperson…'}
              </Text>
              <ChevronDown size={14} color={GREY} />
            </TouchableOpacity>

            {/* Phone + Customer Lookup */}
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[styles.input, phoneError && styles.inputError]}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              maxLength={10}
              value={buyerPhone}
              onChangeText={v => {
                setBuyerPhone(v);
                if (v.length === 10) setPhoneError(false);
              }}
            />
            {phoneError && buyerPhone.length < 10 && (
              <Text style={styles.errorText}>Enter a valid 10-digit phone number</Text>
            )}

            {/* Lookup states */}
            {lookupState === 'loading' && (
              <View style={styles.statusRow}>
                <ActivityIndicator size="small" color={ACCENT} />
                <Text style={styles.statusText}>Checking customer database…</Text>
              </View>
            )}
            
            {lookupState === 'found' && customer && (
              <View style={styles.foundCard}>
                <View style={styles.foundHeader}>
                  <CheckCircle size={14} color={GREEN} />
                  <Text style={styles.foundLabel}>Customer Found</Text>
                  <TouchableOpacity style={styles.editBtn} onPress={() => setEditModal(true)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.customerName}>
                  {customer.type === 'shop' 
                    ? `${customer.name} (${customer.shopName})` 
                    : customer.name}
                </Text>
                {customer.address && (
                  <View style={styles.customerAddressRow}>
                    <MapPin size={13} color={GREY} />
                    <Text style={styles.customerAddressText}>{customer.address}</Text>
                  </View>
                )}
                {(customer.city || customer.state) && (
                  <View style={styles.customerCityRow}>
                    <Building2 size={13} color={GREY} />
                    <Text style={styles.customerCityText}>
                      {[customer.city, customer.state].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            {lookupState === 'notfound' && (
              <View style={styles.notFoundBox}>
                <AlertTriangle size={13} color={ACCENT} />
                <Text style={styles.notFoundText}>No customer found.</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setAddModal(true)}>
                  <Text style={styles.addBtnText}>+ Add Customer</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {lookupState === 'error' && (
              <View style={styles.notFoundBox}>
                <WifiOff size={13} color={ACCENT} />
                <Text style={styles.notFoundText}>Could not reach server.</Text>
                <TouchableOpacity 
                  style={[styles.addBtn, styles.retryBtn]} 
                  onPress={() => dispatch(lookupCustomer(buyerPhone))}
                >
                  <Text style={styles.addBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Shipping Address */}
            <Text style={styles.label}>Shipping Address</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Same as buyer address</Text>
              <TouchableOpacity
                style={[styles.switchBtn, sameAsBuyer && styles.switchBtnActive]}
                onPress={() => setSameAsBuyer(p => !p)}
              >
                <Text style={[styles.switchBtnText, sameAsBuyer && styles.switchBtnTextActive]}>
                  {sameAsBuyer ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {!sameAsBuyer && (
              <View style={styles.shippingFields}>
                <TextInput
                  style={styles.input}
                  placeholder="Ship to Name"
                  placeholderTextColor="#aaa"
                  value={shipToName}
                  onChangeText={setShipToName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ship to Phone"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  value={shipToPhone}
                  onChangeText={setShipToPhone}
                />
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Ship to Address"
                  placeholderTextColor="#aaa"
                  multiline
                  value={shipToAddress}
                  onChangeText={setShipToAddress}
                />
                <View style={styles.rowFields}>
                  <TextInput
                    style={[styles.input, styles.fieldHalf]}
                    placeholder="City"
                    placeholderTextColor="#aaa"
                    value={shipToCity}
                    onChangeText={setShipToCity}
                  />
                  <TextInput
                    style={[styles.input, styles.fieldHalf]}
                    placeholder="State"
                    placeholderTextColor="#aaa"
                    value={shipToState}
                    onChangeText={setShipToState}
                  />
                </View>
              </View>
            )}

            {/* GST */}
            <Text style={styles.label}>GST (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={gstAmount}
              onChangeText={setGstAmount}
              placeholder="0"
              placeholderTextColor="#aaa"
            />

            {/* Courier */}
            <Text style={styles.label}>Courier Charge (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={courierCharge}
              onChangeText={setCourierCharge}
              placeholder="0"
              placeholderTextColor="#aaa"
            />

            {/* Total preview */}
            <View style={styles.totalPreview}>
              {[
                { label: 'Subtotal', value: `₹${fmt(subtotal)}` },
                ...(discountAmt > 0 ? [{ label: 'Discount', value: `- ₹${fmt(discountAmt)}`, accent: true }] : []),
                { label: 'Courier', value: `₹${fmt(courierAmt)}` },
                ...(gstAmt > 0 ? [{ label: 'GST', value: `₹${fmt(gstAmt)}` }] : []),
              ].map(row => (
                <View key={row.label} style={styles.totalRow}>
                  <Text style={styles.totalRowLabel}>{row.label}</Text>
                  <Text style={[styles.totalRowValue, row.accent && styles.totalRowAccent]}>
                    {row.value}
                  </Text>
                </View>
              ))}
              <View style={styles.totalDivider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalGrandLabel}>Grand Total</Text>
                <Text style={styles.totalGrandValue}>₹{fmt(grandTotalNet)}</Text>
              </View>
            </View>
          </View>

          {/* ── View Invoice button ── */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              (isConfirming || !referenceNo.trim() || !orderType) && styles.primaryBtnDisabled,
            ]}
            onPress={handleViewInvoice}
            disabled={isConfirming || !referenceNo.trim() || !orderType}
          >
            <FileText size={16} color={WHITE} />
            <Text style={styles.primaryBtnText}>View Invoice</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Sheets ── */}
      <PickerSheet
        visible={pmSheet}
        onClose={() => setPmSheet(false)}
        title="Payment Mode"
        items={PAYMENT_MODES}
        selected={paymentMode}
        onSelect={setPaymentMode}
      />
      <PickerSheet
        visible={otSheet}
        onClose={() => setOtSheet(false)}
        title="Order Type"
        items={ORDER_TYPES}
        selected={orderType}
        onSelect={setOrderType}
      />
      <PickerSheet
        visible={spSheet}
        onClose={() => setSpSheet(false)}
        title="Salesperson"
        items={SALESPERSONS}
        selected={salesperson}
        onSelect={setSalesperson}
      />

      {/* ── Modals ── */}
      <CustomerModal
        visible={addModal}
        onClose={() => setAddModal(false)}
        onSave={data => dispatch(addCustomer({ phone: buyerPhone, ...data }))}
        saving={addLoading}
        title="Add New Customer"
        phone={buyerPhone}
      />

      <CustomerModal
        visible={editModal}
        onClose={() => setEditModal(false)}
        onSave={data => dispatch(updateCustomer({ phone: buyerPhone, data }))}
        saving={updateLoading}
        title="Edit Customer"
        phone={buyerPhone}
        initial={customer}
      />

      <ConfirmModal
        visible={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={goToInvoice}
        confirming={isConfirming}
        data={confirmData}
      />
    </SafeAreaView>
  );
};

export default OrderSuccess;

//---------------------- 31.08.2026 -----------------------------
// // OrderSuccess.js — Full web parity with OrderSuccessPage.js
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, ScrollView, Modal,
//   ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   FileText, ChevronDown, X, User, Truck, Calendar, Phone,
//   UserPlus, CheckCircle, MapPin, Building2, AlertTriangle,
//   WifiOff, CreditCard, Check,
// } from 'lucide-react-native';
// import Header from '../../components/Header';
// import API from '../../services/API/api';
// import {
//   lookupCustomer,
//   addCustomer,
//   updateCustomer,
//   resetCustomer,
// } from '../../services/features/customer/customerSlice';
// import { fetchProducts } from '../../services/features/products/productSlice';

// // ─── Constants ────────────────────────────────────────────────
// const ACCENT = '#D32F2F';
// const WHITE  = '#FFFFFF';
// const BG     = '#F5F5F5';
// const GREY   = '#555';
// const BORDER = '#E5E7EB';
// const GREEN  = '#2E7D32';

// const SALESPERSONS = [
//   'SHANTHI', 'HARIVARTHINI', 'UMA MAM', 'SHARMILA', 'MOHANA AMBIGAI',
//   'KALAIVANI', 'SUNDER SIR', 'PAVITHRA', 'SARANYA', 'VIJAYA LAKSHMI',
//   'VENNILA', 'ASHWINI', 'PRIYADHARSHNI', 'GOMATHI', 'KAVIBHARATHI', 'DHANALAKSHMI',
// ];

// const PAYMENT_MODES = ['Cash', 'GPay', 'Credit Card', 'Debit Card', 'Office Use', 'Loan Amount'];
// const ORDER_TYPES   = ['OEM', 'TOOLS'];

// const fmtDate = iso => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
// const fmt     = v   => Number(v || 0).toLocaleString('en-IN');

// // ─── Picker Sheet ─────────────────────────────────────────────
// const PickerSheet = ({ visible, onClose, title, items, selected, onSelect }) => (
//   <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//     <View style={s.overlay}>
//       <View style={s.sheet}>
//         <View style={s.sheetHeader}>
//           <Text style={s.sheetTitle}>{title}</Text>
//           <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//             <X size={20} color={GREY} />
//           </TouchableOpacity>
//         </View>
//         <ScrollView>
//           {items.map(item => (
//             <TouchableOpacity
//               key={item}
//               style={[s.sheetRow, selected === item && { backgroundColor: '#FFF3F3' }]}
//               onPress={() => { onSelect(item); onClose(); }}>
//               <Text style={[s.sheetRowText, selected === item && { color: ACCENT, fontWeight: '700' }]}>
//                 {item}
//               </Text>
//               {selected === item && <CheckCircle size={15} color={ACCENT} />}
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>
//     </View>
//   </Modal>
// );

// // ─── Add / Edit Customer Modal ────────────────────────────────
// const CustomerModal = ({ visible, onClose, onSave, saving, title, phone, initial }) => {
//   const [name,    setName]    = useState('');
//   const [address, setAddress] = useState('');
//   const [city,    setCity]    = useState('');
//   const [state,   setState]   = useState('');
//   const [shop,    setShop]    = useState('');
//   const [type,    setType]    = useState('customer');

//   useEffect(() => {
//     if (visible && initial) {
//       setName(initial.name || '');
//       setAddress(initial.address || '');
//       setCity(initial.city || '');
//       setState(initial.state || '');
//       setShop(initial.shopName || '');
//       setType(initial.type || 'customer');
//     } else if (visible) {
//       setName(''); setAddress(''); setCity(''); setState(''); setShop(''); setType('customer');
//     }
//   }, [visible, initial]);

//   const handleSave = () => {
//     if (!name.trim()) { Alert.alert('Validation', 'Customer name is required.'); return; }
//     if (type === 'shop' && !shop.trim()) { Alert.alert('Validation', 'Shop name is required.'); return; }
//     onSave({ name: name.trim(), address: address.trim(), city: city.trim(), state: state.trim(), shopName: shop.trim(), type });
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//       <View style={s.overlay}>
//         <View style={[s.sheet, { maxHeight: '88%' }]}>
//           <View style={s.sheetHeader}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//               <UserPlus size={18} color={ACCENT} />
//               <Text style={s.sheetTitle}>{title}</Text>
//             </View>
//             <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//               <X size={20} color={GREY} />
//             </TouchableOpacity>
//           </View>
//           <ScrollView style={{ paddingHorizontal: 20 }} keyboardShouldPersistTaps="handled">
//             {/* Phone pill */}
//             <View style={s.phonePill}>
//               <Phone size={12} color={GREY} />
//               <Text style={{ fontSize: 13, color: GREY, fontWeight: '600' }}>{phone}</Text>
//             </View>
//             {/* Type toggle */}
//             <View style={s.typeRow}>
//               {['customer', 'shop'].map(t => (
//                 <TouchableOpacity
//                   key={t}
//                   style={[s.typeBtn, type === t && s.typeBtnActive]}
//                   onPress={() => setType(t)}>
//                   <Text style={[s.typeBtnText, type === t && s.typeBtnTextActive]}>
//                     {t === 'customer' ? 'Customer' : 'Shop'}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             {[
//               { label: 'Name *',    key: 'name',    value: name,    set: setName    },
//               ...(type === 'shop' ? [{ label: 'Shop Name *', key: 'shop', value: shop, set: setShop }] : []),
//             ].map(f => (
//               <View key={f.key}>
//                 <Text style={s.label}>{f.label}</Text>
//                 <TextInput style={s.input} value={f.value} onChangeText={f.set} placeholder={f.label} placeholderTextColor="#aaa" />
//               </View>
//             ))}
//             <Text style={s.label}>Delivery Address</Text>
//             <TextInput
//               style={[s.input, { minHeight: 68, textAlignVertical: 'top' }]}
//               value={address} onChangeText={setAddress}
//               placeholder="Street, landmark, area…" placeholderTextColor="#aaa" multiline />
//             <View style={{ flexDirection: 'row', gap: 10 }}>
//               <View style={{ flex: 1 }}>
//                 <Text style={s.label}>City</Text>
//                 <TextInput style={s.input} value={city} onChangeText={setCity} placeholder="City" placeholderTextColor="#aaa" />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={s.label}>State</Text>
//                 <TextInput style={s.input} value={state} onChangeText={setState} placeholder="State" placeholderTextColor="#aaa" />
//               </View>
//             </View>
//           </ScrollView>
//           <View style={s.modalFooter}>
//             <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
//               <Text style={s.cancelBtnText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={s.submitBtn} onPress={handleSave} disabled={saving}>
//               {saving ? <ActivityIndicator size="small" color={WHITE} /> : <CheckCircle size={14} color={WHITE} />}
//               <Text style={s.submitBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ─── Confirm Modal ────────────────────────────────────────────
// const ConfirmModal = ({ visible, onClose, onConfirm, confirming, data }) => {
//   if (!data) return null;
//   return (
//     <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
//       <View style={s.overlay}>
//         <View style={[s.sheet, { maxHeight: '88%' }]}>
//           <View style={s.sheetHeader}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//               <Check size={18} color={GREEN} />
//               <Text style={s.sheetTitle}>Ready to Generate Invoice?</Text>
//             </View>
//             <TouchableOpacity onPress={onClose}><X size={20} color={GREY} /></TouchableOpacity>
//           </View>
//           <ScrollView style={{ paddingHorizontal: 20, paddingTop: 12 }}>
//             <Text style={{ fontSize: 13, color: GREY, marginBottom: 12 }}>Please confirm the order details before proceeding.</Text>
//             {[
//               { label: 'Reference No',  value: data.referenceNo },
//               { label: 'Order Type',    value: data.orderType   },
//               { label: 'Buyer',         value: data.buyerName   },
//               { label: 'Phone',         value: data.phone       },
//               { label: 'Address',       value: data.address || '—' },
//               { label: 'City / State',  value: [data.city, data.state].filter(Boolean).join(', ') || '—' },
//               { label: 'Salesperson',   value: data.salesperson || '—' },
//               { label: 'Payment Mode',  value: data.paymentMode || '—' },
//               { label: 'Courier',       value: `₹${data.courier}` },
//               ...(data.discount > 0 ? [{ label: 'Discount', value: `₹${data.discount}` }] : []),
//               ...(data.gst > 0       ? [{ label: 'GST',      value: `₹${data.gst}` }] : []),
//               { label: 'Grand Total',   value: `₹${fmt(data.grandTotal)}` },
//             ].map(row => (
//               <View key={row.label} style={s.confirmRow}>
//                 <Text style={s.confirmLabel}>{row.label}</Text>
//                 <Text style={[s.confirmValue, row.label === 'Grand Total' && { color: ACCENT, fontSize: 15, fontWeight: '800' }]}>
//                   {row.value}
//                 </Text>
//               </View>
//             ))}
//           </ScrollView>
//           <View style={s.modalFooter}>
//             <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
//               <Text style={s.cancelBtnText}>Go Back</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={s.submitBtn} onPress={onConfirm} disabled={confirming}>
//               {confirming
//                 ? <ActivityIndicator size="small" color={WHITE} />
//                 : <FileText size={14} color={WHITE} />}
//               <Text style={s.submitBtnText}>{confirming ? 'Processing…' : 'Confirm & Invoice'}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ─── Main Screen ──────────────────────────────────────────────
// const OrderSuccess = ({ navigation, route }) => {
//   const dispatch = useDispatch();
//   const {
//     cartItems = [],
//     grandTotal = 0,
//     paymentMode: initialPaymentMode,
//     date,
//     batchSelections = {},
//     showBatchSelector = false,
//     priceType = 'retailerPrice',
//   } = route.params || {};

//   const { lookupData: customer, lookupState, addLoading, addSuccess, updateLoading, updateSuccess, error: custError } = useSelector(s => s.customer);
//   const user = useSelector(s => s.auth.user);

//   // ── State
//   const [referenceNo,     setReferenceNo]     = useState('');
//   const [buyerPhone,      setBuyerPhone]       = useState('');
//   const [phoneError,      setPhoneError]       = useState(false);
//   const [paymentMode,     setPaymentMode]      = useState(initialPaymentMode || 'Cash');
//   const [orderType,       setOrderType]        = useState('');
//   const [salesperson,     setSalesperson]      = useState('');
//   const [discount,        setDiscount]         = useState('0');
//   const [courierCharge,   setCourierCharge]    = useState('0');
//   const [gstAmount,       setGstAmount]        = useState('0');
//   const [sameAsBuyer,     setSameAsBuyer]      = useState(true);
//   const [shipToName,      setShipToName]       = useState('');
//   const [shipToPhone,     setShipToPhone]      = useState('');
//   const [shipToAddress,   setShipToAddress]    = useState('');
//   const [shipToCity,      setShipToCity]       = useState('');
//   const [shipToState,     setShipToState]      = useState('');
//   const [addModal,        setAddModal]         = useState(false);
//   const [editModal,       setEditModal]        = useState(false);
//   const [confirmModal,    setConfirmModal]     = useState(false);
//   const [isConfirming,    setIsConfirming]     = useState(false);

//   // Picker sheets
//   const [pmSheet,  setPmSheet]  = useState(false);
//   const [otSheet,  setOtSheet]  = useState(false);
//   const [spSheet,  setSpSheet]  = useState(false);

//   useEffect(() => {
//     if (!cartItems.length) navigation.goBack();
//     return () => { dispatch(resetCustomer()); };
//   }, []);

//   useEffect(() => {
//     if (buyerPhone.length === 10) {
//       setPhoneError(false);
//       dispatch(lookupCustomer(buyerPhone));
//     } else {
//       dispatch(resetCustomer());
//     }
//   }, [buyerPhone, dispatch]);

//   useEffect(() => {
//     if (addSuccess) {
//       setAddModal(false);
//       dispatch(lookupCustomer(buyerPhone));
//     }
//   }, [addSuccess, buyerPhone, dispatch]);

//   useEffect(() => {
//     if (updateSuccess) {
//       setEditModal(false);
//       dispatch(lookupCustomer(buyerPhone));
//       Alert.alert('Success', 'Customer updated.');
//     }
//   }, [updateSuccess, buyerPhone, dispatch]);

//   // ── Totals
//   const subtotal      = cartItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);
//   const discountAmt   = parseFloat(discount)      || 0;
//   const courierAmt    = parseFloat(courierCharge) || 0;
//   const gstAmt        = parseFloat(gstAmount)     || 0;
//   const grandTotalNet = Math.max(subtotal - discountAmt, 0) + courierAmt + gstAmt;

//   // ── Batch allocations helper
//   const getBatchAllocations = useCallback((item) => {
//     let alloc = batchSelections[item.id]?.batchAllocations || item.batchAllocations || [];
//     return alloc;
//   }, [batchSelections]);

//   // ── Validate before showing confirm
//   const handleViewInvoice = () => {
//     if (!referenceNo.trim()) { Alert.alert('Validation', 'Reference number is required.'); return; }
//     if (!orderType)          { Alert.alert('Validation', 'Please select an order type.');  return; }
//     if (buyerPhone.length < 10) { setPhoneError(true); Alert.alert('Validation', 'Enter a valid 10-digit phone number.'); return; }
//     if (lookupState === 'loading') { Alert.alert('Please wait', 'Verifying customer details…'); return; }
//     if (lookupState === 'notfound') {
//       setPhoneError(true);
//       Alert.alert('Customer not found', 'Would you like to add this customer?', [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Add Customer', onPress: () => setAddModal(true) },
//       ]);
//       return;
//     }
//     if (lookupState === 'error') { Alert.alert('Error', 'Could not reach server. Check your connection.'); return; }
//     if (lookupState === 'found' && customer) { setConfirmModal(true); }
//   };

//   // ── Create invoice
//   const goToInvoice = async () => {
//     setIsConfirming(true);
//     setConfirmModal(false);
//     try {
//       const finalShipName    = sameAsBuyer ? customer?.name    || '' : shipToName;
//       const finalShipPhone   = sameAsBuyer ? buyerPhone              : shipToPhone;
//       const finalShipAddress = sameAsBuyer ? customer?.address || '' : shipToAddress;
//       const finalShipCity    = sameAsBuyer ? customer?.city    || '' : shipToCity;
//       const finalShipState   = sameAsBuyer ? customer?.state   || '' : shipToState;

//       const invoiceItems = cartItems.map(item => {
//         const alloc = getBatchAllocations(item);
//         const hasValidBatches = alloc.length > 0 && alloc.some(a => a.batchNumber && a.batchNumber !== 'default');
//         const base = {
//           productId: item.id, name: item.name,
//           qty: item.qty || 0, price: item.price || 0,
//           useDefaultPrice: !hasValidBatches,
//         };
//         if (hasValidBatches) {
//           base.batchAllocations = alloc
//             .filter(a => a.batchNumber && a.batchNumber !== 'default')
//             .map(a => ({ batchNumber: a.batchNumber, qty: a.qty || item.qty, purchaseCost: a.purchaseCost || 0, sellingPrice: a.sellingPrice || item.price }));
//         }
//         return base;
//       });

//       const payload = {
//         billerName:      user?.name || 'Unknown',
//         items:           invoiceItems,
//         totalAmount:     grandTotalNet,
//         paymentMode:     paymentMode || 'Cash',
//         status:          'completed',
//         customerPhone:   buyerPhone,
//         customerName:    customer?.name    || 'Guest',
//         customerType:    customer?.type    || 'customer',
//         shopName:        customer?.shopName || '',
//         customerAddress: customer?.address || '',
//         customerCity:    customer?.city    || '',
//         customerState:   customer?.state   || '',
//         sameAsBuyer,
//         shippingAddress: { name: finalShipName, phone: finalShipPhone, address: finalShipAddress, city: finalShipCity, state: finalShipState },
//         subtotal,
//         discount: discountAmt,
//         courierCharge: courierAmt,
//         gstAmount: gstAmt,
//         salesperson: salesperson || '',
//         referenceNo:   referenceNo || '',
//         invoiceDate:   date || new Date().toISOString(),
//         orderType:     orderType || '',
//         priceType:     priceType || 'retailerPrice',
//         allowDefaultBatches: true,
//         hasDefaultBatches: invoiceItems.some(i => i.useDefaultPrice),
//       };

//       const res = await API.post('/api/invoices', payload);
//       const invoiceNumber = res.data.invoice.invoiceNumber;
//       await dispatch(fetchProducts());

//       navigation.navigate('InvoiceScreen', {
//         invoiceNumber,
//         items: cartItems,
//         total: grandTotalNet,
//         paymentMode,
//         date,
//         buyerName:    customer?.name    || '—',
//         buyerPhone,
//         buyerAddress: customer?.address || '',
//         buyerCity:    customer?.city    || '',
//         buyerState:   customer?.state   || '',
//         courierCharge: courierAmt,
//         discount:      discountAmt,
//         gstAmount:     gstAmt,
//         salesperson,
//         referenceNo,
//         shipToName:    finalShipName,
//         shipToPhone:   finalShipPhone,
//         shipToAddress: finalShipAddress,
//         shipToCity:    finalShipCity,
//         shipToState:   finalShipState,
//         customerType:  customer?.type,
//         shopName:      customer?.shopName,
//         orderType,
//         batchSelections,
//         showBatchSelector,
//         priceType,
//       });
//     } catch (err) {
//       let msg = 'Failed to confirm order. Please try again.';
//       if (err?.response?.data?.message) {
//         msg = err.response.data.code === 'INSUFFICIENT_STOCK'
//           ? `Insufficient stock: ${err.response.data.message}`
//           : err.response.data.message;
//       } else if (err?.message) {
//         msg = err.message;
//       }
//       Alert.alert('Error', msg);
//     } finally {
//       setIsConfirming(false);
//     }
//   };

//   const confirmData = {
//     referenceNo, orderType,
//     buyerName: customer?.type === 'shop' ? `${customer?.name} (${customer?.shopName})` : (customer?.name || '—'),
//     phone: buyerPhone,
//     address: customer?.address || '—',
//     city: customer?.city || '',
//     state: customer?.state || '',
//     salesperson, paymentMode,
//     courier: courierAmt, discount: discountAmt, gst: gstAmt,
//     grandTotal: grandTotalNet,
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['bottom']}>
//       <Header title="Order Confirm" />
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

//           {/* ── Batch Summary ── */}
//           {showBatchSelector && (
//             <View style={s.section}>
//               <Text style={s.sectionTitle}>Batch Allocations</Text>
//               {cartItems.map(item => {
//                 const alloc = getBatchAllocations(item);
//                 const hasValid = alloc.length > 0 && alloc.some(a => a.batchNumber && a.batchNumber !== 'default');
//                 return (
//                   <View key={item.id} style={s.batchSummaryItem}>
//                     <Text style={s.batchSummaryProduct} numberOfLines={1}>{item.name}</Text>
//                     <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
//                       {hasValid
//                         ? alloc.filter(a => a.batchNumber && a.batchNumber !== 'default').map((a, i) => (
//                           <View key={i} style={s.batchTag}>
//                             <Text style={s.batchTagText}>{a.batchNumber}: {a.qty || item.qty} units</Text>
//                           </View>
//                         ))
//                         : <View style={[s.batchTag, { backgroundColor: '#F5F5F5' }]}>
//                             <Text style={[s.batchTagText, { color: GREY }]}>Default price (no batch)</Text>
//                           </View>
//                       }
//                     </View>
//                   </View>
//                 );
//               })}
//             </View>
//           )}

//           {/* ── Form ── */}
//           <View style={s.section}>
//             <Text style={s.sectionTitle}>Delivery & Invoice Details</Text>

//             {/* Reference No */}
//             <Text style={s.label}>Reference No. *</Text>
//             <TextInput
//               style={[s.input, !referenceNo.trim() && { borderColor: ACCENT }]}
//               placeholder="e.g. PO-12345 (Required)"
//               placeholderTextColor="#aaa"
//               value={referenceNo}
//               onChangeText={setReferenceNo}
//             />
//             {!referenceNo.trim() && <Text style={s.errorText}>Reference number is required</Text>}

//             {/* Order Type */}
//             <Text style={s.label}>Order Type *</Text>
//             <TouchableOpacity style={[s.picker, !orderType && { borderColor: ACCENT }]} onPress={() => setOtSheet(true)}>
//               <FileText size={14} color={GREY} />
//               <Text style={[s.pickerText, !orderType && { color: '#aaa' }]}>{orderType || 'Select order type…'}</Text>
//               <ChevronDown size={14} color={GREY} />
//             </TouchableOpacity>
//             {!orderType && <Text style={s.errorText}>Order type is required</Text>}

//             {/* Payment Mode */}
//             <Text style={s.label}>Payment Mode</Text>
//             <TouchableOpacity style={s.picker} onPress={() => setPmSheet(true)}>
//               <CreditCard size={14} color={GREY} />
//               <Text style={s.pickerText}>{paymentMode}</Text>
//               <ChevronDown size={14} color={GREY} />
//             </TouchableOpacity>

//             {/* Subtotal (readonly) */}
//             <Text style={s.label}>Subtotal</Text>
//             <View style={s.readonlyField}>
//               <Text style={s.readonlyText}>₹{fmt(subtotal)}</Text>
//             </View>

//             {/* Discount */}
//             <Text style={s.label}>Discount (₹)</Text>
//             <TextInput style={s.input} keyboardType="numeric" value={discount} onChangeText={setDiscount} placeholder="0" placeholderTextColor="#aaa" />

//             {/* Invoice Date (readonly) */}
//             <Text style={s.label}>Invoice Date</Text>
//             <View style={s.readonlyField}>
//               <Calendar size={13} color={GREY} />
//               <Text style={s.readonlyText}>{fmtDate(date || new Date().toISOString())}</Text>
//             </View>

//             {/* Salesperson */}
//             <Text style={s.label}>Salesperson</Text>
//             <TouchableOpacity style={s.picker} onPress={() => setSpSheet(true)}>
//               <User size={14} color={GREY} />
//               <Text style={[s.pickerText, !salesperson && { color: '#aaa' }]}>{salesperson || 'Select salesperson…'}</Text>
//               <ChevronDown size={14} color={GREY} />
//             </TouchableOpacity>

//             {/* Phone + Customer Lookup */}
//             <Text style={s.label}>Phone Number *</Text>
//             <TextInput
//               style={[s.input, phoneError && { borderColor: ACCENT }]}
//               placeholder="Enter 10-digit mobile number"
//               placeholderTextColor="#aaa"
//               keyboardType="phone-pad"
//               maxLength={10}
//               value={buyerPhone}
//               onChangeText={v => { setBuyerPhone(v); if (v.length === 10) setPhoneError(false); }}
//             />
//             {phoneError && buyerPhone.length < 10 && (
//               <Text style={s.errorText}>Enter a valid 10-digit phone number</Text>
//             )}

//             {/* Lookup states */}
//             {lookupState === 'loading' && (
//               <View style={s.statusRow}>
//                 <ActivityIndicator size="small" color={ACCENT} />
//                 <Text style={{ color: GREY, fontSize: 12 }}>Checking customer database…</Text>
//               </View>
//             )}
//             {lookupState === 'found' && customer && (
//               <View style={s.foundCard}>
//                 <View style={s.foundHeader}>
//                   <CheckCircle size={14} color={GREEN} />
//                   <Text style={{ fontSize: 13, color: GREEN, fontWeight: '700', flex: 1 }}>Customer Found</Text>
//                   <TouchableOpacity style={s.editBtn} onPress={() => setEditModal(true)}>
//                     <Text style={s.editBtnText}>Edit</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <Text style={s.customerName}>
//                   {customer.type === 'shop' ? `${customer.name} (${customer.shopName})` : customer.name}
//                 </Text>
//                 {customer.address ? (
//                   <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 3 }}>
//                     <MapPin size={13} color={GREY} />
//                     <Text style={{ fontSize: 12, color: GREY, flex: 1 }}>{customer.address}</Text>
//                   </View>
//                 ) : null}
//                 {(customer.city || customer.state) ? (
//                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
//                     <Building2 size={13} color={GREY} />
//                     <Text style={{ fontSize: 12, color: GREY }}>{[customer.city, customer.state].filter(Boolean).join(', ')}</Text>
//                   </View>
//                 ) : null}
//               </View>
//             )}
//             {lookupState === 'notfound' && (
//               <View style={s.notFoundBox}>
//                 <AlertTriangle size={13} color={ACCENT} />
//                 <Text style={{ fontSize: 12, color: GREY, flex: 1 }}>No customer found.</Text>
//                 <TouchableOpacity style={s.addBtn} onPress={() => setAddModal(true)}>
//                   <Text style={s.addBtnText}>+ Add Customer</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//             {lookupState === 'error' && (
//               <View style={s.notFoundBox}>
//                 <WifiOff size={13} color={ACCENT} />
//                 <Text style={{ fontSize: 12, color: GREY, flex: 1 }}>Could not reach server.</Text>
//                 <TouchableOpacity style={s.addBtn} onPress={() => dispatch(lookupCustomer(buyerPhone))}>
//                   <Text style={s.addBtnText}>Retry</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {/* Shipping Address */}
//             <Text style={s.label}>Shipping Address</Text>
//             <View style={s.switchRow}>
//               <Text style={{ fontSize: 13, color: GREY }}>Same as buyer address</Text>
//               <TouchableOpacity
//                 style={[s.switchBtn, sameAsBuyer && s.switchBtnActive]}
//                 onPress={() => setSameAsBuyer(p => !p)}>
//                 <Text style={[s.switchBtnText, sameAsBuyer && { color: WHITE }]}>
//                   {sameAsBuyer ? 'ON' : 'OFF'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             {!sameAsBuyer && (
//               <>
//                 {[
//                   { label: 'Ship to Name',  value: shipToName,    set: setShipToName    },
//                   { label: 'Ship to Phone', value: shipToPhone,   set: setShipToPhone,  keyboard: 'phone-pad' },
//                 ].map(f => (
//                   <TextInput key={f.label} style={[s.input, { marginTop: 6 }]} placeholder={f.label} placeholderTextColor="#aaa" keyboardType={f.keyboard || 'default'} value={f.value} onChangeText={f.set} />
//                 ))}
//                 <TextInput
//                   style={[s.input, { minHeight: 60, textAlignVertical: 'top', marginTop: 6 }]}
//                   placeholder="Ship to Address" placeholderTextColor="#aaa" multiline
//                   value={shipToAddress} onChangeText={setShipToAddress} />
//                 <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
//                   <TextInput style={[s.input, { flex: 1 }]} placeholder="City" placeholderTextColor="#aaa" value={shipToCity} onChangeText={setShipToCity} />
//                   <TextInput style={[s.input, { flex: 1 }]} placeholder="State" placeholderTextColor="#aaa" value={shipToState} onChangeText={setShipToState} />
//                 </View>
//               </>
//             )}

//             {/* GST */}
//             <Text style={s.label}>GST (₹)</Text>
//             <TextInput style={s.input} keyboardType="numeric" value={gstAmount} onChangeText={setGstAmount} placeholder="0" placeholderTextColor="#aaa" />

//             {/* Courier */}
//             <Text style={s.label}>Courier Charge (₹)</Text>
//             <TextInput style={s.input} keyboardType="numeric" value={courierCharge} onChangeText={setCourierCharge} placeholder="0" placeholderTextColor="#aaa" />

//             {/* Total preview */}
//             <View style={s.totalPreview}>
//               {[
//                 { label: 'Subtotal',  value: `₹${fmt(subtotal)}` },
//                 ...(discountAmt > 0 ? [{ label: 'Discount', value: `- ₹${fmt(discountAmt)}`, accent: true }] : []),
//                 { label: 'Courier',  value: `₹${fmt(courierAmt)}` },
//                 ...(gstAmt > 0      ? [{ label: 'GST',      value: `₹${fmt(gstAmt)}` }] : []),
//               ].map(row => (
//                 <View key={row.label} style={s.totalRow}>
//                   <Text style={s.totalRowLabel}>{row.label}</Text>
//                   <Text style={[s.totalRowValue, row.accent && { color: GREEN }]}>{row.value}</Text>
//                 </View>
//               ))}
//               <View style={[s.totalRow, { borderTopWidth: 1, borderTopColor: BORDER, marginTop: 6, paddingTop: 8 }]}>
//                 <Text style={[s.totalRowLabel, { fontWeight: '800', fontSize: 14 }]}>Grand Total</Text>
//                 <Text style={[s.totalRowValue, { color: ACCENT, fontSize: 16, fontWeight: '800' }]}>₹{fmt(grandTotalNet)}</Text>
//               </View>
//             </View>
//           </View>

//           {/* ── View Invoice button ── */}
//           <TouchableOpacity
//             style={[s.primaryBtn, (isConfirming || !referenceNo.trim() || !orderType) && { opacity: 0.5 }]}
//             onPress={handleViewInvoice}
//             disabled={isConfirming || !referenceNo.trim() || !orderType}>
//             <FileText size={16} color={WHITE} />
//             <Text style={s.primaryBtnText}>View Invoice</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* ── Sheets ── */}
//       <PickerSheet visible={pmSheet} onClose={() => setPmSheet(false)} title="Payment Mode"  items={PAYMENT_MODES} selected={paymentMode}  onSelect={setPaymentMode}  />
//       <PickerSheet visible={otSheet} onClose={() => setOtSheet(false)} title="Order Type"    items={ORDER_TYPES}   selected={orderType}    onSelect={setOrderType}    />
//       <PickerSheet visible={spSheet} onClose={() => setSpSheet(false)} title="Salesperson"   items={SALESPERSONS}  selected={salesperson}   onSelect={setSalesperson}   />

//       {/* ── Add Customer ── */}
//       <CustomerModal
//         visible={addModal}
//         onClose={() => setAddModal(false)}
//         onSave={data => dispatch(addCustomer({ phone: buyerPhone, ...data }))}
//         saving={addLoading}
//         title="Add New Customer"
//         phone={buyerPhone}
//       />

//       {/* ── Edit Customer ── */}
//       <CustomerModal
//         visible={editModal}
//         onClose={() => setEditModal(false)}
//         onSave={data => dispatch(updateCustomer({ phone: buyerPhone, data }))}
//         saving={updateLoading}
//         title="Edit Customer"
//         phone={buyerPhone}
//         initial={customer}
//       />

//       {/* ── Confirm modal ── */}
//       <ConfirmModal
//         visible={confirmModal}
//         onClose={() => setConfirmModal(false)}
//         onConfirm={goToInvoice}
//         confirming={isConfirming}
//         data={confirmData}
//       />
//     </SafeAreaView>
//   );
// };

// // ─── Styles ───────────────────────────────────────────────────
// const s = StyleSheet.create({
//   section: { backgroundColor: WHITE, borderRadius: 14, padding: 16, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4 },
//   sectionTitle: { fontSize: 13, fontWeight: '800', color: '#212121', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
//   label: { fontSize: 11, fontWeight: '700', color: GREY, marginBottom: 5, marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
//   input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: '#212121' },
//   picker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
//   pickerText: { flex: 1, fontSize: 14, color: '#212121' },
//   readonlyField: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
//   readonlyText: { fontSize: 14, color: GREY, fontWeight: '600' },
//   errorText: { fontSize: 11, color: ACCENT, marginTop: 3 },
//   statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, backgroundColor: '#F9F9F9', borderRadius: 8, marginTop: 6 },

//   foundCard: { backgroundColor: '#E8F5E9', borderRadius: 10, padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#A5D6A7' },
//   foundHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
//   editBtn: { borderWidth: 1, borderColor: ACCENT, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
//   editBtnText: { fontSize: 12, color: ACCENT, fontWeight: '700' },
//   customerName: { fontSize: 14, fontWeight: '700', color: '#212121' },

//   notFoundBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF3E0', borderRadius: 8, padding: 10, marginTop: 6 },
//   addBtn: { backgroundColor: ACCENT, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
//   addBtnText: { fontSize: 12, color: WHITE, fontWeight: '700' },

//   switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
//   switchBtn: { borderWidth: 1, borderColor: BORDER, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 7 },
//   switchBtnActive: { backgroundColor: ACCENT, borderColor: ACCENT },
//   switchBtnText: { fontSize: 13, fontWeight: '700', color: GREY },

//   totalPreview: { backgroundColor: '#F9F9F9', borderRadius: 10, padding: 14, marginTop: 14 },
//   totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
//   totalRowLabel: { fontSize: 13, color: GREY },
//   totalRowValue: { fontSize: 13, color: '#212121', fontWeight: '600' },

//   primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 15, gap: 8, elevation: 3, shadowColor: ACCENT, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 6 },
//   primaryBtnText: { color: WHITE, fontSize: 15, fontWeight: '800' },

//   // Batch summary
//   batchSummaryItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
//   batchSummaryProduct: { fontSize: 13, fontWeight: '700', color: '#212121' },
//   batchTag: { backgroundColor: '#E3F2FD', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
//   batchTagText: { fontSize: 11, color: '#1565C0', fontWeight: '600' },

//   // Sheet
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
//   sheet: { backgroundColor: WHITE, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', borderTopWidth: 3, borderTopColor: ACCENT },
//   sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
//   sheetTitle: { fontSize: 16, fontWeight: '800', color: '#212121' },
//   sheetRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F8F8F8' },
//   sheetRowText: { flex: 1, fontSize: 14, color: '#212121' },

//   // Confirm
//   confirmRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F8F8F8' },
//   confirmLabel: { fontSize: 12, color: GREY, fontWeight: '600' },
//   confirmValue: { fontSize: 13, color: '#212121', fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 12 },

//   // Customer Modal
//   phonePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F9F9F9', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, alignSelf: 'flex-start', marginTop: 10 },
//   typeRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
//   typeBtn: { flex: 1, borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
//   typeBtnActive: { backgroundColor: ACCENT, borderColor: ACCENT },
//   typeBtnText: { fontSize: 14, color: GREY, fontWeight: '600' },
//   typeBtnTextActive: { color: WHITE, fontWeight: '700' },
//   modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
//   cancelBtn: { borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 11 },
//   cancelBtnText: { color: GREY, fontSize: 14, fontWeight: '600' },
//   submitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: ACCENT, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 11, gap: 6, elevation: 2 },
//   submitBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },
// });

// export default OrderSuccess;