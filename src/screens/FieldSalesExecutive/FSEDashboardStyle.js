import { StyleSheet } from 'react-native';

const FSEDashboardStyle = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },

  /* 🔴 HEADER */
  header: {
    height: 56,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  content: {
    padding: 16,
  },

  welcome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },

  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },

  /* KPI GRID */
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDECEC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
  },

  cardLabel: {
    fontSize: 13,
    color: '#757575',
    marginTop: 4,
  },

  /* QUICK ACTION */
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginVertical: 14,
  },

  actionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    marginLeft: 12,
  },

});

export default FSEDashboardStyle;
