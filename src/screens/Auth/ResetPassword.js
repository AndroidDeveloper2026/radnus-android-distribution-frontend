import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from './ForgotPasswordStyle'; // reuse same styles
import API from '../../services/API/api';
import LeftArrow from '../../assets/svg/white-left-arrow.svg';

const ResetPassword = ({ route, navigation }) => {
  const { email, otp } = route.params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBackBtn = () => {
    navigation.goBack();
  };

  const submit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      console.log('--- RESET DATA:----', { email, otp, password });
      const res = await API.post('/api/auth/reset-password', {
        email,
        otp,
        password: password.trim(),
      });

      console.log('---RESET RESPONSE:---', res.data);
      Alert.alert('Success', 'Password reset successful');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
          <LeftArrow width={35} height={35} />
        </TouchableOpacity>

        <Text style={styles.title}>Reset Password</Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.subText}>Enter your new password below</Text>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={submit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Updating...' : 'Reset Password'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPassword;
