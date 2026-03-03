// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import styles from './RetailerStyle';
// import RetailerApprovalModal from './RetailerApprovalModal';
// import Header from '../../components/Header';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchRetailers } from '../../services/features/retailer/retailerSlice';

// // 🔐 Role simulation (replace from auth)
// const userRole = 'distributor';
// // fse | distributor | admin

// const RetailerList = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const retailers = useSelector(state => state.retailer?.list);
//   const [selectedRetailer, setSelectedRetailer] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [activeCard, setActiveCard] = useState(null);

//   // const [retailers, setRetailers] = useState([
//   //   {
//   //     id: 'R1',
//   //     name: 'Sri Lakshmi Mobiles',
//   //     owner: 'Ramesh',
//   //     area: 'MG Road',
//   //     status: 'PENDING',
//   //     addedBy: 'FSE Kumar',
//   //     createdAt: '02 Feb 2026',
//   //   },
//   //   {
//   //     id: 'R2',
//   //     name: 'Mobile World',
//   //     owner: 'Suresh',
//   //     area: 'Bus Stand',
//   //     status: 'APPROVED',
//   //     addedBy: 'FSE Kumar',
//   //     createdAt: '30 Jan 2026',
//   //   },
//   // ]);

//   useEffect(() => {
//     dispatch(fetchRetailers());
//   }, []);

//   /* ✅ APPROVE / REJECT LOGIC */
//   const updateStatus = (id, status) => {
//     // setRetailers(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
//     setModalVisible(false);
//   };

//   const openApproval = retailer => {
//     setSelectedRetailer(retailer);
//     setModalVisible(true);
//   };

//   console.log('--- Retailer List (retaier) ---',retailers);

//   const renderItem = ({ item }) => {
//     const isActive = activeCard === item.id;

//     return (
//       <TouchableOpacity
//         activeOpacity={0.9}
//         onPress={() => setActiveCard(isActive ? null : item.id)}
//       >
//         <View style={styles.card}>
//           <View style={styles.row}>
//             <Text style={styles.name}>{item.name}</Text>
//             <Text
//               style={[
//                 styles.badge,
//                 item.status === 'APPROVED'
//                   ? styles.approved
//                   : item.status === 'REJECTED'
//                   ? styles.rejected
//                   : styles.pending,
//               ]}
//             >
//               {item.status}
//             </Text>
//           </View>

//           <Text style={styles.subText}>Owner: {item.owner}</Text>
//           <Text style={styles.subText}>Area: {item.area}</Text>
//           <Text style={styles.subText}>Added by: {item.addedBy}</Text>

//           {/* 👇 SHOW EDIT WHEN CARD CLICKED */}
//           {isActive && (
//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() =>
//                 navigation.navigate('RetailerProfile', {
//                   retailer: item,
//                 })
//               }
//             >
//               <Text style={styles.actionText}>Edit</Text>
//             </TouchableOpacity>
//           )}

//           {/* EXISTING APPROVE BUTTON */}
//           {userRole !== 'fse' && item.status === 'PENDING' && (
//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => openApproval(item)}
//             >
//               <Text style={styles.actionText}>Review & Approve</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* <Text style={styles.header}>Retailer List</Text> */}

//       <Header title={'Retailer List'} />

//       <FlatList
//         data={retailers}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ padding: 16 }}
//       />

//       {/* APPROVAL MODAL */}
//       <RetailerApprovalModal
//         visible={modalVisible}
//         retailer={selectedRetailer}
//         onApprove={() => updateStatus(selectedRetailer.id, 'APPROVED')}
//         onReject={() => updateStatus(selectedRetailer.id, 'REJECTED')}
//         onClose={() => setModalVisible(false)}
//       />
//     </View>
//   );
// };

// export default RetailerList;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from './RetailerStyle';
import RetailerApprovalModal from './RetailerApprovalModal';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRetailers,
  updateStatus,
} from '../../services/features/retailer/retailerSlice';

// 🔐 Role simulation
const userRole = 'distributor';

const RetailerList = ({ navigation }) => {
  const dispatch = useDispatch();

  // ✅ SAFE SELECTOR
  const retailers = useSelector(state => state.retailer?.list || []);

  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    dispatch(fetchRetailers());
  }, []);

  const openApproval = retailer => {
    setSelectedRetailer(retailer);
    setModalVisible(true);
  };

  const handleStatusUpdate = status => {
    dispatch(updateStatus({ id: selectedRetailer._id, status }));
    setModalVisible(false);
  };

  const renderItem = ({ item }) => {
    const isActive = activeCard === item._id;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setActiveCard(isActive ? null : item._id)}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <Image source={{ uri: item.shopPhoto }} style={styles.shopImage} />
            <Text style={styles.name}>{item.shopName}</Text>

            <Text
              style={[
                styles.badge,
                item.status === 'APPROVED'
                  ? styles.approved
                  : item.status === 'REJECTED'
                  ? styles.rejected
                  : styles.pending,
              ]}
            >
              {item.status}
            </Text>
          </View>

          <Text style={styles.subText}>Owner: {item.ownerName}</Text>
          <Text style={styles.subText}>Mobile: {item.mobile}</Text>
          <Text style={styles.subText}>GPS: {item.gps}</Text>
          <Text style={styles.subText}>
            Created: {new Date(item.createdAt).toDateString()}
          </Text>

          {/* EDIT BUTTON */}
          {isActive && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate('RetailerProfile', {
                  retailer: item,
                })
              }
            >
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}

          {/* APPROVAL BUTTON */}
          {userRole !== 'fse' && item.status === 'PENDING' && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => openApproval(item)}
            >
              <Text style={styles.actionText}>Review & Approve</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={'Retailer List'} />

      <FlatList
        data={retailers}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <RetailerApprovalModal
        visible={modalVisible}
        retailer={selectedRetailer}
        onApprove={() => handleStatusUpdate('APPROVED')}
        onReject={() => handleStatusUpdate('REJECTED')}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default RetailerList;
