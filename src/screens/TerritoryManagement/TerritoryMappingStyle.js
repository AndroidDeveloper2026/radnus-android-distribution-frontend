import { StyleSheet } from "react-native";

const RED = "#D32F2F";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: "#212121",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginBottom: 12,
  },

  /* ADD BUTTON & STATS */
  addWrapper: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statsContainer: {
    flex: 1,
  },

  statsText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  addBtn: {
    backgroundColor: RED,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10,
  },

  addText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 13,
  },

  /* COUNT BADGES */
  countBadge: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
    fontWeight: '400',
  },

  countBadgeSmall: {
    fontSize: 11,
    color: '#999',
    marginLeft: 6,
    fontWeight: '400',
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },

  emptyBtn: {
    backgroundColor: RED,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  emptyBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },

  /* CARD */
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },

  /* STATE */
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 8,
  },

  stateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  /* DISTRICT */
  districtContainer: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    borderLeftWidth: 5,
    borderRadius: 5,
    borderLeftColor: "#00b42a",
    backgroundColor: "#f3f3f3",
  },

  districtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 8,
  },

  districtText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingLeft: 20,
  },

  /* TALUK */
  talukCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  talukHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  talukName: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },

  talukActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  actionBtn: {
    marginRight: 6,
  },

  chevIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },

  /* ASSIGNMENT */
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },

  assigned: {
    backgroundColor: "#D1FADF",
    color: "#027A48",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "600",
  },

  unassignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },

  unassigned: {
    color: RED,
    fontSize: 12,
    fontWeight: "600",
  },

  /* BEATS */
  beatRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  beatChip: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },

  beatText: {
    fontSize: 11,
    color: RED,
    fontWeight: "600",
  },

  noBeat: {
    fontSize: 12,
    color: "#999",
  },

  /* ACTION BUTTONS */
  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  assignBtn: {
    backgroundColor: RED,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },

  secondaryBtn: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },

  btnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },

  secondaryText: {
    fontSize: 12,
    color: "#333",
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
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 4,
  },

  modalSubtitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 16,
  },

  inputContainer: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#555",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#F8F8F8",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 10,
  },

  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },

  cancelBtn: {
    backgroundColor: "#F1F1F1",
  },

  cancelBtnText: {
    color: "#666",
    fontWeight: "600",
  },

  primaryModalBtn: {
    backgroundColor: RED,
  },

  primaryModalBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

//++++++++++++++++++++++++++++++++++++++++++++++++
// import { StyleSheet } from "react-native";

// const RED = "#D32F2F";

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F6F6F6",
//   },

//   content: {
//     padding: 16,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 4,
//     color: "#212121",
//   },

//   subtitle: {
//     fontSize: 13,
//     color: "#777",
//     marginBottom: 12,
//   },

//   /* ADD BUTTON */
//   addWrapper: {
//     padding: 16,
//     alignItems: "flex-end",
//   },

//   addBtn: {
//     backgroundColor: RED,
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 10,
//   },

//   addText: {
//     color: "#FFF",
//     fontWeight: "600",
//     fontSize: 13,
//   },

//   /* CARD */
//   card: {
//     backgroundColor: "#FFF",
//     borderRadius: 8,
//     padding: 14,
//     marginBottom: 12,
//     elevation: 1,
//   },

//   talukRow: {
//     flexDirection: "row",
//     justifyContent: 'flex-end',
//     alignItems: "center",
//     gap:10,
//   },

//   stateRow:{
//     // backgroundColor:'green',
//     flexDirection:'row',
//     justifyContent:'space-between',
//     paddingVertical:8,
//     paddingRight:8,
//   },

//   districtRow:{
//      flexDirection:'row',
//     justifyContent:'space-between',
//     alignItems:'center',
//     paddingVertical:8,
//     paddingRight:8,
//   },

//   stateText: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#222",
//   },

//   districtText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     padding:20
//   },

//   arrow: {
//     color: RED,
//     fontSize: 14,
//   },

//   districtContainer: {
//     marginTop: 10,
//     paddingLeft: 10,
//     paddingRight:10,
//     paddingBottom:10,
//     borderLeftWidth: 5,
//     borderRadius:5,
//     borderLeftColor: "#00b42a",
//     backgroundColor:"#f3f3f3"
//   },

//   talukCard: {
//     backgroundColor: "#FAFAFA",
//     borderRadius: 12,
//     padding: 12,
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: "#EEE",
//   },

//   talukName: {
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   editBtn: {
//     // backgroundColor: "#FDECEA",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },

//   editText: {
//     color: RED,
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   assigned: {
//     marginTop: 6,
//     backgroundColor: "#D1FADF",
//     color: "#027A48",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//     fontSize: 11,
//     alignSelf: "flex-start",
//   },

//   unassigned: {
//     marginTop: 6,
//     color: RED,
//     fontSize: 12,
//   },

//   beatRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 8,
//   },

//   beatChip: {
//     backgroundColor: "#FFE5E5",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//     marginRight: 6,
//     marginBottom: 6,
//   },

//   beatText: {
//     fontSize: 11,
//     color: RED,
//     fontWeight: "600",
//   },

//   noBeat: {
//     fontSize: 12,
//     color: "#999",
//   },

//   actionRow: {
//     flexDirection: "row",
//     marginTop: 10,
//     justifyContent: "space-between",
//   },

//   assignBtn: {
//     backgroundColor: RED,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },

//   secondaryBtn: {
//     backgroundColor: "#F1F1F1",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },

//   btnText: {
//     color: "#FFF",
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   secondaryText: {
//     fontSize: 12,
//     color: "#333",
//     fontWeight: "600",
//   },

//   chevIcon:{
//     flexDirection:'row',
//     justifyContent:'flex-start',
//     alignItems:'center',
//     gap:6,
//   }
// });


