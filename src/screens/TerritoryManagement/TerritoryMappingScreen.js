import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerritory } from '../../services/features/Territory/TerritorySlice';
import styles from './TerritoryMappingStyle';
import Header from '../../components/Header';

const TerritoryMappingScreen = () => {
  const dispatch = useDispatch();

  const { data } = useSelector(state => state.territory);
//   console.log('-- territory mapping (data) ---',data)
  const [expandedState, setExpandedState] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);

  useEffect(() => {
    dispatch(fetchTerritory());
  },[dispatch]);

  const toggleState = state => {
    setExpandedState(expandedState === state ? null : state);
    setExpandedDistrict(null);
  };

  const toggleDistrict = district => {
    setExpandedDistrict(expandedDistrict === district ? null : district);
  };

  return (
    <View style={styles.container}>
      <Header title="Territory Mapping" />
      <ScrollView>
        {/* <Text style={styles.title}>Territory Mapping</Text> */}
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Manage state, district, taluk, and beat assignments
          </Text>

          {Object.keys(data).map(stateName => (
            <View key={stateName} style={styles.card}>
              {/* STATE */}
              <TouchableOpacity onPress={() => toggleState(stateName)}>
                <Text style={styles.stateText}>▾ {stateName}</Text>
              </TouchableOpacity>

              {/* DISTRICTS */}
              {expandedState === stateName &&
                Object.keys(data[stateName]).map(district => (
                  <View key={district} style={styles.districtContainer}>
                    <TouchableOpacity onPress={() => toggleDistrict(district)}>
                      <Text style={styles.districtText}>▾ {district}</Text>
                    </TouchableOpacity>

                    {/* TALUKS */}
                    {expandedDistrict === district &&
                      data[stateName][district].map((item, index) => (
                        <View key={index} style={styles.talukCard}>
                          <Text style={styles.talukName}>
                            {item.taluk || 'N/A'}
                          </Text>

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
                            {item.beats?.map((beat, i) => (
                              <View key={i} style={styles.beatChip}>
                                <Text style={styles.beatText}>{beat}</Text>
                              </View>
                            ))}
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
