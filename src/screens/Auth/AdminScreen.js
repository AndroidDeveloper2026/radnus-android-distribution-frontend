import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './LoginStyle';
import LeftArrow from '../../assets/svg/white-left-arrow.svg';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../../services/features/auth/adminAuthSlice';
import showToast from '../../utils/toast';
import { Eye, EyeOff } from 'lucide-react-native';

const AdminValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const AdminScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { token, error, loading } = useSelector(state => state?.adminAuth);

  const handleBackBtn = () => {
    navigation.goBack();
  };

  // ✅ REMOVE THIS useEffect - Don't navigate manually!
  // Let StackNavigator handle navigation based on Redux state
  // useEffect(() => {
  //   if (token) {
  //     navigation.replace('MainTabs', { role: 'Admin' });
  //   }
  // }, [token, navigation]);

  // Only show error toasts
  React.useEffect(() => {
    if (error) {
      showToast(error, 'short');
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
          <LeftArrow width={35} height={35} />
        </TouchableOpacity>
        <Text style={styles.heading}>Admin Login</Text>
      </View>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={AdminValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          
          
          dispatch(adminLogin(values))
            .unwrap()
            .then(() => {
              showToast('Login successful', 'short');
            })
            .catch((err) => {
              showToast(err || 'Login failed', 'short');
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Get log in your account</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email ID</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Enter your email ID"
                placeholderTextColor={'#000'}
                autoCapitalize="none"
              />
            </View>
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, { paddingRight: 45 }]}
                secureTextEntry={!showPassword}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholderTextColor={'#000'}
                placeholder="Enter your password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '73%',
                  transform: [{ translateY: -10 }],
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#555" />
                ) : (
                  <Eye size={20} color="#555" />
                )}
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AdminScreen;
