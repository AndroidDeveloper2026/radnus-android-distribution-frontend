import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import styles from "./EditTerritoryStyle";
import Header from "../../components/Header";
import { updateTerritory } from "../../services/features/Territory/TerritorySlice";

const EditTerritory = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const { territory } = route.params; // 👈 passed from previous screen

  const [form, setForm] = useState({
    state: "",
    district: "",
    taluk: "",
    beats: "",
    assignedTo: "",
  });

  // ✅ preload data
  useEffect(() => {
    if (territory) {
      setForm({
        state: territory.state || "",
        district: territory.district || "",
        taluk: territory.taluk || "",
        beats: territory.beats?.join(", ") || "",
        assignedTo: territory.assignedTo || "",
      });
    }
  }, [territory]);

  const onChange = (key, value) => {
     setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (!form.state || !form.district || !form.taluk) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const payload = {
      state: form.state,
      district: form.district,
      taluk: form.taluk,
      beats: form.beats
        ? form.beats.split(",").map(b => b.trim()).filter(Boolean)
        : [],
      assignedTo: form.assignedTo || null,
      active: true,
    };

    try {
      await dispatch(
        updateTerritory({ id: territory._id, data: payload })
      ).unwrap();

      Alert.alert("Success", "Territory updated");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "Update failed");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Territory" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Edit Territory</Text>

        <Label text="State *" />
        <TextInput
          style={styles.input}
          value={form.state}
          onChangeText={(v) => onChange("state", v)}
        />

        <Label text="District *" />
        <TextInput
          style={styles.input}
          value={form.district}
          onChangeText={(v) => onChange("district", v)}
        />

        <Label text="Taluk *" />
        <TextInput
          style={styles.input}
          value={form.taluk}
          onChangeText={(v) => onChange("taluk", v)}
        />

        <Label text="Beats" />
        <TextInput
          style={styles.input}
          value={form.beats}
          onChangeText={(v) => onChange("beats", v)}
        />

        <Label text="Assigned To" />
        <TextInput
          style={styles.input}
          value={form.assignedTo}
          onChangeText={(v) => onChange("assignedTo", v)}
        />

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Update Territory</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Label = ({ text }) => (
  <Text style={styles.label}>{text}</Text>
);

export default EditTerritory;