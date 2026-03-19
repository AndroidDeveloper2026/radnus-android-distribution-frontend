import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // ── Screen ────────────────────────────────────────────────────
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },

  // ── Order Summary Box ─────────────────────────────────────────
  infoBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 14,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  rowLabel: {
    fontSize: 13,
    color: '#666',
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  amountText: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },

  // ── Form Card ─────────────────────────────────────────────────
  formCard: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    padding: 16,
    marginBottom: 20,
  },
  formCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 14,
    letterSpacing: 0.3,
  },

  // ── Form Fields ───────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    fontSize: 13,
    color: '#1a1a1a',
  },
  textarea: {
    height: 72,
    textAlignVertical: 'top',
  },
  readonlyField: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  readonlyText: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
  },
  rowFields: {
    flexDirection: 'row',
  },

  // ── Dropdown ──────────────────────────────────────────────────
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownPlaceholder: {
    fontSize: 13,
    color: '#bbb',
  },
  dropdownSelected: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  dropdownItem: {
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  dropdownItemActive: {
    backgroundColor: '#f0fdf4',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#16a34a',
    fontWeight: '700',
  },

  // ── Grand Total Preview ───────────────────────────────────────
  totalPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  totalPreviewLabel: {
    fontSize: 13,
    color: '#444',
    fontWeight: '600',
  },
  totalPreviewValue: {
    fontSize: 15,
    color: '#16a34a',
    fontWeight: '700',
  },

  // ── Buttons ───────────────────────────────────────────────────
  primaryBtn: {
    width: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  outlineBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 12,
  },
  outlineText: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: 14,
  },
  ghostBtn: {
    paddingVertical: 8,
  },
  ghostText: {
    color: '#888',
    fontSize: 13,
    textDecorationLine: 'underline',
  },

  // ── Modal ─────────────────────────────────────────────────────
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centeredWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginTop: 14,
    padding: 4,
  },
  popupLottieWrapper: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 12,
    marginBottom: 12,
  },
  popupLottie: {
    width: 110,
    height: 110,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  popupSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  popupInfoBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#dc2626',
    borderWidth: 1.5,
    backgroundColor: '#fff5f5',
  },
  inputLocked: {
    backgroundColor: '#f3f4f6',
    color: '#888',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
    marginLeft: 2,
  },
  // Loading row
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#16a34a',
  },
  // ✅ Found card
  foundCard: {
    marginTop: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#86efac',
    padding: 12,
  },
  foundCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  foundLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
    flex: 1,
  },
  changeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#dcfce7',
    borderRadius: 6,
  },
  changeBtnText: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '600',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  customerSub: {
    fontSize: 13,
    color: '#555',
    marginTop: 1,
  },
  // ❌ Not found box
  notFoundBox: {
    marginTop: 10,
    gap: 10,
  },
  notFoundText: {
    fontSize: 13,
    color: '#dc2626',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#16a34a',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  // Bottom sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    flex: 1,
  },
  phonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  phonePillText: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '600',
  },
  sheetInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
    backgroundColor: '#f9fafb',
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default styles;
