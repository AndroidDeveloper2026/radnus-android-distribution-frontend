import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import styles from './RetailerProfileStyle';
import Header from '../../components/Header';
import { useDispatch } from 'react-redux';
import { updateRetailer } from '../../services/features/retailer/retailerSlice';

const RetailerProfile = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const retailer = route?.params?.retailer;

  const [editMode, setEditMode] = useState(route?.params?.edit || false);

  const [form, setForm] = useState({
    shopName: retailer.shopName || '',
    ownerName: retailer.ownerName || '',
    mobile: retailer.mobile || '',
    area: retailer.area || '',
    address: retailer.address || '', // ✅ ADDED
    gst: retailer.gst || '',
  });

  if (retailer.status !== 'APPROVED') {
    Alert.alert('Access Denied', 'Retailer not approved yet', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
    return null;
  }

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const saveProfile = async () => {
    if (!form.shopName || !form.ownerName || !form.mobile) {
      Alert.alert('Error', 'Please fill required fields');
      return;
    }

    try {
      await dispatch(
        updateRetailer({
          id: retailer._id,
          data: form,
        }),
      ).unwrap();

      Alert.alert('Success', 'Profile updated', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Update failed');
    }
  };

  return (
    <View style={styles.container}>
      <Header title={'Retailer Profile'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.label}>Shop Name</Text>
          <TextInput style={styles.input} value={form.shopName} editable={editMode} onChangeText={v => onChange('shopName', v)} />

          <Text style={styles.label}>Owner Name</Text>
          <TextInput style={styles.input} value={form.ownerName} editable={editMode} onChangeText={v => onChange('ownerName', v)} />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput style={styles.input} value={form.mobile} editable={editMode} keyboardType="phone-pad" onChangeText={v => onChange('mobile', v)} />

          <Text style={styles.label}>Area</Text>
          <TextInput style={styles.input} value={form.area} editable={editMode} onChangeText={v => onChange('area', v)} />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={form.address}
            editable={editMode}
            onChangeText={v => onChange('address', v)}
          />

          <Text style={styles.label}>GST Number</Text>
          <TextInput style={styles.input} value={form.gst} editable={editMode} onChangeText={v => onChange('gst', v)} />
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={editMode ? saveProfile : () => setEditMode(true)}
        >
          <Text style={styles.btnText}>
            {editMode ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RetailerProfile;
