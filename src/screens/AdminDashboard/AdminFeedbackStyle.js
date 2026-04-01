import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
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
