import { StyleSheet } from 'react-native';

const RED = '#D32F2F';
// const GREEN = "#2E7D32";
// const GRAY = "#777";
const LIGHT_BG = '#F6F6F6';

const ProductMasterStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  addWrapper: {
    flexDirection: 'row',
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RED,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },

  list: {
    padding: 16,
  },

  searchWrapper: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    color: '#212121',
  },

  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 15,
    color: '#999',
  },
});

export default ProductMasterStyle;
