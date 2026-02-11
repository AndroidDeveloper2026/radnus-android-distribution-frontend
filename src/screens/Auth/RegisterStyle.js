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

  error: {
  color: 'red',
  fontSize: 12,
  marginVertical: 8,
},


  backButton: {
    position: 'absolute',
    left: 5,
    padding: 8,
    paddingBottom: 30,
  },

  card: {
    height: 600,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    marginTop: -70, // overlap header
    elevation: 0.8,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 16,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    paddingBottom: 20,
  },

  label: {
    fontSize: 14,
    color: '#212121',
    marginTop: 10,
    marginBottom: 4,
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

  pickerWrapper: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    
  },

  button: {
    marginTop: 20,
    height: 46,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default styles;
