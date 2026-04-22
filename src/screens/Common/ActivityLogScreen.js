import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActivityLogs } from '../../services/features/activity/activitySlice';
import Header from '../../components/Header';
import { PlusCircle, Edit2, User, Calendar, Filter, Phone } from 'lucide-react-native';

const ActivityLogScreen = () => {
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.activity);
  const [filter, setFilter] = useState('today');

  useEffect(() => {
    dispatch(fetchActivityLogs());
  }, []);

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (date) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= oneWeekAgo && date <= now;
  };

  const isThisMonth = (date) => {
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const filteredLogs = useMemo(() => {
    if (!Array.isArray(logs) || logs.length === 0) return [];
    return logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      if (filter === 'today') return isToday(logDate);
      if (filter === 'week') return isThisWeek(logDate);
      if (filter === 'month') return isThisMonth(logDate);
      return true;
    });
  }, [logs, filter]);

  const renderChanges = (changes) => {
    if (!changes || Object.keys(changes).length === 0) return null;
    return (
      <View style={styles.changesContainer}>
        <Text style={styles.changesTitle}>Changes:</Text>
        {Object.entries(changes).map(([field, { old, new: newVal }]) => (
          <View key={field} style={styles.changeRow}>
            <Text style={styles.changeField}>{field}: </Text>
            <Text style={styles.changeOld}>{old || '—'} → </Text>
            <Text style={styles.changeNew}>{newVal || '—'}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.logCard}>
      <View style={styles.cardHeader}>
        {item.action === 'ADD_PRODUCT' && <PlusCircle size={20} color="#10b981" />}
        {item.action === 'EDIT_PRODUCT' && <Edit2 size={20} color="#f59e0b" />}
        {item.action === 'EDIT_CUSTOMER' && <User size={20} color="#3b82f6" />}
        <Text style={styles.actionText}>
          {item.action === 'ADD_PRODUCT' && 'Added Product'}
          {item.action === 'EDIT_PRODUCT' && 'Edited Product'}
          {item.action === 'EDIT_CUSTOMER' && 'Edited Customer'}
        </Text>
      </View>

      {item.productName ? (
        <Text style={styles.productName}>Product: {item.productName}</Text>
      ) : item.action === 'EDIT_CUSTOMER' ? (
        <View style={styles.customerInfo}>
          <Phone size={12} color="#6b7280" />
          <Text style={styles.customerIdentifier}>
            Customer: {item.customerIdentifier || 'Unknown'}
          </Text>
        </View>
      ) : null}

      {item.action === 'EDIT_CUSTOMER' && renderChanges(item.changes)}

      <View style={styles.detailRow}>
        <User size={14} color="#6b7280" />
        <Text style={styles.userText}>{item.user} ({item.role})</Text>
      </View>

      <View style={styles.detailRow}>
        <Calendar size={14} color="#6b7280" />
        <Text style={styles.timeText}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Activity Log" />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'today' && styles.activeFilter]}
          onPress={() => setFilter('today')}>
          <Text style={[styles.filterText, filter === 'today' && styles.activeFilterText]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'week' && styles.activeFilter]}
          onPress={() => setFilter('week')}>
          <Text style={[styles.filterText, filter === 'week' && styles.activeFilterText]}>This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'month' && styles.activeFilter]}
          onPress={() => setFilter('month')}>
          <Text style={[styles.filterText, filter === 'month' && styles.activeFilterText]}>This Month</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item._id?.toString() || item.timestamp.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Filter size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No activity found for this period</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchActivityLogs())}
            colors={['#D32F2F']}
            tintColor="#D32F2F"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  errorText: { fontSize: 16, color: '#ef4444', textAlign: 'center', marginHorizontal: 20 },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  filterButton: { flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: 'center', backgroundColor: '#f3f4f6' },
  activeFilter: { backgroundColor: '#D32F2F' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#4b5563' },
  activeFilterText: { color: '#fff' },
  listContent: { padding: 16, paddingTop: 8 },
  logCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  actionText: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  productName: { fontSize: 15, fontWeight: '500', color: '#111827', marginBottom: 12 },
  customerInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  customerIdentifier: { fontSize: 14, fontWeight: '500', color: '#374151' },
  changesContainer: { marginBottom: 12, backgroundColor: '#fef9e3', padding: 8, borderRadius: 8 },
  changesTitle: { fontSize: 13, fontWeight: '600', color: '#b45309', marginBottom: 4 },
  changeRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
  changeField: { fontSize: 12, fontWeight: '600', color: '#374151' },
  changeOld: { fontSize: 12, color: '#dc2626', textDecorationLine: 'line-through' },
  changeNew: { fontSize: 12, fontWeight: '600', color: '#16a34a' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  userText: { fontSize: 13, color: '#4b5563' },
  timeText: { fontSize: 12, color: '#6b7280' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
});

export default ActivityLogScreen;