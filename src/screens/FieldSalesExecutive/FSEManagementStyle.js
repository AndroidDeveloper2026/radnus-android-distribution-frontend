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
    paddingBottom: 90,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginHorizontal:16,
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
    gap:6
  },

  subText: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },

  addButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#D32F2F",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
statusCol:{
  flexDirection:'column',
  alignItems:'flex-end',
  gap:10,
},
});

