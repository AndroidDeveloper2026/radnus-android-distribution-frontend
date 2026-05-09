import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RNPrint from 'react-native-print';
import {
  Calendar,
  Truck,
  Hash,
  RefreshCw,
  Search,
  X,
  Plus,
  Trash2,
  PackageX,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Printer,
} from 'lucide-react-native';
import Header from '../../components/Header';
import {
  fetchPurchaseReturns,
  createPurchaseReturn,
  deletePurchaseReturn,
} from '../../services/features/returns/returnsSlice';
import styles from './PurchaseReturnStyle';

// ─── Constants ───────────────────────────────────────────────────
const ADMIN_USERS = ['Mohanapriya', 'YOGESH V'];
const GREEN = '#D32F2F';

// ─── Date Helpers ─────────────────────────────────────────────────
const isToday = d => new Date(d).toDateString() === new Date().toDateString();
const isThisWeek = d => {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  return new Date(d) >= weekStart;
};
const isThisMonth = d => {
  const now = new Date();
  return new Date(d) >= new Date(now.getFullYear(), now.getMonth(), 1);
};

// ─── Amount In Words ──────────────────────────────────────────────
const amountInWords = num => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (num === 0) return 'Zero';
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + amountInWords(num % 100) : '');
  if (num < 100000) return amountInWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + amountInWords(num % 1000) : '');
  return amountInWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + amountInWords(num % 100000) : '');
};

// ─── Generate Print HTML ──────────────────────────────────────────
const generatePurchaseReturnHTML = ret => {
  const totalWords = `INR ${amountInWords(Math.floor(ret.totalAmount))} Only`;
  const dateStr = ret.createdAt ? new Date(ret.createdAt).toDateString() : '';
  let itemsRows = '';
  (ret.items || []).forEach((item, idx) => {
    itemsRows += `
      <tr>
        <td style="text-align:center;padding:6px;border:1px solid #000">${idx + 1}</td>
        <td style="padding:6px;border:1px solid #000">${item.name}</td>
        <td style="text-align:center;padding:6px;border:1px solid #000">-</td>
        <td style="text-align:center;padding:6px;border:1px solid #000">${item.qty} NOS</td>
        <td style="text-align:right;padding:6px;border:1px solid #000">&#8377;${item.price}</td>
        <td style="text-align:center;padding:6px;border:1px solid #000">NOS</td>
        <td style="text-align:right;padding:6px;border:1px solid #000">&#8377;${(item.qty * item.price).toFixed(2)}</td>
      </tr>`;
  });
  const totalQty = (ret.items || []).reduce((s, i) => s + i.qty, 0);

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;color:#000!important}
      body{font-family:Arial,sans-serif;background:#fff;padding:1rem}
      .inv{border:1px solid #000;padding:1rem}
      p{margin:2px 0}
      .it{width:100%;border-collapse:collapse;margin:.5rem 0;font-size:.75rem}
      .it th{border:1px solid #000;padding:.45rem .4rem;background:#f0f0f0;font-weight:800;font-size:.72rem}
      .it td{border:1px solid #000;padding:.35rem .4rem;background:#fff}
      .mt{width:100%;border-collapse:collapse;font-size:.75rem}
      .mt td{border:1px solid #000;padding:.25rem .35rem}
    </style></head><body><div class="inv">
    <div style="text-align:center;border-bottom:1px solid #000;padding-bottom:.5rem">
      <h2 style="font-size:1.1rem">RADNUS COMMUNICATION</h2>
      <p style="font-size:.75rem">No.242/44, MG Road, Sinnaya Plaza, Near Fish Market</p>
      <p style="font-size:.75rem">Puducherry - 605001 | State: Puducherry, Code: 605001</p>
      <p style="font-size:.75rem">E-Mail: sundar12134@gmail.com</p>
    </div>
    <div style="text-align:center;font-size:1rem;font-weight:bold;padding:.5rem;border-bottom:1px solid #000">PURCHASE RETURN / DEBIT NOTE</div>
    <div style="display:flex;border-bottom:1px solid #000">
      <div style="width:50%;padding:.5rem;border-right:1px solid #000">
        <div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Supplier Details</div>
        <p style="font-size:.78rem">${ret.supplierName || ''}</p>
        ${ret.referencePO ? `<p style="font-size:.78rem">Ref PO: ${ret.referencePO}</p>` : ''}
        ${ret.reason ? `<p style="font-size:.78rem">Reason: ${ret.reason}</p>` : ''}
      </div>
      <div style="width:50%;padding:.5rem">
        <table class="mt">
          <tr><td style="font-weight:600">Return No.</td><td>${ret.returnNumber || ''}</td></tr>
          <tr><td style="font-weight:600">Date</td><td>${dateStr}</td></tr>
          <tr><td style="font-weight:600">Biller</td><td>${ret.billerName || ''}</td></tr>
        </table>
      </div>
    </div>
    <table class="it">
      <thead><tr><th>SL NO.</th><th>DESCRIPTION</th><th>HSN</th><th>QTY</th><th>RATE</th><th>PER</th><th>AMOUNT</th></tr></thead>
      <tbody>
        ${itemsRows}
        <tr>
          <td style="background:#e8e8e8;font-weight:700;border-top:2px solid #000"></td>
          <td style="background:#e8e8e8;font-weight:700;border-top:2px solid #000">Total</td>
          <td style="background:#e8e8e8;font-weight:700;border-top:2px solid #000"></td>
          <td style="background:#e8e8e8;font-weight:700;border-top:2px solid #000;text-align:center">${totalQty} NOS</td>
          <td style="background:#e8e8e8;font-weight:700;border-top:2px solid #000"></td>
          <td style="background:#e8e8e8;font-weight:700;border-top:2px solid #000"></td>
          <td style="background:#e8e8e8;font-weight:700;border-top:2px solid #000;text-align:right">&#8377;${ret.totalAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    <div style="padding:.5rem;border-bottom:1px solid #000"><strong>Amount in Words:</strong><br/>${totalWords}</div>
    <div style="padding:.5rem;border-bottom:1px solid #000"><strong>Declaration</strong><br/>
      <span style="font-size:.78rem">We declare that this debit note is issued against the goods returned to the supplier and all particulars are true and correct.</span></div>
    <div style="display:flex;padding:.5rem;border-bottom:1px solid #000">
      <div style="width:60%">E. &amp; O.E</div>
      <div style="width:40%;text-align:right"><strong>for RADNUS COMMUNICATION</strong>
        <div style="margin-top:2rem;border-top:1px solid #000"></div><span>Authorised Signatory</span></div>
    </div>
    <div style="text-align:center;padding:.5rem;font-size:.7rem">This is a Computer Generated Document</div>
    </div></body></html>`;
};

// ─── Return Card ──────────────────────────────────────────────────
const PurchaseReturnCard = React.memo(({ ret, onDelete, isAdmin }) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    try {
      setPrinting(true);
      await RNPrint.print({ html: generatePurchaseReturnHTML(ret) });
    } catch (e) {
      Alert.alert('Print Error', 'Could not open print dialog.');
    } finally {
      setPrinting(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* ── Header Row ── */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded(p => !p)}
        activeOpacity={0.8}>
        {/* Left meta */}
        <View style={styles.cardMeta}>
          <View style={styles.metaRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
              <Calendar size={13} color={GREEN} />
            </View>
            <Text style={styles.metaDate}>
              {new Date(ret.createdAt || ret.date).toDateString()}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Truck size={13} color="#1565C0" />
            </View>
            <Text style={styles.metaName} numberOfLines={1}>
              {ret.supplierName || ret.vendorName || ret.billerName}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
              <Hash size={13} color="#6A1B9A" />
            </View>
            <Text style={styles.metaRef}>
              {ret.referencePO || ret.purchaseOrderNo || '—'}
            </Text>
          </View>
        </View>

        {/* Right amount + badge */}
        <View style={styles.cardRight}>
          <Text style={[styles.amount, { color: GREEN }]}>
            ₹{ret.totalAmount}
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.purchaseBadge}>
              <Text style={styles.purchaseBadgeText}>Purchase Return</Text>
            </View>
            {expanded ? (
              <ChevronUp size={16} color="#888" />
            ) : (
              <ChevronDown size={16} color="#888" />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Expanded Body ── */}
      {expanded && (
        <View style={styles.cardBody}>
          {ret.reason ? (
            <View style={styles.reasonBox}>
              <Text style={styles.reasonText}>
                <Text style={{ fontWeight: '700' }}>Reason: </Text>
                {ret.reason}
              </Text>
            </View>
          ) : null}

          {/* Items table header */}
          <View style={styles.tableHeader}>
            {['#', 'Item', 'Qty', 'Price', 'Amount'].map(h => (
              <Text key={h} style={[styles.th, h === 'Item' && { flex: 2 }]}>
                {h}
              </Text>
            ))}
          </View>

          {(ret.items || []).map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.td}>{idx + 1}</Text>
              <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.td}>{item.qty}</Text>
              <Text style={styles.td}>₹{item.price}</Text>
              <Text style={styles.td}>₹{item.qty * item.price}</Text>
            </View>
          ))}

          {/* Total row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Credit Note</Text>
            <Text style={[styles.totalValue, { color: GREEN }]}>
              ₹{ret.totalAmount}
            </Text>
          </View>

          {/* Print button */}
          <View style={styles.actionBtns}>
            <TouchableOpacity
              style={[styles.printBtn, { backgroundColor: GREEN }]}
              onPress={handlePrint}
              disabled={printing}>
              <Printer size={14} color="#fff" />
              <Text style={styles.printBtnText}>
                {printing ? 'Opening...' : 'Print / Save PDF'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Delete (admin only) */}
          {isAdmin && (
            <View style={styles.deleteSection}>
              {!confirmDelete ? (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => setConfirmDelete(true)}>
                  <Trash2 size={14} color="#EF4444" />
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmText}>Delete this return?</Text>
                  <TouchableOpacity
                    style={styles.confirmYes}
                    onPress={() => {
                      onDelete(ret._id);
                      setConfirmDelete(false);
                    }}>
                    <Text style={styles.confirmYesText}>Yes, Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmNo}
                    onPress={() => setConfirmDelete(false)}>
                    <Text style={styles.confirmNoText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
});

// ─── Create Purchase Return Modal ─────────────────────────────────
const emptyItem = () => ({ productId: '', name: '', qty: '', price: '' });

const CreatePurchaseReturnModal = ({ visible, onClose, onSubmit, submitting, submitError }) => {
  const products = useSelector(s => s.products.list);
  const [form, setForm] = useState({
    supplierName: '',
    referencePO: '',
    reason: '',
    items: [emptyItem()],
  });

  const resetForm = () =>
    setForm({ supplierName: '', referencePO: '', reason: '', items: [emptyItem()] });

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, emptyItem()] }));
  const removeItem = idx =>
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx, field, value) =>
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...f, items };
    });

  const totalAmount = form.items.reduce(
    (sum, it) => sum + (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0),
    0
  );

  const handleSubmit = () => {
    if (!form.supplierName.trim()) {
      Alert.alert('Validation', 'Supplier name is required.');
      return;
    }
    if (form.items.some(it => !it.productId || !it.qty || !it.price)) {
      Alert.alert('Validation', 'Please select a product and fill Qty/Price for each item.');
      return;
    }
    onSubmit({
      ...form,
      items: form.items.map(it => ({
        productId: it.productId,
        name: it.name.trim(),
        qty: parseFloat(it.qty),
        price: parseFloat(it.price),
      })),
      totalAmount,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <PackageX size={18} color={GREEN} />
              <Text style={styles.modalTitle}>New Purchase Return</Text>
            </View>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
            {/* Supplier Name */}
            <Text style={styles.label}>Supplier / Vendor Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter supplier name"
              placeholderTextColor="#aaa"
              value={form.supplierName}
              onChangeText={v => setForm(f => ({ ...f, supplierName: v }))}
            />

            {/* Reference PO */}
            <Text style={styles.label}>Reference PO / GRN No.</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. PO-2024-001"
              placeholderTextColor="#aaa"
              value={form.referencePO}
              onChangeText={v => setForm(f => ({ ...f, referencePO: v }))}
            />

            {/* Reason */}
            <Text style={styles.label}>Reason for Return</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Defective, excess stock, wrong item..."
              placeholderTextColor="#aaa"
              value={form.reason}
              onChangeText={v => setForm(f => ({ ...f, reason: v }))}
              multiline
              numberOfLines={3}
            />

            {/* Items */}
            <View style={styles.itemsHeader}>
              <Text style={styles.label}>Items *</Text>
              <TouchableOpacity style={styles.addItemBtn} onPress={addItem}>
                <Plus size={14} color={GREEN} />
                <Text style={[styles.addItemText, { color: GREEN }]}>Add Item</Text>
              </TouchableOpacity>
            </View>

            {form.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                {/* Product Picker */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.productPickerScroll}>
                  <View style={styles.productPickerRow}>
                    {products.map(p => (
                      <TouchableOpacity
                        key={p._id}
                        style={[
                          styles.productChip,
                          item.productId === p._id && styles.productChipActive,
                        ]}
                        onPress={() => {
                          updateItem(idx, 'productId', p._id);
                          updateItem(idx, 'name', p.name);
                          updateItem(idx, 'price', String(p.walkinPrice || 0));
                        }}>
                        <Text
                          style={[
                            styles.productChipText,
                            item.productId === p._id && styles.productChipTextActive,
                          ]}
                          numberOfLines={1}>
                          {p.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <View style={styles.qtyPriceRow}>
                  <TextInput
                    style={[styles.input, styles.qtyInput]}
                    placeholder="Qty"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={item.qty}
                    onChangeText={v => updateItem(idx, 'qty', v)}
                  />
                  <TextInput
                    style={[styles.input, styles.priceInput]}
                    placeholder="Price"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={String(item.price)}
                    onChangeText={v => updateItem(idx, 'price', v)}
                  />
                  {form.items.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeItem(idx)}>
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>

                {item.name ? (
                  <Text style={[styles.selectedProduct, { color: GREEN }]}>✓ {item.name}</Text>
                ) : null}
              </View>
            ))}

            {/* Total */}
            <View style={styles.modalTotal}>
              <Text style={styles.modalTotalLabel}>Credit Note Value:</Text>
              <Text style={[styles.modalTotalValue, { color: GREEN }]}>
                ₹{totalAmount.toFixed(2)}
              </Text>
            </View>

            {/* Error */}
            {submitError ? (
              <View style={styles.errorBox}>
                <AlertTriangle size={14} color="#EF4444" />
                <Text style={styles.errorText}>{submitError}</Text>
              </View>
            ) : null}
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: GREEN }]}
              onPress={handleSubmit}
              disabled={submitting}>
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <PackageX size={14} color="#fff" />
              )}
              <Text style={styles.submitBtnText}>
                {submitting ? 'Submitting...' : 'Create Return'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────
const PurchaseReturnScreen = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(s => s.auth.user);
  const billerName = authUser?.name || authUser?.fullName || authUser?.username || '';
  const isAdmin = authUser?.role === 'Admin' || ADMIN_USERS.includes(billerName);

  const { purchaseReturns, purchaseLoading, purchaseError, submitting, submitError } =
    useSelector(s => s.returns);

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const loadData = useCallback(async () => {
    await dispatch(fetchPurchaseReturns({ billerName: isAdmin ? '' : billerName }));
  }, [dispatch, isAdmin, billerName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    setSearch('');
    await loadData();
    setRefreshing(false);
  };

  const handleCreate = useCallback(
    async payload => {
      const res = await dispatch(createPurchaseReturn({ ...payload, billerName }));
      if (!res.error) setShowCreate(false);
    },
    [dispatch, billerName]
  );

  const handleDelete = useCallback(
    id => dispatch(deletePurchaseReturn(id)),
    [dispatch]
  );

  const filtered = useMemo(() => {
    let data = purchaseReturns;
    if (tab === 'today') data = data.filter(r => isToday(r.createdAt || r.date));
    if (tab === 'week') data = data.filter(r => isThisWeek(r.createdAt || r.date));
    if (tab === 'month') data = data.filter(r => isThisMonth(r.createdAt || r.date));
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        r =>
          r.supplierName?.toLowerCase().includes(q) ||
          r.vendorName?.toLowerCase().includes(q) ||
          r.referencePO?.toLowerCase().includes(q) ||
          r.billerName?.toLowerCase().includes(q) ||
          String(r.totalAmount).includes(q)
      );
    }
    return data;
  }, [purchaseReturns, tab, search]);

  const counts = useMemo(() => ({
    all: purchaseReturns.length,
    today: purchaseReturns.filter(r => isToday(r.createdAt || r.date)).length,
    week: purchaseReturns.filter(r => isThisWeek(r.createdAt || r.date)).length,
    month: purchaseReturns.filter(r => isThisMonth(r.createdAt || r.date)).length,
  }), [purchaseReturns]);

  return (
    <View style={styles.page}>
      <Header title="Purchase Returns" />

      {/* ── Tabs ── */}
      <View style={styles.tabs}>
        {['all', 'today', 'week', 'month'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => { setTab(t); setSearch(''); }}>
            <Text style={tab === t ? styles.activeTabText : styles.tabText}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
            <View style={[styles.badge, tab === t && styles.activeBadge]}>
              <Text style={[styles.badgeText, tab === t && styles.activeBadgeText]}>
                {counts[t]}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Search + Actions ── */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Search size={15} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search supplier, PO no..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={15} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <RefreshCw size={16} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: GREEN }]}
          onPress={() => setShowCreate(true)}>
          <Plus size={15} color="#fff" />
          <Text style={styles.createBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {purchaseLoading && purchaseReturns.length === 0 ? (
        <ActivityIndicator size="large" color={GREEN} style={{ marginTop: 40 }} />
      ) : purchaseError && purchaseReturns.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{purchaseError}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: GREEN }]} onPress={loadData}>
            <RefreshCw size={15} color="#fff" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <PurchaseReturnCard ret={item} onDelete={handleDelete} isAdmin={isAdmin} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[GREEN]} />
          }
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <PackageX size={40} color="#ccc" />
              <Text style={styles.emptyText}>
                {search ? `No results for "${search}"` : 'No purchase returns found.'}
              </Text>
              <TouchableOpacity
                style={[styles.createBtn, { backgroundColor: GREEN, marginTop: 12 }]}
                onPress={() => setShowCreate(true)}>
                <Plus size={15} color="#fff" />
                <Text style={styles.createBtnText}>Create First Return</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* ── Create Modal ── */}
      <CreatePurchaseReturnModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        submitting={submitting}
        submitError={submitError}
      />
    </View>
  );
};

export default PurchaseReturnScreen;
