import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './ForgotPasswordStyle';
import api from '../../services/API/api';
import LeftArrow from '../../assets/svg/white-left-arrow.svg';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBackBtn = () => {
    navigation.goBack();
  };

  const submit = async () => {
    setLoading(true);
    await api.post('/auth/forgot-password', { email });
    setLoading(false);
    navigation.navigate('CheckEmail');
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
