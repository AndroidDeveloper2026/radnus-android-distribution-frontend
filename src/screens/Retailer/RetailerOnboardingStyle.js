import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  photoSection: {
    marginBottom: 20,
  },

  photoBox: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },

  photoText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: '700',
    marginTop: 6,
    marginLeft: 10,
  },

  photoIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    color: '#555',
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  gpsText: {
    fontSize: 13,
    color: '#212121',
    marginLeft: 6,
  },

  gpsHint: {
    fontSize: 11,
    color: '#777',
    marginTop: 6,
  },

  submitBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
