import { StyleSheet } from 'react-native';

const PRIMARY = '#d32f2f';
const GREEN = '#2e7d32';
const GREY_DARK = '#212121';
const GREY_MID = '#555';
const GREY_LIGHT = '#888';
const WHITE = '#ffffff';

const styles = StyleSheet.create({

  // ─── TABS ──────────────────────────────────────────────
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: WHITE,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 20,
    gap: 5,
  },

  activeTab: {
    backgroundColor: PRIMARY,
    elevation: 3,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },

  text: {
    color: GREY_MID,
    fontSize: 13,
    fontWeight: '500',
  },

  activeText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },

  // ─── BADGE ─────────────────────────────────────────────
  badge: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 22,
    alignItems: 'center',
  },

  activeBadge: {
    backgroundColor: WHITE,
  },

  badgeText: {
    fontSize: 11,
    color: GREY_MID,
    fontWeight: 'bold',
  },

  activeBadgeText: {
    color: PRIMARY,
    fontWeight: 'bold',
  },

  // ─── SEARCH BAR ────────────────────────────────────────
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: GREY_DARK,
    padding: 0,
  },

  // ─── CARD ──────────────────────────────────────────────
  card: {
    backgroundColor: WHITE,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
  },

  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 2,
  },

  // ─── ICON BOX ──────────────────────────────────────────
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconSpacing: {
    marginRight: 6,
  },

  // ─── TEXT STYLES ───────────────────────────────────────
  date: {
    color: GREY_LIGHT,
    fontSize: 12,
    letterSpacing: 0.2,
  },

  biller: {
    fontSize: 15,
    fontWeight: '700',
    color: GREY_DARK,
    letterSpacing: 0.2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  invoice: {
    color: GREY_MID,
    fontSize: 13,
    fontWeight: '500',
  },

  amount: {
    fontWeight: '800',
    color: GREEN,
    fontSize: 14,
  },

  mode: {
    color: GREY_LIGHT,
    fontSize: 12,
    textTransform: 'capitalize',
    fontWeight: '500',
  },

  // ─── STATES ────────────────────────────────────────────
  centerBox: {
    alignItems: 'center',
    marginTop: 70,
    gap: 14,
  },

  errorText: {
    color: PRIMARY,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 20,
  },

  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
    elevation: 2,
  },

  retryText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 14,
  },

  emptyText: {
    color: GREY_LIGHT,
    textAlign: 'center',
    marginTop: 60,
    fontSize: 14,
    lineHeight: 22,
  },
});

export default styles;