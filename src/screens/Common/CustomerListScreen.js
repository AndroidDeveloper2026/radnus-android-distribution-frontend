import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert, Modal,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCustomers,
  deleteCustomer,
  updateCustomer,
  clearUpdateState,
} from '../../services/features/customer/customerSlice';
import {
  Search, X, Phone, MapPin, Building2,
  User, WifiOff, RefreshCw, Pencil, Trash2,
} from 'lucide-react-native';
import Header from '../../components/Header';
import styles from '../../screens/Common/CustomerListStyle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { computeChanges } from '../../utils/diff';
import { createActivityLog } from '../../services/features/activity/activitySlice';

const CustomerListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // ✅ Get admin user from adminAuth slice
  const { admin } = useSelector(state => state.adminAuth);
  const isAdmin = !!admin; // true if admin is logged in

  const {
    list: customers = [],
    listState,
    updateState,
    error,
  } = useSelector(s => s.customer);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  // Watch updateState
  useEffect(() => {
    if (updateState === 'success') {
      setEditModalVisible(false);
      dispatch(clearUpdateState());
    }
    if (updateState === 'error' && error) {
      Alert.alert('Error', error);
      dispatch(clearUpdateState());
    }
  }, [updateState, error, dispatch]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchAllCustomers());
    setRefreshing(false);
  }, [dispatch]);

  // Open Edit Modal (only admin)
  const openEdit = useCallback((customer) => {
    if (!isAdmin) return;
    setSelectedCustomer(customer);
    setEditName(customer.name || '');
    setEditAddress(customer.address || '');
    setEditCity(customer.city || '');
    setEditState(customer.state || '');
    setEditModalVisible(true);
  }, [isAdmin]);

  // // Save Edit (only admin)
  // const handleSaveEdit = useCallback(() => {
  //   if (!isAdmin) return;
  //   if (!editName.trim()) {
  //     Alert.alert('Required', 'Customer name cannot be empty.');
  //     return;
  //   }
  //   dispatch(updateCustomer({
  //     phone: selectedCustomer.phone,
  //     data: {
  //       name: editName.trim(),
  //       address: editAddress.trim(),
  //       city: editCity.trim(),
  //       state: editState.trim(),
  //     },
  //   }));
  // }, [isAdmin, editName, selectedCustomer, dispatch]);

//   const handleSaveEdit = useCallback(() => {
//   if (!isAdmin) return;
//   if (!editName.trim()) {
//     Alert.alert('Required', 'Customer name cannot be empty.');
//     return;
//   }

//   const oldData = {
//     name: selectedCustomer.name || '',
//     address: selectedCustomer.address || '',
//     city: selectedCustomer.city || '',
//     state: selectedCustomer.state || '',
//     type: selectedCustomer.type || 'customer',
//     shopName: selectedCustomer.shopName || '',
//   };

//   const newData = {
//     name: editName.trim(),
//     address: editAddress.trim(),
//     city: editCity.trim(),
//     state: editState.trim(),
//     type: selectedCustomer.type || 'customer', // type not editable here, keep old
//     shopName: selectedCustomer.shopName || '',
//   };

//   const changes = computeChanges(oldData, newData);

//   dispatch(updateCustomer({
//     phone: selectedCustomer.phone,
//     data: {
//       name: editName.trim(),
//       address: editAddress.trim(),
//       city: editCity.trim(),
//       state: editState.trim(),
//     },
//   })).then((result) => {
//     if (result.meta.requestStatus === 'fulfilled' && changes) {
//       dispatch(createActivityLog({
//         action: 'EDIT_CUSTOMER',
//         productId: null,
//         productName: null,
//         changes: changes,
//       }));
//     }
//   });
// }, [isAdmin, editName, editAddress, editCity, editState, selectedCustomer, dispatch]);


const handleSaveEdit = useCallback(() => {
  if (!isAdmin) return;
  if (!editName.trim()) {
    Alert.alert('Required', 'Customer name cannot be empty.');
    return;
  }

  const oldData = { /* ... */ };
  const newData = { /* ... */ };
  const changes = computeChanges(oldData, newData);

  dispatch(updateCustomer({
    phone: selectedCustomer.phone,
    data: { name: editName.trim(), address: editAddress.trim(), city: editCity.trim(), state: editState.trim() },
  })).then((result) => {
    if (result.meta.requestStatus === 'fulfilled' && changes) {
      dispatch(createActivityLog({
        action: 'EDIT_CUSTOMER',
        productId: null,
        productName: null,
        customerIdentifier: `${selectedCustomer.name} (${selectedCustomer.phone})`,
        changes: changes,
      }));
    }
  });
}, [isAdmin, editName, editAddress, editCity, editState, selectedCustomer, dispatch]);
  // Delete (only admin)
  const handleDelete = useCallback((customer) => {
    if (!isAdmin) return;
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete "${customer.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteCustomer(customer.phone)),
        },
      ]
    );
  }, [isAdmin, dispatch]);

  // Memoized filtered customers
  const safeCustomers = useMemo(() => (Array.isArray(customers) ? customers : []), [customers]);

  const filteredCustomers = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return safeCustomers;
    return safeCustomers.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.state?.toLowerCase().includes(q)
    );
  }, [debouncedSearch, safeCustomers]);

  // Search bar component
  const renderSearchBar = useCallback(() => (
    <View style={styles.searchWrapper}>
      <Search size={16} color="#888" strokeWidth={2} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, phone or city…"
        placeholderTextColor="#bbb"
        value={searchText}
        onChangeText={setSearchText}
        returnKeyType="search"
        blurOnSubmit={false}
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={() => setSearchText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <X size={16} color="#888" strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  ), [searchText]);

  // Render item – show edit/delete only if admin
  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() => navigation.navigate('CustomerDetail', { customer: item })}
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name?.charAt(0).toUpperCase() || '?'}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.customerName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.detailRow}>
          <Phone size={11} color="#888" strokeWidth={2} />
          <Text style={styles.detailText}> {item.phone}</Text>
        </View>
        {item.address ? (
          <View style={styles.detailRow}>
            <MapPin size={11} color="#888" strokeWidth={2} />
            <Text style={styles.detailText} numberOfLines={1}>
              {'  '}{item.address}
            </Text>
          </View>
        ) : null}
        {item.city || item.state ? (
          <View style={styles.detailRow}>
            <Building2 size={11} color="#888" strokeWidth={2} />
            <Text style={styles.detailText}>
              {'  '}{[item.city, item.state].filter(Boolean).join(', ')}
            </Text>
          </View>
        ) : null}
      </View>

      {/* ✅ Only show Edit & Delete if admin is logged in */}
      {isAdmin && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            onPress={() => openEdit(item)}
          >
            <Pencil size={15} color="#dc2626" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            onPress={() => handleDelete(item)}
          >
            <Trash2 size={15} color="#dc2626" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  ), [isAdmin, navigation, openEdit, handleDelete]);

  // Empty state
  const renderEmpty = useCallback(() => {
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
          <TouchableOpacity style={styles.clearSearchBtn} onPress={() => setSearchText('')}>
            <Text style={styles.clearSearchText}>Clear Search</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }, [listState, searchText]);

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  // Error state
  if (listState === 'error' && safeCustomers.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Header title="Customers" />
        <View style={styles.centerBox}>
          <WifiOff size={48} color="#dc2626" strokeWidth={1.5} />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorSubtitle}>
            {error || 'Failed to load customers.'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => dispatch(fetchAllCustomers())}>
            <RefreshCw size={15} color="#fff" strokeWidth={2} />
            <Text style={styles.retryBtnText}> Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title="Customers Details" />

      {renderSearchBar()}

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
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={[
            styles.listContent,
            filteredCustomers.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
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
        <View style={[styles.countPill, { position: 'absolute', bottom: insets.bottom + 16, alignSelf: 'center' }]}>
          <Text style={styles.countText}>
            {searchText
              ? `${filteredCustomers.length} of ${safeCustomers.length} customers`
              : `${safeCustomers.length} customer${safeCustomers.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
      )}

      {/* Edit Customer Modal (only visible to admin, but safe) */}
      <Modal
        transparent
        visible={editModalVisible}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.sheet}>
                <View style={styles.sheetHeader}>
                  <Pencil size={18} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.sheetTitle}>  Edit Customer</Text>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                    <X size={20} color="#888" strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                <View style={styles.phonePill}>
                  <Phone size={13} color="#16a34a" strokeWidth={2} />
                  <Text style={styles.phonePillText}>
                    {'  '}{selectedCustomer?.phone}
                  </Text>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Customer Name *"
                  placeholderTextColor="#bbb"
                  value={editName}
                  onChangeText={setEditName}
                />
                <TextInput
                  style={[styles.input, { height: 72, textAlignVertical: 'top' }]}
                  placeholder="Address"
                  placeholderTextColor="#bbb"
                  multiline
                  value={editAddress}
                  onChangeText={setEditAddress}
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="City"
                    placeholderTextColor="#bbb"
                    value={editCity}
                    onChangeText={setEditCity}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="State"
                    placeholderTextColor="#bbb"
                    value={editState}
                    onChangeText={setEditState}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.saveBtn, updateState === 'loading' && { opacity: 0.6 }]}
                  onPress={handleSaveEdit}
                  disabled={updateState === 'loading'}
                >
                  {updateState === 'loading'
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.saveBtnText}>Save Changes</Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CustomerListScreen;