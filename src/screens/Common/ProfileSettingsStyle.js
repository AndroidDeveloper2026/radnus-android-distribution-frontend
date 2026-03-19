import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },

  /* ── Profile Card ── */
  profileCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 8,
    backgroundColor: "#F0F0F0",
  },

  roleBadge: {
    backgroundColor: "#FFF3F3",
    borderColor: "#D32F2F",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginBottom: 8,
  },

  roleBadgeText: {
    fontSize: 11,
    color: "#D32F2F",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
    textAlign: "center",
  },

  subText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    textAlign: "center",
  },

  statusBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusApproved: {
    backgroundColor: "#E8F5E9",
  },

  statusPending: {
    backgroundColor: "#FFF8E1",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  statusApprovedText: {
    color: "#2E7D32",
  },

  statusPendingText: {
    color: "#F57F17",
  },

  editButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D32F2F",
  },

  editText: {
    fontSize: 13,
    color: "#D32F2F",
    fontWeight: "700",
  },

  /* ── Sections ── */
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    elevation: 2,
    paddingBottom: 6,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#444",
    marginLeft: 16,
    marginVertical: 10,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderColor: "#EEE",
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  itemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },

  desc: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  status: {
    fontSize: 11,
    fontWeight: "700",
    marginRight: 8,
  },

  verified: {
    color: "#2E7D32",
  },

  pending: {
    color: "#D32F2F",
  },

  /* ── Logout ── */
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#D32F2F",
    margin: 20,
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
});