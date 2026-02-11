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

  totalCard: {
    backgroundColor: "#D32F2F",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
  },

  totalLabel: {
    fontSize: 12,
    color: "#FFECEC",
    marginTop: 4,
  },

  list: {
    paddingTop:16,
    paddingHorizontal: 16,
    paddingBottom: 20,
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
});

