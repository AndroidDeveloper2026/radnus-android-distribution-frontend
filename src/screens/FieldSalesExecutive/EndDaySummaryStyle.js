// EndDaySummaryStyle.js - COMPLETE WITH ALL STYLES

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // ============================================================
  // CONTAINER
  // ============================================================
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // ============================================================
  // CONTENT
  // ============================================================
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // ============================================================
  // GRID & SUMMARY CARDS
  // ============================================================
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
  },

  label: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  // ============================================================
  // CARDS
  // ============================================================
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },

  note: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    flex: 1,
  },

  // ============================================================
  // SUBMIT BUTTON
  // ============================================================
  submitBtn: {
    flexDirection: "row",
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  submitBtnDisabled: {
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  // ============================================================
  // CANCEL BUTTON
  // ============================================================
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: "transparent",
    marginTop: 8,
  },

  cancelBtnDisabled: {
    opacity: 0.5,
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "600",
  },

  // ============================================================
  // SYNC PROGRESS
  // ============================================================
  syncProgressContainer: {
    marginTop: 10,
    padding: 14,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },

  syncProgressHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  syncProgressTitle: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "600",
  },

  syncProgressCount: {
    color: "#1E40AF",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
  },

  syncProgressBatch: {
    color: "#6B7280",
    fontSize: 11,
    marginTop: 2,
  },

  syncProgressBar: {
    marginTop: 8,
    height: 6,
    backgroundColor: "#DBEAFE",
    borderRadius: 3,
    overflow: "hidden",
  },

  syncProgressBarFill: {
    height: 6,
    backgroundColor: "#2563EB",
    borderRadius: 3,
  },

  syncProgressTime: {
    color: "#6B7280",
    fontSize: 11,
    marginTop: 4,
  },

  // ============================================================
  // STATUS MESSAGES
  // ============================================================
  statusSuccess: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#DCFCE7",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#22C55E",
  },

  statusSuccessText: {
    color: "#16A34A",
    fontSize: 13,
    fontWeight: "500",
  },

  statusError: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },

  statusErrorText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "500",
  },

  // ============================================================
  // DATA SUMMARY
  // ============================================================
  dataSummary: {
    marginTop: 10,
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },

  dataLabel: {
    color: "#64748B",
    fontSize: 13,
  },

  dataValue: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "600",
  },

  dataValuePending: {
    color: "#F59E0B",
    fontSize: 13,
    fontWeight: "600",
  },

  dataValueSynced: {
    color: "#22C55E",
    fontSize: 13,
    fontWeight: "600",
  },

  // ============================================================
  // INFO SECTION
  // ============================================================
  infoSection: {
    marginTop: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  infoIcon: {
    marginRight: 8,
    marginTop: 1,
  },

  // ============================================================
  // SESSION INFO
  // ============================================================
  sessionInfo: {
    marginTop: 8,
  },

  sessionText: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 2,
  },

  sessionPendingText: {
    fontSize: 11,
    color: "#F59E0B",
    marginVertical: 2,
  },

  // ============================================================
  // SKIP BUTTON
  // ============================================================
  skipBtn: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    alignItems: "center",
  },

  skipBtnContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  skipBtnText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  skipBtnSubtext: {
    color: "#6B7280",
    fontSize: 11,
    marginTop: 2,
  },

  // ============================================================
  // TRACKING STATUS
  // ============================================================
  trackingStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },

  trackingStatusActive: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },

  trackingStatusInactive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },

  trackingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },

  trackingDotActive: {
    backgroundColor: "#22C55E",
  },

  trackingDotInactive: {
    backgroundColor: "#EF4444",
  },

  trackingText: {
    fontSize: 13,
    fontWeight: "600",
  },

  trackingTextActive: {
    color: "#16A34A",
  },

  trackingTextInactive: {
    color: "#DC2626",
  },

  // ============================================================
  // EMPTY STATE
  // ============================================================
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  emptyIcon: {
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },

  // ============================================================
  // LOADING
  // ============================================================
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  // ============================================================
  // ADDITIONAL UTILITY STYLES
  // ============================================================
  flex1: {
    flex: 1,
  },

  flexRow: {
    flexDirection: "row",
  },

  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },

  flexRowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  flexColumn: {
    flexDirection: "column",
  },

  flexColumnCenter: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  mt8: {
    marginTop: 8,
  },

  mt10: {
    marginTop: 10,
  },

  mt12: {
    marginTop: 12,
  },

  mt16: {
    marginTop: 16,
  },

  mt20: {
    marginTop: 20,
  },

  mb8: {
    marginBottom: 8,
  },

  mb10: {
    marginBottom: 10,
  },

  mb12: {
    marginBottom: 12,
  },

  mb16: {
    marginBottom: 16,
  },

  p8: {
    padding: 8,
  },

  p10: {
    padding: 10,
  },

  p12: {
    padding: 12,
  },

  p14: {
    padding: 14,
  },

  p16: {
    padding: 16,
  },

  textCenter: {
    textAlign: "center",
  },

  textBold: {
    fontWeight: "700",
  },

  textSemibold: {
    fontWeight: "600",
  },

  textMedium: {
    fontWeight: "500",
  },

  textSmall: {
    fontSize: 11,
  },

  textRegular: {
    fontSize: 12,
  },

  textLarge: {
    fontSize: 14,
  },

  textXL: {
    fontSize: 16,
  },

  textXXL: {
    fontSize: 18,
  },

  colorPrimary: {
    color: "#DC2626",
  },

  colorSuccess: {
    color: "#22C55E",
  },

  colorWarning: {
    color: "#F59E0B",
  },

  colorError: {
    color: "#EF4444",
  },

  colorInfo: {
    color: "#2563EB",
  },

  colorGray: {
    color: "#6B7280",
  },

  colorDark: {
    color: "#0F172A",
  },

  colorWhite: {
    color: "#FFFFFF",
  },

  bgWhite: {
    backgroundColor: "#FFFFFF",
  },

  bgGray: {
    backgroundColor: "#F8FAFC",
  },

  bgLight: {
    backgroundColor: "#F1F5F9",
  },

  bgSuccess: {
    backgroundColor: "#DCFCE7",
  },

  bgError: {
    backgroundColor: "#FEF2F2",
  },

  bgWarning: {
    backgroundColor: "#FEF3C7",
  },

  bgInfo: {
    backgroundColor: "#EFF6FF",
  },

  rounded8: {
    borderRadius: 8,
  },

  rounded10: {
    borderRadius: 10,
  },

  rounded12: {
    borderRadius: 12,
  },

  rounded14: {
    borderRadius: 14,
  },

  rounded16: {
    borderRadius: 16,
  },

  roundedFull: {
    borderRadius: 9999,
  },

  border1: {
    borderWidth: 1,
  },

  border2: {
    borderWidth: 2,
  },

  borderGray: {
    borderColor: "#E2E8F0",
  },

  borderSuccess: {
    borderColor: "#BBF7D0",
  },

  borderError: {
    borderColor: "#FEE2E2",
  },

  borderWarning: {
    borderColor: "#FDE68A",
  },

  borderInfo: {
    borderColor: "#BFDBFE",
  },

  shadowNone: {
    elevation: 0,
    shadowOpacity: 0,
  },

  shadowSmall: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  shadowMedium: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  shadowLarge: {
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});

//---------------- 08.09.2026 -----------------------
// import { StyleSheet } from "react-native";

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F6F6F6",
//   },

//   content: {
//     padding: 16,
//     paddingBottom: 40,
//   },

//   grid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },

//   summaryCard: {
//     backgroundColor: "#FFFFFF",
//     width: "48%",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 14,
//     alignItems: "center",
//     elevation: 2,
//   },

//   iconCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#FDECEA",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   value: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#212121",
//   },

//   label: {
//     fontSize: 12,
//     color: "#777",
//     marginTop: 4,
//   },

//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     padding: 16,
//     marginTop: 10,
//     elevation: 2,
//   },

//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#212121",
//     marginBottom: 6,
//   },

//   note: {
//     fontSize: 12,
//     color: "#555",
//     lineHeight: 18,
//   },

//   submitBtn: {
//     flexDirection: "row",
//     backgroundColor: "#D32F2F",
//     paddingVertical: 16,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//     elevation: 3,
//   },

//   submitText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "700",
//     marginLeft: 8,
//   },
// });
