import { ToastAndroid, Platform } from 'react-native';

const showToast = (message, duration = 'short', position = 'bottom') => {
  if (Platform.OS === 'android') {
    const toastDuration =
      duration === 'long'
        ? ToastAndroid.LONG
        : ToastAndroid.SHORT;

    const toastPosition =
      position === 'top'
        ? ToastAndroid.TOP
        : position === 'center'
        ? ToastAndroid.CENTER
        : ToastAndroid.BOTTOM;

    ToastAndroid.showWithGravity(
      message,
      toastDuration,
      toastPosition
    );
  } else {
    console.warn('Toast is only supported on Android');
  }
};

export default showToast;
