import { StyleSheet } from 'react-native';

const SelectRoleStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* HEADER */
  header: {
    height:'50%',
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* CARD */
  card: {
    marginTop: -100,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 0.8,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 0,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#030303',
    textAlign: 'center',
  },
  
  loginContent:{
    marginVertical:20,
  },

  /* BUTTON */
  button: {
    height: 46,
    borderRadius: 8,
    borderWidth:1,
    borderColor:'#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  buttonText: {
    color: '#D32F2F',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  richtext: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
    justifyContent: 'center',
    gap: 8,
  },
  richtextBtn: {
    color: '#D32F2F',
  },
});

export default SelectRoleStyles;
