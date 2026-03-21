import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  //   StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ added
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCustomers } from '../../services/features/customer/customerSlice';
import {
  Search,
  X,
  Phone,
  MapPin,
  Building2,
  UserPlus,
  ChevronRight,
  User,
  WifiOff,
  RefreshCw,
} from 'lucide-react-native';
import Header from '../../components/Header';
import styles from '../../screens/Common/CustomerListStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomerListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {
    list: customers = [],
    listState,
    error,
  } = useSelector(s => s.customer);

  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch on mount ──────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  // ── Pull to refresh ─────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchAllCustomers());
    setRefreshing(false);
  }, [dispatch]);

  // ── Local search filter ─────────────────────────────
  const safeCustomers = Array.isArray(customers) ? customers : [];

  const filteredCustomers = safeCustomers.filter(c => {
    const q = searchText.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.state?.toLowerCase().includes(q)
    );
  });

  // ── Search Bar ──────────────────────────────────────
  const renderSearchBar = () => (
    <View style={styles.searchWrapper}>
      <Search size={16} color="#888" strokeWidth={2} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, phone or city…"
        placeholderTextColor="#bbb"
        value={searchText}
        onChangeText={setSearchText}
        returnKeyType="search"
      />
      {searchText.length > 0 && (
        <TouchableOpacity
          onPress={() => setSearchText('')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={16} color="#888" strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Customer Card ───────────────────────────────────
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() => navigation.navigate('CustomerDetail', { customer: item })}
    >
      {/* Avatar — first letter */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>

      {/* Customer Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.customerName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.detailRow}>
          <Phone size={11} color="#888" strokeWidth={2} />
          <Text style={styles.detailText}> {item.phone}</Text>
        </View>

        {item.address ? (
          <View style={styles.detailRow}>
            <MapPin size={11} color="#888" strokeWidth={2} />
            <Text style={styles.detailText} numberOfLines={1}>
              {'  '}
              {item.address}
            </Text>
          </View>
        ) : null}

        {item.city || item.state ? (
          <View style={styles.detailRow}>
            <Building2 size={11} color="#888" strokeWidth={2} />
            <Text style={styles.detailText}>
              {'  '}
              {[item.city, item.state].filter(Boolean).join(', ')}
            </Text>
          </View>
        ) : null}
      </View>

      <ChevronRight size={18} color="#ccc" strokeWidth={2} />
    </TouchableOpacity>
  );


  const renderEmpty = () => {
    if (listState === 'loading') return null;
    return (
      <View style={styles.emptyBox}>
        <User size={52} color="#ddd" strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>
          {searchText ? 'No results found' : 'No customers yet'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {searchText
            ? `No customer matches "${searchText}"`
            : 'Customers added from orders will appear here'}
        </Text>
        {searchText ? (
          <TouchableOpacity
            style={styles.clearSearchBtn}
            onPress={() => setSearchText('')}
          >
            <Text style={styles.clearSearchText}>Clear Search</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  // ── Separator ───────────────────────────────────────
  const renderSeparator = () => <View style={styles.separator} />;

  // ── Error Screen ────────────────────────────────────
  if (listState === 'error' && safeCustomers.length === 0) {
    return (
      // SafeAreaView wraps entire error screen
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Header title="Customers" />
        <View style={styles.centerBox}>
          <WifiOff size={48} color="#dc2626" strokeWidth={1.5} />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorSubtitle}>
            {error || 'Failed to load customers.'}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => dispatch(fetchAllCustomers())}
          >
            <RefreshCw size={15} color="#fff" strokeWidth={2} />
            <Text style={styles.retryBtnText}> Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main Render ─────────────────────────────────────
  return (
    // SafeAreaView with bottom edge — FAB stays above gesture bar
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title="Customers Details" />

      {/* Full screen loader — only on first load */}
      {listState === 'loading' && safeCustomers.length === 0 ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading customers…</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={item => item._id?.toString() || item.phone}
          renderItem={renderItem}
          ListHeaderComponent={renderSearchBar}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={[
            styles.listContent,
            filteredCustomers.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#16a34a']}
              tintColor="#16a34a"
            />
          }
        />
      )}

      {/* Count pill */}
      {listState === 'success' && safeCustomers.length > 0 && (
        <View style={styles.countPill}>
          <Text style={styles.countText}>
            {searchText
              ? `${filteredCustomers.length} of ${safeCustomers.length} customers`
              : `${safeCustomers.length} customer${
                  safeCustomers.length !== 1 ? 's' : ''
                }`}
          </Text>
        </View>
      )}

      {/* ✅ FAB — color changed to #dc2626 */}
      <TouchableOpacity
        style={[styles.fab,{ bottom: insets.bottom + 16 }]}
        onPress={() => navigation.navigate('AddCustomer')}
        activeOpacity={0.85}
      >
        <UserPlus size={20} color="#fff" strokeWidth={2} />
        <Text style={styles.fabText}>Add Customer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CustomerListScreen;
