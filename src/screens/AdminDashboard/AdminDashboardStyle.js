import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  /* SECTION TITLE (like screenshot) */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
    marginTop: 24,
    marginBottom: 12,
  },

  /* KPI GRID */
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'center',
    marginBottom: 14,
  },

  kpiBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,

    /* soft card shadow like reference */
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // elevation: 2,
        display:'flex',
   justifyContent:'space-between',
   alignItems:'center',
   gap:5,
  },


  kpiLabel: {
    fontSize: 13,
    color: "#757575",
    fontWeight: "500",
  },

  kpiValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#212121",
  },

  /* ACTION / QUICK NAV ITEMS */
  navItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // elevation: 2,
  },

  navTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#212121",
  },

  navSubTitle: {
    fontSize: 13,
    color: "#757575",
    marginTop: 6,
    lineHeight: 18,
  },


});

export default styles;
