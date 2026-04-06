import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Tab bar styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 30,
  },
  activeTab: {
    backgroundColor: '#D32F2F', // active tab background
  },
  tabText: {
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },

  // Card styles
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },

  message: {
    fontSize: 14,
    fontWeight: '500',
  },

  meta: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  date: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },

  status: {
    fontSize: 11,
    fontWeight: '700',
  },

  pending: {
    color: '#E65100',
  },

  resolved: {
    color: '#2E7D32',
  },

  resolveBtn: {
    color: '#D32F2F',
    fontWeight: '600',
  },
});