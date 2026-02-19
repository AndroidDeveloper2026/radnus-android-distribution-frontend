import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './RegisterStyle';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../services/features/auth/registerSlice';
import locationData from '../../utils/locationData';
//svg
import LeftArrow from '../../assets/svg/white-left-arrow.svg';

// const locationData = {
//   TamilNadu: {
//     Chennai: ['Egmore', 'T Nagar'],
//     Madurai: ['Thirumangalam', 'Melur'],
//   },
//   Karnataka: {
//     Bangalore: ['Yelahanka', 'Whitefield'],
//     Mysore: ['Nanjangud', 'KR Nagar'],
//   },
// };

const RegisterSchema = Yup.object().shape({
  role: Yup.string().required('Role is required'),
  state: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),
  taluk: Yup.string().required('Taluk is required'),
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    .required('Mobile is required'),
  password: Yup.string().min(6).required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
});

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state?.register);
  const handleBackBtn = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
          <LeftArrow width={35} height={35} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register</Text>
      </View>

      <View style={styles.card}>
        <Formik
          initialValues={{
            name: '',
            email: '',
            mobile: '',
            password: '',
            confirmPassword: '',
            role: '',
            state: '',
            district: '',
            taluk: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={async values => {
            // const result = await dispatch(registerUser(values));

            // if(registerUser.fulfilled.match(result)){
            //   navigation.navigate('OtpScreen',{
            //     mobile:values.mobile,
            //   });
            // }

            navigation.navigate('TermsConditions', {
              registerData: values,
            });

            console.log('Register Payload:', values);
            // navigation.navigate('OtpScreen');
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Create your account</Text>

                {/* NAME */}
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={'#000'}
                  placeholder="Enter your name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                />
                {touched.name && errors.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}

                {/* EMAIL */}
                <Text style={styles.label}>EmailID</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={'#000'}
                  placeholder="Enter your emailID"
                  value={values.email}
                  onChangeText={handleChange('email')}
                />
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                {/* MOBILE */}
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={'#000'}
                  placeholder="Enter your mobile number"
                  keyboardType="phone-pad"
                  value={values.mobile}
                  onChangeText={handleChange('mobile')}
                />
                {touched.mobile && errors.mobile && (
                  <Text style={styles.error}>{errors.mobile}</Text>
                )}

                {/* PASSWORD */}
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={'#000'}
                  placeholder="Enter your Password"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange('password')}
                />
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                {/* CONFIRM PASSWORD */}
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={'#000'}
                  placeholder="Enter your Confirm Password"
                  secureTextEntry
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.error}>{errors.confirmPassword}</Text>
                )}

                {/* ROLE */}
                <Text style={styles.label}>Role</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={values.role}
                    onValueChange={val => setFieldValue('role', val)}
                  >
                    <Picker.Item label="Select Role" value="" color="#000" />
                    <Picker.Item
                      label="Marketing Manager"
                      value="MarketingManager"
                      color="#000"
                    />
                    <Picker.Item
                      label="Marketing Executive"
                      value="MarketingExecutive"
                      color="#000"
                    />
                    <Picker.Item
                      label="Distributor"
                      value="Distributor"
                      color="#000"
                    />
                    <Picker.Item label="FSE" value="FSE" color="#000" />
                    <Picker.Item
                      label="Retailer"
                      value="Retailer"
                      color="#000"
                    />
                  </Picker>
                </View>
                {touched.role && errors.role && (
                  <Text style={styles.error}>{errors.role}</Text>
                )}

                {/* STATE */}
                <Text style={styles.label}>State</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={values.state}
                    selectionColor={'#000000'}
                    onValueChange={val => {
                      setFieldValue('state', val);
                      setFieldValue('district', '');
                      setFieldValue('taluk', '');
                    }}
                  >
                    <Picker.Item
                      label="Select State"
                      value=""
                      color="#000000"
                    />
                    {Object.keys(locationData).map(st => (
                      <Picker.Item
                        key={st}
                        label={st}
                        value={st}
                        color="#000000"
                      />
                    ))}
                  </Picker>
                </View>
                {touched.state && errors.state && (
                  <Text style={styles.error}>{errors.state}</Text>
                )}

                {/* DISTRICT */}
                <Text style={styles.label}>District</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    enabled={!!values.state}
                    selectedValue={values.district}
                    selectionColor={'#000'}
                    onValueChange={val => {
                      setFieldValue('district', val);
                      setFieldValue('taluk', '');
                    }}
                  >
                    <Picker.Item
                      label="Select District"
                      value=""
                      color="#000"
                    />
                    {values.state &&
                      Object.keys(locationData[values.state]).map(dist => (
                        <Picker.Item
                          key={dist}
                          label={dist}
                          value={dist}
                          color="#000000"
                        />
                      ))}
                  </Picker>
                </View>
                {touched.district && errors.district && (
                  <Text style={styles.error}>{errors.district}</Text>
                )}

                {/* TALUK */}
                <Text style={styles.label}>Taluk</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    enabled={!!values.district}
                    selectedValue={values.taluk}
                    selectionColor={'#000'}
                    onValueChange={val => setFieldValue('taluk', val)}
                  >
                    <Picker.Item
                      label="Select Taluk"
                      value=""
                      color="#000000"
                    />
                    {values.state &&
                      values.district &&
                      locationData[values.state][values.district].map(t => (
                        <Picker.Item
                          key={t}
                          label={t}
                          value={t}
                          color="#000000"
                        />
                      ))}
                  </Picker>
                </View>
                {touched.taluk && errors.taluk && (
                  <Text style={styles.error}>{errors.taluk}</Text>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>REGISTER</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default RegisterScreen;
