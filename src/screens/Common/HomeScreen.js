// import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "./HomeScreenStyle";
import Header from "../../components/Header";
import { Search, Filter } from "lucide-react-native";
import { useState } from "react";

/* ------------------ CATEGORY DATA ------------------ */
const CATEGORIES = ["All", "Chargers", "Cables", "Bluetooth", "Ear Buds", "Speakers", "Battery"];

/* ------------------ PRODUCT DATA ------------------ */
const PRODUCT_DATA = [
  {
    id: "1",
    name: "Samsung Charger",
    category: "Chargers",
    price: 850,
    mrp: 999,
    stock: 120,
    moq: 5,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Bluetooth Headset",
    category: "Headsets",
    price: 2150,
    mrp: 2500,
    stock: 25,
    moq: 2,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Mobile Cover",
    category: "Covers",
    price: 350,
    mrp: 499,
    stock: 0,
    moq: 10,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    name: "Mobile Cover",
    category: "Covers",
    price: 350,
    mrp: 499,
    stock: 0,
    moq: 10,
    image: "https://via.placeholder.com/150",
  },
];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  /* ------------------ FILTER LOGIC ------------------ */
  const filteredData = PRODUCT_DATA.filter((item) => {
    const matchCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const matchSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchCategory && matchSearch;
  });

  /* ------------------ PRODUCT CARD ------------------ */
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

      {/* ------------------ SEARCH + FILTER ------------------ */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color="#777" />
          <TextInput
            placeholder="What are you looking for?"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={18} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      {/* ------------------ CATEGORY TABS ------------------ */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {CATEGORIES.map((cat, index) => (
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

      {/* ------------------ PRODUCT GRID ------------------ */}
      <FlatList
        data={filteredData}
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