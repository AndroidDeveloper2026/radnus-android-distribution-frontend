import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShoppingCart, ChevronDown, Plus, Trash2, X,
  CheckCircle, Package, Truck, AlertTriangle,
} from 'lucide-react-native';
import Header from '../../components/Header';
import { fetchProducts } from '../../services/features/products/productSlice';
import {
  fetchSuppliers,
  addSupplier,
  createPurchase,
  clearSubmitError,
} from '../../services/features/purchase/purchaseSlice';

// ─── Constants ────────────────────────────────────────────────────
const ACCENT = '#D32F2F';
const WHITE  = '#FFFFFF';
const BG     = '#F5F5F5';
const GREY   = '#555';
const BORDER = '#E5E7EB';

const PAYMENT_TYPES = ['Credit', 'Cash', 'UPI', 'Bank Transfer', 'Cheque'];

// ─── Helpers ─────────────────────────────────────────────────────
const fmt = v => Number(v || 0).toFixed(2);

// ─── Picker Sheet ─────────────────────────────────────────────────
const PickerSheet = ({ visible, onClose, title, items, onSelect, keyExtractor, labelExtractor, selectedKey }) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View style={s.overlay}>
      <View style={s.sheet}>
        <View style={s.sheetHeader}>
          <Text style={s.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={20} color={GREY} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => {
            const isSelected = keyExtractor(item) === selectedKey;
            return (
              <TouchableOpacity
                style={[s.sheetItem, isSelected && s.sheetItemActive]}
                onPress={() => { onSelect(item); onClose(); }}>
                <Text style={[s.sheetItemText, isSelected && s.sheetItemTextActive]}>
                  {labelExtractor(item)}
                </Text>
                {isSelected && <CheckCircle size={16} color={ACCENT} />}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={s.emptyText}>No items found</Text>}
        />
      </View>
    </View>
  </Modal>
);

// ─── Add Supplier Modal ───────────────────────────────────────────
const AddSupplierModal = ({ visible, onClose, onSave, saving }) => {
  const [form, setForm] = useState({ name: '', mobile: '', address: '', gstNo: '' });

  const reset = () => setForm({ name: '', mobile: '', address: '', gstNo: '' });

  const handleSave = () => {
    if (!form.name.trim()) { Alert.alert('Validation', 'Supplier name is required.'); return; }
    onSave(form);
    reset();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>New Supplier</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={GREY} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ paddingHorizontal: 20 }} keyboardShouldPersistTaps="handled">
            {[
              { label: 'Name *', key: 'name', placeholder: 'Supplier name' },
              { label: 'Mobile', key: 'mobile', placeholder: '9XXXXXXXXX', keyboardType: 'phone-pad' },
              { label: 'Address', key: 'address', placeholder: 'Full address', multiline: true },
              { label: 'GST No.', key: 'gstNo', placeholder: '22AAAAA0000A1Z5' },
            ].map(f => (
              <View key={f.key} style={{ marginBottom: 14 }}>
                <Text style={s.label}>{f.label}</Text>
                <TextInput
                  style={[s.input, f.multiline && { minHeight: 68, textAlignVertical: 'top' }]}
                  placeholder={f.placeholder}
                  placeholderTextColor="#aaa"
                  keyboardType={f.keyboardType || 'default'}
                  multiline={!!f.multiline}
                  value={form[f.key]}
                  onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
                />
              </View>
            ))}
          </ScrollView>
          <View style={s.modalFooter}>
            <TouchableOpacity style={s.cancelBtn} onPress={handleClose}>
              <Text style={s.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.submitBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator size="small" color={WHITE} /> : <Plus size={15} color={WHITE} />}
              <Text style={s.submitBtnText}>{saving ? 'Saving...' : 'Add Supplier'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Confirm Modal ────────────────────────────────────────────────
const ConfirmModal = ({ visible, onClose, onConfirm, submitting, totals, supplierName, itemCount, discount, paidAmount }) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View style={s.overlay}>
      <View style={[s.sheet, { borderTopLeftRadius: 16, borderTopRightRadius: 16 }]}>
        <View style={s.sheetHeader}>
          <Text style={s.sheetTitle}>Confirm Purchase Entry</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={20} color={GREY} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 20, paddingVertical: 12, gap: 10 }}>
          {[
            { label: 'Supplier', value: supplierName },
            { label: 'Items', value: `${itemCount} product${itemCount !== 1 ? 's' : ''}` },
            { label: 'Subtotal', value: `₹${fmt(totals.subtotal)}` },
            { label: 'GST', value: `₹${fmt(totals.gstAmount)}` },
            ...(Number(discount) > 0 ? [{ label: 'Discount', value: `- ₹${fmt(discount)}` }] : []),
          ].map(row => (
            <View key={row.label} style={s.confirmRow}>
              <Text style={s.confirmLabel}>{row.label}</Text>
              <Text style={s.confirmValue}>{row.value}</Text>
            </View>
          ))}
          <View style={s.confirmDivider} />
          <View style={s.confirmRow}>
            <Text style={[s.confirmLabel, { fontWeight: '800', fontSize: 14 }]}>Grand Total</Text>
            <Text style={[s.confirmValue, { fontSize: 16, fontWeight: '800', color: ACCENT }]}>
              ₹{fmt(totals.grandTotal)}
            </Text>
          </View>
          {Number(paidAmount) > 0 && (
            <View style={s.confirmRow}>
              <Text style={s.confirmLabel}>Paid</Text>
              <Text style={[s.confirmValue, { color: '#2E7D32' }]}>₹{fmt(paidAmount)}</Text>
            </View>
          )}
          <View style={s.confirmRow}>
            <Text style={s.confirmLabel}>Due Amount</Text>
            <Text style={[s.confirmValue, { color: totals.dueAmount > 0 ? ACCENT : '#2E7D32' }]}>
              ₹{fmt(totals.dueAmount)}
            </Text>
          </View>
        </View>
        <View style={s.modalFooter}>
          <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
            <Text style={s.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.submitBtn} onPress={onConfirm} disabled={submitting}>
            {submitting
              ? <ActivityIndicator size="small" color={WHITE} />
              : <CheckCircle size={15} color={WHITE} />}
            <Text style={s.submitBtnText}>{submitting ? 'Saving...' : 'Save & Continue'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// ─── Main Screen ──────────────────────────────────────────────────
const emptyItem = () => ({
  productId: '', name: '', sku: '',
  qty: '', batchNo: '', rackNo: '',
  purchasePrice: '', gst: '0',
  distributorPrice: '', retailerPrice: '', walkinPrice: '', mrp: '',
  unit: 'pcs',
});

const PurchaseEntryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const products   = useSelector(s => s.products.list);
  const { suppliers, submitting, submitError } = useSelector(s => s.purchase);

  // ── Header fields
  const [supplier, setSupplier]       = useState(null);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [paymentType, setPaymentType] = useState('Credit');
  const [remarks, setRemarks]         = useState('');

  // ── Item being composed
  const [draft, setDraft] = useState(emptyItem());

  // ── Cart
  const [items, setItems]     = useState([]);
  const [discount, setDiscount]     = useState('0');
  const [paidAmount, setPaidAmount] = useState('0');

  // ── Pickers / modals
  const [supplierSheet, setSupplierSheet]   = useState(false);
  const [paymentSheet, setPaymentSheet]     = useState(false);
  const [productSheet, setProductSheet]     = useState(false);
  const [addSupplierModal, setAddSupplierModal] = useState(false);
  const [confirmModal, setConfirmModal]     = useState(false);

  // ── Product search in picker
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSuppliers());
    return () => dispatch(clearSubmitError());
  }, [dispatch]);

  // ── Totals
  const totals = useMemo(() => {
    const subtotal  = items.reduce((s, it) => s + Number(it.total || 0), 0);
    const gstAmount = items.reduce((s, it) => s + (Number(it.total || 0) * (Number(it.gst) || 0)) / 100, 0);
    const grandTotal = subtotal - (Number(discount) || 0) + gstAmount;
    const dueAmount  = grandTotal - (Number(paidAmount) || 0);
    return {
      subtotal:   Math.round(subtotal   * 100) / 100,
      gstAmount:  Math.round(gstAmount  * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
      dueAmount:  Math.round(dueAmount  * 100) / 100,
    };
  }, [items, discount, paidAmount]);

  // ── Product picker filtered list
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase();
    return products.filter(p =>
      p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  const handleSelectProduct = useCallback(p => {
    setDraft(prev => ({
      ...prev,
      productId: p._id,
      name: p.name,
      sku: p.sku || '',
      unit: p.unit || 'pcs',
      distributorPrice: String(p.distributorPrice || ''),
      retailerPrice:    String(p.retailerPrice || ''),
      walkinPrice:      String(p.walkinPrice || ''),
      mrp:              String(p.mrp || ''),
    }));
    setProductSearch('');
    setProductSheet(false);
  }, []);

  const handleAddItem = () => {
    if (!draft.productId)      { Alert.alert('Validation', 'Select a product first.'); return; }
    if (!draft.qty || Number(draft.qty) <= 0) { Alert.alert('Validation', 'Enter a valid quantity.'); return; }
    if (!draft.purchasePrice || Number(draft.purchasePrice) <= 0) {
      Alert.alert('Validation', 'Enter a valid purchase price.'); return;
    }
    const total = Number(draft.qty) * Number(draft.purchasePrice);
    setItems(prev => [...prev, { ...draft, total }]);
    setDraft(emptyItem());
  };

  const handleRemoveItem = idx => setItems(prev => prev.filter((_, i) => i !== idx));

  const handleAddSupplier = async payload => {
    const res = await dispatch(addSupplier(payload)).unwrap();
    setSupplier(res);
    setAddSupplierModal(false);
  };

  const handleSave = () => {
    if (!supplier)     { Alert.alert('Validation', 'Select a supplier.'); return; }
    if (!invoiceDate)  { Alert.alert('Validation', 'Enter an invoice date.'); return; }
    if (!items.length) { Alert.alert('Validation', 'Add at least one item.'); return; }
    setConfirmModal(true);
  };

  const handleConfirm = async () => {
    try {
      await dispatch(createPurchase({
        supplier: supplier._id,
        invoiceDate,
        paymentType,
        remarks,
        products: items.map(it => ({
          productId:        it.productId,
          name:             it.name,
          sku:              it.sku,
          quantity:         Number(it.qty),
          purchasePrice:    Number(it.purchasePrice),
          gst:              Number(it.gst),
          batchNo:          it.batchNo,
          rackNo:           it.rackNo,
          unit:             it.unit,
          distributorPrice: Number(it.distributorPrice || 0),
          retailerPrice:    Number(it.retailerPrice    || 0),
          walkinPrice:      Number(it.walkinPrice      || 0),
          mrp:              Number(it.mrp              || 0),
          total:            it.total,
        })),
        discount:    Number(discount)    || 0,
        paidAmount:  Number(paidAmount)  || 0,
      })).unwrap();
      setConfirmModal(false);
      Alert.alert('Success', 'Purchase entry saved successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('PurchaseHistoryScreen') },
      ]);
      // Reset
      setSupplier(null); setInvoiceDate(''); setPaymentType('Credit'); setRemarks('');
      setItems([]); setDiscount('0'); setPaidAmount('0');
    } catch (err) {
      setConfirmModal(false);
      Alert.alert('Error', err || 'Failed to save purchase entry.');
    }
  };

  const draftField = (key, value) => setDraft(p => ({ ...p, [key]: value }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['bottom']}>
      <Header title="Purchase Entry" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 30 }} keyboardShouldPersistTaps="handled">

          {/* ── SECTION: Header info ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Purchase Details</Text>

            {/* Supplier */}
            <Text style={s.label}>Supplier *</Text>
            <View style={s.row}>
              <TouchableOpacity style={[s.picker, { flex: 1 }]} onPress={() => setSupplierSheet(true)}>
                <Truck size={15} color={GREY} />
                <Text style={[s.pickerText, !supplier && { color: '#aaa' }]} numberOfLines={1}>
                  {supplier?.name || 'Select supplier'}
                </Text>
                <ChevronDown size={15} color={GREY} />
              </TouchableOpacity>
              <TouchableOpacity style={s.addBtn} onPress={() => setAddSupplierModal(true)}>
                <Plus size={15} color={WHITE} />
              </TouchableOpacity>
            </View>

            {/* Invoice Date */}
            <Text style={s.label}>Invoice Date *</Text>
            <TextInput
              style={s.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#aaa"
              value={invoiceDate}
              onChangeText={setInvoiceDate}
            />

            {/* Payment Type */}
            <Text style={s.label}>Payment Type</Text>
            <TouchableOpacity style={s.picker} onPress={() => setPaymentSheet(true)}>
              <Text style={s.pickerText}>{paymentType}</Text>
              <ChevronDown size={15} color={GREY} />
            </TouchableOpacity>

            {/* Remarks */}
            <Text style={s.label}>Remarks</Text>
            <TextInput
              style={[s.input, { minHeight: 60, textAlignVertical: 'top' }]}
              placeholder="Optional notes"
              placeholderTextColor="#aaa"
              multiline
              value={remarks}
              onChangeText={setRemarks}
            />
          </View>

          {/* ── SECTION: Add Item ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Add Item</Text>

            {/* Product */}
            <Text style={s.label}>Product *</Text>
            <TouchableOpacity style={s.picker} onPress={() => setProductSheet(true)}>
              <Package size={15} color={GREY} />
              <Text style={[s.pickerText, !draft.productId && { color: '#aaa' }]} numberOfLines={1}>
                {draft.name || 'Select product'}
              </Text>
              <ChevronDown size={15} color={GREY} />
            </TouchableOpacity>

            {/* Qty + Purchase Price */}
            <View style={s.rowGap}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Qty *</Text>
                <TextInput style={s.input} placeholder="0" placeholderTextColor="#aaa" keyboardType="numeric" value={draft.qty} onChangeText={v => draftField('qty', v)} />
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={s.label}>Purchase Price *</Text>
                <TextInput style={s.input} placeholder="0.00" placeholderTextColor="#aaa" keyboardType="numeric" value={draft.purchasePrice} onChangeText={v => draftField('purchasePrice', v)} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>GST %</Text>
                <TextInput style={s.input} placeholder="0" placeholderTextColor="#aaa" keyboardType="numeric" value={draft.gst} onChangeText={v => draftField('gst', v)} />
              </View>
            </View>

            {/* Batch + Rack */}
            <View style={s.rowGap}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Batch No.</Text>
                <TextInput style={s.input} placeholder="e.g. B001" placeholderTextColor="#aaa" value={draft.batchNo} onChangeText={v => draftField('batchNo', v)} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Rack No.</Text>
                <TextInput style={s.input} placeholder="e.g. R01" placeholderTextColor="#aaa" value={draft.rackNo} onChangeText={v => draftField('rackNo', v)} />
              </View>
            </View>

            {/* Pricing tiers */}
            <View style={s.rowGap}>
              {[
                { label: 'Distributor ₹', key: 'distributorPrice' },
                { label: 'Retailer ₹', key: 'retailerPrice' },
                { label: 'Walk-in ₹', key: 'walkinPrice' },
                { label: 'MRP ₹', key: 'mrp' },
              ].map(f => (
                <View key={f.key} style={{ flex: 1 }}>
                  <Text style={s.label}>{f.label}</Text>
                  <TextInput style={s.input} placeholder="0" placeholderTextColor="#aaa" keyboardType="numeric" value={draft[f.key]} onChangeText={v => draftField(f.key, v)} />
                </View>
              ))}
            </View>

            {/* Draft total preview */}
            {draft.qty && draft.purchasePrice ? (
              <View style={s.draftTotal}>
                <Text style={s.draftTotalText}>
                  Line total: ₹{fmt(Number(draft.qty) * Number(draft.purchasePrice))}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity style={s.addItemBtn} onPress={handleAddItem}>
              <Plus size={15} color={WHITE} />
              <Text style={s.addItemBtnText}>Add to List</Text>
            </TouchableOpacity>
          </View>

          {/* ── SECTION: Item List ── */}
          {items.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Items ({items.length})</Text>
              {items.map((it, idx) => (
                <View key={idx} style={s.itemCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemName} numberOfLines={1}>{it.name}</Text>
                    <Text style={s.itemMeta}>Qty: {it.qty} × ₹{it.purchasePrice}  |  GST: {it.gst}%</Text>
                    {it.batchNo ? <Text style={s.itemMeta}>Batch: {it.batchNo}{it.rackNo ? `  |  Rack: ${it.rackNo}` : ''}</Text> : null}
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <Text style={s.itemTotal}>₹{fmt(it.total)}</Text>
                    <TouchableOpacity onPress={() => handleRemoveItem(idx)}>
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── SECTION: Summary ── */}
          {items.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Summary</Text>

              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Subtotal</Text>
                <Text style={s.summaryValue}>₹{fmt(totals.subtotal)}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>GST</Text>
                <Text style={s.summaryValue}>₹{fmt(totals.gstAmount)}</Text>
              </View>

              <View style={s.rowGap}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Discount (₹)</Text>
                  <TextInput style={s.input} placeholder="0" placeholderTextColor="#aaa" keyboardType="numeric" value={discount} onChangeText={setDiscount} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Paid Amount (₹)</Text>
                  <TextInput style={s.input} placeholder="0" placeholderTextColor="#aaa" keyboardType="numeric" value={paidAmount} onChangeText={setPaidAmount} />
                </View>
              </View>

              <View style={s.summaryDivider} />
              <View style={s.summaryRow}>
                <Text style={[s.summaryLabel, { fontWeight: '800', fontSize: 15 }]}>Grand Total</Text>
                <Text style={[s.summaryValue, { fontSize: 17, fontWeight: '800', color: ACCENT }]}>
                  ₹{fmt(totals.grandTotal)}
                </Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Due Amount</Text>
                <Text style={[s.summaryValue, { color: totals.dueAmount > 0 ? ACCENT : '#2E7D32', fontWeight: '700' }]}>
                  ₹{fmt(totals.dueAmount)}
                </Text>
              </View>

              {submitError ? (
                <View style={s.errorBox}>
                  <AlertTriangle size={14} color="#EF4444" />
                  <Text style={s.errorText}>{submitError}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
                <ShoppingCart size={16} color={WHITE} />
                <Text style={s.saveBtnText}>Save Purchase Entry</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Supplier Picker ── */}
      <PickerSheet
        visible={supplierSheet}
        onClose={() => setSupplierSheet(false)}
        title="Select Supplier"
        items={suppliers}
        keyExtractor={i => i._id}
        labelExtractor={i => i.name}
        selectedKey={supplier?._id}
        onSelect={i => setSupplier(i)}
      />

      {/* ── Payment Type Picker ── */}
      <PickerSheet
        visible={paymentSheet}
        onClose={() => setPaymentSheet(false)}
        title="Payment Type"
        items={PAYMENT_TYPES.map(v => ({ id: v, label: v }))}
        keyExtractor={i => i.id}
        labelExtractor={i => i.label}
        selectedKey={paymentType}
        onSelect={i => setPaymentType(i.id)}
      />

      {/* ── Product Picker ── */}
      <Modal visible={productSheet} animationType="slide" transparent onRequestClose={() => setProductSheet(false)}>
        <View style={s.overlay}>
          <View style={[s.sheet, { maxHeight: '85%' }]}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Select Product</Text>
              <TouchableOpacity onPress={() => { setProductSheet(false); setProductSearch(''); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={20} color={GREY} />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
              <TextInput
                style={s.searchInput}
                placeholder="Search by name or SKU"
                placeholderTextColor="#aaa"
                value={productSearch}
                onChangeText={setProductSearch}
                autoFocus
              />
            </View>
            <FlatList
              data={filteredProducts}
              keyExtractor={p => p._id}
              renderItem={({ item: p }) => (
                <TouchableOpacity
                  style={[s.sheetItem, draft.productId === p._id && s.sheetItemActive]}
                  onPress={() => handleSelectProduct(p)}>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.sheetItemText, draft.productId === p._id && s.sheetItemTextActive]} numberOfLines={1}>
                      {p.name}
                    </Text>
                    {p.sku ? <Text style={s.skuText}>SKU: {p.sku}</Text> : null}
                  </View>
                  {draft.productId === p._id && <CheckCircle size={16} color={ACCENT} />}
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={s.emptyText}>No products found</Text>}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </Modal>

      {/* ── Add Supplier Modal ── */}
      <AddSupplierModal
        visible={addSupplierModal}
        onClose={() => setAddSupplierModal(false)}
        onSave={handleAddSupplier}
        saving={submitting}
      />

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        visible={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={handleConfirm}
        submitting={submitting}
        totals={totals}
        supplierName={supplier?.name || ''}
        itemCount={items.length}
        discount={discount}
        paidAmount={paidAmount}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  section: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: GREY,
    marginBottom: 5,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#212121',
  },
  searchInput: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212121',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  pickerText: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
  },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  rowGap: { flexDirection: 'row', gap: 8, marginTop: 2 },
  addBtn: {
    backgroundColor: ACCENT,
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 14,
    gap: 6,
    elevation: 2,
  },
  addItemBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },
  draftTotal: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  draftTotalText: { fontSize: 13, color: ACCENT, fontWeight: '700' },

  // Item card
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 10,
  },
  itemName: { fontSize: 13, fontWeight: '700', color: '#212121', marginBottom: 3 },
  itemMeta: { fontSize: 11, color: GREY, lineHeight: 16 },
  itemTotal: { fontSize: 14, fontWeight: '800', color: ACCENT },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: { fontSize: 13, color: GREY, fontWeight: '500' },
  summaryValue: { fontSize: 13, color: '#212121', fontWeight: '600' },
  summaryDivider: { height: 1, backgroundColor: BORDER, marginVertical: 10 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
    gap: 8,
    elevation: 3,
  },
  saveBtnText: { color: WHITE, fontSize: 15, fontWeight: '800' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  errorText: { color: '#EF4444', fontSize: 12, flex: 1 },

  // Sheet
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    borderTopWidth: 3,
    borderTopColor: ACCENT,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: '#212121' },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
    gap: 10,
  },
  sheetItemActive: { backgroundColor: '#FFF3F3' },
  sheetItemText: { flex: 1, fontSize: 14, color: '#212121' },
  sheetItemTextActive: { color: ACCENT, fontWeight: '700' },
  skuText: { fontSize: 11, color: '#aaa', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#aaa', padding: 30, fontSize: 14 },

  // Confirm
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmLabel: { fontSize: 13, color: GREY, fontWeight: '600' },
  confirmValue: { fontSize: 13, color: '#212121', fontWeight: '600' },
  confirmDivider: { height: 1, backgroundColor: BORDER, marginVertical: 8 },

  // Modal footer
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  cancelBtnText: { color: GREY, fontSize: 14, fontWeight: '600' },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 11,
    gap: 6,
    elevation: 2,
  },
  submitBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },
});

export default PurchaseEntryScreen;