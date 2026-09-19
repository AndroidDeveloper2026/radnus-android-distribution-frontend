// CartReviewStyle.js
import { StyleSheet } from 'react-native';

const ACCENT = '#D32F2F';
const WHITE = '#FFFFFF';
const BG = '#F5F5F5';
const GREY = '#666';
const BORDER = '#E5E7EB';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  listContent: {
    padding: 14,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },

  // ── Top section: image + info + remove ──
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  imageBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },

  image: {
    width: 64,
    height: 64,
  },

  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
    gap: 5,
    paddingTop: 1,
  },

  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 19,
  },

  meta: {
    fontSize: 12,
    color: GREY,
  },

  unitPrice: {
    fontSize: 12.5,
    color: ACCENT,
    fontWeight: '700',
    marginTop: 1,
  },

  unitPriceSuffix: {
    fontSize: 11,
    fontWeight: '500',
    color: GREY,
  },

  removeBtn: {
    padding: 4,
    marginLeft: 4,
  },

  // ── Divider between info and quantity/price ──
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginTop: 14,
    marginBottom: 12,
  },

  // ── Bottom section: quantity stepper (left) + subtotal (right) ──
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },

  stepBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepQty: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
  },

  subtotalBlock: {
    alignItems: 'flex-end',
  },

  subtotalLabel: {
    fontSize: 10.5,
    color: GREY,
    marginBottom: 2,
  },

  subtotal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
  },

  // ── "Add more items" footer prompt (fills empty space in small carts) ──
  addMoreBtn: {
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  addMoreBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT,
  },

  // ── Footer ──
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ACCENT,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  footerLabel: {
    fontSize: 11,
    color: WHITE,
    opacity: 0.85,
  },

  footerTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: WHITE,
  },

  placeBtn: {
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 140,
    alignItems: 'center',
    elevation: 3,
  },

  placeBtnText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '800',
  },

  // ── Empty state ──
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 8,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginTop: 6,
  },

  emptyText: {
    fontSize: 13,
    color: GREY,
    textAlign: 'center',
  },

  browseBtn: {
    marginTop: 14,
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },

  browseBtnText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '800',
  },
});

export default styles;

//----------------- 02.09.2026 ---------------------
// // CartReviewStyle.js
// import { StyleSheet } from 'react-native';

// const ACCENT = '#D32F2F';
// const WHITE = '#FFFFFF';
// const BG = '#F5F5F5';
// const GREY = '#666';
// const BORDER = '#E5E7EB';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: BG,
//   },

//   listContent: {
//     padding: 12,
//     paddingBottom: 24,
//   },

//   card: {
//     flexDirection: 'row',
//     backgroundColor: WHITE,
//     borderRadius: 12,
//     padding: 10,
//     marginBottom: 10,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.06,
//     shadowRadius: 3,
//     gap: 10,
//   },

//   imageBox: {
//     width: 56,
//     height: 56,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },

//   image: {
//     width: 56,
//     height: 56,
//   },

//   imagePlaceholder: {
//     width: 56,
//     height: 56,
//     borderRadius: 10,
//     backgroundColor: '#F5F5F5',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   info: {
//     flex: 1,
//     gap: 3,
//   },

//   name: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#212121',
//     lineHeight: 18,
//   },

//   meta: {
//     fontSize: 11,
//     color: GREY,
//   },

//   unitPrice: {
//     fontSize: 11,
//     color: ACCENT,
//     fontWeight: '700',
//   },

//   rightCol: {
//     alignItems: 'flex-end',
//     justifyContent: 'space-between',
//   },

//   removeBtn: {
//     padding: 2,
//   },

//   stepper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: BORDER,
//   },

//   stepBtn: {
//     width: 26,
//     height: 26,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   stepQty: {
//     minWidth: 22,
//     textAlign: 'center',
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#212121',
//   },

//   subtotal: {
//     fontSize: 14,
//     fontWeight: '800',
//     color: '#212121',
//   },

//   // ── Footer ──
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: ACCENT,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     elevation: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//   },

//   footerLabel: {
//     fontSize: 11,
//     color: WHITE,
//     opacity: 0.85,
//   },

//   footerTotal: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: WHITE,
//   },

//   placeBtn: {
//     backgroundColor: WHITE,
//     borderRadius: 10,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     minWidth: 140,
//     alignItems: 'center',
//     elevation: 3,
//   },

//   placeBtnText: {
//     color: ACCENT,
//     fontSize: 14,
//     fontWeight: '800',
//   },

//   // ── Empty state ──
//   emptyContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 30,
//     gap: 8,
//   },

//   emptyTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#212121',
//     marginTop: 6,
//   },

//   emptyText: {
//     fontSize: 13,
//     color: GREY,
//     textAlign: 'center',
//   },

//   browseBtn: {
//     marginTop: 14,
//     backgroundColor: ACCENT,
//     borderRadius: 10,
//     paddingHorizontal: 22,
//     paddingVertical: 12,
//   },

//   browseBtnText: {
//     color: WHITE,
//     fontSize: 13,
//     fontWeight: '800',
//   },
// });

// export default styles;
