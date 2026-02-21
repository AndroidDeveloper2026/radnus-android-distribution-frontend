import { StyleSheet } from "react-native";

const RED = "#D32F2F";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#212121",
  },

  label: {
    fontSize: 12,
    color: "#555",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  button: {
    marginTop: 20,
    backgroundColor: RED,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    elevation: 2,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
});

