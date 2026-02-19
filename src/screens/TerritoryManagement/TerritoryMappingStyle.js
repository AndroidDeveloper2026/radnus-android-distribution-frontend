import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  subtitle: {
    color: '#666',
    marginTop: 12,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  stateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  districtContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },

  districtText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },

  talukCard: {
    backgroundColor: '#F1F3F5',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },

  talukName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },

  assigned: {
    backgroundColor: '#D1FADF',
    color: '#027A48',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    fontSize: 12,
    marginBottom: 6,
  },

  unassigned: {
    color: '#D92D20',
    fontSize: 12,
    marginBottom: 6,
  },

  beatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  beatChip: {
    backgroundColor: '#E4E7EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },

  beatText: {
    fontSize: 12,
    color: '#344054',
  },
  
});
