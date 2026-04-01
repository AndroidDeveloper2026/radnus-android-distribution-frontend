import { StyleSheet } from "react-native";

export default StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#f5f5f5",
 },

 card: {
   margin: 16,
   backgroundColor: "#fff",
   padding: 16,
   borderRadius: 12,
 },

 label: {
   fontSize: 14,
   fontWeight: "600",
   marginBottom: 10,
 },

 input: {
   height: 120,
   borderWidth: 1,
   borderColor: "#ddd",
   borderRadius: 8,
   padding: 10,
   textAlignVertical: "top",
 },

 button: {
   marginTop: 12,
   backgroundColor: "#D32F2F",
   padding: 12,
   borderRadius: 8,
   alignItems: "center",
 },

 buttonText: {
   color: "#fff",
   fontWeight: "600",
 },
});
