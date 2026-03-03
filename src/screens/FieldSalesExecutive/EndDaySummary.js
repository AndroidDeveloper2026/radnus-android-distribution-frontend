import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
import { stopTracking } from '../../redux/trackingSlice';
import API from '../../services/API/api';

const EndDaySummary = ({ navigation }) => {

  const dispatch = useDispatch();
  const { sessionId } = useSelector(state => state.tracking);


  const submitEndDay = async () => {
  try {
    await API.post('/api/session/end', {
      sessionId,
    });

    dispatch(stopTracking()); 

    alert('End Day Submitted');
    navigation.navigate('Dashboard');
  } catch (err) {
    alert('Error');
  }
};

  return (
    <View style={styles.container}>
      <Header title="End Day Summary" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* SUMMARY CARDS */}
        {/* <View style={styles.grid}>
          <SummaryCard
            icon={<ShoppingCart size={20} color="#D32F2F" />}
            label="Orders"
            value={summary.orders}
          />

          <SummaryCard
            icon={<IndianRupee size={20} color="#2E7D32" />}
            label="Sales"
            value={`₹${summary.sales.toLocaleString()}`}
          />

          <SummaryCard
            icon={<Wallet size={20} color="#1976D2" />}
            label="Collections"
            value={`₹${summary.collections.toLocaleString()}`}
          />

          <SummaryCard
            icon={<MapPin size={20} color="#F57C00" />}
            label="Visits"
            value={summary.visits}
          />
        </View> */}

        {/* NOTES */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Remarks (Optional)</Text>
          <Text style={styles.note}>
            All data is auto-captured from today’s activity. Once submitted,
            this day will be locked.
          </Text>
        </View>

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submitBtn} onPress={submitEndDay}>
          <CheckCircle size={18} color="#FFF" />
          <Text style={styles.submitText}>Submit End Day</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// const SummaryCard = ({ icon, label, value }) => (
//   <View style={styles.summaryCard}>
//     <View style={styles.iconCircle}>{icon}</View>
//     <Text style={styles.value}>{value}</Text>
//     <Text style={styles.label}>{label}</Text>
//   </View>
// );

export default EndDaySummary;
