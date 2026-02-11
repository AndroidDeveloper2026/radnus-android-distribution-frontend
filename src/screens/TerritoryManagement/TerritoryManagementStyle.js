import { StyleSheet } from "react-native";


 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },


  header: {
    backgroundColor: "#D32F2F",
    padding: 16,
  },


  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },


  headerSub: {
    color: "#FFCDD2",
    fontSize: 13,
    marginTop: 4,
  },


  primaryButton: {
    backgroundColor: "#D32F2F",
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },


  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },


  content: {
    padding: 16,
  },


  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },


  districtRow: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
  },


  districtName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
  },


  talukRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },


  talukName: {
    fontSize: 14,
    color: "#212121",
  },


  status: {
    fontSize: 12,
    fontWeight: "600",
    color: "#388E3C",
  },


  inactive: {
    color: "#D32F2F",
  },


  addTalukButton: {
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },


  addTalukText: {
    color: "#D32F2F",
    fontWeight: "600",
  },


  /* MODAL */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
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
    marginBottom: 12,
  },


  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },


  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },


  cancelText: {
    marginRight: 20,
    color: "#757575",
  },


  saveButton: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },


  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default styles;