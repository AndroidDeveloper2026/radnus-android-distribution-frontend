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

  imageSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  imageWrapper: {
    position: "relative",
  },

  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEE",
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#D32F2F",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  imageHint: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    color: "#555",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  disabled: {
    backgroundColor: "#EFEFEF",
    color: "#999",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D32F2F",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginRight: 10,
  },

  cancelText: {
    color: "#D32F2F",
    fontWeight: "700",
  },

  saveBtn: {
    flex: 1,
    backgroundColor: "#D32F2F",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  saveText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
