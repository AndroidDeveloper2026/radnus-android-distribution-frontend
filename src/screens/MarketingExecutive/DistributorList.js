import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Building2, MapPin, BadgeCheck, Clock, XCircle } from "lucide-react-native";

import styles from "./DistributorListStyle";
import Header from "../../components/Header";
import { fetchDistributors } from "../../services/features/distributor/distributorSlice";

const DistributorList = ({ navigation }) => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.distributors);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    dispatch(fetchDistributors());
  }, [dispatch]);

  const approvedDistributors = list.filter((item) => item.status === "APPROVED");
  const rejectedDistributors = list.filter((item) => item.status === "REJECTED"); // ✅ NEW

  const displayList =
    activeTab === "APPROVED" ? approvedDistributors :
    activeTab === "REJECTED" ? rejectedDistributors : // ✅ NEW
    list;

  return (
    <View style={styles.container}>
      <Header title={"Distributor List"} />

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "ALL" && styles.activeTab]}
          onPress={() => setActiveTab("ALL")}
        >
          <Text style={[styles.tabText, activeTab === "ALL" && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "APPROVED" && styles.activeTab]}
          onPress={() => setActiveTab("APPROVED")}
        >
          <Text style={[styles.tabText, activeTab === "APPROVED" && styles.activeTabText]}>
            Approved
          </Text>
        </TouchableOpacity>

        {/* ✅ NEW tab */}
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "REJECTED" && styles.rejectedTab]}
          onPress={() => setActiveTab("REJECTED")}
        >
          <Text style={[styles.tabText, activeTab === "REJECTED" && styles.rejectedTabText]}>
            Rejected
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D32F2F" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {displayList.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => {
                  console.log("--- DistributorDetails ---", item);
                  navigation.navigate("DistributorDetails", {
                    distributor: item,
                  });
                }}
              >
                {/* PROFILE IMAGE */}
                <Image
                  source={{
                    uri:
                      item?.images?.profile ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                  }}
                  style={styles.profileImage}
                />

                {/* INFO */}
                <View style={styles.info}>

                  {/* Name + Status badge */}
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        item.status === "APPROVED"
                          ? styles.approvedBadge
                          : item.status === "REJECTED"
                          ? styles.rejectedBadge   // ✅ NEW
                          : styles.pendingBadge,
                      ]}
                    >
                      {item.status === "APPROVED" ? (
                        <BadgeCheck size={11} color="#16a34a" strokeWidth={2.5} />
                      ) : item.status === "REJECTED" ? (
                        <XCircle size={11} color="#dc2626" strokeWidth={2.5} /> // ✅ NEW
                      ) : (
                        <Clock size={11} color="#d97706" strokeWidth={2.5} />
                      )}
                      <Text
                        style={[
                          styles.statusText,
                          item.status === "APPROVED"
                            ? styles.approvedText
                            : item.status === "REJECTED"
                            ? styles.rejectedText  // ✅ NEW
                            : styles.pendingText,
                        ]}
                      >
                        {" "}{item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Business name */}
                  {item.businessName ? (
                    <View style={styles.row}>
                      <Building2 size={13} color="#888" strokeWidth={2} />
                      <Text style={styles.business} numberOfLines={1}>
                        {"  "}{item.businessName}
                      </Text>
                    </View>
                  ) : null}

                  {/* Mobile */}
                  <View style={styles.row}>
                    <Phone size={13} color="#555" strokeWidth={2} />
                    <Text style={styles.mobile}>{"  "}{item.mobile}</Text>
                  </View>

                  {/* GST */}
                  {item.gst ? (
                    <View style={styles.row}>
                      <BadgeCheck size={13} color="#888" strokeWidth={2} />
                      <Text style={styles.meta}>{"  "}GST: {item.gst}</Text>
                    </View>
                  ) : null}

                  {/* Address */}
                  {item.address ? (
                    <View style={styles.row}>
                      <MapPin size={13} color="#888" strokeWidth={2} />
                      <Text style={styles.address} numberOfLines={2}>
                        {"  "}{item.address}
                      </Text>
                    </View>
                  ) : null}

                </View>
              </TouchableOpacity>
            ))}

            {displayList.length === 0 && (
              <Text style={styles.empty}>No distributors found</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default DistributorList;