import API from '../../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Register
const register = async userData => {
  const res = await API.post('/api/auth/regitser', userData);
  return res.data;
};

//Login
const login = async userData => {
  const res = await API.post('/api/auth/login', userData);
  if (res.data.token) {
    await AsyncStorage.setItem('token', res.data.token);
  }
  return res.data;
};

const logout = async () => {
    await AsyncStorage.removeItem("token");
};

export default {register,login,logout};