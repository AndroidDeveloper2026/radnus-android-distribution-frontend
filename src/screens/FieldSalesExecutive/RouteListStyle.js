import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  summary: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    margin: 16,
    borderRadius: 14,
    elevation: 2,
  },

  summaryText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },

  bold: {
    fontWeight: "700",
    color: "#212121",
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
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

  subRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  subText: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },

  pending: {
    fontSize: 12,
    color: "#D32F2F",
    fontWeight: "700",
  },
});
