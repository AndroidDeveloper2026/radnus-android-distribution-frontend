import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  animation: {
    width: 200,
    height: 200,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    color: "#212121",
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    marginTop: 20,
    elevation: 4,
  },

  label: {
    fontSize: 13,
    color: "#757575",
    marginTop: 8,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },

  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#D32F2F",
    marginTop: 4,
  },

  primaryBtn: {
    marginTop: 25,
    backgroundColor: "#D32F2F",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  secondaryBtn: {
    marginTop: 12,
  },

  secondaryText: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "600",
  },

});

export default styles;