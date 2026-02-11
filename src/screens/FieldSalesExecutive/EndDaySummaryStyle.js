import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
    elevation: 2,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
  },

  label: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 6,
  },

  note: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
  },

  submitBtn: {
    flexDirection: "row",
    backgroundColor: "#D32F2F",
    paddingVertical: 16,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
});
