// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import styles from './HomeScreenStyle';
// import Header from '../../components/Header';
// import { Search, Filter } from 'lucide-react-native';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProducts } from '../../services/features/products/productSlice';

// const HomeScreen = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const { list: products, loading } = useSelector(state => state.products);

//   const { user } = useSelector(state => state.auth);
//   const role = user?.role || 'Retailer';

//   const [categories, setCategories] = useState(['All']);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [searchText, setSearchText] = useState('');

//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   useEffect(() => {
//     if (products?.length > 0) {
//       const uniqueCategories = [
//         'All',
//         ...new Set(products.map(p => p.category)),
//       ];
//       setCategories(uniqueCategories);
//     }
//   }, [products]);


// const getPrice = item => {
//   switch (role) {
//     case 'Admin':
//       return `D: ₹${Number(item.distributorPrice) || 0} | R: ₹${Number(item.retailerPrice) || 0}`;
//     case 'Distributor':
//       return `₹${Number(item.distributorPrice) || 0}`;
//     case 'Retailer':
//       return `₹${Number(item.retailerPrice) || 0}`;
//     case 'FSE':
//       return `₹${Number(item.retailerPrice) || 0}`;
//     case 'MarketingManager':
//       return `₹${Number(item.retailerPrice) || 0}`;
//     case 'MarketingExecutive':
//       return `₹${Number(item.retailerPrice) || 0}`;
//     case 'Radnus':
//       return `D: ₹${Number(item.distributorPrice) || 0} | R: ₹${Number(item.retailerPrice) || 0}`;
//     default:
//       return `₹${Number(item.retailerPrice) || 0}`; // ✅ Number() prevents undefined
//   }
// };


//   /* ------------------ FILTER LOGIC ------------------ */
//   const filteredData = products.filter(item => {
//     const matchCategory =
//       selectedCategory === 'All' ||
//       item.category?.toLowerCase().includes(selectedCategory.toLowerCase());

//     const matchSearch = item.name
//       ?.toLowerCase()
//       .includes(searchText.toLowerCase());

//     const matchStatus = role === 'Admin' ? true : item.status === 'Active';

//     return matchCategory && matchSearch && matchStatus;
//   });

//   /* ------------------ PRODUCT CARD ------------------ */
//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => navigation.navigate('ProductDetail', { product: item })}
//     >
//       <Image source={{ uri: item.image }} style={styles.image} />

//       <Text style={styles.name} numberOfLines={2}>
//         {item.name}
//       </Text>

//       <Text style={styles.price}>{getPrice(item)}</Text>

//       <Text style={styles.mrp}>₹{item.mrp}</Text>

//       <Text style={[styles.stock, item.stock === 0 && styles.outStock]}>
//         {item.moq > 0 ? `Stock: ${item.moq}` : 'Out of stock'}
//       </Text>

//       <Text style={styles.moq}>MOQ: {item.moq}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Header title="Product Catalog" />

//       {/* ------------------ SEARCH + FILTER ------------------ */}
//       <View style={styles.tabMenu}>
//         <View style={styles.searchRow}>
//           <View style={styles.searchBox}>
//             <Search size={16} color="#777" />
//             <TextInput
//               placeholder="What are you looking for?"
//               placeholderTextColor={'#777'}
//               style={styles.searchInput}
//               value={searchText}
//               onChangeText={setSearchText}
//             />
//           </View>

//           <TouchableOpacity style={styles.filterBtn}>
//             <Filter size={18} color="#D32F2F" />
//           </TouchableOpacity>
//         </View>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.categoryContainer}
//         >
//           {categories.map((cat, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[
//                 styles.categoryTab,
//                 selectedCategory === cat && styles.activeTab,
//               ]}
//               onPress={() => setSelectedCategory(cat)}
//             >
//               <Text
//                 style={[
//                   styles.categoryText,
//                   selectedCategory === cat && styles.activeText,
//                 ]}
//               >
//                 {cat}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#D32F2F" />
//       ) : (
//         <FlatList
//           style={{ flex: 1 }} 
//           data={filteredData}
//           keyExtractor={item => item._id}
//           renderItem={renderItem}
//           numColumns={2}
//           columnWrapperStyle={styles.row}
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// };

// export default HomeScreen;

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
import { fetchInvoices } from '../../services/features/retailer/invoiceSlice'; // ✅ Add this

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { list: products, loading } = useSelector(state => state.products);
  const { data: invoices } = useSelector(state => state.invoice || { data: [] }); // ✅ Add this
  const { user } = useSelector(state => state.auth);
  const role = user?.role || 'Retailer';

  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchInvoices("all")); // ✅ Add this to fetch invoices
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

  // ✅ Function to calculate current stock
  const getCurrentStock = (productId, moq) => {
    if (!invoices.length) return moq;
    
    const totalSold = invoices.reduce((sum, invoice) => {
      const item = invoice.items?.find(i => i.productId === productId);
      return sum + (item?.qty || 0);
    }, 0);
    
    return Math.max(0, moq - totalSold);
  };

  const getPrice = item => {
    switch (role) {
      case 'Admin':
        return `D: ₹${Number(item.distributorPrice) || 0} | R: ₹${Number(item.retailerPrice) || 0}`;
      case 'Distributor':
        return `₹${Number(item.distributorPrice) || 0}`;
      case 'Retailer':
        return `₹${Number(item.retailerPrice) || 0}`;
      case 'FSE':
        return `₹${Number(item.retailerPrice) || 0}`;
      case 'MarketingManager':
        return `₹${Number(item.retailerPrice) || 0}`;
      case 'MarketingExecutive':
        return `₹${Number(item.retailerPrice) || 0}`;
      case 'Radnus':
        return `D: ₹${Number(item.distributorPrice) || 0} | R: ₹${Number(item.retailerPrice) || 0}`;
      default:
        return `₹${Number(item.retailerPrice) || 0}`;
    }
  };

  /* ------------------ FILTER LOGIC ------------------ */
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

  /* ------------------ PRODUCT CARD ------------------ */
  const renderItem = ({ item }) => {
    const currentStock = getCurrentStock(item._id, item.moq); // ✅ Calculate current stock
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <Image source={{ uri: item.image }} style={styles.image} />

        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.price}>{getPrice(item)}</Text>

        <Text style={styles.mrp}>₹{item.mrp}</Text>

        {/* ✅ FIXED: Show current stock instead of moq */}
        <Text style={[styles.stock, currentStock === 0 && styles.outStock]}>
          {currentStock > 0 ? `Stock: ${currentStock}` : 'Out of stock'}
        </Text>

        <Text style={styles.moq}>MOQ: {item.moq}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Product Catalog" />

      {/* ------------------ SEARCH + FILTER ------------------ */}
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