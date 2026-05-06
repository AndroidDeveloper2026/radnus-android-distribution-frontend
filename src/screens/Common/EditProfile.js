import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert
} from "react-native";
import styles from "./EditProfileStyle";
import Header from "../../components/Header";
import { launchImageLibrary } from "react-native-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Store, Building2, User } from "lucide-react-native";
import { updateProfile } from "../../services/features/profile/profileSlice";   // adjust if needed
import { openCamera } from "../../utils/cameraHelper";

// ============================================================
// Role-based initial form values (same as before)
// ============================================================
const getInitialForm = (role, profileData, authUser) => {
  switch (role) {
    case "Distributor":
      return {
        businessName: profileData?.businessName || "",
        mobile: profileData?.mobile || authUser?.mobile || "",
        alternateMobile: profileData?.alternateMobile || "",
        gst: profileData?.gst || "",
        msme: profileData?.msme || "",
        address: profileData?.address || "",
        communicationAddress: profileData?.communicationAddress || "",
      };
    case "Retailer":
      return {
        shopName: profileData?.shopName || "",
        ownerName: profileData?.ownerName || "",
        mobile: profileData?.mobile || authUser?.mobile || "",
        gps: profileData?.gps || "",
      };
    case "Executive":
      return {
        name: profileData?.name || authUser?.name || "",
        dob: profileData?.dob || "",
        email: profileData?.email || authUser?.email || "",
        phone: profileData?.phone || authUser?.mobile || "",
        alternatePhone: profileData?.alternatePhone || "",
        address: profileData?.address || "",
      };
    case "Radnus":
      return {
        name: profileData?.name || authUser?.name || "",
        dob: profileData?.dob || "",
        email: profileData?.email || authUser?.email || "",
        phone: profileData?.phone || authUser?.mobile || "",
        altPhone: profileData?.altPhone || "",
        address: profileData?.address || "",
        altAddress: profileData?.altAddress || "",
        photo: profileData?.photo || null,
      };
    default:
      return {
        name: authUser?.name || "",
        email: authUser?.email || "",
        mobile: authUser?.mobile || "",
      };
  }
};

// ============================================================
// Role-based form sections (same as before)
// ============================================================
const getFormSections = (role) => {
  switch (role) {
    case "Distributor":
      return [
        {
          title: "Business Information",
          fields: [
            { key: "businessName", label: "Business Name", editable: true },
            { key: "mobile", label: "Mobile Number", editable: false },
            { key: "alternateMobile", label: "Alternate Mobile", editable: true, keyboardType: "phone-pad" },
          ],
        },
        {
          title: "Registration",
          fields: [
            { key: "gst", label: "GST Number", editable: true, autoCapitalize: "characters" },
            { key: "msme", label: "MSME Number", editable: true },
          ],
        },
        {
          title: "Address",
          fields: [
            { key: "address", label: "Business Address", editable: true, multiline: true },
            { key: "communicationAddress", label: "Communication Address", editable: true, multiline: true },
          ],
        },
      ];
    case "Retailer":
      return [
        {
          title: "Shop Information",
          fields: [
            { key: "shopName", label: "Shop Name", editable: true },
            { key: "ownerName", label: "Owner Name", editable: true },
            { key: "mobile", label: "Mobile Number", editable: false },
          ],
        },
        {
          title: "Location",
          fields: [
            { key: "gps", label: "GPS Location", editable: false },
          ],
        },
      ];
    case "Executive":
      return [
        {
          title: "Personal Information",
          fields: [
            { key: "name", label: "Full Name", editable: true },
            { key: "dob", label: "Date of Birth", editable: true },
            { key: "email", label: "Email", editable: false, keyboardType: "email-address" },
          ],
        },
        {
          title: "Contact Details",
          fields: [
            { key: "phone", label: "Phone Number", editable: false, keyboardType: "phone-pad" },
            { key: "alternatePhone", label: "Alternate Phone", editable: true, keyboardType: "phone-pad" },
          ],
        },
        {
          title: "Address",
          fields: [
            { key: "address", label: "Address", editable: true, multiline: true },
          ],
        },
      ];
    case "Agent":
      return [
        {
          title: "Personal Information",
          fields: [
            { key: "name", label: "Full Name", editable: true },
            { key: "dob", label: "Date of Birth", editable: true },
            { key: "email", label: "Email", editable: false, keyboardType: "email-address" },
          ],
        },
        {
          title: "Contact Details",
          fields: [
            { key: "phone", label: "Phone Number", editable: false, keyboardType: "phone-pad" },
            { key: "altPhone", label: "Alternate Phone", editable: true, keyboardType: "phone-pad" },
          ],
        },
        {
          title: "Address",
          fields: [
            { key: "address", label: "Primary Address", editable: true, multiline: true },
            { key: "altAddress", label: "Alternate Address", editable: true, multiline: true },
          ],
        },
      ];
    default:
      return [
        {
          title: "Profile",
          fields: [
            { key: "name", label: "Full Name", editable: true },
            { key: "email", label: "Email", editable: false },
            { key: "mobile", label: "Mobile", editable: false },
          ],
        },
      ];
  }
};

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);
  const profileData = useSelector((state) => state.profile?.data);
  const role = authUser?.role || "Distributor";

  const [profileImage, setProfileImage] = useState(
    profileData?.photo || profileData?.shopPhoto || null
  );
  const [imageToUpload, setImageToUpload] = useState(null);
  const [form, setForm] = useState(getInitialForm(role, profileData, authUser));

  const sections = getFormSections(role);

  const onChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const pickFromGallery = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, response => {
      if (!response.didCancel && response.assets?.length > 0) {
        const asset = response.assets[0];
        setProfileImage(asset.uri);
        setImageToUpload({
          uri: asset.uri,
          type: asset.type || "image/jpeg",
          name: asset.fileName || `gallery_${Date.now()}.jpg`,
        });
      }
    });
  };

  const pickFromCamera = () => {
    openCamera(image => {
      setProfileImage(image.uri);
      setImageToUpload(image); // { uri, type, name }
    });
  };

  const handlePhotoOptions = () => {
    Alert.alert("Profile Photo", "Choose from...", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const onSave = async () => {
    try {
      await dispatch(updateProfile({ role, data: form, photo: imageToUpload })).unwrap();
      Alert.alert("Success", "Profile updated!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "Update failed");
    }
  };

  const AvatarIcon = role === "Retailer" ? <Store size={28} color="#D32F2F" />
    : role === "Distributor" ? <Building2 size={28} color="#D32F2F" />
    : <User size={28} color="#D32F2F" />;

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imageWrapper} onPress={handlePhotoOptions}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.iconAvatar}>{AvatarIcon}</View>
            )}
            <View style={styles.cameraButton}>
              <Camera size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to change photo</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{role}</Text>
          </View>
        </View>

        {sections.map((section, sIdx) => (
          <View key={sIdx} style={styles.card}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.fields.map(field => (
              <View key={field.key}>
                <Label text={field.label} disabled={!field.editable} />
                <TextInput
                  style={[
                    styles.input,
                    !field.editable && styles.disabled,
                    field.multiline && styles.multilineInput,
                  ]}
                  value={form[field.key] ?? ""}
                  onChangeText={v => onChange(field.key, v)}
                  editable={field.editable !== false}
                  keyboardType={field.keyboardType || "default"}
                  autoCapitalize={field.autoCapitalize || "sentences"}
                  multiline={field.multiline || false}
                  numberOfLines={field.multiline ? 3 : 1}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
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

const Label = ({ text, disabled }) => (
  <Text style={[styles.label, disabled && styles.labelDisabled]}>{text}</Text>
);

export default EditProfile;



