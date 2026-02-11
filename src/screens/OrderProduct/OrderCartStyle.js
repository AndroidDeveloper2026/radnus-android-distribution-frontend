import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 16,
    paddingBottom: 120,
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
    bottom: 40,
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
});

export default styles;
