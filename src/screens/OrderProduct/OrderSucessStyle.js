import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#9E9E9E",
    marginTop: 6,
  },

  /* MODAL */
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    alignItems: "center",
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  checkIcon: {
    fontSize: 30,
    color: "#2E7D32",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 20,
  },

  /* INFO BOX */
  infoBox: {
    width: "100%",
    backgroundColor: "#F9F9F9",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 13,
    color: "#757575",
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#D32F2F",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
  },

  /* BUTTONS */
  primaryBtn: {
    width: "100%",
    backgroundColor: "#D32F2F",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  outlineBtn: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#D32F2F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  outlineText: {
    color: "#D32F2F",
    fontSize: 15,
    fontWeight: "600",
  },
  ghostBtn: {
    paddingVertical: 10,
  },
  ghostText: {
    color: "#9E9E9E",
    fontSize: 14,
    fontWeight: "500",
  },

});

export default styles;