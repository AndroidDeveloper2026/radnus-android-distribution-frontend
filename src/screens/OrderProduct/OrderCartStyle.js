import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#F4F5F7',
  },

  header: {
    height: 56,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  content: {
    paddingHorizontal: 16,
    // paddingBottom: 120,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
  },

  infoContainer: {
    flex: 1,
    paddingLeft: 10,
    // borderWidth: 1,
  },

  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },

  sku: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D32F2F',
  },

  qtyBox: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent:'flex-end',
    alignItems: 'center',
    gap: 8,
    // paddingRight: 8,
  },

  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 10,
  },

  moqText: {
    fontSize: 12,
    color: '#388E3C',
    marginTop: 6,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  totalLabel: {
    fontSize: 15,
    color: '#212121',
    fontWeight: '600',
  },

  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D32F2F',
  },

  placeOrderBtn: {
    height: 46,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom:10,
    backgroundColor: '#fff',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#1a1a1a',
    padding: 0,
  },
  resultCount: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
    marginLeft: 4,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
  },
  // Price selector styles
priceSelectorRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: '#fff',
  paddingVertical: 8,
  paddingHorizontal: 16,
  marginTop: 8,
  marginHorizontal: 16,
  borderRadius: 30,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
},
priceOption: {
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 20,
  backgroundColor: '#f5f5f5',
},
priceOptionActive: {
  backgroundColor: '#D32F2F',
},
priceOptionText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#444',
},
priceOptionTextActive: {
  color: '#fff',
},

});

export default styles;
