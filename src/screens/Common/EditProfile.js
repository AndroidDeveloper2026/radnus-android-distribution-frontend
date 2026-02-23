import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import styles from "./EditProfileStyle";
import Header from "../../components/Header";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Camera } from "lucide-react-native";

const EditProfile = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);

  const [form, setForm] = useState({
    businessName: "Radnus Distributors",
    ownerName: "Ramesh Kumar",
    mobile: "9876543210",
    gst: "29ABCDE1234F1Z9",
    territory: "Bangalore South",
  });

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.8 },
      (response) => {
        if (!response.didCancel && response.assets) {
          setProfileImage(response.assets[0].uri);
        }
      }
    );
  };

  const onSave = () => {
    // 🔗 API CALL
    // Send form + profileImage
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" />

      <ScrollView contentContainerStyle={styles.content}>

        {/* PROFILE IMAGE */}
        <View style={styles.imageSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("../../assets/logo/radnus-logo.png") // fallback
              }
              style={styles.profileImage}
            />

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={pickImage}
            >
              <Camera size={16} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.imageHint}>Tap camera to change photo</Text>
        </View>

        {/* BUSINESS INFO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Business Information</Text>

          <Label text="Business Name" />
          <TextInput
            style={styles.input}
            value={form.businessName}
            onChangeText={(v) => onChange("businessName", v)}
          />

          <Label text="Owner Name" />
          <TextInput
            style={styles.input}
            value={form.ownerName}
            onChangeText={(v) => onChange("ownerName", v)}
          />

          <Label text="Mobile Number" />
          <TextInput
            style={[styles.input, styles.disabled]}
            value={form.mobile}
            editable={false}
          />
        </View>

        {/* REGISTRATION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Registration</Text>

          <Label text="GST Number" />
          <TextInput
            style={styles.input}
            value={form.gst}
            onChangeText={(v) => onChange("gst", v)}
            autoCapitalize="characters"
          />

          <Label text="Territory" />
          <TextInput
            style={[styles.input, styles.disabled]}
            value={form.territory}
            editable={false}
          />
        </View>

        {/* ACTIONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const Label = ({ text }) => (
  <Text style={styles.label}>{text}</Text>
);

export default EditProfile;
