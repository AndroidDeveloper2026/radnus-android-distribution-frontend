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
import MessagePopup from '../../components/ModalPopup';
import { openCamera } from '../../utils/cameraHelper';

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
  const [popup, setPopup] = useState({
    visible: false,
    type: 'success',
    title: '',
    description: '',
  });

  const capturePhoto = async () => {
    console.log('--- camera open via helper ---');

    try {
      openCamera(image => {
        setShopPhoto(image); // ✅ handle result here
      });
      // const image = await openCamera();   // 🔥 using your helper
      // setShopPhoto(image);
    } catch (err) {
      console.log('Camera Error:', err);
    }
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, visible: false }));
  };

  const submitForm = async values => {
    try {
      if (!shopPhoto) {
        alert('Please capture shop photo');
        return;
      }

      const formData = new FormData();

      formData.append('shopName', values.shopName);
      formData.append('ownerName', values.ownerName);
      formData.append('mobile', values.mobile);
      formData.append('gps', values.gps);
      formData.append('shopPhoto', {
        uri: shopPhoto.uri,
        type: shopPhoto.type || 'image/jpeg',
        name: shopPhoto.fileName || 'shop.jpg',
      });

      // formData.append('shopPhoto', shopPhoto);

      setLoading(true);
      console.log('---frontend (retailer) ---', formData);

      console.log('---frontend (retailer) ---', formData);

      const res = await dispatch(addRetailer(formData)).unwrap();

      console.log('✅ SUCCESS:', res);

      setPopup({
        visible: true,
        type: 'success',
        title: 'Success',
        description: 'Retailer added successfully',
      });
    } catch (err) {
      console.log(' ERROR FULL:', err);

      setPopup({
        visible: true,
        type: 'error',
        title: 'Error',
        description: err?.message || 'Failed to add retailer',
      });
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
                  // <Image source={{ uri: shopPhoto }} style={styles.photo} />
                  <Image source={{ uri: shopPhoto.uri }} style={styles.photo} />
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
      <MessagePopup
        visible={popup.visible}
        type={popup.type}
        title={popup.title}
        description={popup.description}
        secondaryText="Cancel"
        onSecondaryPress={closePopup}
        onPress={() => {
          closePopup();
          navigation.goBack();
        }}
      />
    </View>
  );
};

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

export default RetailerOnboarding;
