import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 16,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },

  imageBox: {
    marginRight: 12,
  },

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  business: {
    fontSize: 14,
    color: "#555",
  },

  mobile: {
    fontSize: 14,
    marginTop: 4,
  },

  meta: {
    fontSize: 13,
    color: "#777",
  },

  address: {
    fontSize: 13,
    color: "#888",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },

  
tabContainer: {
  flexDirection: "row",
  marginHorizontal: 15,
  marginTop: 10,
  backgroundColor: "#eee",
  borderRadius: 8,
  overflow: "hidden",
},

tabButton: {
  flex: 1,
  paddingVertical: 10,
  alignItems: "center",
},

tabText: {
  fontSize: 14,
  color: "#555",
  fontWeight: "500",
},

activeTab: {
  backgroundColor: "#D32F2F",
},

activeTabText: {
  color: "#fff",
},

status: {
  marginTop: 5,
  fontSize: 12,
  fontWeight: "600",
},

approved: {
  color: "green",
},

pending: {
  color: "orange",
},

});