import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './LoginStyle';

import LeftArrow from '../../assets/svg/white-left-arrow.svg';

import { Formik } from 'formik';

import * as Yup from 'yup';

const AdminValidationSchema = Yup.object().shape({
  emailID: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const AdminScreen = ({ navigation }) => {
  const handleBackBtn = () => {
    navigation.goBack();
  };

  // const handleLogin = (values, { setSubmitting, setErrors }) => {
  //   const { mobile, password } = values;

  //   if (mobile === 'admin' && password === 'admin') {
  //     navigation.navigate('Register');
  //   } else {
  //     setErrors({ password: 'Invalid login credentials' });
  //   }

  //   setSubmitting(false);
  // };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
          <LeftArrow width={35} height={35} />
        </TouchableOpacity>
        <Text style={styles.heading}>Admin Login</Text>
      </View>

      {/* FORM */}
      <Formik
        initialValues={{ emailID: '', password: '' }}
        validationSchema={AdminValidationSchema}
        onSubmit={value => {}}
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
            <Text style={styles.title}>Get log in your account</Text>

            {/* MOBILE / EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email ID</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                value={values.emailID}
                onChangeText={handleChange('emailID')}
                onBlur={handleBlur('emailID')}
                placeholder="Enter your email ID"
                placeholderTextColor={'#000'}
                autoCapitalize="none"
              />
              {touched.emailID && errors.emailID && (
                <Text style={styles.error}>{errors.emailID}</Text>
              )}
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholderTextColor={'#000'}
                placeholder="Enter your password"
              />
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AdminScreen;
