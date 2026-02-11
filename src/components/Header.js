import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LeftArrow from '../assets/svg/white-left-arrow.svg';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Header = ({ title }) => {
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
          <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
            <LeftArrow width={35} height={35} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>{title}</Text>

        {/* <TouchableOpacity style={ProductsMasterStyle.addButton}>
          <Text style={ProductsMasterStyle.addButtonText}>+ Add Product</Text>
        </TouchableOpacity> */}
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
    height:100,
    paddingTop:30,
    justifyContent:'center'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'black',
    gap: 55,
    paddingTop: 5,
  },
});
