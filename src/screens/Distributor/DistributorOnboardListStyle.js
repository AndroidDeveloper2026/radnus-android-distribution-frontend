import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },

  activeTab: {
    borderBottomColor: "#D32F2F",
  },

  tabText: {
    fontWeight: "600",
    color: "#777",
  },

  activeTabText: {
    color: "#D32F2F",
  },

  list: {
    padding: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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

  iconCircleLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },

  sub: {
    fontSize: 12,
    color: "#777",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  label: {
    fontSize: 12,
    color: "#777",
  },

  value: {
    fontSize: 12,
    fontWeight: "600",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeApproved: {
    backgroundColor: "#91fe9a",
  },

  badgePending: {
    backgroundColor: "#fcd088",
  },

  badgeRejected: {
    backgroundColor: "#fe9d92",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },

  section: {
    marginTop: 14,
    fontWeight: "700",
    fontSize: 13,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  detailText: {
    marginLeft: 8,
    fontSize: 13,
  },

  actionRow: {
    flexDirection: "row",
    margin: 16,
  },

  approveBtn: {
    flex: 1,
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: "#D32F2F",
    padding: 12,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* 🔥 NEW ADDITIONS */

// Profile Image
avatar: {
  width: 55,
  height: 55,
  borderRadius: 28,
},

avatarPlaceholder: {
  width: 55,
  height: 55,
  borderRadius: 28,
  backgroundColor: "#eee",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},

// Text adjustments (if needed)
subText: {
  fontSize: 13,
  color: "#555",
},

mobile: {
  fontSize: 12,
  color: "#777",
},

// Delete icon
deleteIcon: {
  padding: 6,
},

// Center text (loading / empty)
center: {
  textAlign: "center",
  marginTop: 20,
},

// Error text
error: {
  color: "red",
  textAlign: "center",
  marginTop: 10,
},
statusCol:{
  flexDirection:'column',
  alignItems:'flex-end',
  gap:8,
},

btnText:{
  color:'#fff'
}
});
