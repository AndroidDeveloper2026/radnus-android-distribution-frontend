import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices, fetchInvoiceCounts } from '../../services/features/retailer/invoiceSlice';
import styles from './InvoiceListStyle';
import Header from '../../components/Header';
import {
  Calendar,
  User,
  Hash,
  CreditCard,
  RefreshCw,
  Search,
  X,
} from 'lucide-react-native';

const InvoiceListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);

  // Get the biller name – adjust field names to match your auth slice
  const billerName = authUser?.name || authUser?.fullName || authUser?.username || "";

  const { data, counts, loading, error } = useSelector(state => state.invoice);
  const [tab, setTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  // Load invoices & counts for the current user only
  const loadAll = useCallback(async (filter = 'all') => {
    await Promise.all([
      dispatch(fetchInvoices({ filter, billerName })),
      dispatch(fetchInvoiceCounts(billerName)),
    ]);
  }, [dispatch, billerName]);

  useEffect(() => {
    loadAll(tab);
  }, [tab, loadAll]);

  const onRefresh = async () => {
    setRefreshing(true);
    setSearch('');
    await loadAll(tab);
    setRefreshing(false);
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      item =>
        item.billerName?.toLowerCase().includes(q) ||
        item.invoiceNumber?.toLowerCase().includes(q) ||
        item.paymentMode?.toLowerCase().includes(q) ||
        String(item.totalAmount).includes(q)
    );
  }, [data, search]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('InvoiceViewScreen', { invoice: item })}
      activeOpacity={0.85}
    >
      <View style={styles.iconRow}>
        <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
          <Calendar size={13} color="#E65100" />
        </View>
        <Text style={styles.date}>{new Date(item.createdAt).toDateString()}</Text>
      </View>

      <View style={styles.iconRow}>
        <View style={[styles.iconBox, { backgroundColor: '#FCE4EC' }]}>
          <User size={13} color="#C62828" />
        </View>
        <Text style={styles.biller}>{item.billerName}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.iconRow}>
          <View style={[styles.iconBox, { backgroundColor: '#EDE7F6' }]}>
            <Hash size={13} color="#4527A0" />
          </View>
          <Text style={styles.invoice}>{item.invoiceNumber}</Text>
        </View>
        <View style={styles.iconRow}>
          <Text style={styles.amount}>₹{item.totalAmount}</Text>
        </View>
      </View>

      <View style={styles.iconRow}>
        <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
          <CreditCard size={13} color="#1565C0" />
        </View>
        <Text style={styles.mode}>{item.paymentMode}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Header title={'Invoice History'} />

      <View style={styles.tabs}>
        {['all', 'today', 'week', 'month'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => { setTab(t); setSearch(''); }}
          >
            <Text style={tab === t ? styles.activeText : styles.text}>
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

      <View style={styles.searchWrapper}>
        <Search size={16} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, invoice no, amount..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <X size={16} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {loading && <ActivityIndicator size="large" color="#d32f2f" style={{ marginTop: 40 }} />}

      {!loading && error && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadAll(tab)}>
            <RefreshCw size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <Text style={styles.emptyText}>
          {search ? `No results for "${search}"` : 'No invoices found for this user.'}
        </Text>
      )}

      {!loading && !error && (
        <FlatList
          data={filteredData}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#d32f2f']} />
          }
        />
      )}
    </View>
  );
};

export default InvoiceListScreen;