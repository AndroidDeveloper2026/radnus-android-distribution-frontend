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
import styles from './RetailerOnboardingStyle';
import Header from '../../components/Header';
import { launchCamera } from 'react-native-image-picker';
import { Camera, MapPin } from 'lucide-react-native';
import { addRetailer } from '../../services/features/retailer/retailerSlice';

/* ---------------- VALIDATION ---------------- */
const validationSchema = Yup.object().shape({
  shopName: Yup.string().required('Shop name required'),
  ownerName: Yup.string().required('Owner name required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Enter valid mobile')
    .required('Mobile required'),
});

/* ---------------- COMPONENT ---------------- */
const RetailerOnboarding = ({ navigation }) => {
  const dispatch = useDispatch();
  const [shopPhoto, setShopPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const capturePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.7 }, res => {
      if (res.didCancel) return;

      if (res.errorCode) {
        console.log('Camera Error:', res.errorMessage);
        return;
      }

      if (res.assets && res.assets.length > 0) {
        const uri = res.assets[0].uri;

        console.log('IMAGE URI:', uri);

        // 🔥 Important fix for Android sometimes
        setShopPhoto(uri.startsWith('file://') ? uri : `file://${uri}`);
        //  setShopPhoto(uri);
      }
    });
  };

  /* 🚀 Submit */
  const submitForm = async values => {
    try {
      if (!shopPhoto) {
        alert('Error', 'Please capture shop photo');
        return;
      }

      const formData = new FormData();

      formData.append('shopName', values.shopName);
      formData.append('ownerName', values.ownerName);
      formData.append('mobile', values.mobile);
      formData.append('gps', values.gps);

      const fileName = shopPhoto.split('/').pop();
      const fileType = fileName.split('.').pop();

      if (shopPhoto) {
        formData.append('shopPhoto', {
          uri: shopPhoto.uri,
          type: shopPhoto.type || 'image/jpeg',
          name: shopPhoto.fileName || 'shop.jpg',
        });
      }

      setLoading(true);

      const res = await dispatch(addRetailer(formData)).unwrap();

      alert('Success', 'Retailer added successfully');
      navigation.goBack();
    } catch (err) {
      console.log('❌ ERROR:', err);
      alert('Error', err || 'Failed to add retailer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Retailer Onboarding" />

      <Formik
        initialValues={{
          shopName: '',
          ownerName: '',
          mobile: '',
          gps: 'Auto location',
        }}
        validationSchema={validationSchema}
        onSubmit={submitForm}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* DETAILS */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Retailer Details</Text>

              <Label text="Shop Name *" />
              <TextInput
                style={styles.input}
                value={values.shopName}
                onChangeText={handleChange('shopName')}
              />
              {touched.shopName && errors.shopName && (
                <Text style={{ color: 'red' }}>{errors.shopName}</Text>
              )}

              <Label text="Owner Name *" />
              <TextInput
                style={styles.input}
                value={values.ownerName}
                onChangeText={handleChange('ownerName')}
              />
              {touched.ownerName && errors.ownerName && (
                <Text style={{ color: 'red' }}>{errors.ownerName}</Text>
              )}

              <Label text="Mobile *" />
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={values.mobile}
                onChangeText={handleChange('mobile')}
              />
              {touched.mobile && errors.mobile && (
                <Text style={{ color: 'red' }}>{errors.mobile}</Text>
              )}
            </View>

            {/* LOCATION */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Location</Text>

              <View style={styles.gpsRow}>
                <MapPin size={16} color="#D32F2F" />
                <Text style={styles.gpsText}>{values.gps}</Text>
              </View>

              <Text style={styles.gpsHint}>
                Location is auto-captured for verification
              </Text>
            </View>

            {/* PHOTO */}
            <View style={styles.photoSection}>
              <TouchableOpacity style={styles.photoBox} onPress={capturePhoto}>
                {shopPhoto ? (
                  <Image source={{ uri: shopPhoto }} style={styles.photo} />
                ) : (
                  <View style={styles.photoIcon}>
                    <Camera size={26} color="#D32F2F" />
                    <Text style={styles.photoText}>Take Shop Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* SUBMIT */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>
                {loading ? 'Submitting...' : 'Submit for Approval'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

export default RetailerOnboarding;
