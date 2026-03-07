import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import styles from "./ManagerManagementStyle";
import Header from "../../components/Header";

import { useDispatch, useSelector } from "react-redux";

import {
  getManagers,
  deleteManager,
  approveManager,
  updateManager,
} from "../../services/features/manager/managerSlice";

import { Trash2, User2Icon } from "lucide-react-native";

const ManagerManagement = ({ navigation }) => {

  const dispatch = useDispatch();

  const [tab, setTab] = useState("PENDING");

  const { list, loading } = useSelector(state => state.manager);

  useEffect(() => {
    dispatch(getManagers());
  }, []);

  const filtered = list.filter(i => i.status === tab);

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      <View style={styles.row}>

        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User2Icon size={22} color="#999" />
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subText}>{item.email}</Text>
          <Text style={styles.mobile}>{item.phone}</Text>
        </View>

        <View style={styles.statusCol}>

          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => dispatch(deleteManager(item._id))}
          >
            <Trash2 size={20} color="red" />
          </TouchableOpacity>

          <View style={styles.badge}>
            <Text>{item.status}</Text>
          </View>

        </View>

      </View>

      {item.status === "PENDING" && (

        <View style={styles.actionRow}>

          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => dispatch(approveManager(item._id))}
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() =>
              dispatch(
                updateManager({
                  id: item._id,
                  data: { status: "REJECTED" },
                })
              )
            }
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>

        </View>

      )}

    </View>

  );

  return (
    <View style={styles.container}>

      <Header title="Manager Management" />

      {/* Tabs */}

      <View style={styles.tabs}>
        {["PENDING", "APPROVED", "REJECTED"].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <ActivityIndicator />}

      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("ManagerOnboarding")}
      >
        <Text style={styles.addButtonText}>+ Add Manager</Text>
      </TouchableOpacity>

    </View>
  );
};

export default ManagerManagement;