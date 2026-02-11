import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
    paddingBottom: 30,
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

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },

  
  pickerWrapper: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#030303',
    textAlign: 'center',
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#212121',
  },

  error: {
    color: '#D32F2F',
    fontSize: 13,
    textAlign: 'left',
    marginVertical: 8,
  },

  /* BUTTON */
  button: {
    height: 46,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
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

export default styles;
