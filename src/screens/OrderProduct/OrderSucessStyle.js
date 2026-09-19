// OrderSuccessStyle.js
import { StyleSheet } from 'react-native';

const ACCENT = '#D32F2F';
const WHITE = '#FFFFFF';
const BG = '#F5F5F5';
const GREY = '#555';
const BORDER = '#E5E7EB';
const GREEN = '#2E7D32';

const styles = StyleSheet.create({
  // ── Safe Area ────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },

  // ── Section ──────────────────────────────────────────────────
  section: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Labels ───────────────────────────────────────────────────
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: GREY,
    marginBottom: 5,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Inputs ──────────────────────────────────────────────────
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#212121',
  },

  inputError: {
    borderColor: ACCENT,
  },

  textarea: {
    minHeight: 68,
    textAlignVertical: 'top',
  },

  // ── Picker ──────────────────────────────────────────────────
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },

  pickerError: {
    borderColor: ACCENT,
  },

  pickerText: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
  },

  pickerPlaceholder: {
    color: '#aaa',
  },

  // ── Readonly Field ──────────────────────────────────────────
  readonlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },

  readonlyText: {
    fontSize: 14,
    color: GREY,
    fontWeight: '600',
  },

  // ── Error ────────────────────────────────────────────────────
  errorText: {
    fontSize: 11,
    color: ACCENT,
    marginTop: 3,
  },

  // ── Status Row ──────────────────────────────────────────────
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginTop: 6,
  },

  statusText: {
    color: GREY,
    fontSize: 12,
  },

  // ── Found Card ──────────────────────────────────────────────
  foundCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },

  foundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },

  foundLabel: {
    fontSize: 13,
    color: GREEN,
    fontWeight: '700',
    flex: 1,
  },

  editBtn: {
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  editBtnText: {
    fontSize: 12,
    color: ACCENT,
    fontWeight: '700',
  },

  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
  },

  customerAddressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginTop: 3,
  },

  customerAddressText: {
    fontSize: 12,
    color: GREY,
    flex: 1,
  },

  customerCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },

  customerCityText: {
    fontSize: 12,
    color: GREY,
  },

  // ── Not Found ──────────────────────────────────────────────
  notFoundBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },

  notFoundText: {
    fontSize: 12,
    color: GREY,
    flex: 1,
  },

  addBtn: {
    backgroundColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  addBtnText: {
    fontSize: 12,
    color: WHITE,
    fontWeight: '700',
  },

  retryBtn: {
    backgroundColor: '#dc2626',
  },

  // ── Switch ──────────────────────────────────────────────────
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  switchLabel: {
    fontSize: 13,
    color: GREY,
  },

  switchBtn: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },

  switchBtnActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },

  switchBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: GREY,
  },

  switchBtnTextActive: {
    color: WHITE,
  },

  shippingFields: {
    marginTop: 6,
  },

  // ── Row Fields ──────────────────────────────────────────────
  rowFields: {
    flexDirection: 'row',
    gap: 10,
  },

  fieldHalf: {
    flex: 1,
  },

  // ── Total Preview ────────────────────────────────────────────
  totalPreview: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },

  totalRowLabel: {
    fontSize: 13,
    color: GREY,
  },

  totalRowValue: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '600',
  },

  totalRowAccent: {
    color: GREEN,
  },

  totalDivider: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginTop: 6,
    paddingTop: 8,
  },

  totalGrandLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: GREY,
  },

  totalGrandValue: {
    fontSize: 16,
    fontWeight: '800',
    color: ACCENT,
  },

  // ── Primary Button ──────────────────────────────────────────
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 15,
    gap: 8,
    elevation: 3,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },

  primaryBtnDisabled: {
    opacity: 0.5,
  },

  primaryBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '800',
  },

  // ── Batch Summary ────────────────────────────────────────────
  batchSummaryItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  batchSummaryProduct: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
  },

  batchTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 4,
  },

  batchTag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  batchTagDefault: {
    backgroundColor: '#F5F5F5',
  },

  batchTagText: {
    fontSize: 11,
    color: '#1565C0',
    fontWeight: '600',
  },

  batchTagTextDefault: {
    color: GREY,
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

  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

  // ── Modal ────────────────────────────────────────────────────
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

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
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },

  cancelBtnText: {
    color: GREY,
    fontSize: 14,
    fontWeight: '600',
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
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

  // ── Phone Pill ──────────────────────────────────────────────
  phonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginTop: 10,
  },

  phonePillText: {
    fontSize: 13,
    color: GREY,
    fontWeight: '600',
  },

  // ── Type Row ────────────────────────────────────────────────
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  typeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },

  typeBtnActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },

  typeBtnText: {
    fontSize: 14,
    color: GREY,
    fontWeight: '600',
  },

  typeBtnTextActive: {
    color: WHITE,
    fontWeight: '700',
  },

  // ── Confirm Modal ────────────────────────────────────────────
  confirmSubtitle: {
    fontSize: 13,
    color: GREY,
    marginBottom: 12,
  },

  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },

  confirmLabel: {
    fontSize: 12,
    color: GREY,
    fontWeight: '600',
  },

  confirmValue: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },

  confirmGrandTotal: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: '800',
  },
});

export default styles;

//--------------- 31.08.2026 ---------------------------------
// import { StyleSheet, Platform, Dimensions } from 'react-native';

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   // ── Screen ────────────────────────────────────────────────────
//   scrollContent: {
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//     paddingTop: 12,
//     backgroundColor: '#fff',
//   },
//   content: {
//     width: '100%',
//     alignItems: 'center',
//   },

//   // ── Order Summary Box ─────────────────────────────────────────
//   infoBox: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#e8e8e8',
//     borderRadius: 14,
//     marginBottom: 20,
//     overflow: 'hidden',
//     backgroundColor: '#fafafa',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 11,
//     paddingHorizontal: 16,
//   },
//   rowLabel: {
//     fontSize: 13,
//     color: '#666',
//   },
//   rowValue: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   amountText: {
//     color: '#16a34a',
//     fontWeight: '700',
//     fontSize: 14,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#e8e8e8',
//   },

//   // ── Form Card ─────────────────────────────────────────────────
//   formCard: {
//     width: '100%',
//     backgroundColor: '#f9fafb',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#e8e8e8',
//     padding: 16,
//     marginBottom: 20,
//   },
//   formCardTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 14,
//     letterSpacing: 0.3,
//   },

//   // ── Form Fields ───────────────────────────────────────────────
//   fieldGroup: {
//     marginBottom: 12,
//   },
//   labelRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   label: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#444',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === 'ios' ? 12 : 9,
//     fontSize: 13,
//     color: '#1a1a1a',
//   },
//   textarea: {
//     height: 72,
//     textAlignVertical: 'top',
//   },
//   readonlyField: {
//     backgroundColor: '#f0fdf4',
//     borderWidth: 1,
//     borderColor: '#bbf7d0',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 11,
//   },
//   readonlyText: {
//     fontSize: 13,
//     color: '#16a34a',
//     fontWeight: '600',
//   },
//   rowFields: {
//     flexDirection: 'row',
//   },

//   // ── Dropdown ──────────────────────────────────────────────────
//   dropdown: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 11,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   dropdownPlaceholder: {
//     fontSize: 13,
//     color: '#bbb',
//   },
//   dropdownSelected: {
//     fontSize: 13,
//     color: '#1a1a1a',
//     fontWeight: '600',
//   },
//   dropdownList: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 10,
//     marginTop: 4,
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//   },
//   dropdownItem: {
//     paddingVertical: 11,
//     paddingHorizontal: 14,
//   },
//   dropdownItemActive: {
//     backgroundColor: '#f0fdf4',
//   },
//   dropdownItemText: {
//     fontSize: 13,
//     color: '#333',
//   },
//   dropdownItemTextActive: {
//     color: '#16a34a',
//     fontWeight: '700',
//   },

//   // ── Grand Total Preview ───────────────────────────────────────
//   totalPreview: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f0fdf4',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     marginTop: 4,
//     borderWidth: 1,
//     borderColor: '#bbf7d0',
//   },
//   totalPreviewLabel: {
//     fontSize: 13,
//     color: '#444',
//     fontWeight: '600',
//   },
//   totalPreviewValue: {
//     fontSize: 15,
//     color: '#16a34a',
//     fontWeight: '700',
//   },

//   // ── Buttons ───────────────────────────────────────────────────
//   primaryBtn: {
//     width: '100%',
//     backgroundColor: '#16a34a',
//     borderRadius: 12,
//     paddingVertical: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   primaryText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 15,
//   },
//   outlineBtn: {
//     width: '100%',
//     borderWidth: 1.5,
//     borderColor: '#16a34a',
//     borderRadius: 12,
//     paddingVertical: 13,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   outlineText: {
//     color: '#16a34a',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   ghostBtn: {
//     paddingVertical: 8,
//   },
//   ghostText: {
//     color: '#888',
//     fontSize: 13,
//     textDecorationLine: 'underline',
//   },

//   // ── Modal ─────────────────────────────────────────────────────
//   backdrop: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   centeredWrapper: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   popup: {
//     width: width * 0.9,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//     paddingTop: 0,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15,
//     shadowRadius: 20,
//     elevation: 10,
//     overflow: 'hidden',
//   },
//   closeBtn: {
//     alignSelf: 'flex-end',
//     marginTop: 14,
//     padding: 4,
//   },
//   popupLottieWrapper: {
//     width: '100%',
//     alignItems: 'center',
//     backgroundColor: '#f0fdf4',
//     paddingVertical: 12,
//     marginBottom: 12,
//   },
//   popupLottie: {
//     width: 110,
//     height: 110,
//   },
//   popupTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   popupSubtitle: {
//     fontSize: 12,
//     color: '#888',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   popupInfoBox: {
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#e8e8e8',
//     borderRadius: 12,
//     marginBottom: 16,
//     overflow: 'hidden',
//     backgroundColor: '#fafafa',
//   },
//   inputError: {
//     borderColor: '#dc2626',
//     borderWidth: 1.5,
//     backgroundColor: '#fff5f5',
//   },
//   inputLocked: {
//     backgroundColor: '#f3f4f6',
//     color: '#888',
//   },
//   errorText: {
//     fontSize: 12,
//     color: '#dc2626',
//     marginTop: 4,
//     marginLeft: 2,
//   },
//   // Loading row
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//     gap: 6,
//   },
//   statusText: {
//     fontSize: 13,
//     color: '#16a34a',
//   },
//   // ✅ Found card
//   foundCard: {
//     marginTop: 10,
//     backgroundColor: '#f0fdf4',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#86efac',
//     padding: 12,
//   },
//   foundCardTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   foundLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#16a34a',
//     flex: 1,
//   },
//   changeBtn: {
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     backgroundColor: '#dcfce7',
//     borderRadius: 6,
//   },
//   changeBtnText: {
//     fontSize: 12,
//     color: '#15803d',
//     fontWeight: '600',
//   },
//   customerName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#111',
//     marginBottom: 2,
//   },
//   customerSub: {
//     fontSize: 13,
//     color: '#555',
//     marginTop: 1,
//   },
//   // ❌ Not found box
//   notFoundBox: {
//     marginTop: 10,
//     gap: 10,
//   },
//   notFoundText: {
//     fontSize: 13,
//     color: '#dc2626',
//   },
//   addBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     backgroundColor: '#16a34a',
//     paddingHorizontal: 14,
//     paddingVertical: 9,
//     borderRadius: 8,
//   },
//   addBtnText: {
//     color: '#fff',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   // Bottom sheet
//   sheetOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     justifyContent: 'flex-end',
//   },
//   sheetCard: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 22,
//     borderTopRightRadius: 22,
//     padding: 20,
//     paddingBottom: 36,
//   },
//   sheetHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 14,
//   },
//   sheetTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111',
//     flex: 1,
//   },
//   phonePill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     backgroundColor: '#f0fdf4',
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     marginBottom: 14,
//     borderWidth: 1,
//     borderColor: '#86efac',
//   },
//   phonePillText: {
//     fontSize: 14,
//     color: '#16a34a',
//     fontWeight: '600',
//   },
//   sheetInput: {
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: '#111',
//     backgroundColor: '#f9fafb',
//     marginBottom: 10,
//   },
//   saveBtn: {
//     backgroundColor: '#16a34a',
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   saveBtnText: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '700',
//   },
  
// });

// export default styles;
