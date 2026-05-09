import { StyleSheet } from 'react-native';

const GREEN = '#D32F2F';
const WHITE = '#FFFFFF';
const GREY_DARK = '#212121';
const GREY_MID = '#555';
const GREY_LIGHT = '#888';
const BG = '#F5F5F5';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: BG,
  },

  // ─── Tabs ──────────────────────────────────────────────
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: WHITE,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 20,
    gap: 5,
  },
  activeTab: {
    backgroundColor: GREEN,
    elevation: 3,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  tabText: {
    color: GREY_MID,
    fontSize: 13,
    fontWeight: '500',
  },
  activeTabText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 22,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: WHITE,
  },
  badgeText: {
    fontSize: 11,
    color: GREY_MID,
    fontWeight: 'bold',
  },
  activeBadgeText: {
    color: GREEN,
    fontWeight: 'bold',
  },

  // ─── Search Row ────────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
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
    color: GREY_DARK,
    padding: 0,
  },
  refreshBtn: {
    backgroundColor: WHITE,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 5,
    elevation: 2,
  },
  createBtnText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },

  // ─── List ──────────────────────────────────────────────
  list: {
    padding: 12,
    paddingBottom: 30,
  },

  // ─── Card ──────────────────────────────────────────────
  card: {
    backgroundColor: WHITE,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: GREEN,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 14,
    gap: 10,
  },
  cardMeta: {
    flex: 1,
    gap: 7,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaDate: {
    fontSize: 12,
    color: GREY_LIGHT,
  },
  metaName: {
    fontSize: 14,
    fontWeight: '700',
    color: GREY_DARK,
    flexShrink: 1,
  },
  metaRef: {
    fontSize: 12,
    color: GREY_MID,
    fontWeight: '500',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  purchaseBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  purchaseBadgeText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: '700',
  },

  // ─── Card Body ─────────────────────────────────────────
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 14,
    gap: 10,
  },
  reasonBox: {
    backgroundColor: '#F1F8F1',
    padding: 10,
    borderRadius: 8,
  },
  reasonText: {
    fontSize: 12,
    color: GREY_MID,
    lineHeight: 18,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  th: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: GREY_MID,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  td: {
    flex: 1,
    fontSize: 12,
    color: GREY_DARK,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: GREY_MID,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  printBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    elevation: 1,
  },
  printBtnText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },
  deleteSection: {
    marginTop: 4,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-end',
    gap: 5,
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  confirmText: {
    fontSize: 12,
    color: GREY_MID,
  },
  confirmYes: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  confirmYesText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
  confirmNo: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  confirmNoText: {
    color: GREY_MID,
    fontSize: 12,
  },

  // ─── States ────────────────────────────────────────────
  centerBox: {
    alignItems: 'center',
    marginTop: 60,
    gap: 14,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: GREY_LIGHT,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    color: GREEN,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
    elevation: 2,
  },
  retryText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 14,
  },

  // ─── Modal ─────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
    borderTopWidth: 3,
    borderTopColor: GREEN,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: GREY_DARK,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: GREY_MID,
    marginTop: 10,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: GREY_DARK,
  },
  textarea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  addItemText: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemRow: {
    backgroundColor: '#F1F8F1',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#c8cce6',
  },
  productPickerScroll: {
    maxHeight: 40,
  },
  productPickerRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  productChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxWidth: 150,
  },
  productChipActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  productChipText: {
    fontSize: 12,
    color: GREY_MID,
    fontWeight: '500',
  },
  productChipTextActive: {
    color: WHITE,
    fontWeight: '700',
  },
  qtyPriceRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  qtyInput: {
    flex: 1,
  },
  priceInput: {
    flex: 1.5,
  },
  removeBtn: {
    padding: 8,
  },
  selectedProduct: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginVertical: 14,
  },
  modalTotalLabel: {
    fontSize: 14,
    color: GREY_MID,
    fontWeight: '600',
  },
  modalTotalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 12,
//     flex: 1,
//   },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  cancelBtnText: {
    color: GREY_MID,
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 11,
    gap: 6,
    elevation: 2,
  },
  submitBtnText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default styles;
