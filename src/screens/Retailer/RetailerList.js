 import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "./RetailerStyle";
import RetailerApprovalModal from "./RetailerApprovalModal";
import Header from "../../components/Header";

// 🔐 Role simulation (replace from auth)
const userRole = "distributor"; 
// fse | distributor | admin

const RetailerList = ({navigation}) => {
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [retailers, setRetailers] = useState([
    {
      id: "R1",
      name: "Sri Lakshmi Mobiles",
      owner: "Ramesh",
      area: "MG Road",
      status: "PENDING",
      addedBy: "FSE Kumar",
      createdAt: "02 Feb 2026",
    },
    {
      id: "R2",
      name: "Mobile World",
      owner: "Suresh",
      area: "Bus Stand",
      status: "APPROVED",
      addedBy: "FSE Kumar",
      createdAt: "30 Jan 2026",
    },
  ]);

  /* ✅ APPROVE / REJECT LOGIC */
  const updateStatus = (id, status) => {
    setRetailers((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    );
    setModalVisible(false);
  };

  const openApproval = (retailer) => {
    setSelectedRetailer(retailer);
    setModalVisible(true);
    navigation.navigate("RetailerProfile", {
  retailer: retailer,
});

  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.name}</Text>
        <Text
          style={[
            styles.badge,
            item.status === "APPROVED"
              ? styles.approved
              : item.status === "REJECTED"
              ? styles.rejected
              : styles.pending,
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.subText}>
        Owner: {item.owner}
      </Text>
      <Text style={styles.subText}>
        Area: {item.area}
      </Text>
      <Text style={styles.subText}>
        Added by: {item.addedBy}
      </Text>

      {/* ACTIONS */}
      {(userRole !== "fse" &&
        item.status === "PENDING") && (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openApproval(item)}
        >
          <Text style={styles.actionText}>
            Review & Approve
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Retailer List</Text> */}

      <Header title={'Retailer List'}/>

      <FlatList
        data={retailers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* APPROVAL MODAL */}
      <RetailerApprovalModal
        visible={modalVisible}
        retailer={selectedRetailer}
        onApprove={() =>
          updateStatus(selectedRetailer.id, "APPROVED")
        }
        onReject={() =>
          updateStatus(selectedRetailer.id, "REJECTED")
        }
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default RetailerList;
