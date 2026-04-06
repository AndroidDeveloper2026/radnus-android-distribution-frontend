// import React, { useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchFeedbacks,
//   updateFeedbackStatus,
// } from '../../services/features/retailer/feedbackSlice';
// import styles from './AdminFeedbackStyle';
// import Header from '../../components/Header';

// const AdminFeedbackScreen = () => {
//   const dispatch = useDispatch();
//   const feedbacks = useSelector(s => s.feedback.list);

//   useEffect(() => {
//     dispatch(fetchFeedbacks());
//   }, []);

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.message}>{item.message}</Text>

//       <Text style={styles.meta}>
//         {item.user} • {item.phone}
//       </Text>

//       <Text style={styles.date}>
//         {new Date(item.createdAt).toLocaleString()}
//       </Text>

//       <View style={styles.row}>
//         <Text
//           style={[
//             styles.status,
//             item.status === 'PENDING' ? styles.pending : styles.resolved,
//           ]}
//         >
//           {item.status}
//         </Text>

//         {item.status === 'PENDING' && (
//           <TouchableOpacity
//             onPress={() => updateFeedbackStatus(item.id, 'RESOLVED')}
//           >
//             <Text style={styles.resolveBtn}>Mark Resolved</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Header title="Feedback " />

//       <FlatList
//         data={feedbacks}
//         keyExtractor={item => item._id}
//         renderItem={renderItem}
//         contentContainerStyle={{ padding: 16 }}
//         ListEmptyComponent={
//           <Text style={{ textAlign: 'center', marginTop: 50 }}>
//             No feedback yet
//           </Text>
//         }
//       />
//     </View>
//   );
// };

// export default AdminFeedbackScreen;


import React, { useEffect, useState, useMemo } from 'react';
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
  const feedbacks = useSelector((state) => state.feedback.list);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'week', 'month'

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  // Filter feedbacks based on selected tab
  const filteredFeedbacks = useMemo(() => {
    if (!feedbacks) return [];

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    switch (activeTab) {
      case 'week': {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return feedbacks.filter((item) => new Date(item.createdAt) >= weekAgo);
      }
      case 'month': {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        return feedbacks.filter((item) => new Date(item.createdAt) >= monthAgo);
      }
      default:
        return feedbacks;
    }
  }, [feedbacks, activeTab]);

  const handleResolve = (feedbackId) => {
    dispatch(updateFeedbackStatus({ id: feedbackId, status: 'RESOLVED' }));
  };

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
          <TouchableOpacity onPress={() => handleResolve(item._id)}>
            <Text style={styles.resolveBtn}>Mark Resolved</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Feedback" />

      {/* Tab Menu Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'week' && styles.activeTab]}
          onPress={() => setActiveTab('week')}
        >
          <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'month' && styles.activeTab]}
          onPress={() => setActiveTab('month')}
        >
          <Text style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}>
            Month
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredFeedbacks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50 }}>
            No feedback in this period
          </Text>
        }
      />
    </View>
  );
};

export default AdminFeedbackScreen;