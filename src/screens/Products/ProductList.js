import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import styles from "./ProductListStyle";
import Header from "../../components/Header";


// 🔐 TEMP: replace with role from login / redux / context
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
      image: "https://www.portronics.com/cdn/shop/files/Portronics_Adapto_100_Multiport_100w_Charger.png?v=1738651493",
    },
    {
      id: 2,
      name: "Type-C Cable 1.5m",
      sku: "TC-CABLE-15",
      mrp: 399,
      retailerPrice: 320,
      distributorPrice: 290,
      moq: 10,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr-qYBo49olQ7YpjOk9oO2t7j-sKiEB1TETw&s",
    },
  ];


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
            <Text style={styles.priceText}>
              Buy: ₹{item.distributorPrice}
            </Text>
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
            <Text style={styles.priceText}>
              MRP: ₹{item.mrp}
            </Text>
          </>
        )}
      </>
    );
  };


  return (
    <View style={styles.container}>

      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Product List</Text>
      </View> */}
      
      <Header title={'Product List'} />
 
      <ScrollView>
        <View style={styles.content}>
          {products.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  productId: item.id,
                })
              }
            >
              {/* IMAGE */}
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
              </View>


              {/* INFO */}
              <View style={styles.info}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.sku}>SKU: {item.sku}</Text>


                <View style={{ marginTop: 6 }}>
                  {renderPrices(item)}
                </View>


                <Text style={styles.moq}>
                  MOQ: {item.moq} units
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


export default ProductList;
