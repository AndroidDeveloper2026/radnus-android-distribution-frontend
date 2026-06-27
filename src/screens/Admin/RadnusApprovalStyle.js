import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  activeTab: {
    borderBottomColor: '#D32F2F',
  },

  tabText: {
    fontWeight: '600',
    color: '#777',
  },

  activeTabText: {
    color: '#D32F2F',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDECEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
  },

  subText: {
    fontSize: 13,
    color: '#555',
  },

  mobile: {
    fontSize: 12,
    color: '#777',
  },

  sub: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  badgeApproved: {
    backgroundColor: '#91fe9a',
  },

  badgePending: {
    backgroundColor: '#fcd088',
  },

  badgeRejected: {
    backgroundColor: '#fe9d92',
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  approveBtn: {
    flex: 1,
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  reasonText: {
    marginTop: 8,
    fontSize: 12,
    color: '#D32F2F',
  },

  center: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },

  modalActionRow: {
    flexDirection: 'row',
    marginTop: 16,
  },

  cancelBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: '#eee',
  },

  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
});
