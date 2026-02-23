
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },

  /* HEADER */
  header: {
    height: 56,
    backgroundColor: "#D32F2F",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    padding: 16,
  },

  /* PRODUCT CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  imageBox: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 8,
  },

  info: {
    flex: 1,
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
  },

  sku: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },

  priceRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },

  priceText: {
    fontSize: 13,
    color: "#212121",
  },

  highlight: {
    color: "#D32F2F",
    fontWeight: "600",
  },

  moq: {
    fontSize: 12,
    color: "#388E3C",
    marginTop: 6,
  },
});

export default styles;
