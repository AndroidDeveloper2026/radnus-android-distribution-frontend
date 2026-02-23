import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTerritory,
  deleteTaluk,
  deleteState,
  deleteDistrict,
} from '../../services/features/Territory/TerritorySlice';
import styles from './TerritoryMappingStyle';
import Header from '../../components/Header';
import PopupModal from '../../components/PopupModal';
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  SquarePen,
} from 'lucide-react-native';

const TerritoryMappingScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { data } = useSelector(state => state.territory);
  const [expandedState, setExpandedState] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);

  // ✅ DELETE MODAL STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchTerritory());
  }, [dispatch]);

  const toggleState = state => {
    setExpandedState(expandedState === state ? null : state);
    setExpandedDistrict(null);
  };

  const toggleDistrict = district => {
    setExpandedDistrict(expandedDistrict === district ? null : district);
  };

  const handleAddTerritory = () => {
    navigation.navigate('AddTerritory');
  };

  const handleEditTerritory = item => {
    navigation.navigate('EditTerritory', {
      territory: item,
    }); 
  };

  // OPEN DELETE MODAL
  const handleDeleteClick = (type, payload) => {
    setDeleteType(type);
    setSelectedItem(payload);
    setShowDeleteModal(true);
  };

  // CONFIRM DELETE
  const confirmDelete = () => {
    if (deleteType === 'state') {
      dispatch(deleteState(selectedItem));
    } else if (deleteType === 'district') {
      dispatch(deleteDistrict(selectedItem));
    } else if (deleteType === 'taluk') {
      dispatch(deleteTaluk(selectedItem));
    }

    setShowDeleteModal(false);
    setSelectedItem(null);
    setDeleteType(null);
  };

  // OPTIONAL: Dynamic message
  const getDeleteMessage = () => {
    if (deleteType === 'state') return 'Delete this state and all its data?';
    if (deleteType === 'district') return 'Delete this district?';
    if (deleteType === 'taluk') return 'Delete this taluk?';
    return 'Are you sure you want to delete?';
  };

  return (
    <View style={styles.container}>
      <Header title="Territory Mapping" />
      {/* ADD BUTTON */}
      <View style={styles.addWrapper}>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddTerritory}>
          <Text style={styles.addText}>+ Add Territory</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* <Text style={styles.title}>Territory Mapping</Text> */}
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Manage state, district, taluk, and beat assignments
          </Text>

          {Object.keys(data).map(stateName => (
            <View key={stateName} style={styles.card}>
              {/* STATE */}
              <View style={styles.stateRow}>
                <TouchableOpacity
                  onPress={() => toggleState(stateName)}
                  style={styles.chevIcon}
                >
                  {expandedState === stateName ? (
                    <ChevronRight size={22} color={'#D32F2F'} />
                  ) : (
                    <ChevronDown size={22} color={'#D32F2F'} />
                  )}
                  <Text style={styles.stateText}>{stateName}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteClick('state', stateName)}
                >
                  <Trash2 size={20} color="red" />
                </TouchableOpacity>
              </View>

              {/* DISTRICTS */}
              {expandedState === stateName &&
                Object.keys(data[stateName]).map(district => (
                  <View key={district} style={styles.districtContainer}>
                    <View style={styles.districtRow}>
                      <TouchableOpacity
                        onPress={() => toggleDistrict(district)}
                        style={styles.chevIcon}
                      >
                        {expandedDistrict === district ? (
                          <ChevronRight size={22} color={'#D32F2F'} />
                        ) : (
                          <ChevronDown size={22} color={'#D32F2F'} />
                        )}
                        <Text style={styles.districtText}>{district}</Text>
                      </TouchableOpacity>

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
                    </View>

                    {/* TALUKS */}
                    {expandedDistrict === district &&
                      data[stateName][district].map((item, index) => (
                        <View key={index} style={styles.talukCard}>
                          <Text style={styles.talukName}>
                            {item.taluk || 'N/A'}
                          </Text>

                          {/* TOP */}
                          <View style={styles.talukRow}>
                            {/* <Text style={styles.talukName}>{item.taluk}</Text> */}
                            {/* EDIT */}
                            <TouchableOpacity
                              style={styles.editBtn}
                              onPress={() => handleEditTerritory({
                                  ...item,
                                  state: stateName,
                                  district: district,
                                })}
                            >
                              {/* <Text style={styles.editText}>Edit</Text> */}
                              <SquarePen size={22} color="red" />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() =>
                                handleDeleteClick('taluk', item._id)
                              }
                            >
                              <Trash2 size={22} color="red" />
                            </TouchableOpacity>
                          </View>

                          {/* ASSIGNMENT */}
                          {item.assignedTo ? (
                            <Text style={styles.assigned}>
                              Assigned: {item.assignedTo}
                            </Text>
                          ) : (
                            <Text style={styles.unassigned}>Unassigned</Text>
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
                            <TouchableOpacity style={styles.assignBtn}>
                              <Text style={styles.btnText}>Assign</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.secondaryBtn}>
                              <Text style={styles.secondaryText}>Add Beat</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                  </View>
                ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ✅ DELETE CONFIRMATION MODAL */}
      <PopupModal
        visible={showDeleteModal}
        title="Delete Territory"
        description={getDeleteMessage()}
        buttonText="Delete"
        secondaryText="Cancel"
        onPress={confirmDelete}
        onSecondaryPress={() => setShowDeleteModal(false)}
      />
    </View>
  );
};

export default TerritoryMappingScreen;
