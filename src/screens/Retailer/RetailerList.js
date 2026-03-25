import React, { useEffect, useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';

const userRole = 'distributor';

const RetailerList = ({ navigation }) => {
  const dispatch = useDispatch();
  const retailers = useSelector(state => state.retailer?.list || []);

  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    dispatch(fetchRetailers());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      setActiveCard(null);
    }, [])
  );

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
          <Image source={{ uri: item.shopPhoto }} style={styles.shopImage} />

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

          <View style={styles.infoRow}>
            <User size={14} color="#616161" />
            <Text style={styles.infoText}>Owner: {item.ownerName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Phone size={14} color="#616161" />
            <Text style={styles.infoText}>Mobile: {item.mobile}</Text>
          </View>

          {/* ✅ AREA */}
          <View style={styles.infoRow}>
            <MapPin size={14} color="#616161" />
            <Text style={styles.infoText}>Area: {item.area || '-'}</Text>
          </View>

          {/* ✅ ADDRESS */}
          <View style={styles.infoRow}>
            <MapPin size={14} color="#616161" />
            <Text style={styles.infoText}>
              Address: {item.address || '-'}
            </Text>
          </View>

          {/* ✅ GST */}
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              GST: {item.gst || '-'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={14} color="#616161" />
            <Text style={styles.infoText}>
              Created: {new Date(item.createdAt).toDateString()}
            </Text>
          </View>

          {isActive && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate('RetailerProfile', {
                  retailer: item,
                  edit: true,
                })
              }
            >
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}

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
