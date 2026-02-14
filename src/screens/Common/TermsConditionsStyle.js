import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  card: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    flex: 1,
  },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 12,
  },

  text: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
  },

  checkboxText: {
    fontSize: 13,
    color: "#212121",
    marginLeft: 10,
    flex: 1,
  },

  okButton: {
    backgroundColor: "#D32F2F",
    margin: 16,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
  },

  disabledBtn: {
    backgroundColor: "#CCC",
  },

  okText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});


