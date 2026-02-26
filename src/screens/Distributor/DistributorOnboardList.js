import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import styles from './DistributorOnboardListStyle';
import Header from '../../components/Header';
import { User2Icon, Trash2 } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDistributors,
  deleteDistributor,
  updateStatus,
} from '../../services/features/distributor/distributorSlice';
import PopupModal from '../../components/PopupModal';

const DistributorOnboardList = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState('PENDING');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { list, loading, error } = useSelector(state => state.distributors);

  useEffect(() => {
    dispatch(fetchDistributors());
  }, [dispatch]);

  const filtered = list.filter(d => d.status === tab);

  const confirmReject = () => {
    dispatch(
      updateStatus({
        id: selectedId,
        status: 'REJECTED',
      }),
    );

    setShowRejectModal(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* TOP ROW */}
      <View style={styles.row}>
        {/* IMAGE */}
        {item.profileImage ? (
          <Image
            source={{
              uri: `data:image/*;base64,${item.profileImage}`,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User2Icon size={22} color="#999" />
          </View>
        )}

        {/* DETAILS */}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subText}>{item.businessName}</Text>
          <Text style={styles.mobile}>{item.mobile}</Text>
        </View>
        <View style={styles.statusCol}>
          {/* DELETE */}
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => dispatch(deleteDistributor(item._id))}
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
            <Text
              style={[
                styles.badgeText,
                item.status === 'APPROVED' && styles.badgeTextApproved,
                item.status === 'REJECTED' && styles.badgeTextRejected,
                item.status === 'PENDING' && styles.badgeTextPending,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      {item.status === 'PENDING' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() =>
              dispatch(
                updateStatus({
                  id: item._id,
                  status: 'APPROVED',
                }),
              )
            }
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={
              () => {
                setSelectedId(item._id);
                setShowRejectModal(true);
              }
              // dispatch(
              //   updateStatus({
              //     id: item._id,
              //     status: 'REJECTED',
              //   }),
              // )
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
      <Header title="Distributor Onboard List" />

      {/* TABS */}
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
      {loading && (
        <Text style={styles.center}>
          <ActivityIndicator color={'blue'} />
        </Text>
      )}

      {/* ERROR */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.center}>
              No {tab.toLowerCase()} distributors
            </Text>
          )
        }
      />
      <PopupModal
        visible={showRejectModal}
        title="Reject Distributor"
        description="Are you sure you want to reject this distributor?"
        buttonText="Reject"
        secondaryText="Cancel"
        onPress={confirmReject}
        onSecondaryPress={() => setShowRejectModal(false)}
      />
    </View>
  );
};

export default DistributorOnboardList;
