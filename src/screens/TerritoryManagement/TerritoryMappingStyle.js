// import { StyleSheet } from 'react-native';

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4F5F7',
//   },

//   title: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 4,
//   },

//   content: {
//     padding: 16,
//     paddingBottom: 40,
//   },

//   subtitle: {
//     color: '#666',
//     marginTop: 12,
//     marginBottom: 12,
//   },

//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },

//   stateText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#222',
//   },

//   districtContainer: {
//     marginTop: 10,
//     paddingLeft: 10,
//   },

//   districtText: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#333',
//   },

//   talukCard: {
//     backgroundColor: '#F1F3F5',
//     borderRadius: 10,
//     padding: 10,
//     marginTop: 8,
//   },

//   talukName: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 4,
//   },

//   assigned: {
//     backgroundColor: '#D1FADF',
//     color: '#027A48',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//     fontSize: 12,
//     marginBottom: 6,
//   },

//   unassigned: {
//     color: '#D92D20',
//     fontSize: 12,
//     marginBottom: 6,
//   },

//   beatRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//   },

//   beatChip: {
//     backgroundColor: '#E4E7EC',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 20,
//     marginRight: 6,
//     marginBottom: 6,
//   },

//   beatText: {
//     fontSize: 12,
//     color: '#344054',
//   },
  
// });

//------------------------

import { StyleSheet } from "react-native";

const RED = "#D32F2F";
const BG = "#F6F6F6";
const TEXT = "#212121";
const SUB = "#777";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  subtitle: {
    fontSize: 13,
    color: SUB,
    marginBottom: 14,
  },

  /* ---------------- STATE CARD ---------------- */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  stateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  stateText: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT,
  },

  arrow: {
    fontSize: 16,
    color: RED,
  },

  /* ---------------- DISTRICT ---------------- */
  districtContainer: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#F1F1F1",
  },

  districtRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  districtText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  /* ---------------- TALUK CARD ---------------- */
  talukCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  talukTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  talukName: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT,
  },

  /* ---------------- STATUS ---------------- */
  assigned: {
    backgroundColor: "#E6F4EA",
    color: "#1B5E20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "600",
  },

  unassigned: {
    backgroundColor: "#FDECEA",
    color: RED,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "600",
  },

  /* ---------------- ACTIONS ---------------- */
  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },

  actionBtn: {
    backgroundColor: RED,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  actionText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },

  secondaryBtn: {
    backgroundColor: "#F1F1F1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  secondaryText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },

  /* ---------------- BEATS ---------------- */
  beatRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
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

  /* ---------------- EMPTY ---------------- */
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
