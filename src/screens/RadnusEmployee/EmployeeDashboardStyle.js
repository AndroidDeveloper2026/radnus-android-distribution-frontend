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

  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

    kpiBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,

    /* soft card shadow like reference */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },

  kpiLabel: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
  },

  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
  },

  statCard: {
    justifyContent:'center',
    alignItems:'center',
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
