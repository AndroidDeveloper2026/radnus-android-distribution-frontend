import { StyleSheet } from 'react-native';

const FSEHomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebeaea',
  },

  /* TOP BAR */
  header: {
    height: 56,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },

  infoBox: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    backgroundColor:'#ffffff'
  },

  infoLabel: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
  },

    infoAddressValue: {
    marginTop:20,  
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
  },

  gpsStatus: {
    fontSize: 14,
    marginTop: 8,
    color: '#212121',
  },

  button: {
    marginTop: 24,
    height: 44,
    backgroundColor: '#D32F2F',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default FSEHomeStyles;
