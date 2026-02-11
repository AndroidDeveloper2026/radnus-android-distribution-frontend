
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./FSEManagementStyle";
import Header from "../../components/Header";
import { User, MapPin, Target, Ban, CheckCircle } from "lucide-react-native";

const FSE_DATA = [
  {
    id: "1",
    name: "Ramesh Kumar",
    beat: "Bangalore South",
    target: 500000,
    status: "ACTIVE", // ACTIVE | BLOCKED
  },
  {
    id: "2",
    name: "Suresh Rao",
    beat: "BTM Layout",
    target: 300000,
    status: "BLOCKED",
  },
  {
    id: "3",
    name: "Manjunath",
    beat: "JP Nagar",
    target: 400000,
    status: "ACTIVE",
  },
];

const FSEManagement = ({ navigation }) => {
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("FSEDetail", {
          fseId: item.id,
        })
      }
    >
      <View style={styles.row}>
        {/* LEFT ICON */}
        <View style={styles.iconCircle}>
          <User size={18} color="#D32F2F" />
        </View>

        {/* FSE INFO */}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {index + 1}. {item.name}
          </Text>

          <View style={styles.subRow}>
            <MapPin size={12} color="#777" />
            <Text style={styles.subText}>{item.beat}</Text>
          </View>

          <View style={styles.subRow}>
            <Target size={12} color="#777" />
            <Text style={styles.subText}>
              Target ₹{item.target.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* STATUS */}
        {item.status === "ACTIVE" ? (
          <CheckCircle size={18} color="#2E7D32" />
        ) : (
          <Ban size={18} color="#D32F2F" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="FSE Management" />

      {/* SUMMARY */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total FSE: <Text style={styles.bold}>3</Text>
        </Text>
        <Text style={styles.summaryText}>
          Active: <Text style={styles.bold}>2</Text>
        </Text>
      </View>

      <FlatList
        data={FSE_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* ADD FSE BUTTON */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddFSE")}
      >
        <Text style={styles.addButtonText}>+ Add FSE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FSEManagement;
