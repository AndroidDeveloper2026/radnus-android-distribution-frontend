import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "./HomeScreenStyle";
import Header from "../../components/Header";
import { Search, Filter } from "lucide-react-native";

const PRODUCT_DATA = [
  {
    id: "1",
    name: "Samsung Charger",
    price: 850,
    mrp: 999,
    stock: 120,
    moq: 5,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Bluetooth Headset",
    price: 2150,
    mrp: 2500,
    stock: 25,
    moq: 2,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Mobile Cover",
    price: 350,
    mrp: 499,
    stock: 0,
    moq: 10,
    image: "https://via.placeholder.com/150",
  },
];

const HomeScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetail", { product: item })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>

      <Text style={styles.price}>₹{item.price}</Text>

      <Text style={styles.mrp}>₹{item.mrp}</Text>

      <Text
        style={[
          styles.stock,
          item.stock === 0 && styles.outStock,
        ]}
      >
        {item.stock > 0
          ? `Stock: ${item.stock}`
          : "Out of stock"}
      </Text>

      <Text style={styles.moq}>MOQ: {item.moq}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Product Catalog" />

      {/* SEARCH + FILTER */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color="#777" />
          <TextInput
            placeholder="What are you looking for?"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={18} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      {/* PRODUCT GRID */}
      <FlatList
        data={PRODUCT_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;
