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
import { User, Phone, MapPin, Calendar } from 'lucide-react-native';

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
          {/* SHOP IMAGE */}
          <Image source={{ uri: item.shopPhoto }} style={styles.shopImage} />

          {/* NAME + STATUS */}
          <View style={styles.row}>
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

          {/* OWNER */}
          <View style={styles.infoRow}>
            <User size={14} color="#616161" />
            <Text style={styles.infoText}>Owner: {item.ownerName}</Text>
          </View>

          {/* MOBILE */}
          <View style={styles.infoRow}>
            <Phone size={14} color="#616161" />
            <Text style={styles.infoText}>Mobile: {item.mobile}</Text>
          </View>

          {/* GPS */}
          <View style={styles.infoRow}>
            <MapPin size={14} color="#616161" />
            <Text style={styles.infoText}>GPS: {item.gps}</Text>
          </View>

          {/* CREATED */}
          <View style={styles.infoRow}>
            <Calendar size={14} color="#616161" />
            <Text style={styles.infoText}>
              Created: {new Date(item.createdAt).toDateString()}
            </Text>
          </View>

          {/* EDIT BUTTON */}
          {isActive && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate('RetailerProfile', { retailer: item })
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
