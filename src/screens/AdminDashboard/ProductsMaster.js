import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import ProductsMasterStyle from "./ProductsMasterStyle";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import { Plus } from "lucide-react-native";

const PRODUCTS = [
  {
    id: "1",
    name: "Product A",
    sku: "RND001",
    mrp: 100,
    distributorPrice: 85,
    retailerPrice: 92,
    gst: "18%",
    moq: "10 units",
    status: "Active",
  },
  {
    id: "2",
    name: "Product B",
    sku: "RND002",
    mrp: 150,
    distributorPrice: 130,
    retailerPrice: 140,
    gst: "18%",
    moq: "5 units",
    status: "Active",
  },
];

const ProductMaster = ({ navigation }) => {
  return (
    <View style={ProductsMasterStyle.container}>
      <Header title="Product Master" />

      {/* ADD PRODUCT BUTTON */}
      <View style={ProductsMasterStyle.addWrapper}>
        <TouchableOpacity
          style={ProductsMasterStyle.addButton}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={ProductsMasterStyle.addButtonText}>
            Add Product
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard item={item} />
        )}
        contentContainerStyle={ProductsMasterStyle.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductMaster;
