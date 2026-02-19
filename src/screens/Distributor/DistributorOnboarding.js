// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
// } from "react-native";
// import styles from "./DistributorOnboardingStyle";
// import Header from "../../components/Header";
// import { launchCamera } from "react-native-image-picker";
// import { Camera, MapPin } from "lucide-react-native";

// const DistributorOnboarding = ({ navigation }) => {
//   const [shopPhoto, setShopPhoto] = useState(null);

//   const [form, setForm] = useState({
//     shopName: "",
//     ownerName: "",
//     mobile: "",
//     gps: "Fetching location...",
//   });

//   const onChange = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   const capturePhoto = () => {
//     launchCamera({ mediaType: "photo", quality: 0.7 }, (response) => {
//       if (!response.didCancel && response.assets) {
//         setShopPhoto(response.assets[0].uri);
//       }
//     });
//   };

//   const submitRetailer = () => {
//     // 🔗 API CALL
//     console.log("Retailer Data:", form, shopPhoto);
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Retailer Onboarding" />

//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >


//         {/* BASIC DETAILS */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Retailer Details</Text>

//           <Label text="Shop Name *" />
//           <TextInput
//             style={styles.input}
//             placeholder="Enter shop name"
//             value={form.shopName}
//             onChangeText={(v) => onChange("shopName", v)}
//           />

//           <Label text="Owner Name *" />
//           <TextInput
//             style={styles.input}
//             placeholder="Enter owner name"
//             value={form.ownerName}
//             onChangeText={(v) => onChange("ownerName", v)}
//           />

//           <Label text="Mobile Number *" />
//           <TextInput
//             style={styles.input}
//             placeholder="10-digit mobile"
//             keyboardType="phone-pad"
//             maxLength={10}
//             value={form.mobile}
//             onChangeText={(v) => onChange("mobile", v)}
//           />
//         </View>

//         {/* GPS LOCATION */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>Location</Text>

//           <View style={styles.gpsRow}>
//             <MapPin size={16} color="#D32F2F" />
//             <Text style={styles.gpsText}>{form.gps}</Text>
//           </View>

//           <Text style={styles.gpsHint}>
//             Location is auto-captured for verification
//           </Text>
//         </View>

//                 {/* SHOP PHOTO */}
//         <View style={styles.photoSection}>
//           <TouchableOpacity
//             style={styles.photoBox}
//             onPress={capturePhoto}
//           >
//             {shopPhoto ? (
//               <Image source={{ uri: shopPhoto }} style={styles.photo} />
//             ) : (
//               <>
//               <View style={styles.photoIcon}>
//                 <Camera size={26} color="#D32F2F" />
//                 <Text style={styles.photoText}>Take Photo</Text>
//               </View>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* SUBMIT */}
//         <TouchableOpacity
//           style={styles.submitBtn}
//           onPress={submitRetailer}
//         >
//           <Text style={styles.submitText}>Submit for Approval</Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </View>
//   );
// };

// const Label = ({ text }) => (
//   <Text style={styles.label}>{text}</Text>
// );

// export default DistributorOnboarding;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import styles from "./DistributorOnboardingStyle";
import Header from "../../components/Header";
import { launchCamera } from "react-native-image-picker";
import { Camera } from "lucide-react-native";

const DistributorOnboarding = ({ navigation }) => {
  const [images, setImages] = useState({
    shop: null,
    aadhaar: null,
    passport: null,
  });

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    mobile: "",
    alternateMobile: "",
    gst: "",
    msme: "",
    address: "",
    communicationAddress: "",
    bankDetails: "",
    fseAadhaar: "",
  });

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const captureImage = (type) => {
    launchCamera({ mediaType: "photo", quality: 0.7 }, (res) => {
      if (!res.didCancel && res.assets) {
        setImages({ ...images, [type]: res.assets[0].uri });
      }
    });
  };

  const submit = () => {
    console.log("DATA:", form, images);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Distributor Onboarding" />

      <ScrollView contentContainerStyle={styles.content}>

        {/* BASIC DETAILS */}
        <Section title="Basic Details">
          <Input label="Name *" value={form.name} onChangeText={(v) => onChange("name", v)} />
          <Input label="Business Name *" value={form.businessName} onChangeText={(v) => onChange("businessName", v)} />
          <Input label="Mobile Number *" value={form.mobile} keyboardType="phone-pad" />
          <Input label="Alternate Mobile" value={form.alternateMobile} />
          <Input label="GST Number" value={form.gst} />
          <Input label="MSME" value={form.msme} />
        </Section>

        {/* ADDRESS */}
        <Section title="Address Details">
          <Input label="Residential Address" value={form.address} />
          <Input label="Communication Address" value={form.communicationAddress} />
        </Section>

        {/* BANK */}
        <Section title="Bank Details">
          <Input label="Bank Details" value={form.bankDetails} />
        </Section>

        {/* KYC */}
        <Section title="KYC Details">
          <Input label="FSE Aadhaar Number" value={form.fseAadhaar} />
        </Section>

        {/* IMAGES */}
        <Section title="Upload Documents">

          <ImagePicker
            label="Shop Photo"
            image={images.shop}
            onPress={() => captureImage("shop")}
          />

          <ImagePicker
            label="Aadhaar Photo"
            image={images.aadhaar}
            onPress={() => captureImage("aadhaar")}
          />

          <ImagePicker
            label="Passport Photo"
            image={images.passport}
            onPress={() => captureImage("passport")}
          />

        </Section>

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submitBtn} onPress={submit}>
          <Text style={styles.submitText}>Submit for Approval</Text>
        </TouchableOpacity>

      </ScrollView>
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

const Input = ({ label, ...props }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
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

