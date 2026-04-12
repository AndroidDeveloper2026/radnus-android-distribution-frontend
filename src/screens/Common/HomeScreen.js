import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import styles from './HomeScreenStyle';
import Header from '../../components/Header';
import { Search, Filter } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../services/features/products/productSlice';
import { fetchInvoices } from '../../services/features/retailer/invoiceSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { list: products, loading } = useSelector(state => state.products);
  const { data: invoices } = useSelector(state => state.invoice || { data: [] });
  
  const authUser = useSelector(state => state.auth?.user);
  const adminUser = useSelector(state => state.adminAuth?.admin);
  const user = authUser || adminUser;
  const role = user?.role || 'Retailer';

  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  // Price color mapping
  const priceColors = {
    distributor: '#2E7D32', // Green
    retailer: '#1565C0',    // Blue
    walkin: '#E65100',      // Orange
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchInvoices("all"));
  }, [dispatch]);

  useEffect(() => {
    if (products?.length > 0) {
      const uniqueCategories = [
        'All',
        ...new Set(products.map(p => p.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [products]);

  const getCurrentStock = (productId, moq) => {
    if (!invoices.length) return moq;
    const totalSold = invoices.reduce((sum, invoice) => {
      const item = invoice.items?.find(i => i.productId === productId);
      return sum + (item?.qty || 0);
    }, 0);
    return Math.max(0, moq - totalSold);
  };

  // Helper to get price numbers
  const getPriceNumbers = (item) => {
    return {
      dp: Number(item.distributorPrice) || 0,
      rp: Number(item.retailerPrice) || 0,
      wp: Number(item.walkinPrice) || 0,
    };
  };

  const filteredData = products.filter(item => {
    const matchCategory =
      selectedCategory === 'All' ||
      item.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = item.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchStatus = role === 'Admin' ? true : item.status === 'Active';
    return matchCategory && matchSearch && matchStatus;
  });

  const renderItem = ({ item }) => {
    const currentStock = getCurrentStock(item._id, item.moq);
    const { dp, rp, wp } = getPriceNumbers(item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Price section with colors */}
        <View style={styles.priceContainer}>
          {role === 'Admin' ? (
            <>
              <Text style={[styles.priceText, { color: priceColors.distributor }]}>
                Distributor price: ₹{dp}
              </Text>
              <Text style={[styles.priceText, { color: priceColors.retailer }]}>
                Retailer price: ₹{rp}
              </Text>
              <Text style={[styles.priceText, { color: priceColors.walkin }]}>
                Walk-in price: ₹{wp}
              </Text>
            </>
          ) : role === 'Radnus' ? (
            <>
              <Text style={[styles.priceText, { color: priceColors.distributor }]}>
                D: ₹{dp}
              </Text>
              <Text style={[styles.priceText, { color: priceColors.retailer }]}>
                R: ₹{rp}
              </Text>
              <Text style={[styles.priceText, { color: priceColors.walkin }]}>
                W: ₹{wp}
              </Text>
            </>
          ) : role === 'Distributor' ? (
            <Text style={[styles.priceText, { color: priceColors.distributor }]}>
              ₹{dp}
            </Text>
          ) : (
            <Text style={[styles.priceText, { color: priceColors.retailer }]}>
              ₹{rp}
            </Text>
          )}
        </View>

        <Text style={[styles.stock, currentStock === 0 && styles.outStock]}>
          {currentStock > 0 ? `Stock: ${currentStock}` : 'Out of stock'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Product catalogue" />

      <View style={styles.tabMenu}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search size={16} color="#777" />
            <TextInput
              placeholder="What are you looking for?"
              placeholderTextColor={'#777'}
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={18} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryTab,
                selectedCategory === cat && styles.activeTab,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D32F2F" />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filteredData}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HomeScreen;