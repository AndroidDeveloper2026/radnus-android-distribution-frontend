import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from './ForgotPasswordStyle';
import API from '../../services/API/api';
import LeftArrow from '../../assets/svg/white-left-arrow.svg';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Enter a valid email')
    .required('Email is required'),
});

const ForgotPassword = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleBackBtn = () => {
    navigation.goBack();
  };

  const handleSubmit = async values => {
    try {
      setLoading(true);

     const res = await API.post('/api/auth/forgot-password', {
        email: values.email,
      });

      if (res.data.success) {
      navigation.navigate('OtpScreen', {
        email: values.email,
        type: 'reset',
      });
    }
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

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.card}>
            <Text style={styles.subText}>
              Enter your registered email to receive a reset link
            </Text>

            {/* Email Input */}
            <TextInput
              style={[
                styles.input,
                errors.email && touched.email ? { borderColor: 'red' } : null,
              ]}
              placeholder="Enter email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
            />

            {/* Error Message */}
            {errors.email && touched.email && (
              <Text style={{ color: 'red', marginTop: 5 }}>{errors.email}</Text>
            )}

            {/* Button */}
            <TouchableOpacity
              style={[
                styles.button,
                (loading || !values.email || errors.email) && { opacity: 0.5 },
              ]}
              onPress={handleSubmit}
              disabled={loading || !values.email || !!errors.email}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default ForgotPassword;
