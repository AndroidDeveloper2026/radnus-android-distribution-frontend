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
import { launchImageLibrary } from "react-native-image-picker";
import { useSelector } from "react-redux";
import { Camera, Store, Building2, User } from "lucide-react-native";

// ─────────────────────────────────────────────
// Role → initial form fields (from DB schema)
// ─────────────────────────────────────────────
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

    case "Agent":
      return {
        name: profileData?.name || authUser?.name || "",
        dob: profileData?.dob || "",
        email: profileData?.email || authUser?.email || "",
        phone: profileData?.phone || authUser?.mobile || "",
        altPhone: profileData?.altPhone || "",
        address: profileData?.address || "",
        altAddress: profileData?.altAddress || "",
      };

    default:
      return {
        name: authUser?.name || "",
        email: authUser?.email || "",
        mobile: authUser?.mobile || "",
      };
  }
};

// ─────────────────────────────────────────────
// Role → form field definitions
// ─────────────────────────────────────────────
const getFormSections = (role) => {
  switch (role) {
    case "Distributor":
      return [
        {
          title: "Business Information",
          fields: [
            { key: "businessName", label: "Business Name", editable: true },
            { key: "mobile", label: "Mobile Number", editable: false },
            {
              key: "alternateMobile",
              label: "Alternate Mobile",
              editable: true,
              keyboardType: "phone-pad",
            },
          ],
        },
        {
          title: "Registration",
          fields: [
            {
              key: "gst",
              label: "GST Number",
              editable: true,
              autoCapitalize: "characters",
            },
            { key: "msme", label: "MSME Number", editable: true },
          ],
        },
        {
          title: "Address",
          fields: [
            {
              key: "address",
              label: "Business Address",
              editable: true,
              multiline: true,
            },
            {
              key: "communicationAddress",
              label: "Communication Address",
              editable: true,
              multiline: true,
            },
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
            {
              key: "alternatePhone",
              label: "Alternate Phone",
              editable: true,
              keyboardType: "phone-pad",
            },
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
            {
              key: "altPhone",
              label: "Alternate Phone",
              editable: true,
              keyboardType: "phone-pad",
            },
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


const PHOTO_ROLES = ["Executive", "Agent", "Retailer"];

const EditProfile = ({ navigation }) => {
  // Adjust redux slice paths as needed
  const authUser = useSelector((state) => state.auth?.user);
  const profileData = useSelector((state) => state.profile?.data);
  const role = authUser?.role || "Distributor";

  const [profileImage, setProfileImage] = useState(
    profileData?.photo ||
    profileData?.shopPhoto ||
    null
  );

  const [form, setForm] = useState(
    getInitialForm(role, profileData, authUser)
  );

  const sections = getFormSections(role);
  const showPhoto = PHOTO_ROLES.includes(role);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (response) => {
      if (!response.didCancel && response.assets) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const onSave = () => {
    // 🔗 API CALL — dispatch update thunk with { role, form, profileImage }
    // e.g. dispatch(updateProfile({ role, data: form, photo: profileImage }))
    navigation.goBack();
  };

  // Avatar icon by role
  const AvatarIcon = role === "Retailer"
    ? <Store size={28} color="#D32F2F" />
    : role === "Distributor"
    ? <Building2 size={28} color="#D32F2F" />
    : <User size={28} color="#D32F2F" />;

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" />

      <ScrollView contentContainerStyle={styles.content}>

        {/* ── PHOTO / AVATAR ── */}
        <View style={styles.imageSection}>
          <View style={styles.imageWrapper}>
            {showPhoto ? (
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/logo/radnus-logo.png")
                }
                style={styles.profileImage}
              />
            ) : (
              // Distributor: icon avatar (no photo upload needed)
              <View style={styles.iconAvatar}>
                {AvatarIcon}
              </View>
            )}

            {showPhoto && (
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <Camera size={16} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>

          {showPhoto && (
            <Text style={styles.imageHint}>Tap camera to change photo</Text>
          )}

          {/* Role badge */}
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{role}</Text>
          </View>
        </View>

        {/* ── DYNAMIC FORM SECTIONS ── */}
        {sections.map((section, sIdx) => (
          <View key={sIdx} style={styles.card}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.fields.map((field) => (
              <View key={field.key}>
                <Label text={field.label} disabled={!field.editable} />
                <TextInput
                  style={[
                    styles.input,
                    !field.editable && styles.disabled,
                    field.multiline && styles.multilineInput,
                  ]}
                  value={form[field.key] ?? ""}
                  onChangeText={(v) => onChange(field.key, v)}
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

        {/* ── ACTIONS ── */}
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

const Label = ({ text, disabled }) => (
  <Text style={[styles.label, disabled && styles.labelDisabled]}>{text}</Text>
);

export default EditProfile;