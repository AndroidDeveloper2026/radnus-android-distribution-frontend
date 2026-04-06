import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFF",
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#D32F2F",
  },

  tabText: {
    fontSize: 13,
    color: "#777",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#D32F2F",
  },

  // ✅ NEW - Time Filter Row (for Day/Week/Month toggles)
  timeFilterRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 6,
    flexWrap: "wrap",
  },

  // ✅ NEW - Time Filter Button
  timeFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  // ✅ NEW - Time Filter Button Active State
  timeFilterBtnActive: {
    backgroundColor: "#D32F2F",
    borderColor: "#D32F2F",
  },

  // ✅ NEW - Time Filter Text
  timeFilterText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },

  // ✅ NEW - Time Filter Text Active State
  timeFilterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  // ✅ IMPROVED RED CARD - More compact, better details display
  totalCard: {
    backgroundColor: "#D32F2F",
    margin: 12,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  // ✅ IMPROVED - Larger prominent amount
  totalValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  // ✅ IMPROVED - Subtitle
  totalLabel: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "400",
    marginBottom: 10,
  },

  // ✅ NEW - Summary rows with better organization
  summaryRow: {
    width: "100%",
    gap: 0,
  },

  // ✅ IMPROVED - Individual summary items with better layout
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 0,
    justifyContent: "space-between",
    width: "100%",
  },

  // ✅ IMPROVED - Summary item left side (icon + label)
  summaryItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  // ✅ NEW - Summary item right side (value)
  summaryItemRight: {
    alignItems: "flex-end",
  },

  // ✅ IMPROVED - Summary text (label)
  summaryText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "400",
    marginLeft: 6,
  },

  // ✅ NEW - Summary value text
  summaryValue: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  list: {
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  historyCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212121",
  },

  sku: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10,
  },

  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    fontSize: 12,
    color: "#777",
  },

  bold: {
    fontSize: 13,
    fontWeight: "700",
    color: "#212121",
  },

  date: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  qty: {
    fontSize: 13,
    fontWeight: "700",
  },

  inward: {
    color: "#2E7D32",
  },

  outward: {
    color: "#D32F2F",
  },

  emptyContainer: {
    padding: 20,
    alignItems: "center",
    marginTop: 40,
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptySubText: {
    textAlign: "center",
    color: "#BBB",
    fontSize: 12,
    lineHeight: 18,
  },

  price: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },

  totalAmount: {
    fontSize: 11,
    fontWeight: "600",
    color: "#212121",
    marginTop: 2,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
