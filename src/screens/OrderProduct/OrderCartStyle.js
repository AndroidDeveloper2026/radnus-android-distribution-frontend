// OrderCartStyle.js
import { StyleSheet } from 'react-native';

const ACCENT = '#D32F2F';
const WHITE = '#FFFFFF';
const BG = '#F5F5F5';
const GREY = '#555';
const BORDER = '#E5E7EB';
const GREEN = '#2E7D32';

const styles = StyleSheet.create({
  // ── Container ──────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: BG,
  },

  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: GREY,
    marginTop: 12,
  },

  // ── Top Bar ──────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },

  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#212121',
    padding: 0,
  },

  catBtn: {
    backgroundColor: ACCENT,
    padding: 11,
    borderRadius: 12,
    elevation: 2,
  },

  categoryChipWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 6,
  },

  activeCatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    gap: 6,
  },

  activeCatChipText: {
    fontSize: 12,
    color: ACCENT,
    fontWeight: '700',
  },

  // ── Price Tab Bar ──────────────────────────────────────────────
  priceTabBar: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 6,
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    padding: 3,
  },

  priceTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  priceTabActive: {
    backgroundColor: ACCENT,
    elevation: 2,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  priceTabText: {
    fontSize: 12,
    color: GREY,
    fontWeight: '600',
  },

  priceTabTextActive: {
    color: WHITE,
    fontWeight: '800',
  },

  // ── Product Card ─────────────────────────────────────────────
  card: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  cardActive: {
    borderWidth: 1.5,
    borderColor: ACCENT,
    elevation: 3,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  // ── Image ─────────────────────────────────────────────────────
  imageBox: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
  },

  productImage: {
    width: 56,
    height: 56,
  },

  imagePlaceholder: {
    width: 56,
    height: 56,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Info Container ───────────────────────────────────────────
  infoContainer: {
    flex: 1,
    gap: 3,
  },

  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 18,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  metaText: {
    fontSize: 11,
    color: GREY,
  },

  // ── Price ────────────────────────────────────────────────────
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  price: {
    fontSize: 14,
    fontWeight: '800',
    color: ACCENT,
  },

  batchTag: {
    fontSize: 10,
    color: '#aaa',
    fontFamily: 'monospace',
  },

  defaultTag: {
    fontSize: 10,
    color: '#aaa',
  },

  priceEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },

  priceCurrency: {
    fontSize: 14,
    color: GREY,
  },

  priceInput: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: '#212121',
    backgroundColor: '#F9F9F9',
    flex: 1,
  },

  // ── Total Indicator ──────────────────────────────────────────
  totalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  totalIndicatorText: {
    fontSize: 11,
    color: '#1565C0',
    fontWeight: '600',
  },

  // ── Batch Selector ──────────────────────────────────────────
  batchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },

  batchSelectorText: {
    flex: 1,
    fontSize: 11,
    color: '#333',
    fontFamily: 'monospace',
  },

  availBadge: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },

  availBadgeText: {
    fontSize: 10,
    color: GREY,
    fontWeight: '600',
  },

  noBatchTag: {
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },

  noBatchText: {
    fontSize: 10,
    color: GREY,
    fontStyle: 'italic',
  },

  // ── Allocation Box ──────────────────────────────────────────
  allocBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 6,
  },

  allocLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: GREY,
  },

  allocTag: {
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  allocTagText: {
    fontSize: 10,
    color: '#212121',
  },

  // ── Warning Box ─────────────────────────────────────────────
  warnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
    padding: 6,
    marginTop: 4,
  },

  warnText: {
    fontSize: 11,
    color: ACCENT,
    flex: 1,
  },

  // ── Stepper ──────────────────────────────────────────────────
  stepper: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },

  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },

  stepBtnDisabled: {
    opacity: 0.35,
  },

  stepBtnText: {
    fontSize: 18,
    color: '#212121',
    lineHeight: 22,
  },

  stepBtnTextDisabled: {
    color: '#ccc',
  },

  stepQtyInput: {
    width: 36,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    padding: 0,
  },

  stepQtyInputActive: {
    color: ACCENT,
    fontWeight: '800',
  },

  // ── Floating Mini Cart Bar (Zepto / Instamart style) ──────────
  miniCartBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  miniCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  miniCartIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  miniCartCountBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  miniCartCountBadgeText: {
    color: ACCENT,
    fontSize: 9,
    fontWeight: '800',
  },

  miniCartItemsText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '600',
  },

  miniCartAmountText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '800',
  },

  miniCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  miniCartViewText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '800',
  },

  // ── Summary Panel ────────────────────────────────────────────
  summaryPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ACCENT,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },

  summaryHeaderText: {
    flex: 1,
    color: WHITE,
    fontSize: 14,
    fontWeight: '700',
  },

  summaryBadge: {
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },

  summaryBadgeText: {
    color: ACCENT,
    fontWeight: '800',
    fontSize: 12,
  },

  summaryScroll: {
    maxHeight: 200,
  },

  summaryEmpty: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
    padding: 10,
  },

  summaryItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },

  summaryItemName: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '600',
  },

  summaryItemIndex: {
    color: ACCENT,
    fontWeight: '800',
  },

  summaryBatchCount: {
    fontSize: 10,
    color: '#1565C0',
  },

  batchBreakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    marginTop: 2,
  },

  batchBreakText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },

  summaryItemRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 2,
  },

  summaryQty: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },

  summaryItemPrice: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },

  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  summaryFooterLabel: {
    fontSize: 11,
    color: WHITE,
    opacity: 0.8,
  },

  summaryTotal: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '800',
  },

  placeBtn: {
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 3,
  },

  placeBtnDisabled: {
    opacity: 0.5,
  },

  placeBtnText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '800',
  },

  // ── List ─────────────────────────────────────────────────────
  listContent: {
    padding: 10,
    paddingBottom: 140,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 10,
  },

  emptyText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },

  // ── Batch Tags ──────────────────────────────────────────────
  tagGreen: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },

  tagGreenText: {
    fontSize: 9,
    fontWeight: '700',
    color: GREEN,
    letterSpacing: 0.3,
  },

  tagRed: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },

  tagRedText: {
    fontSize: 9,
    fontWeight: '700',
    color: ACCENT,
    letterSpacing: 0.3,
  },

  checkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
  },

  // ── Sheet / Modal ────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    borderTopWidth: 3,
    borderTopColor: ACCENT,
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
  },

  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },

  sheetRowActive: {
    backgroundColor: '#FFF3F3',
  },

  sheetRowText: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
  },

  sheetRowTextActive: {
    color: ACCENT,
    fontWeight: '700',
  },

  // ── Batch Picker Sheet ──────────────────────────────────────
  emptyBatchContainer: {
    padding: 30,
    alignItems: 'center',
  },

  emptyBatchText: {
    color: ACCENT,
    fontWeight: '700',
    fontSize: 14,
  },

  emptyBatchSubtext: {
    color: GREY,
    fontSize: 12,
    marginTop: 4,
  },

  batchHeaderRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  batchHeaderText: {
    fontSize: 11,
    color: GREY,
  },

  batchHeaderAction: {
    fontSize: 11,
    color: '#aaa',
  },

  batchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
    gap: 10,
  },

  batchRowActive: {
    backgroundColor: '#FFF3F3',
  },

  batchRowContent: {
    flex: 1,
    gap: 3,
  },

  batchRowTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },

  batchRowNumber: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },

  batchRowNumberActive: {
    fontWeight: '700',
  },

  batchRowPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: GREEN,
  },

  batchStockTag: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  batchStockTagText: {
    fontSize: 10,
    color: '#E65100',
    fontWeight: '700',
  },

  batchQtyTag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  batchQtyTagText: {
    fontSize: 10,
    color: '#1565C0',
    fontWeight: '700',
  },

  batchRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  batchRowDate: {
    fontSize: 11,
    color: '#aaa',
  },

  batchRowInvoice: {
    fontSize: 10,
    color: '#ccc',
  },

  showMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 6,
  },

  showMoreText: {
    color: GREEN,
    fontWeight: '700',
    fontSize: 13,
  },

  // Add to OrderCartStyle.js

priceTypeBadge: {
  backgroundColor: '#E8F0FE',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
  marginHorizontal: 4,
},

priceTypeBadgeText: {
  fontSize: 9,
  color: '#1565C0',
  fontWeight: '600',
},
});

export default styles;

//------------------- 31.08.2026 -------------------------------
// import { StyleSheet } from 'react-native';

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     backgroundColor: '#F4F5F7',
//   },

//   header: {
//     height: 56,
//     backgroundColor: '#D32F2F',
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//   },

//   headerTitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },

//   content: {
//     paddingHorizontal: 16,
//     // paddingBottom: 120,
//   },

//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//   },

//   cardRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   imageBox: {
//     width: 70,
//     height: 70,
//     borderRadius: 8,
//     backgroundColor: '#FAFAFA',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },

//   productImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//     borderRadius: 8,
//   },

//   infoContainer: {
//     flex: 1,
//     paddingLeft: 10,
//     // borderWidth: 1,
//   },

//   productName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#212121',
//   },

//   sku: {
//     fontSize: 12,
//     color: '#757575',
//     marginTop: 2,
//   },

//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//   },

//   price: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#D32F2F',
//   },

//   qtyBox: {
//     // flex: 1,
//     flexDirection: 'row',
//     justifyContent:'flex-end',
//     alignItems: 'center',
//     gap: 8,
//     // paddingRight: 8,
//   },

//   qtyBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 6,
//     backgroundColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   qtyText: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginHorizontal: 10,
//   },

//   moqText: {
//     fontSize: 12,
//     color: '#388E3C',
//     marginTop: 6,
//   },

//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#E0E0E0',
//   },

//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },

//   totalLabel: {
//     fontSize: 15,
//     color: '#212121',
//     fontWeight: '600',
//   },

//   totalValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#D32F2F',
//   },

//   placeOrderBtn: {
//     height: 46,
//     backgroundColor: '#D32F2F',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   placeOrderText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   wrapper: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     marginBottom:10,
//     backgroundColor: '#fff',
//   },
//   inputBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e8e8e8',
//     paddingHorizontal: 12,
//     paddingVertical: 9,
//   },
//   input: {
//     flex: 1,
//     fontSize: 13,
//     color: '#1a1a1a',
//     padding: 0,
//   },
//   resultCount: {
//     fontSize: 11,
//     color: '#888',
//     marginTop: 6,
//     marginLeft: 4,
//   },
//   emptyBox: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//     gap: 12,
//   },
//   emptyText: {
//     fontSize: 13,
//     color: '#aaa',
//     textAlign: 'center',
//   },
//   // Price selector styles
// priceSelectorRow: {
//   flexDirection: 'row',
//   justifyContent: 'space-around',
//   backgroundColor: '#fff',
//   paddingVertical: 8,
//   paddingHorizontal: 16,
//   marginTop: 8,
//   marginHorizontal: 16,
//   borderRadius: 30,
//   shadowColor: '#000',
//   shadowOpacity: 0.05,
//   shadowRadius: 4,
//   elevation: 2,
// },
// priceOption: {
//   paddingVertical: 6,
//   paddingHorizontal: 14,
//   borderRadius: 20,
//   backgroundColor: '#f5f5f5',
// },
// priceOptionActive: {
//   backgroundColor: '#D32F2F',
// },
// priceOptionText: {
//   fontSize: 12,
//   fontWeight: '600',
//   color: '#444',
// },
// priceOptionTextActive: {
//   color: '#fff',
// },

// });

// export default styles;
