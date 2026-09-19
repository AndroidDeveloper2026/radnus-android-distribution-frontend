import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import styles from './FSEManagementStyle';
import Header from '../../components/Header';
import { User2Icon, Trash2 } from 'lucide-react-native';

import { useDispatch, useSelector } from 'react-redux';
import {
  getFSEs,
  deleteFSE,
  approveFSE,
  updateFSE,
} from '../../services/features/fse/fseSlice';

import PopupModal from '../../components/PopupModal';

const FSEManagement = ({ navigation }) => {
  const dispatch = useDispatch();

  const [tab, setTab] = useState('PENDING');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionInProgressId, setActionInProgressId] = useState(null);
  const { list, loading, error } = useSelector(state => state.fse);

  const loadFSEs = useCallback(async () => {
    try {
      await dispatch(getFSEs()).unwrap();
    } catch (err) {
      Alert.alert(
        'Error',
        err || 'Failed to load FSE list. Please check your connection and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: loadFSEs },
        ],
      );
    }
  }, [dispatch]);

  useEffect(() => {
    loadFSEs();
  }, [loadFSEs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getFSEs()).unwrap();
    } catch (err) {
      Alert.alert('Error', err || 'Failed to refresh FSE list.');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // FILTER BY STATUS
  const filtered = (list || []).filter(f => f.status === tab);

  const confirmAction = async () => {
    setShowRejectModal(false);

    try {
      if (modalType === 'reject') {
        await dispatch(
          updateFSE({
            id: selectedId,
            data: { status: 'REJECTED' },
          }),
        ).unwrap();
      }

      if (modalType === 'delete') {
        await dispatch(deleteFSE(selectedId)).unwrap();
      }
    } catch (err) {
      const action = modalType === 'delete' ? 'delete' : 'reject';
      Alert.alert(
        'Error',
        err || `Failed to ${action} FSE. Please try again.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: confirmAction },
        ],
      );
    }
  };

  const handleApprove = async (item) => {
    setActionInProgressId(item._id);
    try {
      await dispatch(approveFSE(item._id)).unwrap();
    } catch (err) {
      Alert.alert(
        'Error',
        err || 'Failed to approve FSE. Please try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: () => handleApprove(item) },
        ],
      );
    } finally {
      setActionInProgressId(null);
    }
  };

  // RENDER ITEM
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* IMAGE */}
        {item.photo ? (
          <Image source={{ uri: item?.photo }} style={styles.avatar} />
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
            onPress={() => {
              setSelectedId(item._id);
              setModalType('delete');
              setShowRejectModal(true);
            }}
          >
            <Trash2 size={20} color="#e01616" />
          </TouchableOpacity>

          {/* STATUS BADGE */}
          <View
            style={[
              styles.badge,
              item.status === 'APPROVED' && styles.badgeApproved,
              item.status === 'REJECTED' && styles.badgeRejected,
              item.status === 'PENDING' && styles.badgePending,
            ]}
          >
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      {item.status === 'PENDING' && (
        <View style={styles.actionRow}>
          {/* APPROVE */}
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => handleApprove(item)}
            disabled={actionInProgressId === item._id}
          >
            {actionInProgressId === item._id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Approve</Text>
            )}
          </TouchableOpacity>

          {/* REJECT */}
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => {
              setSelectedId(item._id);
              setModalType('reject');
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
        {['PENDING', 'APPROVED', 'REJECTED'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LOADING */}
      {loading && !refreshing && (
        <View style={{ paddingVertical: 12, alignItems: 'center' }}>
          <ActivityIndicator color="blue" />
        </View>
      )}

      {/* ERROR BANNER (non-blocking; list may still show cached data) */}
      {error && !loading && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={{ color: '#DC2626', fontSize: 12 }}>{error}</Text>
        </View>
      )}

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <Text style={styles.center}>No {tab.toLowerCase()} FSE</Text>
          )
        }
        // ✅ PERFORMANCE: virtualization tuning for potentially long FSE lists
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
      />

      {/* REJECT MODAL */}
      <PopupModal
        visible={showRejectModal}
        title={modalType === 'delete' ? 'Delete FSE' : 'Reject FSE'}
        description={
          modalType === 'delete'
            ? 'Are you sure you want to delete this FSE?'
            : 'Are you sure you want to reject this FSE?'
        }
        buttonText={modalType === 'delete' ? 'Delete' : 'Reject'}
        secondaryText="Cancel"
        onPress={confirmAction}
        onSecondaryPress={() => setShowRejectModal(false)}
      />

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('FSEOnboarding')}
      >
        <Text style={styles.addButtonText}>+ Add FSE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FSEManagement;
//++++++++++++++ FSE Old Code +++++++++++++++++++++++++++
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import styles from './FSEManagementStyle';
// import Header from '../../components/Header';
// import { User2Icon, Trash2 } from 'lucide-react-native';

// import { useDispatch, useSelector } from 'react-redux';
// import {
//   getFSEs,
//   deleteFSE,
//   approveFSE,
//   updateFSE,
// } from '../../services/features/fse/fseSlice';

// import PopupModal from '../../components/PopupModal';

// const FSEManagement = ({ navigation }) => {
//   const dispatch = useDispatch();

//   const [tab, setTab] = useState('PENDING');
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [modalType, setModalType] = useState(null);
//   const { list, loading } = useSelector(state => state.fse);

//   useEffect(() => {
//     dispatch(getFSEs());
//   }, []);

//   // FILTER BY STATUS
//   const filtered = list.filter(f => f.status === tab);



//   const confirmAction = () => {
//     if (modalType === 'reject') {
//       dispatch(
//         updateFSE({
//           id: selectedId,
//           data: { status: 'REJECTED' },
//         }),
//       );
//     }

//     if (modalType === 'delete') {
//       dispatch(deleteFSE(selectedId));
//     }

//     setShowRejectModal(false);
//   };

//   // RENDER ITEM
//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.row}>
//         {/* IMAGE */}
//         {item.photo ? (
//           <Image source={{ uri: item?.photo }} style={styles.avatar} />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <User2Icon size={22} color="#999" />
//           </View>
//         )}

//         {/* DETAILS */}
//         <View style={styles.details}>
//           <Text style={styles.name}>{item.name}</Text>
//           <Text style={styles.subText}>{item.email}</Text>
//           <Text style={styles.mobile}>{item.phone}</Text>
//         </View>

//         {/* RIGHT SIDE */}
//         <View style={styles.statusCol}>
//           {/* DELETE */}
//           <TouchableOpacity
//             style={styles.deleteIcon}
//             onPress={() => {
//               setSelectedId(item._id);
//               setModalType('delete');
//               setShowRejectModal(true);
//             }}
//           >
//             <Trash2 size={20} color="#e01616" />
//           </TouchableOpacity>

//           {/* STATUS BADGE */}
//           <View
//             style={[
//               styles.badge,
//               item.status === 'APPROVED' && styles.badgeApproved,
//               item.status === 'REJECTED' && styles.badgeRejected,
//               item.status === 'PENDING' && styles.badgePending,
//             ]}
//           >
//             <Text style={styles.badgeText}>{item.status}</Text>
//           </View>
//         </View>
//       </View>

//       {/* ACTION BUTTONS */}
//       {item.status === 'PENDING' && (
//         <View style={styles.actionRow}>
//           {/* APPROVE */}
//           <TouchableOpacity
//             style={styles.approveBtn}
//             onPress={() => dispatch(approveFSE(item._id))}
//           >
//             <Text style={styles.btnText}>Approve</Text>
//           </TouchableOpacity>

//           {/* REJECT */}
//           <TouchableOpacity
//             style={styles.rejectBtn}
//             onPress={() => {
//               setSelectedId(item._id);
//               setModalType('reject');
//               setShowRejectModal(true);
//             }}
//           >
//             <Text style={styles.btnText}>Reject</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Header title="FSE Management" />

//       {/* ✅ TABS */}
//       <View style={styles.tabs}>
//         {['PENDING', 'APPROVED', 'REJECTED'].map(t => (
//           <TouchableOpacity
//             key={t}
//             style={[styles.tab, tab === t && styles.activeTab]}
//             onPress={() => setTab(t)}
//           >
//             <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
//               {t}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* LOADING */}
//       {loading && (
//         <Text style={styles.center}>
//           <ActivityIndicator color="blue" />
//         </Text>
//       )}

//       {/* LIST */}
//       <FlatList
//         data={filtered}
//         keyExtractor={item => item._id}
//         renderItem={renderItem}
//         contentContainerStyle={{ padding: 16 }}
//         ListEmptyComponent={
//           !loading && (
//             <Text style={styles.center}>No {tab.toLowerCase()} FSE</Text>
//           )
//         }
//       />

//       {/* REJECT MODAL */}
//       <PopupModal
//         visible={showRejectModal}
//         title={modalType === 'delete' ? 'Delete FSE' : 'Reject FSE'}
//         description={
//           modalType === 'delete'
//             ? 'Are you sure you want to delete this FSE?'
//             : 'Are you sure you want to reject this FSE?'
//         }
//         buttonText={modalType === 'delete' ? 'Delete' : 'Reject'}
//         secondaryText="Cancel"
//         onPress={confirmAction}
//         onSecondaryPress={() => setShowRejectModal(false)}
//       />

//       {/* ADD BUTTON */}
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => navigation.navigate('FSEOnboarding')}
//       >
//         <Text style={styles.addButtonText}>+ Add FSE</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default FSEManagement;
