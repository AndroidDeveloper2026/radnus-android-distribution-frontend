import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { UserCog } from 'lucide-react-native';
import API from '../../services/API/api';
import Header from '../../components/Header';
import styles from './RadnusApprovalStyle';

// This screen is dedicated to the Radnus Employee Login approval workflow.
// It does not touch Distributor / FSE / Retailer onboarding, which have
// their own separate screens and endpoints.
const TABS = ['pending', 'approved', 'rejected'];

const RadnusApprovalScreen = () => {
  const [tab, setTab] = useState('pending');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      if (tab === 'pending') {
        const res = await API.get('/api/admin/pending-approvals');
        setUsers(res.data || []);
      } else {
        const res = await API.get('/api/admin/approved-users?role=Radnus');
        const list = res.data || [];
        setUsers(
          list.filter(u =>
            tab === 'approved'
              ? u.approvalStatus === 'approved'
              : u.approvalStatus === 'rejected',
          ),
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load Radnus employees');
    }
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const approve = async (id) => {
    try {
      await API.post(`/api/admin/approve-user/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve');
    }
  };

  const openReject = (id) => {
    setSelectedUserId(id);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      await API.post(`/api/admin/reject-user/${selectedUserId}`, {
        reason: rejectReason.trim(),
      });
      setRejectModalVisible(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <UserCog size={20} color="#D32F2F" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subText}>{item.email}</Text>
          <Text style={styles.mobile}>{item.mobile}</Text>
          <Text style={styles.sub}>
            {item.district}, {item.state}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            item.approvalStatus === 'approved' && styles.badgeApproved,
            item.approvalStatus === 'rejected' && styles.badgeRejected,
            item.approvalStatus === 'pending' && styles.badgePending,
          ]}
        >
          <Text style={styles.badgeText}>{item.approvalStatus?.toUpperCase()}</Text>
        </View>
      </View>

      {item.approvalStatus === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.approveBtn} onPress={() => approve(item._id)}>
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => openReject(item._id)}>
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.approvalStatus === 'rejected' && item.rejectionReason && (
        <Text style={styles.reasonText}>Reason: {item.rejectionReason}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Radnus Employee Approvals" />

      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <ActivityIndicator color="#D32F2F" style={{ marginTop: 16 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading && <Text style={styles.center}>No {tab} Radnus employees</Text>
        }
      />

      <Modal transparent visible={rejectModalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reject Registration</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter rejection reason"
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
            />
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={confirmReject}>
                <Text style={styles.actionText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RadnusApprovalScreen;
