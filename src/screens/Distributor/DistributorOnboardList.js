import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./DistributorOnboardListStyle";
import Header from "../../components/Header";
import { Store } from "lucide-react-native";

const DATA = [
  {
    id: "1",
    name: "Jane Distributor",
    firm: "Jane Suppliers",
    mobile: "9876543211",
    territory: "Bangalore South",
    status: "PENDING",
  },
  {
    id: "2",
    name: "John Distributor",
    firm: "John Traders",
    mobile: "9876543210",
    territory: "Bangalore North",
    status: "APPROVED",
  },
];

const DistributorOnboardList = ({ navigation }) => {
  const [tab, setTab] = useState("PENDING");

  const filtered = DATA.filter(
    (d) => d.status === tab
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DistributorDetails", {
          distributor: item,
        })
      }
    >
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Store size={18} color="#D32F2F" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.sub}>{item.firm}</Text>
        </View>

        <View
          style={[
            styles.badge,
            tab === "APPROVED" && styles.approved,
            tab === "PENDING" && styles.pending,
            tab === "REJECTED" && styles.rejected,
          ]}
        >
          <Text style={styles.badgeText}>{tab}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Mobile:</Text>
        <Text style={styles.value}>{item.mobile}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Territory:</Text>
        <Text style={styles.value}>{item.territory}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Distributor Onboarding" />

      {/* TABS */}
      <View style={styles.tabs}>
        {["PENDING", "APPROVED", "REJECTED"].map(
          (t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.tab,
                tab === t && styles.activeTab,
              ]}
              onPress={() => setTab(t)}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === t && styles.activeTabText,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No {tab.toLowerCase()} distributors
          </Text>
        }
      />
    </View>
  );
};

export default DistributorOnboardList;