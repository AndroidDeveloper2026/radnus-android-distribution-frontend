import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Clock, CheckCircle2, XCircle } from 'lucide-react-native';

const ApprovalStatusCards = ({
  pending = 0,
  approved = 0,
  rejected = 0,
  loading = false,
  error = null,
  onPress,
}) => {
  const items = [
    {
      key: 'pending',
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: '#F59E0B',
      bg: '#FEF3C7',
    },
    {
      key: 'approved',
      label: 'Approved',
      value: approved,
      icon: CheckCircle2,
      color: '#10B981',
      bg: '#D1FAE5',
    },
    {
      key: 'rejected',
      label: 'Rejected',
      value: rejected,
      icon: XCircle,
      color: '#EF4444',
      bg: '#FEE2E2',
    },
  ];

  return (
    <View>
      <View style={styles.row}>
        {items.map(item => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => onPress && onPress(item.key)}
            >
              <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                <IconComponent size={20} color={item.color} strokeWidth={2} />
              </View>
              {loading ? (
                <ActivityIndicator size="small" color={item.color} style={styles.value} />
              ) : (
                <Text style={[styles.value, { color: item.color }]}>{item.value}</Text>
              )}
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default ApprovalStatusCards;
