import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import styles from "./RetailerProfileStyle";
import Header from "../../components/Header";

const RetailerProfile = ({ route, navigation }) => {
  // const { retailer } = route.params;

  const defaultRetailer = {
    id: "R0",
    name: "Default Retail Shop",
    owner: "Default Owner",
    mobile: "9999999999",
    area: "Default Area",
    gst: "GSTIN0000",
    status: "APPROVED",
  };

  // ✅ Use route params OR default
  const retailer = route?.params?.retailer || defaultRetailer;

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    shopName: retailer.name,
    ownerName: retailer.owner,
    mobile: retailer.mobile || "",
    area: retailer.area,
    gst: retailer.gst || "",
  });

  var Status = "APPROVED";
  // BLOCK UNAPPROVED RETAILERS (retailer.status !== "APPROVED")
  if (Status !== "APPROVED") {
    Alert.alert("Access Denied", "Retailer not approved yet", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
    return null;
  }

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const saveProfile = () => {
    if (!form.shopName || !form.ownerName || !form.mobile) {
      Alert.alert("Error", "Please fill required fields");
      return;
    }

    console.log("Updated Retailer:", form);
    Alert.alert("Success", "Profile updated");
    setEditMode(false);
  };

  return (
    <View style={styles.container}>
      
        <Header  title={'Retailer Profile'}/>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* PROFILE CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            value={form.shopName}
            editable={editMode}
            onChangeText={(v) => onChange("shopName", v)}
          />

          <Text style={styles.label}>Owner Name</Text>
          <TextInput
            style={styles.input}
            value={form.ownerName}
            editable={editMode}
            onChangeText={(v) => onChange("ownerName", v)}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={form.mobile}
            keyboardType="phone-pad"
            editable={editMode}
            onChangeText={(v) => onChange("mobile", v)}
          />

          <Text style={styles.label}>Area</Text>
          <TextInput
            style={styles.input}
            value={form.area}
            editable={editMode}
            onChangeText={(v) => onChange("area", v)}
          />

          <Text style={styles.label}>GST Number</Text>
          <TextInput
            style={styles.input}
            value={form.gst}
            editable={editMode}
            onChangeText={(v) => onChange("gst", v)}
          />
        </View>

        {/* ACTION BUTTON */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={editMode ? saveProfile : () => setEditMode(true)}
        >
          <Text style={styles.btnText}>
            {editMode ? "Save Changes" : "Edit Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RetailerProfile;
