import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTerritory,
  deleteTaluk,
  deleteState,
  deleteDistrict,
  updateTerritory,
} from '../../services/features/Territory/TerritorySlice';
import styles from './TerritoryMappingStyle';
import Header from '../../components/Header';
import PopupModal from '../../components/PopupModal';
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  SquarePen,
  UserCheck,
  UserX,
} from 'lucide-react-native';

// ─── ROLE BASED ACCESS ──────────────────────────────────────────────────────
const getRole = () => {
  // Replace with actual role from auth state
  return 'Admin'; // 'Admin' | 'Manager' | 'Executive' | 'Radnus'
};

const TerritoryMappingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.territory);

  // ─── UI STATES ──────────────────────────────────────────────────────
  const [expandedState, setExpandedState] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);

  // ─── DELETE MODAL ──────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // ─── ASSIGN MODAL ──────────────────────────────────────────────────────
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [assignName, setAssignName] = useState('');
  const [assignSaving, setAssignSaving] = useState(false);

  // ─── ADD BEAT MODAL ──────────────────────────────────────────────────────
  const [showBeatModal, setShowBeatModal] = useState(false);
  const [beatTarget, setBeatTarget] = useState(null);
  const [beatName, setBeatName] = useState('');
  const [beatSaving, setBeatSaving] = useState(false);

  // ─── EDIT MODAL ──────────────────────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editTalukName, setEditTalukName] = useState('');
  const [editBeats, setEditBeats] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const userRole = getRole();
  const canManage = ['Admin', 'Radnus'].includes(userRole);

  // ─── FETCH DATA ──────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchTerritory());
  }, [dispatch]);

  // ─── TOGGLE FUNCTIONS ──────────────────────────────────────────────────────
  const toggleState = (state) => {
    setExpandedState(expandedState === state ? null : state);
    setExpandedDistrict(null);
  };

  const toggleDistrict = (district) => {
    setExpandedDistrict(expandedDistrict === district ? null : district);
  };

  // ─── ADD TERRITORY ──────────────────────────────────────────────────────
  const handleAddTerritory = () => {
    navigation.navigate('AddTerritory');
  };

  // ─── EDIT TERRITORY ──────────────────────────────────────────────────────
  const handleEditTerritory = (item) => {
    setEditTarget(item);
    setEditTalukName(item.taluk || '');
    setEditBeats((item.beats || []).join(', '));
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editTalukName.trim()) {
      Alert.alert('Error', 'Taluk name is required');
      return;
    }

    setEditSaving(true);
    try {
      const beats = editBeats
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean);

      await dispatch(
        updateTerritory({
          id: editTarget._id,
          data: {
            state: editTarget.state,
            district: editTarget.district,
            taluk: editTalukName.trim(),
            beats: beats,
            assignedTo: editTarget.assignedTo || null,
            active: true,
          },
        })
      ).unwrap();

      Alert.alert('Success', 'Territory updated successfully');
      setShowEditModal(false);
    } catch (err) {
      Alert.alert('Error', err.message || 'Update failed');
    } finally {
      setEditSaving(false);
    }
  };

  // ─── ASSIGN FSE ──────────────────────────────────────────────────────
  const openAssignModal = (item) => {
    setAssignTarget(item);
    setAssignName(item.assignedTo || '');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    if (!assignName.trim()) {
      Alert.alert('Error', 'Please enter FSE name');
      return;
    }

    setAssignSaving(true);
    try {
      await dispatch(
        updateTerritory({
          id: assignTarget._id,
          data: {
            state: assignTarget.state,
            district: assignTarget.district,
            taluk: assignTarget.taluk,
            beats: assignTarget.beats || [],
            assignedTo: assignName.trim(),
            active: true,
          },
        })
      ).unwrap();

      Alert.alert('Success', 'FSE assigned successfully');
      setShowAssignModal(false);
      setAssignName('');
    } catch (err) {
      Alert.alert('Error', err.message || 'Assignment failed');
    } finally {
      setAssignSaving(false);
    }
  };

  // ─── ADD BEAT ──────────────────────────────────────────────────────
  const openBeatModal = (item) => {
    setBeatTarget(item);
    setBeatName('');
    setShowBeatModal(true);
  };

  const handleBeatSubmit = async () => {
    if (!beatName.trim()) {
      Alert.alert('Error', 'Beat name is required');
      return;
    }

    setBeatSaving(true);
    try {
      const updatedBeats = [...(beatTarget.beats || []), beatName.trim()];
      await dispatch(
        updateTerritory({
          id: beatTarget._id,
          data: {
            state: beatTarget.state,
            district: beatTarget.district,
            taluk: beatTarget.taluk,
            beats: updatedBeats,
            assignedTo: beatTarget.assignedTo || null,
            active: true,
          },
        })
      ).unwrap();

      Alert.alert('Success', 'Beat added successfully');
      setShowBeatModal(false);
      setBeatName('');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to add beat');
    } finally {
      setBeatSaving(false);
    }
  };

  // ─── DELETE ──────────────────────────────────────────────────────
  const handleDeleteClick = (type, payload) => {
    setDeleteType(type);
    setSelectedItem(payload);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === 'state') {
        await dispatch(deleteState(selectedItem)).unwrap();
        Alert.alert('Success', 'State deleted successfully');
      } else if (deleteType === 'district') {
        await dispatch(deleteDistrict(selectedItem)).unwrap();
        Alert.alert('Success', 'District deleted successfully');
      } else if (deleteType === 'taluk') {
        await dispatch(deleteTaluk(selectedItem)).unwrap();
        Alert.alert('Success', 'Taluk deleted successfully');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Delete failed');
    }
    setShowDeleteModal(false);
    setSelectedItem(null);
    setDeleteType(null);
  };

  const getDeleteMessage = () => {
    if (deleteType === 'state') return 'Delete this state and all its data?';
    if (deleteType === 'district')
      return 'Delete this district and all its taluks?';
    if (deleteType === 'taluk') return 'Delete this taluk?';
    return 'Are you sure you want to delete?';
  };

  // ─── COUNT HELPERS ──────────────────────────────────────────────────────
  const getStateCount = () => Object.keys(data).length;
  const getDistrictCount = (state) => Object.keys(data[state] || {}).length;
  const getTalukCount = (state, district) =>
    (data[state]?.[district] || []).length;

  // ─── LOADING STATE ──────────────────────────────────────────────────────
  if (loading && !Object.keys(data).length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text style={styles.loadingText}>Loading territories...</Text>
      </View>
    );
  }

  // ─── RENDER ──────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Header title="Territory Mapping" />

      {/* Add Button with Count Badge */}
      <View style={styles.addWrapper}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {getStateCount()} States •{' '}
            {Object.values(data).reduce(
              (acc, districts) => acc + Object.keys(districts).length,
              0
            )}{' '}
            Districts
          </Text>
        </View>
        {canManage && (
          <TouchableOpacity style={styles.addBtn} onPress={handleAddTerritory}>
            <Text style={styles.addText}>+ Add Territory</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Manage state, district, taluk, and beat assignments
          </Text>

          {Object.keys(data).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No territories configured</Text>
              <Text style={styles.emptySubtitle}>
                Add states, districts, and taluks
              </Text>
              {canManage && (
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={handleAddTerritory}
                >
                  <Text style={styles.emptyBtnText}>+ Add Territory</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            Object.keys(data).map((stateName) => (
              <View key={stateName} style={styles.card}>
                {/* STATE */}
                <View style={styles.stateRow}>
                  <TouchableOpacity
                    onPress={() => toggleState(stateName)}
                    style={styles.chevIcon}
                  >
                    {expandedState === stateName ? (
                      <ChevronDown size={22} color={'#D32F2F'} />
                    ) : (
                      <ChevronRight size={22} color={'#D32F2F'} />
                    )}
                    <Text style={styles.stateText}>{stateName}</Text>
                    <Text style={styles.countBadge}>
                      {getDistrictCount(stateName)} districts
                    </Text>
                  </TouchableOpacity>

                  {canManage && (
                    <TouchableOpacity
                      onPress={() => handleDeleteClick('state', stateName)}
                    >
                      <Trash2 size={20} color="red" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* DISTRICTS */}
                {expandedState === stateName &&
                  Object.keys(data[stateName]).map((district) => (
                    <View key={district} style={styles.districtContainer}>
                      <View style={styles.districtRow}>
                        <TouchableOpacity
                          onPress={() => toggleDistrict(district)}
                          style={styles.chevIcon}
                        >
                          {expandedDistrict === district ? (
                            <ChevronDown size={20} color={'#D32F2F'} />
                          ) : (
                            <ChevronRight size={20} color={'#D32F2F'} />
                          )}
                          <Text style={styles.districtText}>{district}</Text>
                          <Text style={styles.countBadgeSmall}>
                            {getTalukCount(stateName, district)} taluks
                          </Text>
                        </TouchableOpacity>

                        {canManage && (
                          <TouchableOpacity
                            onPress={() =>
                              handleDeleteClick('district', {
                                state: stateName,
                                district,
                              })
                            }
                          >
                            <Trash2 size={18} color="red" />
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* TALUKS */}
                      {expandedDistrict === district &&
                        data[stateName][district].map((item, index) => (
                          <View
                            key={item._id || index}
                            style={styles.talukCard}
                          >
                            <View style={styles.talukHeader}>
                              <Text style={styles.talukName}>
                                {item.taluk || 'N/A'}
                              </Text>
                              {canManage && (
                                <View style={styles.talukActions}>
                                  <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={() =>
                                      handleEditTerritory({
                                        ...item,
                                        state: stateName,
                                        district: district,
                                      })
                                    }
                                  >
                                    <SquarePen size={20} color="red" />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleDeleteClick('taluk', item._id)
                                    }
                                  >
                                    <Trash2 size={20} color="red" />
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>

                            {/* ASSIGNMENT */}
                            {item.assignedTo ? (
                              <View style={styles.assignedContainer}>
                                <UserCheck size={14} color="#027A48" />
                                <Text style={styles.assigned}>
                                  Assigned: {item.assignedTo}
                                </Text>
                              </View>
                            ) : (
                              <View style={styles.unassignedContainer}>
                                <UserX size={14} color="#D32F2F" />
                                <Text style={styles.unassigned}>Unassigned</Text>
                              </View>
                            )}

                            {/* BEATS */}
                            <View style={styles.beatRow}>
                              {item.beats?.length > 0 ? (
                                item.beats.map((beat, i) => (
                                  <View key={i} style={styles.beatChip}>
                                    <Text style={styles.beatText}>{beat}</Text>
                                  </View>
                                ))
                              ) : (
                                <Text style={styles.noBeat}>No Beats</Text>
                              )}
                            </View>

                            {/* ACTIONS */}
                            <View style={styles.actionRow}>
                              <TouchableOpacity
                                style={styles.assignBtn}
                                onPress={() =>
                                  openAssignModal({
                                    ...item,
                                    state: stateName,
                                    district: district,
                                  })
                                }
                              >
                                <Text style={styles.btnText}>Assign</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.secondaryBtn}
                                onPress={() =>
                                  openBeatModal({
                                    ...item,
                                    state: stateName,
                                    district: district,
                                  })
                                }
                              >
                                <Text style={styles.secondaryText}>
                                  Add Beat
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                    </View>
                  ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* ─── ASSIGN MODAL ────────────────────────────────────────────── */}
      <Modal visible={showAssignModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Assign FSE</Text>
            <Text style={styles.modalSubtitle}>
              {assignTarget?.taluk} - {assignTarget?.district}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Assigned Person Name / ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter FSE name or ID"
                placeholderTextColor="#888"
                value={assignName}
                onChangeText={setAssignName}
                autoFocus
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowAssignModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.primaryModalBtn]}
                onPress={handleAssignSubmit}
                disabled={assignSaving}
              >
                {assignSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.primaryModalBtnText}>Assign</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── ADD BEAT MODAL ────────────────────────────────────────────── */}
      <Modal visible={showBeatModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Beat</Text>
            <Text style={styles.modalSubtitle}>
              {beatTarget?.taluk} - {beatTarget?.district}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Beat Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Market Area"
                placeholderTextColor="#888"
                value={beatName}
                onChangeText={setBeatName}
                autoFocus
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowBeatModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.primaryModalBtn]}
                onPress={handleBeatSubmit}
                disabled={beatSaving}
              >
                {beatSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.primaryModalBtnText}>Add Beat</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── EDIT TALUK MODAL ────────────────────────────────────────────── */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Taluk</Text>
            <Text style={styles.modalSubtitle}>
              {editTarget?.district} - {editTarget?.state}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Taluk Name *</Text>
              <TextInput
                style={styles.input}
                value={editTalukName}
                onChangeText={setEditTalukName}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Beats (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={editBeats}
                placeholderTextColor="#888"
                onChangeText={setEditBeats}
                placeholder="Beat 1, Beat 2, Beat 3"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.primaryModalBtn]}
                onPress={handleEditSubmit}
                disabled={editSaving}
              >
                {editSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.primaryModalBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── DELETE CONFIRMATION MODAL ────────────────────────────────────── */}
      <PopupModal
        visible={showDeleteModal}
        title="Delete Territory"
        description={getDeleteMessage()}
        buttonText="Delete"
        secondaryText="Cancel"
        onPress={confirmDelete}
        onSecondaryPress={() => setShowDeleteModal(false)}
        variant="danger"
      />
    </View>
  );
};

export default TerritoryMappingScreen;


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchTerritory,
//   deleteTaluk,
//   deleteState,
//   deleteDistrict,
// } from '../../services/features/Territory/TerritorySlice';
// import styles from './TerritoryMappingStyle';
// import Header from '../../components/Header';
// import PopupModal from '../../components/PopupModal';
// import {
//   ChevronRight,
//   ChevronDown,
//   Trash2,
//   SquarePen,
// } from 'lucide-react-native';

// const TerritoryMappingScreen = ({ navigation }) => {
//   const dispatch = useDispatch();

//   const { data } = useSelector(state => state.territory);
//   const [expandedState, setExpandedState] = useState(null);
//   const [expandedDistrict, setExpandedDistrict] = useState(null);

//   // ✅ DELETE MODAL STATES
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteType, setDeleteType] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);

//   useEffect(() => {
//     dispatch(fetchTerritory());
//   }, [dispatch]);

//   const toggleState = state => {
//     setExpandedState(expandedState === state ? null : state);
//     setExpandedDistrict(null);
//   };

//   const toggleDistrict = district => {
//     setExpandedDistrict(expandedDistrict === district ? null : district);
//   };

//   const handleAddTerritory = () => {
//     navigation.navigate('AddTerritory');
//   };

//   const handleEditTerritory = item => {
//     navigation.navigate('EditTerritory', {
//       territory: item,
//     }); 
//   };

//   // OPEN DELETE MODAL
//   const handleDeleteClick = (type, payload) => {
//     setDeleteType(type);
//     setSelectedItem(payload);
//     setShowDeleteModal(true);
//   };

//   // CONFIRM DELETE
//   const confirmDelete = () => {
//     if (deleteType === 'state') {
//       dispatch(deleteState(selectedItem));
//     } else if (deleteType === 'district') {
//       dispatch(deleteDistrict(selectedItem));
//     } else if (deleteType === 'taluk') {
//       dispatch(deleteTaluk(selectedItem));
//     }

//     setShowDeleteModal(false);
//     setSelectedItem(null);
//     setDeleteType(null);
//   };

//   // OPTIONAL: Dynamic message
//   const getDeleteMessage = () => {
//     if (deleteType === 'state') return 'Delete this state and all its data?';
//     if (deleteType === 'district') return 'Delete this district?';
//     if (deleteType === 'taluk') return 'Delete this taluk?';
//     return 'Are you sure you want to delete?';
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Territory Mapping" />
//       {/* ADD BUTTON */}
//       <View style={styles.addWrapper}>
//         <TouchableOpacity style={styles.addBtn} onPress={handleAddTerritory}>
//           <Text style={styles.addText}>+ Add Territory</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView>
//         {/* <Text style={styles.title}>Territory Mapping</Text> */}
//         <View style={styles.content}>
//           <Text style={styles.subtitle}>
//             Manage state, district, taluk, and beat assignments
//           </Text>

//           {Object.keys(data).map(stateName => (
//             <View key={stateName} style={styles.card}>
//               {/* STATE */}
//               <View style={styles.stateRow}>
//                 <TouchableOpacity
//                   onPress={() => toggleState(stateName)}
//                   style={styles.chevIcon}
//                 >
//                   {expandedState === stateName ? (
//                     <ChevronRight size={22} color={'#D32F2F'} />
//                   ) : (
//                     <ChevronDown size={22} color={'#D32F2F'} />
//                   )}
//                   <Text style={styles.stateText}>{stateName}</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => handleDeleteClick('state', stateName)}
//                 >
//                   <Trash2 size={20} color="red" />
//                 </TouchableOpacity>
//               </View>

//               {/* DISTRICTS */}
//               {expandedState === stateName &&
//                 Object.keys(data[stateName]).map(district => (
//                   <View key={district} style={styles.districtContainer}>
//                     <View style={styles.districtRow}>
//                       <TouchableOpacity
//                         onPress={() => toggleDistrict(district)}
//                         style={styles.chevIcon}
//                       >
//                         {expandedDistrict === district ? (
//                           <ChevronRight size={22} color={'#D32F2F'} />
//                         ) : (
//                           <ChevronDown size={22} color={'#D32F2F'} />
//                         )}
//                         <Text style={styles.districtText}>{district}</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         onPress={() =>
//                           handleDeleteClick('district', {
//                             state: stateName,
//                             district,
//                           })
//                         }
//                       >
//                         <Trash2 size={18} color="red" />
//                       </TouchableOpacity>
//                     </View>

//                     {/* TALUKS */}
//                     {expandedDistrict === district &&
//                       data[stateName][district].map((item, index) => (
//                         <View key={index} style={styles.talukCard}>
//                           <Text style={styles.talukName}>
//                             {item.taluk || 'N/A'}
//                           </Text>

//                           {/* TOP */}
//                           <View style={styles.talukRow}>
//                             {/* <Text style={styles.talukName}>{item.taluk}</Text> */}
//                             {/* EDIT */}
//                             <TouchableOpacity
//                               style={styles.editBtn}
//                               onPress={() => handleEditTerritory({
//                                   ...item,
//                                   state: stateName,
//                                   district: district,
//                                 })}
//                             >
//                               {/* <Text style={styles.editText}>Edit</Text> */}
//                               <SquarePen size={22} color="red" />
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                               onPress={() =>
//                                 handleDeleteClick('taluk', item._id)
//                               }
//                             >
//                               <Trash2 size={22} color="red" />
//                             </TouchableOpacity>
//                           </View>

//                           {/* ASSIGNMENT */}
//                           {item.assignedTo ? (
//                             <Text style={styles.assigned}>
//                               Assigned: {item.assignedTo}
//                             </Text>
//                           ) : (
//                             <Text style={styles.unassigned}>Unassigned</Text>
//                           )}

//                           {/* BEATS */}
//                           <View style={styles.beatRow}>
//                             {item.beats?.length > 0 ? (
//                               item.beats.map((beat, i) => (
//                                 <View key={i} style={styles.beatChip}>
//                                   <Text style={styles.beatText}>{beat}</Text>
//                                 </View>
//                               ))
//                             ) : (
//                               <Text style={styles.noBeat}>No Beats</Text>
//                             )}
//                           </View>

//                           {/* ACTIONS */}
//                           <View style={styles.actionRow}>
//                             <TouchableOpacity style={styles.assignBtn}>
//                               <Text style={styles.btnText}>Assign</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.secondaryBtn}>
//                               <Text style={styles.secondaryText}>Add Beat</Text>
//                             </TouchableOpacity>
//                           </View>
//                         </View>
//                       ))}
//                   </View>
//                 ))}
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       {/* ✅ DELETE CONFIRMATION MODAL */}
//       <PopupModal
//         visible={showDeleteModal}
//         title="Delete Territory"
//         description={getDeleteMessage()}
//         buttonText="Delete"
//         secondaryText="Cancel"
//         onPress={confirmDelete}
//         onSecondaryPress={() => setShowDeleteModal(false)}
//       />
//     </View>
//   );
// };

// export default TerritoryMappingScreen;
