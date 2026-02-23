import { StyleSheet } from "react-native";

const RED = "#D32F2F";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  content: {
    padding: 16,
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

  /* ADD BUTTON */
  addWrapper: {
    padding: 16,
    alignItems: "flex-end",
  },

  addBtn: {
    backgroundColor: RED,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  addText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 13,
  },

  /* CARD */
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },

  talukRow: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: "center",
    gap:10,
  },

  stateRow:{
    // backgroundColor:'green',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingVertical:8,
    paddingRight:8,
  },

  districtRow:{
     flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:8,
    paddingRight:8,
  },

  stateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  districtText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    padding:20
  },

  arrow: {
    color: RED,
    fontSize: 14,
  },

  districtContainer: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight:10,
    paddingBottom:10,
    borderLeftWidth: 5,
    borderRadius:5,
    borderLeftColor: "#00b42a",
    backgroundColor:"#f3f3f3"
  },

  talukCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  talukName: {
    fontSize: 14,
    fontWeight: "700",
  },

  editBtn: {
    // backgroundColor: "#FDECEA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  editText: {
    color: RED,
    fontSize: 12,
    fontWeight: "600",
  },

  assigned: {
    marginTop: 6,
    backgroundColor: "#D1FADF",
    color: "#027A48",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 11,
    alignSelf: "flex-start",
  },

  unassigned: {
    marginTop: 6,
    color: RED,
    fontSize: 12,
  },

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

  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },

  assignBtn: {
    backgroundColor: RED,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  secondaryBtn: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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

  chevIcon:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    gap:6,
  }
});


