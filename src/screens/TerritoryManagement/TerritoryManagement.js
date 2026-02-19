import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import styles from './TerritoryManagementStyle';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { addDistrict, addTaluk } from '../../services/features/Territory/TerritorySlice';
import { fetchTerritory } from '../../services/features/Territory/TerritorySlice';




// 🔐 Example role (replace from login)
const userRole = 'super_admin';
// super_admin | admin | manager

const TerritoryManagement = () => {

  const dispatch = useDispatch();
const { data } = useSelector(state => state.territory);

  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState(''); // district | taluk
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    dispatch(fetchTerritory());
  },[dispatch]);

    // 🔥 Convert API → UI format
  const formattedData = Object.keys(data?.TamilNadu || {}).map(
    (districtName, index) => ({
      districtId: `D${index}`,
      districtName,
      taluks: data.TamilNadu[districtName].map((t, i) => ({
        talukId: `T${i}`,
        talukName: t.taluk,
      })),
    })
  );

  const toggleDistrict = id => {
    setExpandedDistrict(expandedDistrict === id ? null : id);
  };

  const openAddDistrict = () => {
    setFormType('district');
    setName('');
    setSelectedDistrict(null);
    setModalVisible(true);
  };

  const openAddTaluk = district => {
    setFormType('taluk');
    setName('');
    setSelectedDistrict(district);
    setModalVisible(true);
  };

  const saveTerritory = () => {
  if (!name.trim()) return;

  if (formType === 'district') {
    dispatch(
      addDistrict({
        state: 'TamilNadu',
        district: name,
      })
    );
  }

  if (formType === 'taluk' && selectedDistrict) {
    dispatch(
      addTaluk({
        state: 'TamilNadu',
        district: selectedDistrict.districtName,
        taluk: name,
      })
    );
  }

  setModalVisible(false);
  setName('');
};


  // const saveTerritory = () => {
  //   if (!name.trim()) return;

  //   if (formType === 'district') {
  //     setTerritoryData([
  //       ...territoryData,
  //       {
  //         districtId: `D${Date.now()}`,
  //         districtName: name,
  //         active: true,
  //         taluks: [],
  //       },
  //     ]);
  //   }

  //   if (formType === 'taluk' && selectedDistrict) {
  //     setTerritoryData(
  //       territoryData.map(d =>
  //         d.districtId === selectedDistrict.districtId
  //           ? {
  //               ...d,
  //               taluks: [
  //                 ...d.taluks,
  //                 {
  //                   talukId: `T${Date.now()}`,
  //                   talukName: name,
  //                   active: true,
  //                 },
  //               ],
  //             }
  //           : d,
  //       ),
  //     );
  //   }

  //   setModalVisible(false);
  // };

  

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Territory Management</Text>
        <Text style={styles.headerSub}>Tamil Nadu</Text>
      </View> */}

      <Header title={'Territory Management'} />

      {/* ADD DISTRICT */}
      {userRole === 'super_admin' && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={openAddDistrict}
        >
          <Text style={styles.primaryButtonText}>+ Add District</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        {formattedData.map(district => (
          <View key={district.districtId} style={styles.card}>

            <TouchableOpacity
              style={styles.districtRow}
              onPress={() => toggleDistrict(district.districtId)}
            >
              <Text style={styles.districtName}>
                {district.districtName}
              </Text>
            </TouchableOpacity>

            {expandedDistrict === district.districtId &&
              district.taluks.map(taluk => (
                <View key={taluk.talukId} style={styles.talukRow}>
                  <Text>{taluk.talukName}</Text>
                </View>
              ))}

            {expandedDistrict === district.districtId && (
              <TouchableOpacity
                onPress={() => openAddTaluk(district)}
              >
                <Text style={{ color: 'green' }}>+ Add Taluk</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text>
              {formType === 'district' ? 'Add District' : 'Add Taluk'}
            </Text>

            <TextInput
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TouchableOpacity  style={styles.primaryButton} onPress={saveTerritory}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TerritoryManagement;
