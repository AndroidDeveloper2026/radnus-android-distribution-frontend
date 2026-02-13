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

  welcomeBox: {
    marginBottom: 16,
  },

  welcome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
  },

  subWelcome: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
  },

  statLabel: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 10,
    marginTop: 10,
  },

  offerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    marginBottom: 20,
  },

  offerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#212121",
  },

  offerSub: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
  },

  offerBadge: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  offerBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  actionRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    marginBottom: 10,
  },

  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },

  arrow: {
    fontSize: 22,
    color: "#CCC",
  },
});

