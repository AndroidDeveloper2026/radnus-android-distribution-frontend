import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';

/* 🔐 Request Camera Permission */
export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera access to take photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission Error:', err);
      return false;
    }
  }
  return true;
};



/* 📸 Open Camera */
export const openCamera = async (onSuccess) => {
  const hasPermission = await requestCameraPermission();

  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Camera permission is required');
    return;
  }

  launchCamera(
    {
      mediaType: 'photo',
      quality: 0.7,
      saveToPhotos: false,
    },
    (res) => {
      if (res.didCancel) return;

      if (res.errorCode) {
        Alert.alert('Error', res.errorMessage || 'Camera error');
        return;
      }

      if (res.assets && res.assets.length > 0) {
        const asset = res.assets[0];

        const image = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
        };

        onSuccess(image); // 🔥 return image to caller
      }
    }
  );
};