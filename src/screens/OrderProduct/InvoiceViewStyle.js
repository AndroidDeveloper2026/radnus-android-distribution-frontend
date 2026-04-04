import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  label: {
    fontSize: 14,
    color: '#777',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },

  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  itemName: {
    fontSize: 14,
    flex: 1,
    color: '#333',
  },

  itemText: {
    fontSize: 13,
    color: '#555',
    width: 70,
    textAlign: 'right',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
