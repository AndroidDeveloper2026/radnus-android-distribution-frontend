import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f9",
  },

  scroll: {
    padding: 16,
  },

  header: {
    backgroundColor: "#D32F2F",
    padding: 16,
    borderRadius: 10,
  },

  headerTitle: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "700",
  },

  headerStatus: {
    color: "#FFCDD2",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
  },

  label: {
    fontSize: 13,
    color: "#616161",
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginTop: 4,
  },

  primaryBtn: {
    marginTop: 20,
    backgroundColor: "#D32F2F",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#000000",
    fontWeight: "700",
  },
});

export default styles;
