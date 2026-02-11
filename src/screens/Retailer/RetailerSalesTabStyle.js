import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
  },

  /* ❌ BLOCKED */
  blockedText: {
    marginTop: 32,
    textAlign: 'center',
    color: '#D32F2F',
    fontSize: 15,
    fontWeight: '700',
  },

  /* 🔴 SUMMARY – HERO CARD */
  summaryCard: {
    backgroundColor: '#D32F2F', // BLACK HERO
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },

  summaryTitle: {
    fontSize: 12,
    color: '#f6f5f5',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  summaryAmount: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 8,
  },

  summarySub: {
    fontSize: 13,
    color: '#FFCDD2',
    marginTop: 6,
    fontWeight: '600',
  },

  /* 🧾 SALES CARD */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
    shadowColor: '#05050500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  invoice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#212121',
    letterSpacing: 0.4,
  },

  amount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D32F2F', // BRAND RED
  },

  subText: {
    fontSize: 12,
    color: '#616161',
    marginTop: 8,
  },

  /* 🏷️ CHIP STYLE (OPTIONAL EXTENSION) */
  chip: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FDECEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D32F2F',
  },
});

export default styles;
