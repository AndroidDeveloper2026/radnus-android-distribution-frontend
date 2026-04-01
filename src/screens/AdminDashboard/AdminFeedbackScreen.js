import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeedbacks,
  updateFeedbackStatus,
} from '../../services/features/retailer/feedbackSlice';
import styles from './AdminFeedbackStyle';
import Header from '../../components/Header';

const AdminFeedbackScreen = () => {
  const dispatch = useDispatch();
  const feedbacks = useSelector(s => s.feedback.list);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.message}>{item.message}</Text>

      <Text style={styles.meta}>
        {item.user} • {item.phone}
      </Text>

      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>

      <View style={styles.row}>
        <Text
          style={[
            styles.status,
            item.status === 'PENDING' ? styles.pending : styles.resolved,
          ]}
        >
          {item.status}
        </Text>

        {item.status === 'PENDING' && (
          <TouchableOpacity
            onPress={() => updateFeedbackStatus(item.id, 'RESOLVED')}
          >
            <Text style={styles.resolveBtn}>Mark Resolved</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Feedback " />

      <FlatList
        data={feedbacks}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50 }}>
            No feedback yet
          </Text>
        }
      />
    </View>
  );
};

export default AdminFeedbackScreen;
