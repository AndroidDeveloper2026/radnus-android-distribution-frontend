import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./RetailerSalesTabStyle";
import Header from "../../components/Header";


const RetailerSalesTab = ({ retailer }) => {

var Status = "APPROVED";
  // 🔒 Allow only approved retailers if (retailer.status !== "APPROVED") 
  if (Status !== "APPROVED") {
    return (
      <Text style={styles.blockedText}>
        Retailer not approved
      </Text>
    );
  }


  // 🔹 Sample data (replace with API)
  const sales = [
    {
      id: "INV001",
      date: "02 Feb 2026",
      amount: 12500,
      items: 6,
    },
    {
      id: "INV002",
      date: "28 Jan 2026",
      amount: 8200,
      items: 4,
    },
    {
      id: "INV003",
      date: "20 Jan 2026",
      amount: 15600,
      items: 8,
    },
  ];


  const totalSales = sales.reduce(
    (sum, s) => sum + s.amount,
    0
  );


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // 🔜 Invoice details screen later
        console.log("Invoice:", item.id);
      }}
    >
      <View style={styles.row}>
        <Text style={styles.invoice}>{item.id}</Text>
        <Text style={styles.amount}>₹{item.amount}</Text>
      </View>


      <View style={styles.row}>
        <Text style={styles.subText}>{item.date}</Text>
        <Text style={styles.subText}>
          {item.items} items
        </Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View >
        <Header title={'RetailerSalesTab'}/>
      {/* SUMMARY */}
     <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Sales</Text>
        <Text style={styles.summaryAmount}>₹{totalSales}</Text>
        <Text style={styles.summarySub}>
          Orders: {sales.length}
        </Text>
      </View>


      {/* SALES LIST */}
      <FlatList
        data={sales}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
    </View> 
  );
};


export default RetailerSalesTab;