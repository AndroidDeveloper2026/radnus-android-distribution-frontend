import { StyleSheet } from "react-native";


const RED = "#D32F2F";
// const GREEN = "#2E7D32";
// const GRAY = "#777";
const LIGHT_BG = "#F6F6F6";

const ProductMasterStyle = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  addWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: "flex-end",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: RED,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
    marginLeft: 6,
  },

  list: {
    padding: 16,
  },


});

export default ProductMasterStyle;