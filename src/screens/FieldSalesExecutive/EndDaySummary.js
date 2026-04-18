import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from './EndDaySummaryStyle';
import Header from '../../components/Header';
import {
  CheckCircle,
  Clock,
  Lock,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { stopTracking } from '../../services/features/fse/trackingSlice';
import API from '../../services/API/api';
import { stopTrackingService } from '../../utils/TrackingService';
import { clearSessionId } from '../../services/AuthStorage/authStorgage';

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
      // ✅ FIX: End session on backend FIRST before stopping tracking service
      //         so that if API fails, tracking is still running and user can retry
      await API.post('/api/session/end', { sessionId });


      // ✅ Stop GPS tracking service AFTER successful API call
      stopTrackingService();

      // ✅ Clear AsyncStorage session
      await clearSessionId();

      // ✅ Clear Redux
      dispatch(stopTracking());

      // ✅ Show success message
      Alert.alert('Success', 'Your day has been ended successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.replace('MainTabs', {
              role: 'FSE',
            });
          },
        },
      ]);
    } catch (err) {
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
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Day', style: 'destructive', onPress: submitEndDay },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Header title="End Day Summary" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* NOTES SECTION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>End of Day</Text>

          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}>
              <CheckCircle
                size={16}
                color="#16A34A"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.note}>
                All data has been auto-captured from today's activity.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}>
              <Clock size={16} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={styles.note}>
                Your location tracking will be stopped.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Lock size={16} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.note}>
                Once submitted, this day will be locked and cannot be modified.
              </Text>
            </View>
          </View>
        </View>

        {/* EMPTY SPACE */}
        <View style={{ flex: 1 }} />

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}>
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