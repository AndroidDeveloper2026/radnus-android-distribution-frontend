import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search, X, ChevronDown, ChevronUp, Eye, Pencil,
  ClipboardList, RefreshCw, CheckCircle,
} from 'lucide-react-native';
import RNPrint from 'react-native-print';
import Header from '../../components/Header';
import {
  fetchPurchases,
  fetchSuppliers,
  updatePurchase,
} from '../../services/features/purchase/purchaseSlice';

// ─── Constants ────────────────────────────────────────────────────
const ACCENT = '#D32F2F';
const WHITE  = '#FFFFFF';
const BG     = '#F5F5F5';
const GREY   = '#555';
const BORDER = '#E5E7EB';

const STATUS_TABS = [
  { key: 'all',     label: 'All'     },
  { key: 'paid',    label: 'Paid'    },
  { key: 'partial', label: 'Partial' },
  { key: 'unpaid',  label: 'Unpaid'  },
];

const PAYMENT_TYPES = ['Credit', 'Cash', 'UPI', 'Bank Transfer', 'Cheque'];

// ─── Status badge ─────────────────────────────────────────────────
const statusColor = s => s === 'paid' ? '#2E7D32' : s === 'partial' ? '#E65100' : '#C62828';
const statusBg    = s => s === 'paid' ? '#E8F5E9' : s === 'partial' ? '#FFF3E0' : '#FFEBEE';

const StatusBadge = ({ status }) => (
  <View style={[s.badge, { backgroundColor: statusBg(status) }]}>
    <Text style={[s.badgeText, { color: statusColor(status) }]}>
      {(status || 'unpaid').toUpperCase()}
    </Text>
  </View>
);

// ─── Helpers ──────────────────────────────────────────────────────
const fmt    = v  => Number(v || 0).toFixed(2);
const fmtDate = v => v ? new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

// ─── Print invoice HTML ───────────────────────────────────────────
const generatePrintHTML = purchase => {
  const COMPANY = { name: 'RADNUS COMMUNICATION', address: 'No.242/244, MG Road, Sinnaya Plaza, Puducherry - 605001' };
  let rows = '';
  (purchase.products || []).forEach((p, i) => {
    rows += `<tr>
      <td style="border:1px solid #000;padding:5px;text-align:center">${i + 1}</td>
      <td style="border:1px solid #000;padding:5px">${p.name || '—'}</td>
      <td style="border:1px solid #000;padding:5px;text-align:center">${p.quantity || 0}</td>
      <td style="border:1px solid #000;padding:5px;text-align:right">₹${fmt(p.purchasePrice)}</td>
      <td style="border:1px solid #000;padding:5px;text-align:right">₹${fmt(p.total || p.quantity * p.purchasePrice)}</td>
    </tr>`;
  });
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:20px}
    .box{border:2px solid #000;padding:1rem}.hdr{text-align:center;border-bottom:2px solid #000;padding-bottom:.5rem}
    h2{font-size:1.1rem}p{font-size:.75rem;margin:2px 0}
    table{width:100%;border-collapse:collapse;margin:.5rem 0;font-size:.75rem}
    th{border:1px solid #000;padding:.45rem;background:#f0f0f0;font-weight:800;text-align:left}
    td{border:1px solid #000;padding:.35rem}</style></head>
    <body><div class="box">
    <div class="hdr"><h2>${COMPANY.name}</h2><p>${COMPANY.address}</p></div>
    <div style="text-align:center;font-size:1rem;font-weight:bold;padding:.5rem 0;border-bottom:1px solid #000">PURCHASE INVOICE</div>
    <div style="display:flex;justify-content:space-between;padding:.5rem 0;font-size:.78rem;border-bottom:1px solid #000">
      <div><strong>Invoice No:</strong> ${purchase.purchaseNumber || '—'}</div>
      <div><strong>Supplier:</strong> ${purchase.supplier?.name || '—'}</div>
      <div><strong>Date:</strong> ${fmtDate(purchase.invoiceDate || purchase.createdAt)}</div>
    </div>
    <table><thead><tr><th>No</th><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>${rows}
      <tr><td colspan="4" style="text-align:right;font-weight:700;border:1px solid #000;padding:5px">Grand Total</td>
      <td style="text-align:right;font-weight:700;border:1px solid #000;padding:5px">₹${fmt(purchase.grandTotal)}</td></tr>
    </tbody></table>
    <div style="padding:.5rem;font-size:.78rem"><strong>Payment Type:</strong> ${purchase.paymentType || '—'} &nbsp;|&nbsp; <strong>Due:</strong> ₹${fmt(purchase.dueAmount)}</div>
    <div style="text-align:center;padding:.5rem;font-size:.7rem;border-top:1px solid #000">Computer Generated Invoice</div>
    </div></body></html>`;
};

// ─── Edit Modal ───────────────────────────────────────────────────
const EditModal = ({ visible, onClose, purchase, onSave, saving }) => {
  const [paymentType, setPaymentType] = useState('Credit');
  const [paidAmount,  setPaidAmount]  = useState('0');
  const [remarks,     setRemarks]     = useState('');
  const [ptSheet,     setPtSheet]     = useState(false);

  useEffect(() => {
    if (purchase) {
      setPaymentType(purchase.paymentType || 'Credit');
      setPaidAmount(String(purchase.paidAmount || 0));
      setRemarks(purchase.remarks || '');
    }
  }, [purchase]);

  if (!purchase) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Edit {purchase.purchaseNumber}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={GREY} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ paddingHorizontal: 20 }} keyboardShouldPersistTaps="handled">
            <Text style={{ fontSize: 12, color: '#aaa', marginTop: 10, marginBottom: 4, lineHeight: 18 }}>
              Line items cannot be edited after saving. Only payment details can be updated.
            </Text>

            <Text style={s.label}>Payment Type</Text>
            <TouchableOpacity style={s.picker} onPress={() => setPtSheet(true)}>
              <Text style={s.pickerText}>{paymentType}</Text>
              <ChevronDown size={15} color={GREY} />
            </TouchableOpacity>

            <Text style={s.label}>Paid Amount (₹)</Text>
            <TextInput
              style={s.input}
              placeholder="0.00"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={paidAmount}
              onChangeText={setPaidAmount}
            />

            <Text style={s.label}>Remarks</Text>
            <TextInput
              style={[s.input, { minHeight: 60, textAlignVertical: 'top' }]}
              placeholder="Optional notes"
              placeholderTextColor="#aaa"
              multiline
              value={remarks}
              onChangeText={setRemarks}
            />
          </ScrollView>
          <View style={s.modalFooter}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.submitBtn}
              onPress={() => onSave(purchase._id, { paymentType, paidAmount: Number(paidAmount) || 0, remarks })}
              disabled={saving}>
              {saving ? <ActivityIndicator size="small" color={WHITE} /> : <CheckCircle size={15} color={WHITE} />}
              <Text style={s.submitBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Payment type picker */}
      <Modal visible={ptSheet} animationType="slide" transparent onRequestClose={() => setPtSheet(false)}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Payment Type</Text>
              <TouchableOpacity onPress={() => setPtSheet(false)}><X size={20} color={GREY} /></TouchableOpacity>
            </View>
            {PAYMENT_TYPES.map(pt => (
              <TouchableOpacity key={pt} style={[s.sheetItem, paymentType === pt && s.sheetItemActive]}
                onPress={() => { setPaymentType(pt); setPtSheet(false); }}>
                <Text style={[s.sheetItemText, paymentType === pt && s.sheetItemTextActive]}>{pt}</Text>
                {paymentType === pt && <CheckCircle size={16} color={ACCENT} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

// ─── Detail Sheet ─────────────────────────────────────────────────
const DetailSheet = ({ visible, onClose, purchase, onEdit, onPrint }) => {
  if (!purchase) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.sheet, { maxHeight: '88%' }]}>
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>{purchase.purchaseNumber}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={GREY} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ paddingHorizontal: 20, paddingTop: 14 }}>
            {/* Meta */}
            <View style={s.detailGrid}>
              {[
                { label: 'Supplier',      value: purchase.supplier?.name || '—' },
                { label: 'Invoice No.',   value: purchase.invoiceNumber || '—'  },
                { label: 'Invoice Date',  value: fmtDate(purchase.invoiceDate)   },
                { label: 'Payment Type', value: purchase.paymentType || '—'    },
                { label: 'Payment Status', value: <StatusBadge status={purchase.paymentStatus} /> },
                { label: 'Created',       value: fmtDate(purchase.createdAt)    },
              ].map(row => (
                <View key={row.label} style={s.detailItem}>
                  <Text style={s.detailLabel}>{row.label}</Text>
                  {typeof row.value === 'string'
                    ? <Text style={s.detailValue}>{row.value}</Text>
                    : row.value}
                </View>
              ))}
            </View>

            {/* Items */}
            <Text style={[s.label, { marginTop: 18 }]}>Items</Text>
            <View style={s.tableHeader}>
              {['Product', 'Qty', 'Price', 'Total'].map(h => (
                <Text key={h} style={[s.th, h === 'Product' && { flex: 2 }]}>{h}</Text>
              ))}
            </View>
            {(purchase.products || []).map((p, i) => (
              <View key={i} style={s.tableRow}>
                <Text style={[s.td, { flex: 2 }]} numberOfLines={1}>{p.name}</Text>
                <Text style={s.td}>{p.quantity}</Text>
                <Text style={s.td}>₹{fmt(p.purchasePrice)}</Text>
                <Text style={s.td}>₹{fmt(p.total || p.quantity * p.purchasePrice)}</Text>
              </View>
            ))}

            {/* Totals */}
            <View style={{ marginTop: 14, gap: 6 }}>
              {[
                { label: 'Grand Total', value: `₹${fmt(purchase.grandTotal)}`, big: true },
                { label: 'Paid Amount', value: `₹${fmt(purchase.paidAmount)}`, color: '#2E7D32' },
                { label: 'Due Amount',  value: `₹${fmt(purchase.dueAmount)}`,  color: purchase.dueAmount > 0 ? ACCENT : '#2E7D32' },
              ].map(row => (
                <View key={row.label} style={s.summaryRow}>
                  <Text style={[s.summaryLabel, row.big && { fontWeight: '800', fontSize: 14 }]}>{row.label}</Text>
                  <Text style={[s.summaryValue, { color: row.color || '#212121' }, row.big && { fontSize: 16, fontWeight: '800' }]}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>

            {purchase.remarks ? (
              <View style={{ backgroundColor: '#F9F9F9', borderRadius: 8, padding: 10, marginTop: 12 }}>
                <Text style={{ fontSize: 12, color: GREY }}>
                  <Text style={{ fontWeight: '700' }}>Remarks: </Text>{purchase.remarks}
                </Text>
              </View>
            ) : null}

            {/* Actions */}
            <View style={[s.detailActions, { marginBottom: 20 }]}>
              <TouchableOpacity style={s.actionBtn} onPress={() => { onClose(); onEdit(purchase); }}>
                <Pencil size={14} color={ACCENT} />
                <Text style={[s.actionBtnText, { color: ACCENT }]}>Edit Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.actionBtn, { backgroundColor: ACCENT }]} onPress={onPrint}>
                <Text style={[s.actionBtnText, { color: WHITE }]}>Print Invoice</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ─── Purchase Card ────────────────────────────────────────────────
const PurchaseCard = React.memo(({ item, onView }) => (
  <TouchableOpacity style={s.card} onPress={() => onView(item)} activeOpacity={0.85}>
    <View style={{ flex: 1, gap: 4 }}>
      <Text style={s.cardTitle}>{item.purchaseNumber}</Text>
      <Text style={s.cardSub} numberOfLines={1}>
        {item.supplier?.name || '—'}
      </Text>
      <Text style={s.cardSub}>{fmtDate(item.invoiceDate || item.createdAt)}  ·  {item.products?.length || 0} items</Text>
    </View>
    <View style={{ alignItems: 'flex-end', gap: 6 }}>
      <Text style={s.cardAmount}>₹{fmt(item.grandTotal)}</Text>
      <StatusBadge status={item.paymentStatus} />
    </View>
  </TouchableOpacity>
));

// ─── Main Screen ──────────────────────────────────────────────────
const PurchaseHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { purchases, purchasesLoading, submitting } = useSelector(s => s.purchase);
  const { list: supplierList } = useSelector(s => s.purchase.suppliers !== undefined ? s.purchase : { list: [] });
  const suppliers = useSelector(s => s.purchase.suppliers);

  const [tab,         setTab]         = useState('all');
  const [search,      setSearch]      = useState('');
  const [supplier,    setSupplier]    = useState('');
  const [refreshing,  setRefreshing]  = useState(false);
  const [viewTarget,  setViewTarget]  = useState(null);
  const [editTarget,  setEditTarget]  = useState(null);
  const [supSheet,    setSupSheet]    = useState(false);
  const [printing,    setPrinting]    = useState(false);

  const load = useCallback(() => {
    dispatch(fetchPurchases());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchPurchases());
    setRefreshing(false);
  };

  const handleUpdate = async (id, payload) => {
    try {
      await dispatch(updatePurchase({ id, payload })).unwrap();
      setEditTarget(null);
      Alert.alert('Success', 'Purchase updated successfully.');
      dispatch(fetchPurchases());
    } catch (err) {
      Alert.alert('Error', err || 'Failed to update purchase.');
    }
  };

  const handlePrint = async purchase => {
    try {
      setPrinting(true);
      await RNPrint.print({ html: generatePrintHTML(purchase) });
    } catch {
      Alert.alert('Print Error', 'Could not open print dialog.');
    } finally {
      setPrinting(false);
    }
  };

  const filtered = useMemo(() => {
    let data = purchases;
    if (tab !== 'all') data = data.filter(p => p.paymentStatus === tab);
    if (supplier)      data = data.filter(p => p.supplier?._id === supplier);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        p.purchaseNumber?.toLowerCase().includes(q) ||
        p.supplier?.name?.toLowerCase().includes(q) ||
        p.invoiceNumber?.toLowerCase().includes(q)
      );
    }
    return data;
  }, [purchases, tab, supplier, search]);

  const counts = useMemo(() => ({
    all:     purchases.length,
    paid:    purchases.filter(p => p.paymentStatus === 'paid').length,
    partial: purchases.filter(p => p.paymentStatus === 'partial').length,
    unpaid:  purchases.filter(p => p.paymentStatus === 'unpaid').length,
  }), [purchases]);

  const selectedSupplierName = useMemo(() =>
    suppliers.find(sup => sup._id === supplier)?.name || 'All Suppliers',
    [suppliers, supplier]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['bottom']}>
      <Header title="Purchase History" />

      {/* ── Status tabs ── */}
      <View style={s.tabs}>
        {STATUS_TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[s.tab, tab === t.key && s.activeTab]}
            onPress={() => { setTab(t.key); setSearch(''); }}>
            <Text style={tab === t.key ? s.activeTabText : s.tabText}>{t.label}</Text>
            <View style={[s.tabBadge, tab === t.key && s.tabBadgeActive]}>
              <Text style={[s.tabBadgeText, tab === t.key && s.tabBadgeTextActive]}>{counts[t.key]}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Filters ── */}
      <View style={s.filterRow}>
        {/* Search */}
        <View style={s.searchWrapper}>
          <Search size={14} color="#aaa" />
          <TextInput
            style={s.searchInput}
            placeholder="Search purchase, invoice…"
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={14} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* Supplier filter */}
        <TouchableOpacity style={s.filterBtn} onPress={() => setSupSheet(true)}>
          <Text style={s.filterBtnText} numberOfLines={1}>{selectedSupplierName}</Text>
          <ChevronDown size={13} color={GREY} />
        </TouchableOpacity>

        {/* Refresh */}
        <TouchableOpacity style={s.iconBtn} onPress={() => { load(); setSearch(''); setSupplier(''); }}>
          <RefreshCw size={16} color={GREY} />
        </TouchableOpacity>
      </View>

      {/* ── New Entry shortcut ── */}
      <TouchableOpacity style={s.newEntryBar} onPress={() => navigation.navigate('PurchaseEntryScreen')}>
        <ClipboardList size={14} color={WHITE} />
        <Text style={s.newEntryText}>+ New Purchase Entry</Text>
      </TouchableOpacity>

      {/* ── List ── */}
      {purchasesLoading && purchases.length === 0 ? (
        <ActivityIndicator size="large" color={ACCENT} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <PurchaseCard item={item} onView={setViewTarget} />}
          contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ACCENT]} />}
          ListEmptyComponent={
            <View style={s.centerBox}>
              <ClipboardList size={40} color="#ccc" />
              <Text style={s.emptyText}>
                {search || supplier || tab !== 'all' ? 'No purchases match the filters.' : 'No purchase entries yet.'}
              </Text>
            </View>
          }
        />
      )}

      {/* ── Supplier filter sheet ── */}
      <Modal visible={supSheet} animationType="slide" transparent onRequestClose={() => setSupSheet(false)}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Filter by Supplier</Text>
              <TouchableOpacity onPress={() => setSupSheet(false)}><X size={20} color={GREY} /></TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[s.sheetItem, !supplier && s.sheetItemActive]}
              onPress={() => { setSupplier(''); setSupSheet(false); }}>
              <Text style={[s.sheetItemText, !supplier && s.sheetItemTextActive]}>All Suppliers</Text>
              {!supplier && <CheckCircle size={16} color={ACCENT} />}
            </TouchableOpacity>
            <FlatList
              data={suppliers}
              keyExtractor={i => i._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[s.sheetItem, supplier === item._id && s.sheetItemActive]}
                  onPress={() => { setSupplier(item._id); setSupSheet(false); }}>
                  <Text style={[s.sheetItemText, supplier === item._id && s.sheetItemTextActive]}>{item.name}</Text>
                  {supplier === item._id && <CheckCircle size={16} color={ACCENT} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* ── Detail sheet ── */}
      <DetailSheet
        visible={!!viewTarget}
        onClose={() => setViewTarget(null)}
        purchase={viewTarget}
        onEdit={p => { setViewTarget(null); setEditTarget(p); }}
        onPrint={() => viewTarget && handlePrint(viewTarget)}
      />

      {/* ── Edit modal ── */}
      <EditModal
        visible={!!editTarget}
        onClose={() => setEditTarget(null)}
        purchase={editTarget}
        onSave={handleUpdate}
        saving={submitting}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: WHITE,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 5,
  },
  activeTab: { backgroundColor: ACCENT, elevation: 3, shadowColor: ACCENT, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 4 },
  tabText:   { color: GREY,  fontSize: 12, fontWeight: '500' },
  activeTabText: { color: WHITE, fontSize: 12, fontWeight: '700' },
  tabBadge: { backgroundColor: '#F2F2F2', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1, minWidth: 20, alignItems: 'center' },
  tabBadgeActive: { backgroundColor: WHITE },
  tabBadgeText:   { fontSize: 10, color: GREY, fontWeight: 'bold' },
  tabBadgeTextActive: { color: ACCENT, fontWeight: 'bold' },

  filterRow: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 8 },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    gap: 7,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#212121', padding: 0 },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    maxWidth: 130,
    elevation: 1,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  filterBtnText: { fontSize: 12, color: '#212121', flex: 1 },
  iconBtn: { backgroundColor: WHITE, padding: 9, borderRadius: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 },

  newEntryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT,
    marginHorizontal: 12,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
    elevation: 2,
    marginBottom: 4,
  },
  newEntryText: { color: WHITE, fontSize: 13, fontWeight: '700' },

  card: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
  },
  cardTitle:  { fontSize: 14, fontWeight: '800', color: '#212121' },
  cardSub:    { fontSize: 12, color: GREY },
  cardAmount: { fontSize: 15, fontWeight: '800', color: ACCENT },

  badge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '700' },

  centerBox: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { color: '#aaa', fontSize: 14, textAlign: 'center' },

  // Detail
  detailGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  detailItem:  { width: '47%' },
  detailLabel: { fontSize: 10, fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#212121' },
  detailActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 10,
    paddingVertical: 11,
    gap: 6,
  },
  actionBtnText: { fontSize: 13, fontWeight: '700' },

  tableHeader: { flexDirection: 'row', paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  th:          { flex: 1, fontSize: 10, fontWeight: '700', color: GREY, textTransform: 'uppercase' },
  tableRow:    { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F8F8F8' },
  td:          { flex: 1, fontSize: 12, color: '#212121' },

  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 13, color: GREY, fontWeight: '500' },
  summaryValue: { fontSize: 13, color: '#212121', fontWeight: '600' },

  // Shared sheet
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: WHITE, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', borderTopWidth: 3, borderTopColor: ACCENT },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  sheetTitle:  { fontSize: 16, fontWeight: '800', color: '#212121' },
  sheetItem:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F8F8F8', gap: 10 },
  sheetItemActive:     { backgroundColor: '#FFF3F3' },
  sheetItemText:       { flex: 1, fontSize: 14, color: '#212121' },
  sheetItemTextActive: { color: ACCENT, fontWeight: '700' },

  picker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  pickerText: { flex: 1, fontSize: 14, color: '#212121' },
  label: { fontSize: 11, fontWeight: '700', color: GREY, marginBottom: 5, marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: '#212121' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  cancelBtn: { borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 11 },
  cancelBtnText: { color: GREY, fontSize: 14, fontWeight: '600' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: ACCENT, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 11, gap: 6, elevation: 2 },
  submitBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },
});

export default PurchaseHistoryScreen;