import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    marginTop: 16,
  },
  // Card base
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  // Invoice header inside card
  invoiceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  invoiceNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#D32F2F',
  },
  dateBadge: {
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
  },
  // Info rows (icon + text)
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoIcon: {
    marginRight: 10,
    opacity: 0.8,
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  // Items header
  itemsHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    flex: 1,
    textAlign: 'center',
  },
  itemNameFlex: {
    flex: 2.5,
    textAlign: 'left',
  },
  itemQtyFlex: {
    flex: 1,
  },
  itemPriceFlex: {
    flex: 1.2,
  },
  // Item row
  itemRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  itemName: {
    flex: 2.5,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  itemQty: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
  },
  itemPrice: {
    flex: 1.2,
    fontSize: 14,
    color: '#334155',
    textAlign: 'right',
    fontWeight: '500',
  },
  // Breakdown
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  discountValue: {
    color: '#059669', // green for discount
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D32F2F',
  },
  // Download button
  downloadBtn: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
  },
  downloadText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});