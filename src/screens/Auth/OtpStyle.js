import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /*  TOP BAR */
  header: {
    height: 220,
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 20,
  },

  backButton: {
    position: 'absolute',
    left: 5,
    padding: 8,
    paddingBottom: 30,
  },

  content: {
    marginTop: -70,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    elevation: 0.8,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 20,
  },

  mobileText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 24,
  },

  /* OTP INPUT */
  otpInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 18,
    letterSpacing: 6,
    textAlign: 'center',
    color: '#212121',
  },

  /* BUTTON */
  button: {
    marginTop: 24,
    height: 44,
    backgroundColor: '#D32F2F',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  /* RESEND */
  resendContainer: {
    marginTop: 16,
    alignItems: 'center',
  },

  resendText: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '500',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  otpBox: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },

  otpBoxActive: {
    borderColor: '#D32F2F',
  },

  timerText: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});

export default styles;
