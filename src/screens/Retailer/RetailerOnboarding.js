import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import styles from "./RetailerOnboardingStyle";
import Header from "../../components/Header";
import { launchCamera } from "react-native-image-picker";
import { Camera, MapPin } from "lucide-react-native";

const RetailerOnboarding = ({ navigation }) => {
  const [shopPhoto, setShopPhoto] = useState(null);

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    mobile: "",
    gps: "Fetching location...",
  });

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const capturePhoto = () => {
    launchCamera({ mediaType: "photo", quality: 0.7 }, (response) => {
      if (!response.didCancel && response.assets) {
        setShopPhoto(response.assets[0].uri);
      }
    });
  };

  const submitRetailer = () => {
    // 🔗 API CALL
    console.log("Retailer Data:", form, shopPhoto);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Retailer Onboarding" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* SHOP PHOTO */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.photoBox}
            onPress={capturePhoto}
          >
            {shopPhoto ? (
              <Image source={{ uri: shopPhoto }} style={styles.photo} />
            ) : (
              <>
                <Camera size={26} color="#D32F2F" />
                <Text style={styles.photoText}>Capture Shop Photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* BASIC DETAILS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Retailer Details</Text>

          <Label text="Shop Name *" />
          <TextInput
            style={styles.input}
            placeholder="Enter shop name"
            value={form.shopName}
            onChangeText={(v) => onChange("shopName", v)}
          />

          <Label text="Owner Name *" />
          <TextInput
            style={styles.input}
            placeholder="Enter owner name"
            value={form.ownerName}
            onChangeText={(v) => onChange("ownerName", v)}
          />

          <Label text="Mobile Number *" />
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile"
            keyboardType="phone-pad"
            maxLength={10}
            value={form.mobile}
            onChangeText={(v) => onChange("mobile", v)}
          />
        </View>

        {/* GPS LOCATION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>

          <View style={styles.gpsRow}>
            <MapPin size={16} color="#D32F2F" />
            <Text style={styles.gpsText}>{form.gps}</Text>
          </View>

          <Text style={styles.gpsHint}>
            Location is auto-captured for verification
          </Text>
        </View>

        {/* SUBMIT */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={submitRetailer}
        >
          <Text style={styles.submitText}>Submit for Approval</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const Label = ({ text }) => (
  <Text style={styles.label}>{text}</Text>
);

export default RetailerOnboarding;
