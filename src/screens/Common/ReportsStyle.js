// // import { StyleSheet, Platform } from "react-native";

// // export default StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#F6F6F6",
// //   },
// //   scrollContent: {
// //     paddingBottom: 40,
// //     paddingHorizontal: 16,
// //   },

// //   // Hero
// //   hero: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 16,
// //     padding: 20,
// //     marginTop: 16,
// //     elevation: 2,
// //     ...Platform.select({
// //       ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { height: 2 } },
// //     }),
// //   },
// //   heroBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 4,
// //     marginBottom: 4,
// //   },
// //   heroBadgeText: {
// //     fontSize: 12,
// //     fontWeight: "700",
// //     color: "#D32F2F",
// //   },
// //   heroTitle: {
// //     fontSize: 22,
// //     fontWeight: "800",
// //     color: "#212121",
// //     letterSpacing: -0.5,
// //   },
// //   heroSub: {
// //     fontSize: 12,
// //     color: "#777",
// //   },
// //   heroRevenue: {
// //     fontSize: 24,
// //     fontWeight: "800",
// //     color: "#00875A",
// //     letterSpacing: -1,
// //   },
// //   heroRevenueLabel: {
// //     fontSize: 11,
// //     color: "#999",
// //     textTransform: "uppercase",
// //     fontWeight: "700",
// //   },

// //   // Period Selector
// //   periodRow: {
// //     flexDirection: "row",
// //     marginVertical: 12,
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 10,
// //     padding: 3,
// //     elevation: 1,
// //   },
// //   periodPill: {
// //     flex: 1,
// //     alignItems: "center",
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //   },
// //   periodPillActive: {
// //     backgroundColor: "#D32F2F",
// //   },
// //   periodPillText: {
// //     fontSize: 12,
// //     fontWeight: "600",
// //     color: "#777",
// //   },
// //   periodPillTextActive: {
// //     color: "#FFFFFF",
// //   },
// //   yearBtn: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 10,
// //     padding: 12,
// //     marginTop: 8,
// //     elevation: 1,
// //   },
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.4)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   modalContent: {
// //     width: "80%",
// //     maxHeight: 300,
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 16,
// //     padding: 16,
// //   },
// //   modalHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 12,
// //   },
// //   yearItem: {
// //     padding: 12,
// //     borderRadius: 8,
// //   },

// //   // KPI Cards
// //   kpiGrid: {
// //     flexDirection: "row",
// //     flexWrap: "wrap",
// //     gap: 12,
// //     marginVertical: 12,
// //   },
// //   kpiCard: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 14,
// //     padding: 14,
// //     flex: 1,
// //     minWidth: "45%",
// //     elevation: 2,
// //     paddingLeft: 18, // for border left
// //   },
// //   kpiIconWrap: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 12,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginRight: 12,
// //   },
// //   kpiLabel: {
// //     fontSize: 12,
// //     color: "#777",
// //   },
// //   kpiValue: {
// //     fontSize: 20,
// //     fontWeight: "800",
// //     marginTop: 2,
// //     letterSpacing: -1,
// //   },
// //   kpiSub: {
// //     fontSize: 11,
// //     color: "#999",
// //     marginTop: 2,
// //   },

// //   // Tabs
// //   tabBar: {
// //     flexDirection: "row",
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 14,
// //     marginVertical: 16,
// //     elevation: 2,
// //   },
// //   tabBtn: {
// //     flex: 1,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingVertical: 12,
// //     borderBottomWidth: 2,
// //     borderBottomColor: "transparent",
// //     gap: 6,
// //   },
// //   tabBtnActive: {
// //     borderBottomColor: "#D32F2F",
// //   },
// //   tabBtnText: {
// //     fontSize: 13,
// //     fontWeight: "600",
// //     color: "#777",
// //   },
// //   tabBtnTextActive: {
// //     color: "#D32F2F",
// //   },
// //   tabCount: {
// //     backgroundColor: "#FDECEA",
// //     borderRadius: 10,
// //     minWidth: 20,
// //     height: 20,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   tabCountText: {
// //     fontSize: 10,
// //     fontWeight: "700",
// //     color: "#D32F2F",
// //   },

// //   // Cards
// //   card: {
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 16,
// //     padding: 16,
// //     marginBottom: 14,
// //     elevation: 2,
// //   },
// //   cardHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     marginBottom: 16,
// //   },
// //   cardTitle: {
// //     fontSize: 15,
// //     fontWeight: "700",
// //     color: "#212121",
// //   },

// //   // Price totals
// //   priceGrid: {
// //     flexDirection: "row",
// //     flexWrap: "wrap",
// //   },
// //   priceCell: {
// //     flex: 1,
// //     minWidth: "40%",
// //     marginBottom: 12,
// //   },
// //   priceLabel: {
// //     fontSize: 11,
// //     color: "#777",
// //     textTransform: "uppercase",
// //   },
// //   priceValue: {
// //     fontSize: 20,
// //     fontWeight: "800",
// //     letterSpacing: -1,
// //   },

// //   // Overview grid (ring charts)
// //   overviewGrid: {
// //     flexDirection: "column",
// //     gap: 14,
// //   },

// //   // Summary table
// //   summaryRow: {
// //     flexDirection: "row",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#f0f0f0",
// //     paddingVertical: 12,
// //     alignItems: "center",
// //   },

// //   // Search
// //   searchWrap: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 10,
// //     paddingHorizontal: 12,
// //     marginBottom: 10,
// //     elevation: 1,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     marginLeft: 8,
// //     fontSize: 13,
// //     color: "#212121",
// //     paddingVertical: 10,
// //   },

// //   // Table styling
// //   tableHeader: {
// //     flexDirection: "row",
// //     backgroundColor: "#F0F0F0",
// //     paddingVertical: 8,
// //     paddingHorizontal: 8,
// //     borderRadius: 8,
// //     marginBottom: 4,
// //   },
// //   th: {
// //     flex: 1,
// //     alignItems: "center",
// //   },
// //   thText: {
// //     flex: 1,
// //     fontSize: 11,
// //     fontWeight: "700",
// //     color: "#666",
// //     textAlign: "center",
// //   },
// //   tableRow: {
// //     flexDirection: "row",
// //     paddingVertical: 10,
// //     paddingHorizontal: 8,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#f0f0f0",
// //     alignItems: "center",
// //   },
// //   tdName: {
// //     flex: 1,
// //     fontSize: 12,
// //     fontWeight: "600",
// //     color: "#212121",
// //   },
// //   tdMuted: {
// //     flex: 1,
// //     fontSize: 11,
// //     color: "#888",
// //     textAlign: "center",
// //   },
// //   tdNum: {
// //     flex: 1,
// //     fontSize: 12,
// //     fontWeight: "700",
// //     textAlign: "center",
// //     color: "#212121",
// //   },
// // });

// //------------------------

// import { StyleSheet, Platform } from "react-native";

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F9FA",
//   },
//   scrollContent: {
//     paddingBottom: 32,
//     paddingHorizontal: 16,
//   },

//   /* ─── HERO SECTION ───────────────────────────────────── */
//   hero: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 20,
//     marginTop: 12,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//   },
//   heroBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     marginBottom: 6,
//   },
//   heroBadgeText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#D32F2F",
//     textTransform: "uppercase",
//   },
//   heroTitle: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: "#1A1A1A",
//     letterSpacing: -0.3,
//   },
//   heroSub: {
//     fontSize: 13,
//     color: "#666",
//     marginTop: 2,
//   },
//   heroStats: {
//     alignItems: "flex-end",
//   },
//   heroRevenue: {
//     fontSize: 26,
//     fontWeight: "800",
//     color: "#00875A",
//     letterSpacing: -1,
//   },
//   heroRevenueLabel: {
//     fontSize: 11,
//     color: "#888",
//     textTransform: "uppercase",
//     fontWeight: "700",
//     marginTop: 2,
//   },

//   /* ─── PERIOD SELECTOR ────────────────────────────────── */
//   periodContainer: {
//     marginVertical: 14,
//   },
//   periodRow: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 4,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },
//   periodPill: {
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   periodPillActive: {
//     backgroundColor: "#D32F2F",
//   },
//   periodPillText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#666",
//   },
//   periodPillTextActive: {
//     color: "#FFFFFF",
//   },
//   yearBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginTop: 10,
//     elevation: 2,
//     gap: 6,
//   },
//   yearBtnText: {
//     fontSize: 13,
//     color: "#333",
//     fontWeight: "500",
//   },
//   customFilters: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 10,
//   },
//   filterBtn: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     elevation: 1,
//   },
//   filterBtnText: {
//     fontSize: 13,
//     color: "#333",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   modalContent: {
//     width: "85%",
//     maxHeight: 320,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 18,
//     padding: 18,
//     elevation: 10,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 14,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//   modalTitle: {
//     fontWeight: "700",
//     fontSize: 16,
//     color: "#212121",
//   },
//   yearItem: {
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//   },
//   yearItemSelected: {
//     backgroundColor: "#FDECEA",
//   },
//   yearItemText: {
//     color: "#212121",
//     fontSize: 14,
//     fontWeight: "500",
//   },

//   /* ─── KPI CARDS ──────────────────────────────────────── */
//   kpiGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 12,
//     marginVertical: 8,
//   },
//   kpiCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 14,
//     flex: 1,
//     minWidth: "47%",
//     elevation: 2,
//     borderLeftWidth: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//   },
//   kpiIconWrap: {
//     width: 44,
//     height: 44,
//     borderRadius: 13,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   kpiContent: {
//     flex: 1,
//   },
//   kpiLabel: {
//     fontSize: 12,
//     color: "#666",
//     fontWeight: "500",
//   },
//   kpiValue: {
//     fontSize: 20,
//     fontWeight: "800",
//     marginTop: 3,
//     letterSpacing: -0.8,
//   },
//   kpiSub: {
//     fontSize: 11,
//     color: "#999",
//     marginTop: 2,
//   },

//   /* ─── TABS ───────────────────────────────────────────── */
//   tabBar: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     marginVertical: 14,
//     padding: 4,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },
//   tabBtn: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 11,
//     borderRadius: 10,
//     gap: 5,
//   },
//   tabBtnActive: {
//     backgroundColor: "#FDECEA",
//   },
//   tabBtnText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#666",
//   },
//   tabBtnTextActive: {
//     color: "#D32F2F",
//   },
//   tabCount: {
//     backgroundColor: "#FDECEA",
//     borderRadius: 9,
//     minWidth: 19,
//     height: 19,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 4,
//   },
//   tabCountText: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: "#D32F2F",
//   },

//   /* ─── CARDS ──────────────────────────────────────────── */
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 18,
//     padding: 18,
//     marginBottom: 14,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 9,
//     marginBottom: 14,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#212121",
//   },

//   /* ─── PRICE TOTALS ───────────────────────────────────── */
//   priceGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 12,
//   },
//   priceCell: {
//     flex: 1,
//     minWidth: "45%",
//     backgroundColor: "#FAFAFA",
//     borderRadius: 12,
//     padding: 12,
//   },
//   priceLabel: {
//     fontSize: 11,
//     color: "#666",
//     textTransform: "uppercase",
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   priceValue: {
//     fontSize: 19,
//     fontWeight: "800",
//     letterSpacing: -0.8,
//   },

//   /* ─── RING CHART ─────────────────────────────────────── */
//   ringContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   ringLegend: {
//     marginLeft: 18,
//     flex: 1,
//   },
//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//     gap: 7,
//   },
//   legendDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   legendLabel: {
//     fontSize: 12,
//     color: "#555",
//     flex: 1,
//   },
//   legendValue: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#212121",
//     width: 35,
//     textAlign: "right",
//   },
//   legendPct: {
//     fontSize: 11,
//     color: "#999",
//     width: 32,
//     textAlign: "right",
//   },

//   /* ─── OVERVIEW GRID ──────────────────────────────────── */
//   overviewGrid: {
//     flexDirection: "column",
//     gap: 14,
//   },

//   /* ─── SUMMARY TABLE ──────────────────────────────────── */
//   summaryRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//     paddingVertical: 11,
//     alignItems: "center",
//   },

//   /* ─── SEARCH INPUT ───────────────────────────────────── */
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.04,
//     shadowRadius: 3,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: "#212121",
//     paddingVertical: 2,
//   },

//   /* ─── TABLE STYLES ───────────────────────────────────── */
//   tabContent: {
//     flex: 1,
//   },
//   emptyText: {
//     textAlign: "center",
//     color: "#999",
//     fontSize: 14,
//     marginTop: 30,
//     marginBottom: 20,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#F5F5F5",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     marginBottom: 6,
//   },
//   th: {
//     alignItems: "center",
//   },
//   thText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#555",
//     textAlign: "center",
//     textTransform: "uppercase",
//   },
//   tableRow: {
//     flexDirection: "row",
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//     alignItems: "center",
//   },
//   tdName: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#212121",
//   },
//   tdMuted: {
//     fontSize: 12,
//     color: "#777",
//     textAlign: "center",
//   },
//   tdNum: {
//     fontSize: 13,
//     fontWeight: "700",
//     textAlign: "center",
//     color: "#212121",
//   },

//   /* ─── MONTHLY TAB ────────────────────────────────────── */
//   monthlyScroll: {
//     paddingHorizontal: 4,
//     paddingVertical: 8,
//   },
// });

//==============================

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* ─── HERO ────────────────────────────────────────────── */
  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#D32F2F",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.4,
  },
  heroSub: {
    fontSize: 12,
    color: "#888",
    marginTop: 3,
    fontWeight: "500",
  },
  heroStats: {
    alignItems: "flex-end",
  },
  heroRevenue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#00875A",
    letterSpacing: -1,
  },
  heroRevenueLabel: {
    fontSize: 10,
    color: "#999",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  heroDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    width: "100%",
    marginVertical: 6,
  },
  heroInvoiceCount: {
    fontSize: 11,
    color: "#AAA",
    fontWeight: "600",
  },

  /* ─── PERIOD SELECTOR ────────────────────────────────── */
  periodContainer: {
    marginBottom: 14,
    gap: 10,
  },
  periodRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  periodPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    borderRadius: 10,
  },
  periodPillActive: {
    backgroundColor: "#D32F2F",
    elevation: 2,
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  periodPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#777",
  },
  periodPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    elevation: 2,
    gap: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  filterChipText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },

  /* ─── MODAL ──────────────────────────────────────────── */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "80%",
    maxHeight: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1A1A1A",
  },
  pickerItem: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 2,
  },
  pickerItemSelected: {
    backgroundColor: "#FDECEA",
  },
  pickerItemText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  pickerItemTextSelected: {
    color: "#D32F2F",
    fontWeight: "700",
  },

  /* ─── KPI CARDS ──────────────────────────────────────── */
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flex: 1,
    minWidth: "47%",
    elevation: 2,
    borderLeftWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  kpiIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  kpiContent: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: 11,
    color: "#777",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  kpiValue: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 3,
    letterSpacing: -0.5,
  },
  kpiSub: {
    fontSize: 10,
    color: "#AAA",
    marginTop: 2,
    fontWeight: "500",
  },

  /* ─── TABS ───────────────────────────────────────────── */
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 14,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 3,
  },
  tabBtnActive: {
    backgroundColor: "#FFF5F5",
  },
  tabIcon: {
    opacity: 0.4,
  },
  tabIconActive: {
    opacity: 1,
    tintColor: "#D32F2F",
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 0.1,
  },
  tabBtnTextActive: {
    color: "#D32F2F",
    fontWeight: "700",
  },
  tabCount: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabCountActive: {
    backgroundColor: "#FDECEA",
  },
  tabCountText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#999",
  },
  tabCountTextActive: {
    color: "#D32F2F",
  },

  /* ─── CARDS ──────────────────────────────────────────── */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
  },

  /* ─── PRICE TOTALS ───────────────────────────────────── */
  priceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  priceCell: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  priceLabel: {
    fontSize: 10,
    color: "#888",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  priceValue: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  /* ─── RING CHART ─────────────────────────────────────── */
  ringContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  ringLegend: {
    marginLeft: 16,
    flex: 1,
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: "#555",
    flex: 1,
    fontWeight: "500",
  },
  legendValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
    minWidth: 30,
    textAlign: "right",
  },
  legendPct: {
    fontSize: 11,
    color: "#BBB",
    minWidth: 34,
    textAlign: "right",
    fontWeight: "600",
  },

  /* ─── SUMMARY TABLE ──────────────────────────────────── */
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingVertical: 12,
  },
  summaryLabel: {
    flex: 2,
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  summaryCountBadge: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginRight: 12,
  },
  summaryCount: {
    fontSize: 11,
    fontWeight: "700",
    color: "#555",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    minWidth: 80,
  },

  /* ─── SEARCH INPUT ───────────────────────────────────── */
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  searchIcon: {
    marginRight: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1A1A1A",
    paddingVertical: 0,
    fontWeight: "500",
  },

  /* ─── TABLE ──────────────────────────────────────────── */
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 4,
    alignItems: "center",
  },
  thText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#888",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    alignItems: "center",
  },
  tdName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  tdBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D32F2F",
  },
  tdMuted: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },
  tdNum: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    color: "#1A1A1A",
  },
  emptyText: {
    textAlign: "center",
    color: "#CCC",
    fontSize: 13,
    fontWeight: "600",
    marginVertical: 32,
    letterSpacing: 0.2,
  },
});