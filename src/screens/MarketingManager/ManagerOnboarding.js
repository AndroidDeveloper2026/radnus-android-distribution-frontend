import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from '../MarketingExecutive/ExecutiveOnboardStyle';
import Header from '../../components/Header';
import { Camera } from 'lucide-react-native';
import { openCamera } from '../../utils/cameraHelper';
import { addManager } from '../../services/features/manager/managerSlice';

/* ---------------- VALIDATION ---------------- */

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  dob: Yup.string().required('DOB is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Enter valid 10-digit phone')
    .required('Phone number is required'),
  alternatePhone: Yup.string().matches(
    /^[0-9]{10}$/,
    'Enter valid phone number',
  ),
  address: Yup.string().required('Address is required'),
});

/* ---------------- COMPONENT ---------------- */

const ManagerOnboarding = ({ navigation }) => {
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);

  const captureImage = () => {
    openCamera(image => {
      console.log('📸 IMAGE:', image);
      setProfile(image);
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Manager Onboarding" />

      <Formik
        initialValues={{
          name: '',
          dob: '',
          email: '',
          phone: '',
          alternatePhone: '',
          address: '',
        }}
        validationSchema={validationSchema}
        // onSubmit={(values) => {
        //   const formData = new FormData();

        //   Object.keys(values).forEach((key) => {
        //     formData.append(key, values[key]);
        //   });

        //   formData.append("profile", profile);

        //   console.log("MANAGER DATA:", formData);

        //   // dispatch(addManager(formData));

        //   navigation.goBack();
        // }}

        onSubmit={values => {
          const formData = new FormData();

          Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
          });

          if (profile) {
            formData.append('photo', {
              uri: profile.uri,
              type: profile.type,
              name: profile.name,
            });
          }

          dispatch(addManager(formData));

          navigation.goBack();
        }}
      >
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <ScrollView contentContainerStyle={styles.content}>
            {/* PROFILE PHOTO */}

            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <TouchableOpacity onPress={captureImage}>
                {profile ? (
                  <Image
                    source={{ uri: profile.uri }}
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 55,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 55,
                      backgroundColor: '#eee',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Camera size={28} color="#D32F2F" />
                    <Text>Take Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* BASIC DETAILS */}

            <Section title="Basic Details">
              <Input
                label="Name *"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={touched.name && errors.name}
              />

              <Input
                label="Date of Birth *"
                value={values.dob}
                onChangeText={handleChange('dob')}
                onBlur={handleBlur('dob')}
                error={touched.dob && errors.dob}
              />

              <Input
                label="Email *"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                error={touched.email && errors.email}
              />

              <Input
                label="Phone Number *"
                value={values.phone}
                onChangeText={handleChange('phone')}
                keyboardType="phone-pad"
                onBlur={handleBlur('phone')}
                error={touched.phone && errors.phone}
              />

              <Input
                label="Alternate Phone Number"
                value={values.alternatePhone}
                onChangeText={handleChange('alternatePhone')}
                keyboardType="phone-pad"
                onBlur={handleBlur('alternatePhone')}
                error={touched.alternatePhone && errors.alternatePhone}
              />
            </Section>

            {/* ADDRESS */}

            <Section title="Address Details">
              <Input
                label="Address *"
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                error={touched.address && errors.address}
              />
            </Section>

            {/* SUBMIT */}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit for Approval</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

/* ---------------- COMPONENTS ---------------- */

const Section = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Input = ({ label, error, ...props }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
    {error && <Text style={{ color: 'red' }}>{error}</Text>}
  </>
);

export default ManagerOnboarding;
