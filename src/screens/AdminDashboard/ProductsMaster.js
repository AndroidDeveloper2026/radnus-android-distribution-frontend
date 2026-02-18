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

// const PRODUCTS = [
//   {
//     id: "1",
//     name: "Product A",
//     sku: "RND001",
//     mrp: 100,
//     distributorPrice: 85,
//     retailerPrice: 92,
//     gst: "18%",
//     moq: "10 units",
//     status: "Active",
//   },
//   {
//     id: "2",
//     name: "Product B",
//     sku: "RND002",
//     mrp: 150,
//     distributorPrice: 130,
//     retailerPrice: 140,
//     gst: "18%",
//     moq: "5 units",
//     status: "Active",
//   },
// ];

const ProductMaster = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.list);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = id => {
    dispatch(deleteProduct(id));
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
        keyExtractor={(item,index)=> item?._id ? item._id.toString() : index.toString()}
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
    </View>
  );
};

export default ProductMaster;
