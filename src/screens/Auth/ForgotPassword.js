import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from './ForgotPasswordStyle';
import API from '../../services/API/api';
import LeftArrow from '../../assets/svg/white-left-arrow.svg';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBackBtn = () => {
    navigation.goBack();
  };

  const submit = async () => {
    console.log('--- forgotpassword ---', email);
    if (!email) {
      Alert.alert('Error', 'Enter email');
      return;
    }

    try {
      setLoading(true);
      console.log('Before API');
      const res = await API.post('/api/auth/forgot-password', { email });
      console.log('After API');
      console.log('--- forgotpassword  (try) ---', email);
      console.log("OTP FROM BACKEND:", res.data.otp);

      navigation.navigate('OtpScreen', { email, type: 'reset' });
    } catch (err) {
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
          <LeftArrow width={35} height={35} />
        </TouchableOpacity>
        <Text style={styles.title}>Forgot Password</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.subText}>
          Enter your registered email to receive a reset link
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={submit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;
