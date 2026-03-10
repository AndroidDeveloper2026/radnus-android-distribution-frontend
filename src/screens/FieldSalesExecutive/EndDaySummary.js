import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from './EndDaySummaryStyle';
import Header from '../../components/Header';
import {
  ShoppingCart,
  IndianRupee,
  Wallet,
  MapPin,
  CheckCircle,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { stopTracking } from '../../services/features/fse/trackingSlice';
import API from '../../services/API/api';
import { stopTrackingService } from '../../utils/TrackingService';

const EndDaySummary = ({ navigation }) => {

  const dispatch = useDispatch();
  const { sessionId } = useSelector(state => state.tracking);
  const [submitting, setSubmitting] = useState(false);

  // ✅ SUBMIT END DAY
  const submitEndDay = async () => {
    
    if (!sessionId) {
      Alert.alert('Error', 'Session ID not found');
      return;
    }

    setSubmitting(true);

    try {
      // ✅ Stop GPS tracking service
      stopTrackingService();

      // ✅ Update session status to ENDED
      await API.post("/api/session/end", {
        sessionId
      });

      console.log('✅ End day submitted for session:', sessionId);

      // ✅ Clear Redux tracking state
      dispatch(stopTracking());

      // ✅ Show success message
      Alert.alert(
        'Success',
        'Your day has been ended successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // ✅ Navigate back to home
              navigation.replace("MainTabs", {
                role: "FSE",
              });
            }
          }
        ]
      );

    } catch (err) {
      console.log('❌ End day error:', err);
      Alert.alert('Error', 'Failed to end day. Please try again.');
      setSubmitting(false);
    }
  };

  // ✅ CONFIRM BEFORE ENDING
  const handleSubmit = () => {
    Alert.alert(
      'End Day',
      'Are you sure you want to end your day? All tracking will be stopped.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'End Day',
          style: 'destructive',
          onPress: submitEndDay
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="End Day Summary" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        
        {/* NOTES SECTION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>End of Day</Text>
          <Text style={styles.note}>
            ✅ All data has been auto-captured from today's activity.
            {'\n'}
            ⏱️ Your location tracking will be stopped.
            {'\n'}
            🔒 Once submitted, this day will be locked and cannot be modified.
          </Text>
        </View>

        {/* EMPTY SPACE */}
        <View style={{ flex: 1 }} />

        {/* SUBMIT BUTTON */}
        <TouchableOpacity 
          style={[
            styles.submitBtn,
            submitting && styles.submitBtnDisabled
          ]} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          <CheckCircle size={18} color="#FFF" />
          <Text style={styles.submitText}>
            {submitting ? 'Submitting...' : 'Submit End Day'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default EndDaySummary;
