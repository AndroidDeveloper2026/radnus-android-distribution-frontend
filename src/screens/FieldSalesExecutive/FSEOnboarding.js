// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
// } from "react-native";
// import styles from "./FSEOnboardingStyle";
// import Header from "../../components/Header";
// import { launchCamera } from "react-native-image-picker";
// import { Camera } from "lucide-react-native";

// const FSEOnboarding = ({ navigation }) => {
//   const [images, setImages] = useState({
//     shop: null,
//     aadhaar: null,
//     passport: null,
//   });

//   const [form, setForm] = useState({
//     name: "",
//     businessName: "",
//     mobile: "",
//     alternateMobile: "",
//     gst: "",
//     msme: "",
//     address: "",
//     communicationAddress: "",
//     bankDetails: "",
//     fseAadhaar: "",
//   });

//   const onChange = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   const captureImage = (type) => {
//     launchCamera({ mediaType: "photo", quality: 0.7 }, (res) => {
//       if (!res.didCancel && res.assets) {
//         setImages({ ...images, [type]: res.assets[0].uri });
//       }
//     });
//   };

//   const submit = () => {
//     console.log("DATA:", form, images);
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="FSE Onboarding" />

//       <ScrollView contentContainerStyle={styles.content}>

//         {/* BASIC DETAILS */}
//         <Section title="Basic Details">
//           <Input label="Name *" value={form.name} onChangeText={(v) => onChange("name", v)} />
//           <Input label="Business Name *" value={form.businessName} onChangeText={(v) => onChange("businessName", v)} />
//           <Input label="Mobile Number *" value={form.mobile} keyboardType="phone-pad" />
//           <Input label="Alternate Mobile" value={form.alternateMobile} />
//           <Input label="GST Number" value={form.gst} />
//           <Input label="MSME" value={form.msme} />
//         </Section>

//         {/* ADDRESS */}
//         <Section title="Address Details">
//           <Input label="Residential Address" value={form.address} />
//           <Input label="Communication Address" value={form.communicationAddress} />
//         </Section>

//         {/* BANK */}
//         <Section title="Bank Details">
//           <Input label="Bank Details" value={form.bankDetails} />
//         </Section>

//         {/* KYC */}
//         <Section title="KYC Details">
//           <Input label="FSE Aadhaar Number" value={form.fseAadhaar} />
//         </Section>

//         {/* IMAGES */}
//         <Section title="Upload Documents">

//           <ImagePicker
//             label="Shop Photo"
//             image={images.shop}
//             onPress={() => captureImage("shop")}
//           />

//           <ImagePicker
//             label="Aadhaar Photo"
//             image={images.aadhaar}
//             onPress={() => captureImage("aadhaar")}
//           />

//           <ImagePicker
//             label="Passport Photo"
//             image={images.passport}
//             onPress={() => captureImage("passport")}
//           />

//         </Section>

//         {/* SUBMIT */}
//         <TouchableOpacity style={styles.submitBtn} onPress={submit}>
//           <Text style={styles.submitText}>Submit for Approval</Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </View>
//   );
// };

// /* ---------------- COMPONENTS ---------------- */

// const Section = ({ title, children }) => (
//   <View style={styles.card}>
//     <Text style={styles.sectionTitle}>{title}</Text>
//     {children}
//   </View>
// );

// const Input = ({ label, ...props }) => (
//   <>
//     <Text style={styles.label}>{label}</Text>
//     <TextInput style={styles.input} {...props} />
//   </>
// );

// const ImagePicker = ({ label, image, onPress }) => (
//   <>
//     <Text style={styles.label}>{label}</Text>
//     <TouchableOpacity style={styles.photoBox} onPress={onPress}>
//       {image ? (
//         <Image source={{ uri: image }} style={styles.photo} />
//       ) : (
//         <View style={styles.photoIcon}>
//           <Camera size={24} color="#D32F2F" />
//           <Text style={styles.photoText}>Capture</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   </>
// );

// export default FSEOnboarding;

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
import { launchCamera } from 'react-native-image-picker';
import styles from './FSEOnboardingStyle';
import Header from '../../components/Header';
import { useDispatch } from 'react-redux';
import { createFSE } from '../../services/features/fse/fseSlice';

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
    launchCamera({ mediaType: 'photo', quality: 0.7 }, res => {
      if (!res.didCancel && res.assets) {
        setPhoto(res.assets[0].uri);
      }
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
            const payload = { ...values, photo };

            try {
              await dispatch(createFSE(payload)).unwrap();
              navigation.goBack();
            } catch (err) {
              console.log('ERROR:', err);
            }
          }}
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
                    <Image source={{ uri: photo }} style={styles.photo} />
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
