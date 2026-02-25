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
import styles from './DistributorOnboardingStyle';
import Header from '../../components/Header';
import { launchCamera } from 'react-native-image-picker';
import { Camera } from 'lucide-react-native';
import { addDistributor } from '../../services/features/distributor/distributorSlice';

/* ---------------- VALIDATION ---------------- */

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  businessName: Yup.string().required('Business name is required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Enter valid 10-digit mobile')
    .required('Mobile is required'),
  alternateMobile: Yup.string().matches(/^[0-9]{10}$/, 'Enter valid mobile'),
  address: Yup.string().required('Address is required'),
  fseAadhaar: Yup.string().matches(/^[0-9]{12}$/, 'Enter valid Aadhaar'),
});

/* ---------------- COMPONENT ---------------- */

const DistributorOnboarding = ({ navigation }) => {
  const dispatch = useDispatch();

  const [images, setImages] = useState({
    shop: null,
    aadhaar: null,
    passport: null,
  });

  const captureImage = type => {
    launchCamera({ mediaType: 'photo', quality: 0.7 }, res => {
      if (!res.didCancel && res.assets && res.assets.length > 0) {
        setImages(prev => ({
          ...prev,
          [type]: res.assets[0].uri,
        }));
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Distributor Onboarding" />

      <Formik
        initialValues={{
          name: '',
          businessName: '',
          mobile: '',
          alternateMobile: '',
          gst: '',
          msme: '',
          address: '',
          communicationAddress: '',
          fseAadhaar: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          const formData = new FormData();

          // Append text fields
          Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
          });

          formData.append('status', 'PENDING');

          // Append images properly
          Object.keys(images).forEach(key => {
            if (images[key]) {
              formData.append(key, {
                uri: images[key],
                type: 'image/jpeg',
                name: `${key}.jpg`,
              });
            }
          });

          console.log('FINAL PAYLOAD:', formData);

          dispatch(addDistributor(formData));
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
                label="Business Name *"
                value={values.businessName}
                onChangeText={handleChange('businessName')}
                onBlur={handleBlur('businessName')}
                error={touched.businessName && errors.businessName}
              />

              <Input
                label="Mobile Number *"
                value={values.mobile}
                onChangeText={handleChange('mobile')}
                onBlur={handleBlur('mobile')}
                keyboardType="phone-pad"
                error={touched.mobile && errors.mobile}
              />

              <Input
                label="Alternate Mobile"
                value={values.alternateMobile}
                onChangeText={handleChange('alternateMobile')}
                onBlur={handleBlur('alternateMobile')}
                error={touched.alternateMobile && errors.alternateMobile}
              />

              <Input
                label="GST Number"
                value={values.gst}
                onChangeText={handleChange('gst')}
                onBlur={handleBlur('gst')}
              />

              <Input
                label="MSME"
                value={values.msme}
                onChangeText={handleChange('msme')}
                onBlur={handleBlur('msme')}
              />
            </Section>

            {/* ADDRESS */}
            <Section title="Address Details">
              <Input
                label="Residential Address *"
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                error={touched.address && errors.address}
              />

              <Input
                label="Communication Address"
                value={values.communicationAddress}
                onChangeText={handleChange('communicationAddress')}
                onBlur={handleBlur('communicationAddress')}
              />
            </Section>

            {/* KYC */}
            <Section title="KYC Details">
              <Input
                label="FSE Aadhaar Number"
                value={values.fseAadhaar}
                onChangeText={handleChange('fseAadhaar')}
                onBlur={handleBlur('fseAadhaar')}
                error={touched.fseAadhaar && errors.fseAadhaar}
              />
            </Section>

            {/* IMAGES */}
            <Section title="Upload Documents">
              <ImagePicker
                label="Shop Photo"
                image={images.shop}
                onPress={() => captureImage('shop')}
              />

              <ImagePicker
                label="Aadhaar Photo"
                image={images.aadhaar}
                onPress={() => captureImage('aadhaar')}
              />

              <ImagePicker
                label="Passport Photo"
                image={images.passport}
                onPress={() => captureImage('passport')}
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

const ImagePicker = ({ label, image, onPress }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.photoBox} onPress={onPress}>
      {image ? (
        <Image source={{ uri: image }} style={styles.photo} />
      ) : (
        <View style={styles.photoIcon}>
          <Camera size={24} color="#D32F2F" />
          <Text style={styles.photoText}>Capture</Text>
        </View>
      )}
    </TouchableOpacity>
  </>
);

export default DistributorOnboarding;
