import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  infoBox: {
    backgroundColor: "#FFF3E0",
    margin: 16,
    padding: 12,
    borderRadius: 12,
  },

  infoText: {
    fontSize: 12,
    color: "#E65100",
    lineHeight: 16,
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

  sku: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  statusBox: {
    alignItems: "center",
    minWidth: 50,
  },

  inStock: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 2,
  },

  lowStock: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F57C00",
    marginTop: 2,
  },

  outStock: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D32F2F",
  },
});
