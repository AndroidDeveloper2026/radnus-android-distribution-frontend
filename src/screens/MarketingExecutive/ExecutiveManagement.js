import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import styles from '../FieldSalesExecutive/FSEManagementStyle';
import Header from '../../components/Header';
import { User2Icon, Trash2 } from 'lucide-react-native';

import { useDispatch, useSelector } from 'react-redux';

import {
  getExecutives,
  deleteExecutive,
  approveExecutive,
  updateExecutive,
} from '../../services/features/executive/executiveSlice';

import PopupModal from '../../components/PopupModal';

const ExecutiveManagement = ({ navigation }) => {
  const dispatch = useDispatch();

  const [tab, setTab] = useState('PENDING');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [modalType, setModalType] = useState(null);

  const { list, loading } = useSelector(state => state.executive);

  useEffect(() => {
    dispatch(getExecutives());
  }, []);

  const filtered = list.filter(e => e.status === tab);

  const confirmAction = () => {
    if (modalType === 'reject') {
      dispatch(
        updateExecutive({
          id: selectedId,
          data: { status: 'REJECTED' },
        }),
      );
    }

    if (modalType === 'delete') {
      dispatch(deleteExecutive(selectedId));
    }

    setShowModal(false);
  };

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
            onPress={() => {
              setSelectedId(item._id);
              setModalType('delete');
              setShowModal(true);
            }}
          >
            <Trash2 size={20} color="#e01616" />
          </TouchableOpacity>

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

      {item.status === 'PENDING' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => dispatch(approveExecutive(item._id))}
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => {
              setSelectedId(item._id);
              setModalType('reject');
              setShowModal(true);
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
      <Header title="Executive Management" />

      {/* Tabs */}

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

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : filtered.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, color: '#777' }}>No data found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      <PopupModal
        visible={showModal}
        title={modalType === 'delete' ? 'Delete Executive' : 'Reject Executive'}
        description="Are you sure?"
        buttonText={modalType === 'delete' ? 'Delete' : 'Reject'}
        secondaryText="Cancel"
        onPress={confirmAction}
        onSecondaryPress={() => setShowModal(false)}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ExecutiveOnboarding')}
      >
        <Text style={styles.addButtonText}>+ Add Executive</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExecutiveManagement;
