import { StyleSheet, StatusBar, Platform } from 'react-native';

const RED = '#D32F2F';
const LIGHT_BG = '#F6F6F6';
// const GRAY = "#777";

const AddProductStyle = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'#D32F2F',
  },

  // header: {
  //   backgroundColor: RED,
  // },

  // headerTitle: {
  //   color: "#fff",
  //   fontSize: 18,
  //   fontWeight: "600",
  // },

  form: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 10,
    // backgroundColor: RED,
  },

  //   inputContainer: {
  //     marginBottom: 14,
  //   },

  //   label: {
  //     fontSize: 13,
  //     color: GRAY,
  //     marginBottom: 6,
  //   },

  //   input: {
  //     backgroundColor: "#fff",
  //     borderRadius: 8,
  //     paddingHorizontal: 12,
  //     paddingVertical: 10,
  //     fontSize: 14,
  //     borderWidth: 1,
  //     borderColor: "#E0E0E0",
  //   },

  saveButton: {
    // flex:1,
    width: '100%',
    // marginTop: 20,
    backgroundColor: RED,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  label: {
    fontSize: 13,
    color: '#212121',
    marginBottom: 6,
  },

  imageBox: {
    height: 140,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },

  imagePlaceholder: {
    color: '#757575',
    fontSize: 14,
  },

  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  saveBtnCard: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    paddingBottom: 54,
    paddingTop:20,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default AddProductStyle;
