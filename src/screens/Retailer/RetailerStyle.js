import { StyleSheet } from "react-native";

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },

  header: {
    fontSize: 18,
    fontWeight: "700",
    padding: 16,
    backgroundColor: "#D32F2F",
    color: "#FFFFFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  badge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: "#FFFFFF",
  },

  approved: {
    backgroundColor: "#388E3C",
  },

  rejected: {
    backgroundColor: "#D32F2F",
  },

  pending: {
    backgroundColor: "#F57C00",
  },

  subText: {
    fontSize: 13,
    color: "#616161",
    marginTop: 4,
  },

  actionBtn: {
    marginTop: 10,
    backgroundColor: "#D32F2F",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "600",
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
    borderRadius: 12,
    padding: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  modalText: {
    fontSize: 14,
    fontWeight: "600",
  },

  modalSub: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 12,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  approveBtn: {
    backgroundColor: "#388E3C",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 6,
    alignItems: "center",
  },

  rejectBtn: {
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 6,
    alignItems: "center",
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  cancelText: {
    marginTop: 12,
    textAlign: "center",
    color: "#757575",
  },
});

export default styles;