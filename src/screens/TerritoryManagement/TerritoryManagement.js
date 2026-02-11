import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import styles from './TerritoryManagementStyle';
import Header from '../../components/Header';

// 🔐 Example role (replace from login)
const userRole = 'super_admin';
// super_admin | admin | manager

const TerritoryManagement = () => {
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState(''); // district | taluk
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [name, setName] = useState('');

  const [territoryData, setTerritoryData] = useState([
    {
      districtId: 'D01',
      districtName: 'Chennai',
      active: true,
      taluks: [
        { talukId: 'T01', talukName: 'Egmore', active: true },
        { talukId: 'T02', talukName: 'Mylapore', active: false },
      ],
    },
    {
      districtId: 'D02',
      districtName: 'Coimbatore',
      active: true,
      taluks: [
        { talukId: 'T03', talukName: 'Pollachi', active: true },
        { talukId: 'T04', talukName: 'Mettupalayam', active: true },
      ],
    },
  ]);

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
      setTerritoryData([
        ...territoryData,
        {
          districtId: `D${Date.now()}`,
          districtName: name,
          active: true,
          taluks: [],
        },
      ]);
    }

    if (formType === 'taluk' && selectedDistrict) {
      setTerritoryData(
        territoryData.map(d =>
          d.districtId === selectedDistrict.districtId
            ? {
                ...d,
                taluks: [
                  ...d.taluks,
                  {
                    talukId: `T${Date.now()}`,
                    talukName: name,
                    active: true,
                  },
                ],
              }
            : d,
        ),
      );
    }

    setModalVisible(false);
  };

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
        {territoryData.map(district => (
          <View key={district.districtId} style={styles.card}>
            {/* DISTRICT */}
            <TouchableOpacity
              style={styles.districtRow}
              onPress={() => toggleDistrict(district.districtId)}
            >
              <Text style={styles.districtName}>{district.districtName}</Text>
              <Text
                style={[styles.status, !district.active && styles.inactive]}
              >
                {district.active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </TouchableOpacity>

            {/* TALUKS */}
            {expandedDistrict === district.districtId &&
              district.taluks.map(taluk => (
                <View key={taluk.talukId} style={styles.talukRow}>
                  <Text style={styles.talukName}>{taluk.talukName}</Text>
                  <Text
                    style={[styles.status, !taluk.active && styles.inactive]}
                  >
                    {taluk.active ? 'ACTIVE' : 'INACTIVE'}
                  </Text>
                </View>
              ))}

            {/* ADD TALUK */}
            {expandedDistrict === district.districtId &&
              userRole !== 'manager' && (
                <TouchableOpacity
                  style={styles.addTalukButton}
                  onPress={() => openAddTaluk(district)}
                >
                  <Text style={styles.addTalukText}>+ Add Taluk</Text>
                </TouchableOpacity>
              )}
          </View>
        ))}
      </ScrollView>

      {/* MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {formType === 'district' ? 'Add District' : 'Add Taluk'}
            </Text>

            <TextInput
              placeholder={
                formType === 'district' ? 'District name' : 'Taluk name'
              }
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveTerritory}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TerritoryManagement;
