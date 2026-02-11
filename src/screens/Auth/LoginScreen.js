import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';

import styles from './LoginStyle';
import LeftArrow from '../../assets/svg/white-left-arrow.svg';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {loginUser} from "../../services/features/auth/authSlice";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

  role: Yup.string()
    .required('Please select a role'),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleBackBtn = () => {
    navigation.goBack();
  };

  const onSubmitLogin = (values, { setSubmitting, setErrors }) => {
       console.log('--- loginform (values) ---',values)

    dispatch(
    loginUser({
      email:values?.email.trim(),
      password: values?.password,
      // role: values.role, 
    })
  )
    .unwrap()
    .then((res) => {
      console.log('--- loginform (res.user.role) ---')
     // role-based navigation
      if (res.user.role === 'Distributor') {
        navigation.replace('AddProduct');
      } else if (res.user.role === 'FSE') {
        navigation.replace('FSEHome');
      } else {
        navigation.replace('AddProduct');
      } // or role-based navigation
    })
    .catch((err) => {
      console.log('-- login form (error) --',err)
      setErrors({ general: err?.message || err || 'Login failed', });
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
          <LeftArrow width={35} height={35} />
        </TouchableOpacity>
        <Text style={styles.heading}>User Login</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Get log in your account</Text>

        <Formik
          initialValues={{
            email: '',
            password: '',
            role: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={onSubmitLogin}
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
            <>
              {/* EMAIL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email Id"
                  placeholderTextColor={'#000'}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
              </View>

              {/* PASSWORD */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={'#000'}
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
              </View>

              {/* ROLE */}
              <Text style={styles.label}>Role</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={values.role}
                  selectionColor={'#000'}
                  onValueChange={handleChange('role')}
                >
                  <Picker.Item label="Select Role" value=""  color='#000'/>
                  <Picker.Item label="Distributor" value="Distributor" />
                  <Picker.Item label="FSE" value="FSE" />
                  <Picker.Item label="Retailer" value="Retailer" />
                </Picker>
              </View>
              {touched.role && errors.role && (
                <Text style={styles.error}>{errors.role}</Text>
              )}

              {/* GENERAL ERROR */}
              {errors.general && (
                <Text style={styles.error}>{errors.general}</Text>
              )}

              {/* LOGIN BUTTON */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>LOGIN</Text>
              </TouchableOpacity>

              {/* REGISTER */}
              <View style={styles.richtext}>
                <Text style={styles.subtitle}>Register new account?</Text>
                <TouchableOpacity
                  style={styles.accBtn}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.richtextBtn}>Register</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default LoginScreen;
