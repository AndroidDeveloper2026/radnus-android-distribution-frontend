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

import styles from "./DistributorListStyle";
import Header from "../../components/Header";

import { fetchDistributors } from "../../services/features/distributor/distributorSlice";

const DistributorList = ({ navigation }) => {
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.distributors);

  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    dispatch(fetchDistributors());
  }, []);

  const approvedDistributors = list.filter(
    (item) => item.status === "APPROVED"
  );

  const displayList =
    activeTab === "APPROVED" ? approvedDistributors : list;

  return (
    <View style={styles.container}>
      <Header title={"Distributor List"} />

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "ALL" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("ALL")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "ALL" && styles.activeTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "APPROVED" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("APPROVED")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "APPROVED" && styles.activeTabText,
            ]}
          >
            Approved
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView>
          <View style={styles.content}>
            {displayList.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("DistributorDetail", {
                    distributorId: item._id,
                  })
                }
              >
                {/* PROFILE IMAGE */}
                <View style={styles.imageBox}>
                  <Image
                    source={{
                      uri:
                        item?.images?.profile ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    }}
                    style={styles.profileImage}
                  />
                </View>

                {/* INFO */}
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>

                  <Text style={styles.business}>
                    {item.businessName}
                  </Text>

                  <Text style={styles.mobile}>
                    📞 {item.mobile}
                  </Text>

                  {item.gst && (
                    <Text style={styles.meta}>
                      GST: {item.gst}
                    </Text>
                  )}

                  {item.address && (
                    <Text style={styles.address}>
                      {item.address}
                    </Text>
                  )}

                  {/* STATUS */}
                  <Text
                    style={[
                      styles.status,
                      item.status === "APPROVED"
                        ? styles.approved
                        : styles.pending,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {displayList.length === 0 && (
              <Text style={styles.empty}>
                No distributors found
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default DistributorList;
