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

  sectionTitle: {
    fontSize: 16,
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
    backgroundColor: '#ffffff',
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
    marginTop: 20,
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

  infoAccuracy: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  // infoAddressValue: {
  //  fontSize: 13,
  //  color: '#212121',
  //  marginTop: 6,
  // },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  cardLabel: {
    fontSize: 13,
    color: '#6B7280',
  },

  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  address: {
    marginTop: 6,
    fontSize: 14,
    color: '#374151',
  },

  startButton: {
    marginTop: 20,
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  startButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default FSEHomeStyles;
