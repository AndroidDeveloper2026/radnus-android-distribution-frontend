import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import styles from './SplashStyle';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('SelectRole');
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo/radnus-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
