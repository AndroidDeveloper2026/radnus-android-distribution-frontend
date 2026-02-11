import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./RouteListStyle";
import Header from "../../components/Header";
import { Store, MapPin, CheckCircle } from "lucide-react-native";

const ROUTE_DATA = [
  {
    id: "1",
    retailerName: "Sri Lakshmi Mobiles",
    area: "MG Road",
    status: "PENDING", // PENDING | VISITED
  },
  {
    id: "2",
    retailerName: "Mobile World",
    area: "Brigade Road",
    status: "VISITED",
  },
  {
    id: "3",
    retailerName: "Sai Mobiles",
    area: "Indiranagar",
    status: "PENDING",
  },
];

const RouteList = ({ navigation }) => {
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("RetailerProfile", {
          retailerId: item.id,
        })
      }
    >
      <View style={styles.row}>
        {/* LEFT ICON */}
        <View style={styles.iconCircle}>
          <Store size={18} color="#D32F2F" />
        </View>

        {/* RETAILER INFO */}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {index + 1}. {item.retailerName}
          </Text>

          <View style={styles.subRow}>
            <MapPin size={12} color="#777" />
            <Text style={styles.subText}>{item.area}</Text>
          </View>
        </View>

        {/* STATUS */}
        {item.status === "VISITED" ? (
          <CheckCircle size={18} color="#2E7D32" />
        ) : (
          <Text style={styles.pending}>Pending</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Today's Route" />

      {/* ROUTE SUMMARY */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Beat: <Text style={styles.bold}>Bangalore South</Text>
        </Text>
        <Text style={styles.summaryText}>
          Retailers: <Text style={styles.bold}>3</Text>
        </Text>
      </View>

      <FlatList
        data={ROUTE_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RouteList;
