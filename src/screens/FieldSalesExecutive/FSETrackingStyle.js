import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  bottomCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  mainDistance: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  infoBox: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    color: '#777',
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },

  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
  },

  date: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
  },
});