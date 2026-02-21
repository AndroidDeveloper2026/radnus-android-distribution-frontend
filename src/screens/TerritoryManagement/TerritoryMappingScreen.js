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
import { ChevronRight, ChevronDown, Trash2 } from 'lucide-react-native';

const TerritoryMappingScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { data } = useSelector(state => state.territory);
  //   console.log('-- territory mapping (data) ---',data)
  const [expandedState, setExpandedState] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);

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
                  onPress={() => dispatch(deleteState(stateName))}
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
                          dispatch(
                            deleteDistrict({ state: stateName, district }),
                          )
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
                              onPress={() => handleEditTerritory(item)}
                            >
                              {/* <Text style={styles.editText}>Edit</Text> */}
                              <Trash2 size={22} color="red" />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => dispatch(deleteTaluk(item._id))}
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
    </View>
  );
};

export default TerritoryMappingScreen;
