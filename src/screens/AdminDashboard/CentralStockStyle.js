import { StyleSheet } from "react-native";

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },

  /* HEADER */
  header: {
    backgroundColor: "#D32F2F",
    padding: 16,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  headerSub: {
    color: "#FFEBEE",
    fontSize: 12,
    marginTop: 4,
  },

  /* SUMMARY */
  summaryBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 16,
    paddingVertical: 14,
    elevation: 3,
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#D32F2F",
    textAlign: "center",
  },

  summaryLabel: {
    fontSize: 12,
    color: "#616161",
    textAlign: "center",
    marginTop: 2,
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#D32F2F",
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#212121",
  },

  qty: {
    fontSize: 22,
    fontWeight: "900",
    color: "#D32F2F",
  },

  sku: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },

  date: {
    fontSize: 11,
    color: "#9E9E9E",
    marginTop: 2,
  },

  /* ACTIONS */
  actionsRow: {
    flexDirection: "row",
    marginTop: 14,
    justifyContent: "space-between",
  },

  inwardBtn: {
    backgroundColor: "#388E3C",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  outwardBtn: {
    backgroundColor: "#F57C00",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  editBtn: {
    backgroundColor: "#212121",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  /* MODAL */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  modalProduct: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap:8,
    marginTop: 16,
  },

  cancelText: {
    color: "#000000",
    textAlign:'center',
    fontWeight: "700",
  },

    CancelBtn: {
    flex:1,
    backgroundColor: "#dbdbdb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  saveBtn: {
    flex:1,
    backgroundColor: "#D32F2F",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign:'center'
  },

  topRow: {
  flexDirection: "row",
  alignItems: "center",
},

productImage: {
  width: 64,
  height: 64,
  borderRadius: 10,
  backgroundColor: "#F5F5F5",
},

info: {
  flex: 1,
  marginLeft: 12,
},

qtyBox: {
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FDECEA",
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 6,
},

qtyLabel: {
  fontSize: 11,
  color: "#757575",
},

});

export default styles;