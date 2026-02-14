import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
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
    fontWeight: "600",
    color: "#777",
  },

  activeTabText: {
    color: "#D32F2F",
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 2,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  cardTitle: {
    fontSize: 13,
    color: "#777",
  },

  cardValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
    marginTop: 2,
  },

  cardSub: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },

  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 13,
    color: "#999",
  },
});
