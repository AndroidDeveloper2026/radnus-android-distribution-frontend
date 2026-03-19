import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ShoppingCart, Plus, Check } from "lucide-react-native";
import styles from "./ProductListStyle";
import Header from "../../components/Header";

// TEMP: replace with role from login / redux / context
const userRole = "fse";
// admin | distributor | fse | retailer

const ProductList = ({ navigation }) => {
  // 🔹 SAMPLE DATA (replace with API)
  const products = [
    {
      id: 1,
      name: "Fast Charger 25W",
      sku: "FC-25W-01",
      mrp: 999,
      retailerPrice: 850,
      distributorPrice: 780,
      moq: 5,
      image:
        "https://www.portronics.com/cdn/shop/files/Portronics_Adapto_100_Multiport_100w_Charger.png?v=1738651493",
    },
    {
      id: 2,
      name: "Type-C Cable 1.5m",
      sku: "TC-CABLE-15",
      mrp: 399,
      retailerPrice: 320,
      distributorPrice: 290,
      moq: 10,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr-qYBo49olQ7YpjOk9oO2t7j-sKiEB1TETw&s",
    },
  ];


  const [cartItems, setCartItems] = useState({});

  const isInCart = (id) => !!cartItems[id];

  const addToCart = (item) => {
    if (isInCart(item.id)) {
      // Already added — navigate directly to cart
      goToCart();
      return;
    }
    setCartItems((prev) => ({
      ...prev,
      [item.id]: {
        ...item,
        qty: item.moq, // start at MOQ
      },
    }));
    Alert.alert(
      "Added to Cart",
      `${item.name} added with MOQ qty ${item.moq}`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { text: "Go to Cart", onPress: goToCart },
      ]
    );
  };

  const goToCart = () => {
    const cartArray = Object.values(cartItems);
    if (cartArray.length === 0) {
      Alert.alert("Cart Empty", "Please add products first.");
      return;
    }
    navigation.navigate("OrderCart", { cartItems: cartArray });
  };

  const cartCount = Object.keys(cartItems).length;

  const renderPrices = (item) => {
    return (
      <>
        {/* ADMIN → ALL PRICES */}
        {userRole === "admin" && (
          <>
            <Text style={styles.priceText}>MRP: ₹{item.mrp}</Text>
            <Text style={styles.priceText}>
              Distributor: ₹{item.distributorPrice}
            </Text>
            <Text style={[styles.priceText, styles.highlight]}>
              Retailer: ₹{item.retailerPrice}
            </Text>
          </>
        )}

        {/* DISTRIBUTOR */}
        {userRole === "distributor" && (
          <>
            <Text style={styles.priceText}>Buy: ₹{item.distributorPrice}</Text>
            <Text style={[styles.priceText, styles.highlight]}>
              Sell: ₹{item.retailerPrice}
            </Text>
          </>
        )}

        {/* FSE */}
        {userRole === "fse" && (
          <Text style={[styles.priceText, styles.highlight]}>
            Price: ₹{item.retailerPrice}
          </Text>
        )}

        {/* RETAILER */}
        {userRole === "retailer" && (
          <>
            <Text style={[styles.priceText, styles.highlight]}>
              Price: ₹{item.retailerPrice}
            </Text>
            <Text style={styles.priceText}>MRP: ₹{item.mrp}</Text>
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={"Product List"} />

      <ScrollView>
        <View style={styles.content}>
          {products.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("ProductDetail", { productId: item.id })
              }
            >
              {/* IMAGE */}
              <View style={styles.imageBox}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
              </View>

              {/* INFO */}
              <View style={styles.info}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.sku}>SKU: {item.sku}</Text>

                <View style={{ marginTop: 6 }}>{renderPrices(item)}</View>

                <Text style={styles.moq}>MOQ: {item.moq} units</Text>
              </View>

              {/* ✅ ADD TO CART BUTTON */}
              <TouchableOpacity
                style={[
                  cartStyles.addBtn,
                  isInCart(item.id) && cartStyles.addBtnActive,
                ]}
                onPress={() => addToCart(item)}
              >
                {isInCart(item.id) ? (
                  <Check size={16} color="#fff" strokeWidth={2.5} />
                ) : (
                  <Plus size={16} color="#16a34a" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ✅ FLOATING CART BUTTON — shows when cart has items */}
      {cartCount > 0 && (
        <TouchableOpacity style={cartStyles.fab} onPress={goToCart}>
          <ShoppingCart size={20} color="#fff" strokeWidth={2} />
          <Text style={cartStyles.fabText}>View Cart</Text>
          <View style={cartStyles.badge}>
            <Text style={cartStyles.badgeText}>{cartCount}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const cartStyles = {
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  addBtnActive: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    left: 20,
    backgroundColor: "#16a34a",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  fabText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: 16,
    backgroundColor: "#dc2626",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
};

export default ProductList;