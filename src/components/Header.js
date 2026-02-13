import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LeftArrow from '../assets/svg/white-left-arrow.svg';
import { useNavigation } from '@react-navigation/native';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Header = ({ title, showBackArrow = true }) => {
  const navigation = useNavigation();
  // const insets = useSafeAreaInsets();

  const handleBackBtn = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <StatusBar backgroundColor="#D32F2F" barStyle="light-content" />
      <View style={styles.headerContainer}>
        <View style={styles.headerBox}>
          {showBackArrow && (
            <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
              <LeftArrow width={35} height={35} />
            </TouchableOpacity>
          )}
        </View>
          <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    // flex:0.05,
    backgroundColor: '#D32F2F',
    paddingHorizontal: 16,
    height: 100,
    paddingTop: 30,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign:'center',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 45,
    paddingTop: 5,
  },
});
