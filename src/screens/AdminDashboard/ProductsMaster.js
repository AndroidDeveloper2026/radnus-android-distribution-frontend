import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import ProductsMasterStyle from './ProductsMasterStyle';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';
import { Plus, Search } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../services/features/products/productSlice';
import { deleteProduct } from '../../services/features/products/productSlice';
import PopupModal from '../../components/PopupModal';



const ProductMaster = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.list);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // const handleDelete = id => {
  //   dispatch(deleteProduct(id));
  // };

  const handleDelete = id => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      dispatch(deleteProduct(selectedId));
    }
    setShowDeleteModal(false);
    setSelectedId(null);
  };

  // 🔎 SEARCH FILTER
  const filteredProducts = useMemo(() => {
    if (!search) return products;

    return products.filter(
      product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  return (
    <View style={ProductsMasterStyle.container}>
      <Header title="Product Master" />

      {/* ADD PRODUCT BUTTON */}
      <View style={ProductsMasterStyle.addWrapper}>
        {/* SEARCH BAR */}
        <View style={ProductsMasterStyle.searchWrapper}>
          <Search size={18} color="#777" />
          <TextInput
            placeholder="Search by name or SKU"
            placeholderTextColor="#999"
            style={ProductsMasterStyle.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={ProductsMasterStyle.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={ProductsMasterStyle.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) =>
          item?._id ? item._id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onEdit={() => navigation.navigate('EditProduct', { id: item._id })}
            onDelete={() => handleDelete(item._id)}
          />
        )}
        contentContainerStyle={ProductsMasterStyle.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={ProductsMasterStyle.emptyContainer}>
            <Text style={ProductsMasterStyle.emptyText}>No Products Found</Text>
          </View>
        )}
      />

      <PopupModal
        visible={showDeleteModal}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        buttonText="Delete"
        secondaryText="Cancel"
        onPress={confirmDelete}
        onSecondaryPress={() => setShowDeleteModal(false)}
      />
    </View>
  );
};

export default ProductMaster;
