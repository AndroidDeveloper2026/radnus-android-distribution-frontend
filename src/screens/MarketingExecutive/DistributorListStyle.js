import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 16,
  },

  // ── Card ──────────────────────────────────────────
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    alignItems: 'flex-start',
  },

  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e5e7eb',
    marginRight: 14,
    marginTop: 2,
  },

  // ── Info block ────────────────────────────────────
  info: {
    flex: 1,
    gap: 5,
  },

  // Name + status badge on same row
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    marginRight: 8,
  },

  // ── Status badge ──────────────────────────────────
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },

  approvedBadge: {
    backgroundColor: '#f0fdf4',
  },

  pendingBadge: {
    backgroundColor: '#fffbeb',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  approvedText: {
    color: '#16a34a',
  },

  pendingText: {
    color: '#d97706',
  },

  // ── Detail rows ───────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  business: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },

  mobile: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },

  meta: {
    fontSize: 12,
    color: '#777',
  },

  address: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
    fontSize: 14,
  },

  // ── Tabs ──────────────────────────────────────────
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },

  tabText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  activeTab: {
    backgroundColor: '#D32F2F',
  },

  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  rejectedTab: {
    backgroundColor: '#dc2626',
  },

  rejectedTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  rejectedBadge: {
    backgroundColor: '#fef2f2',
  },

  rejectedText: {
    color: '#dc2626',
  },
});
