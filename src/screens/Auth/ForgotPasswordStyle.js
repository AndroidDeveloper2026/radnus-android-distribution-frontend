import { StyleSheet } from "react-native";

const RED = "#D32F2F";
const LIGHT_BG = "#F6F6F6";
const DARK = "#212121";
const GRAY = "#757575";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* HEADER */
  header: {
    height: 220,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 5,
    padding: 8,
    paddingBottom: 25,
  },

    /* CARD */
  card: {
    marginTop: -70,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 0.8,
  },


  /* ----------- TITLE ----------- */
 
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },

  subText: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 35,
    lineHeight: 20,
  },

  /* ----------- INPUT ----------- */
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom:60,
    fontSize: 14,
    color: '#212121',
  },

  /* ----------- BUTTON ----------- */
  button: {
    height: 52,
    backgroundColor: RED,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

});



