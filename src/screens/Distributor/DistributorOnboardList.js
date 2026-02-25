import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './DistributorOnboardListStyle';
import Header from '../../components/Header';
import { Store } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDistributors,
  deleteDistributor,
  updateStatus,
} from '../../services/features/distributor/distributorSlice';

// const DATA = [
//   {
//     id: "1",
//     name: "Jane Distributor",
//     firm: "Jane Suppliers",
//     mobile: "9876543211",
//     territory: "Bangalore South",
//     status: "PENDING",
//   },
//   {
//     id: "2",
//     name: "John Distributor",
//     firm: "John Traders",
//     mobile: "9876543210",
//     territory: "Bangalore North",
//     status: "APPROVED",
//   },
// ];

const DistributorOnboardList = ({ navigation }) => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState('PENDING');

    const { list, loading, error } = useSelector(
    (state) => state.distributors
  );

  useEffect(() => {
    dispatch(fetchDistributors());
  }, [dispatch]);

  const filtered = list.filter(d => d.status === tab);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.businessName}</Text>
      <Text>{item.mobile}</Text>

      {/* ACTION BUTTONS */}
      {item.status === "PENDING" && (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() =>
              dispatch(
                updateStatus({
                  id: item._id, // use _id from MongoDB
                  status: "APPROVED",
                })
              )
            }
          >
            <Text style={{ color: "green" }}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              dispatch(
                updateStatus({
                  id: item._id,
                  status: "REJECTED",
                })
              )
            }
          >
            <Text style={{ color: "red" }}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DELETE */}
      <TouchableOpacity
        onPress={() => dispatch(deleteDistributor(item._id))}
      >
        <Text style={{ color: "black" }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );


  // const renderItem = ({ item }) => (
  //   <TouchableOpacity
  //     style={styles.card}
  //     onPress={() =>
  //       navigation.navigate('DistributorDetails', {
  //         distributor: item,
  //       })
  //     }
  //   >
  //     <View style={styles.row}>
  //       <View style={styles.iconCircle}>
  //         <Store size={18} color="#D32F2F" />
  //       </View>

  //       <View style={{ flex: 1 }}>
  //         <Text style={styles.name}>{item.name}</Text>
  //         <Text style={styles.sub}>{item.firm}</Text>
  //       </View>

  //       <View
  //         style={[
  //           styles.badge,
  //           tab === 'APPROVED' && styles.approved,
  //           tab === 'PENDING' && styles.pending,
  //           tab === 'REJECTED' && styles.rejected,
  //         ]}
  //       >
  //         <Text style={styles.badgeText}>{tab}</Text>
  //       </View>
  //     </View>

  //     <View style={styles.infoRow}>
  //       <Text style={styles.label}>Mobile:</Text>
  //       <Text style={styles.value}>{item.mobile}</Text>
  //     </View>

  //     <View style={styles.infoRow}>
  //       <Text style={styles.label}>Territory:</Text>
  //       <Text style={styles.value}>{item.territory}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <View style={{ flex: 1 }}>
      <Header title="Distributor Onboard List" />

      {/* TABS */}
      <View style={styles.tabs}>
        {["PENDING", "APPROVED", "REJECTED"].map((t) => (
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
        ))}
      </View>

      {/* LOADING */}
      {loading && <Text style={{ textAlign: "center" }}>Loading...</Text>}

      {/* ERROR */}
      {error && (
        <Text style={{ color: "red", textAlign: "center" }}>
          {error}
        </Text>
      )}

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center" }}>
            No {tab.toLowerCase()} distributors
          </Text>
        }
      />
    </View>
  );
};

export default DistributorOnboardList;
