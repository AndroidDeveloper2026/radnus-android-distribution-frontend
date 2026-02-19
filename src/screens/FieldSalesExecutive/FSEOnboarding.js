import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import styles from "./FSEOnboardingStyle";
import Header from "../../components/Header";
import { launchCamera } from "react-native-image-picker";
import { Camera } from "lucide-react-native";

const FSEOnboarding = ({ navigation }) => {
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
      <Header title="FSE Onboarding" />

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

export default FSEOnboarding;