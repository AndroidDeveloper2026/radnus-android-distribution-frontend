// import React, { useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import styles from './FSEManagementStyle';
// import Header from '../../components/Header';
// import {
//   User,
//   MapPin,
//   Target,
//   Ban,
//   CheckCircle,
//   PhoneCall,
// } from 'lucide-react-native';

// import { useSelector, useDispatch } from 'react-redux';
// import { getFSEs, approveFSE } from '../../services/features/fse/fseSlice';

// const FSEManagement = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const fseList = useSelector(state => state.fse.list);

//   useEffect(() => {
//     dispatch(getFSEs());
//   }, []);

//   const total = fseList.length;
//   const active = fseList.filter(f => f.status === 'APPROVED').length;

//   const renderItem = ({ item, index }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => navigation.navigate('FSEDetail', { fseId: item._id })}
//     >
//       <View style={styles.row}>
//         <View style={styles.iconCircle}>
//           <User size={18} color="#D32F2F" />
//         </View>

//         <View style={{ flex: 1 }}>
//           <Text style={styles.name}>
//             {index + 1}. {item.name}
//           </Text>

//           <View style={styles.subRow}>
//             <MapPin size={12} />
//             <Text>{item.address}</Text>
//           </View>

//           <View style={styles.subRow}>
//             <PhoneCall size={12} />
//             <Text>{item.phone}</Text>
//           </View>
//         </View>

//         <View style={styles.statusCol}>
//           {item.status === 'APPROVED' ? (
//             <>
//               <CheckCircle size={18} color="green" />
//               <TouchableOpacity onPress={() => dispatch(approveFSE(item._id))}>
//                 <Text style={{ color: '#0000',backgroundColor: '#91fe9a',borderRadius:20,padding:6, fontSize:12,}}>APPROVED</Text>
//               </TouchableOpacity>
//             </>
//           ) : (
//             <>
//               <Ban size={18} color="red" />
//               <TouchableOpacity onPress={() => dispatch(approveFSE(item._id))}>
//                 <Text style={{ color: '#0000',backgroundColor:'#fcd088',borderRadius:20,padding:6, fontSize:12,}}>APPROVE</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Header title="FSE Management" />

//       <View style={styles.summary}>
//         <Text>Total: {total}</Text>
//         <Text>Active: {active}</Text>
//       </View>

//       <FlatList
//         data={fseList}
//         keyExtractor={item => item._id}
//         renderItem={renderItem}
//       />

//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => navigation.navigate('AddFSE')}
//       >
//         <Text style={styles.addButtonText}>+ Add FSE</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default FSEManagement;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import styles from "./FSEManagementStyle";
import Header from "../../components/Header";
import { User2Icon, Trash2 } from "lucide-react-native";

import { useDispatch, useSelector } from "react-redux";
import {
  getFSEs,
  deleteFSE,
  approveFSE,
  updateFSE,
} from "../../services/features/fse/fseSlice";


import PopupModal from "../../components/PopupModal";

const FSEManagement = ({ navigation }) => {
  const dispatch = useDispatch();

  const [tab, setTab] = useState("PENDING");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { list, loading } = useSelector((state) => state.fse);

  useEffect(() => {
    dispatch(getFSEs());
  }, []);

  // ✅ FILTER BY STATUS
  const filtered = list.filter((f) => f.status === tab);

  // ✅ REJECT
  const confirmReject = () => {
    dispatch(
      updateFSE({
        id: selectedId,
        data: { status: "REJECTED" },
      })
    );

    setShowRejectModal(false);
  };

  // ✅ RENDER ITEM
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>

        {/* IMAGE */}
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User2Icon size={22} color="#999" />
          </View>
        )}

        {/* DETAILS */}
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subText}>{item.email}</Text>
          <Text style={styles.mobile}>{item.phone}</Text>
        </View>

        {/* RIGHT SIDE */}
        <View style={styles.statusCol}>

          {/* DELETE */}
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => dispatch(deleteFSE(item._id))}
          >
            <Trash2 size={20} color="#e01616" />
          </TouchableOpacity>

          {/* STATUS BADGE */}
          <View
            style={[
              styles.badge,
              item.status === "APPROVED" && styles.badgeApproved,
              item.status === "REJECTED" && styles.badgeRejected,
              item.status === "PENDING" && styles.badgePending,
            ]}
          >
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>

        </View>
      </View>

      {/* ACTION BUTTONS */}
      {item.status === "PENDING" && (
        <View style={styles.actionRow}>

          {/* APPROVE */}
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => dispatch(approveFSE(item._id))}
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>

          {/* REJECT */}
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => {
              setSelectedId(item._id);
              setShowRejectModal(true);
            }}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>

        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="FSE Management" />

      {/* ✅ TABS */}
      <View style={styles.tabs}>
        {["PENDING", "APPROVED", "REJECTED"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
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
      {loading && (
        <Text style={styles.center}>
          <ActivityIndicator color="blue" />
        </Text>
      )}

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.center}>
              No {tab.toLowerCase()} FSE
            </Text>
          )
        }
      />

      {/* REJECT MODAL */}
      <PopupModal
        visible={showRejectModal}
        title="Reject FSE"
        description="Are you sure you want to reject this FSE?"
        buttonText="Reject"
        secondaryText="Cancel"
        onPress={confirmReject}
        onSecondaryPress={() => setShowRejectModal(false)}
      />

      {/* ADD BUTTON */}
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
