import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
// import { launchCamera } from 'react-native-image-picker';
import styles from './FSEOnboardingStyle';
import Header from '../../components/Header';
import { useDispatch } from 'react-redux';
import { createFSE } from '../../services/features/fse/fseSlice';
import { openCamera } from '../../utils/cameraHelper';

const schema = Yup.object().shape({
  name: Yup.string().required('Name required'),
  dob: Yup.string().required('DOB required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid phone')
    .required(),
  altPhone: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone'),
  address: Yup.string().required('Address required'),
  altAddress: Yup.string(),
});

const FSEOnboarding = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const dispatch = useDispatch();

  const capturePhoto = () => {
    // launchCamera({ mediaType: 'photo', quality: 0.7 }, res => {
    //   if (!res.didCancel && res.assets) {
    //     setPhoto(res.assets[0].uri);
    //   }
    // });
    openCamera((image) => {
      console.log("📸 IMAGE:", image);
      setPhoto(image); // ✅ FULL OBJECT
    });
  };

  return (
    <View style={styles.container}>
      <Header title="FSE Onboarding" />
      <ScrollView contentContainerStyle={styles.content}>
        <Formik
          initialValues={{
            name: '',
            dob: '',
            email: '',
            phone: '',
            altPhone: '',
            address: '',
            altAddress: '',
          }}
          validationSchema={schema}
          onSubmit={async values => {
            try {
              const formData = new FormData();

              formData.append('name', values.name);
              formData.append('dob', values.dob);
              formData.append('email', values.email);
              formData.append('phone', values.phone);
              formData.append('altPhone', values.altPhone);
              formData.append('address', values.address);
              formData.append('altAddress', values.altAddress);
               formData.append('photo',photo);
              // if (photo) {
              //   formData.append('photo',photo);
              // }

              await dispatch(createFSE(formData)).unwrap();

              navigation.goBack();
            } catch (err) {
              console.log('ERROR:', err);
            }
          }}
          // onSubmit={async values => {
          //   const payload = { ...values, photo };

          //   try {
          //     await dispatch(createFSE(payload)).unwrap();
          //     navigation.goBack();
          //   } catch (err) {
          //     console.log('ERROR:', err);
          //   }
          // }}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <>
              {/* PHOTO */}
              <Section title="Photo">
                <TouchableOpacity
                  style={styles.photoBox}
                  onPress={capturePhoto}
                >
                  {photo ? (
                    // <Image source={{ uri: photo }} style={styles.photo} />
                    <Image source={{ uri: photo?.uri }} style={styles.photo} />
                  ) : (
                    <Text>Capture Photo</Text>
                  )}
                </TouchableOpacity>
              </Section>

              {/* BASIC DETAILS */}
              <Section title="Basic Details">
                <Input
                  label="Name *"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  error={touched.name && errors.name}
                />

                <Input
                  label="DOB *"
                  value={values.dob}
                  onChangeText={handleChange('dob')}
                  placeholder="YYYY-MM-DD"
                  error={touched.dob && errors.dob}
                />

                <Input
                  label="Email *"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  error={touched.email && errors.email}
                />

                <Input
                  label="Phone Number *"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  keyboardType="phone-pad"
                  error={touched.phone && errors.phone}
                />

                <Input
                  label="Alternate Phone"
                  value={values.altPhone}
                  onChangeText={handleChange('altPhone')}
                  keyboardType="phone-pad"
                  error={touched.altPhone && errors.altPhone}
                />
              </Section>

              {/* ADDRESS */}
              <Section title="Address Details">
                <Input
                  label="Address *"
                  value={values.address}
                  onChangeText={handleChange('address')}
                  error={touched.address && errors.address}
                />

                <Input
                  label="Alternative Address"
                  value={values.altAddress}
                  onChangeText={handleChange('altAddress')}
                />
              </Section>

              {/* SUBMIT */}
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit for Approval</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Input = ({ label, error, ...props }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
    {error && <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text>}
  </View>
);
export default FSEOnboarding;
