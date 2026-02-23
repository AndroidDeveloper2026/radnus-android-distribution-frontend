import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#F3F4F6',
  },

  searchRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    // elevation: 2,
  },

  searchInput: {
    marginLeft: 8,
    fontSize: 13,
    flex: 1,
  },

  filterBtn: {
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    // elevation: 2,
  },

  list: {
    // backgroundColor:'black',
    paddingHorizontal: 12,
    paddingVertical:10,
    paddingBottom: 30,
  },

  row: {
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    // elevation: 2,
  },

  image: {
    // width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#EEE',
  },

  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
  },

  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D32F2F',
    marginTop: 4,
  },

  mrp: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
  },

  stock: {
    fontSize: 11,
    color: '#2E7D32',
    marginTop: 4,
  },

  outStock: {
    color: '#D32F2F',
  },

  moq: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },

  categoryContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#eee',
    borderRadius: 14,
    marginRight: 10,
  },

  activeTab: {
    backgroundColor: '#D32F2F',
  },

  categoryText: {
    fontSize: 13,
    color: '#333',
  },

  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
