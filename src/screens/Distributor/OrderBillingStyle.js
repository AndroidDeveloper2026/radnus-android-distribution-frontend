
// import { StyleSheet } from "react-native";

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F6F6F6",
//   },

//   list: {
//     padding: 16,
//     paddingBottom: 20,
//   },

//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 14,
//     elevation: 2,
//   },

//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   iconCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#FDECEA",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },

//   orderId: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#212121",
//   },

//   retailer: {
//     fontSize: 12,
//     color: "#777",
//     marginTop: 2,
//   },

//   amount: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#D32F2F",
//     marginTop: 4,
//   },

//   status: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#1976D2",
//   },

//   actions: {
//     flexDirection: "row",
//     marginTop: 12,
//     justifyContent: "flex-end",
//   },

//   approveBtn: {
//     flexDirection: "row",
//     backgroundColor: "#2E7D32",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     alignItems: "center",
//   },

//   invoiceBtn: {
//     flexDirection: "row",
//     backgroundColor: "#1976D2",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     alignItems: "center",
//   },

//   dispatchBtn: {
//     flexDirection: "row",
//     backgroundColor: "#D32F2F",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     alignItems: "center",
//   },

//   btnText: {
//     color: "#FFF",
//     fontSize: 12,
//     fontWeight: "700",
//     marginLeft: 6,
//   },
// });

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    paddingVertical: 10,
  },

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },

  activeTab: {
    borderBottomColor: "#D32F2F",
  },

  tabText: {
    color: "#777",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#D32F2F",
  },

  // Card
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
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

  orderId: {
    fontSize: 14,
    fontWeight: "700",
  },

  retailer: {
    fontSize: 12,
    color: "#777",
  },

  amount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D32F2F",
  },

  metaText: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  approveBtn: {
    flexDirection: "row",
    backgroundColor: "#2E7D32",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
  },

  dispatchBtn: {
    flexDirection: "row",
    backgroundColor: "#D32F2F",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
  },

  btnText: {
    color: "#FFF",
    fontSize: 12,
    marginLeft: 6,
  },
});

