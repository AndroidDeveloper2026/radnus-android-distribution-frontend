import { StyleSheet } from 'react-native';

const C = {
  bg: '#fff5f5',
  card: '#ffffff',
  border: '#fbd5d5',
  text: '#2d0a0a',
  subText: '#8a5050',
  muted: '#c98f8f',
  red: '#c0392b',
  redDark: '#a52a1f',
  redLight: '#ffe5e0',
  redSoft: '#fdeaea',
  green: '#2e7d32',
  greenBg: '#e8f5e9',
  white: '#ffffff',
};

export const COLORS = C;

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  safeContainer: { flex: 1, backgroundColor: C.bg },
  contentContainer: { flex: 1, backgroundColor: C.bg },

  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: C.subText, fontSize: 14 },

  content: { padding: 16, gap: 12 },
  contentNoHeader: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },

  // Custom Tabs
  customTabContainer: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  customTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  customTabActive: {
    backgroundColor: C.red,
  },
  customTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.subText,
  },
  customTabTextActive: {
    color: '#fff',
  },

  // Tabs (legacy - kept for backward compatibility)
  tabRow: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 4,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: C.red,
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.subText,
  },
  tabBtnTextActive: { color: '#fff' },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: C.text },
  clearIcon: { color: C.muted, fontSize: 16, paddingHorizontal: 4 },

  // Period filter
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  periodChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: C.redSoft,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  periodChipActive: {
    backgroundColor: C.red,
    borderColor: C.red,
  },
  periodChipText: { fontSize: 12, fontWeight: '500', color: C.subText },
  periodChipTextActive: { color: '#fff' },

  clearAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: C.redLight,
    borderRadius: 8,
  },
  clearAllText: { fontSize: 12, fontWeight: '600', color: C.redDark },

  // Custom date
  customDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    gap: 10,
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    backgroundColor: C.redSoft,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: C.text,
  },
  dateSeparator: { color: C.red, fontSize: 16, fontWeight: '700' },

  // Quick date chips
  quickDateSection: { gap: 8, marginBottom: 10 },
  quickDateLabel: { fontSize: 12, fontWeight: '600', color: C.red },
  dateChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: C.redSoft,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  dateChipActive: { backgroundColor: C.red, borderColor: C.red },
  dateChipText: { fontSize: 12, color: C.subText },
  dateChipTextActive: { color: '#fff' },
  clearDateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: C.redLight,
    borderRadius: 8,
    marginRight: 8,
  },
  clearDateChipText: { fontSize: 12, color: C.redDark, fontWeight: '600' },

  // Summary
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  summaryCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    borderTopWidth: 3,
    borderTopColor: C.red,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: { fontSize: 11, color: C.subText, textAlign: 'center' },
  summaryValue: { fontSize: 15, fontWeight: '700', color: C.text, textAlign: 'center' },

  // Group
  group: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: C.redSoft,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  groupDateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  groupDateText: { fontSize: 13, fontWeight: '700', color: C.redDark },
  groupStats: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  groupQty: { fontSize: 12, color: C.subText },
  groupValue: { fontSize: 12, fontWeight: '700', color: C.green },

  // Movement item
  movementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fbeaea',
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  iconInward: { backgroundColor: C.greenBg },
  iconOutward: { backgroundColor: C.redLight },
  itemIconText: { fontSize: 16, fontWeight: 'bold' },

  itemDetails: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 6 },
  itemMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip: { fontSize: 11, color: C.subText },
  metaInline: { flexDirection: 'row', alignItems: 'center' },

  itemQty: { alignItems: 'flex-end', minWidth: 70 },
  qtyValue: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  positive: { color: C.green },
  negative: { color: C.red },
  unitPrice: { fontSize: 11, color: C.subText, marginBottom: 2 },
  totalVal: { fontSize: 12, fontWeight: '700', color: C.green },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.text, textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: C.subText, textAlign: 'center', lineHeight: 20 },

  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.red,
    borderRadius: 10,
  },
  pageBtnDisabled: { opacity: 0.4, borderColor: C.border },
  pageBtnText: { fontSize: 13, fontWeight: '600', color: C.red },
  pageInfo: { fontSize: 13, color: C.subText },
});

