import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  outerBorder: {
    margin: 10,
    borderWidth: 2,
    borderColor: '#000',
  },

  headerSection: {
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000',
  },

  companyName: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  companyText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 1,
  },

  companyTextBold: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 1,
  },

  invoiceTitleBox: {
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 6,
    alignItems: 'center',
  },

  invoiceTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  twoCol: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },

  colLeft: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: '#000',
  },

  colRight: {
    flex: 1,
    padding: 0,
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 3,
  },

  bodyText: {
    fontSize: 10,
    marginTop: 1,
  },

  metaRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },

  metaLabel: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    padding: 3,
    borderRightWidth: 1,
    borderColor: '#000',
  },

  metaValue: {
    flex: 1,
    fontSize: 9,
    padding: 3,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#000',
  },

  th: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },

  td: {
    fontSize: 9,
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#000',
  },

  amountWords: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#000',
  },

  amountWordsLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  amountWordsValue: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },

  declaration: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#000',
  },

  declarationTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },

  declarationText: {
    fontSize: 9,
  },

  signatureRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    minHeight: 70,
  },

  sigLeft: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: '#000',
  },

  sigRight: {
    flex: 1,
    padding: 8,
    alignItems: 'flex-end',
  },

  sigCompany: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  sigLine: {
    marginTop: 35,
    borderTopWidth: 1,
    borderColor: '#000',
    width: '100%',
  },

  sigText: {
    fontSize: 9,
    textAlign: 'center',
    width: '100%',
  },

  footerBox: {
    padding: 6,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 9,
    color: '#555',
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#D32F2F',
    width: 65,
    height: 65,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  fabText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 2,
  },

});

export default styles;