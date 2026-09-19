import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AddTerritoryStyle';
import Header from '../../components/Header';
import { addTerritory } from '../../services/features/Territory/TerritorySlice';

const AddTerritory = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.territory);

  const [form, setForm] = useState({
    state: '',
    district: '',
    taluk: '',
    beats: '',
    assignedTo: '',
  });

  const [errors, setErrors] = useState({});

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.district.trim()) newErrors.district = 'District is required';
    if (!form.taluk.trim()) newErrors.taluk = 'Taluk is required';
    if (form.state.length < 2)
      newErrors.state = 'State must be at least 2 characters';
    if (form.district.length < 2)
      newErrors.district = 'District must be at least 2 characters';
    if (form.taluk.length < 2)
      newErrors.taluk = 'Taluk must be at least 2 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const payload = {
      state: form.state.trim(),
      district: form.district.trim(),
      taluk: form.taluk.trim(),
      beats: form.beats
        ? form.beats
            .split(',')
            .map((b) => b.trim())
            .filter(Boolean)
        : [],
      assignedTo: form.assignedTo.trim() || null,
      active: true,
    };

    try {
      await dispatch(addTerritory(payload)).unwrap();
      Alert.alert('Success', 'Territory added successfully');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Territory" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Territory</Text>

        <Label text="State *" />
        <TextInput
          style={[styles.input, errors.state && styles.inputError]}
          placeholder="Enter state"
          placeholderTextColor="#888"
          value={form.state}
          onChangeText={(v) => onChange('state', v)}
        />
        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

        <Label text="District *" />
        <TextInput
          style={[styles.input, errors.district && styles.inputError]}
          placeholder="Enter district"
          placeholderTextColor="#888"
          value={form.district}
          onChangeText={(v) => onChange('district', v)}
        />
        {errors.district && (
          <Text style={styles.errorText}>{errors.district}</Text>
        )}

        <Label text="Taluk *" />
        <TextInput
          style={[styles.input, errors.taluk && styles.inputError]}
          placeholder="Enter taluk"
          placeholderTextColor="#888"
          value={form.taluk}
          onChangeText={(v) => onChange('taluk', v)}
        />
        {errors.taluk && <Text style={styles.errorText}>{errors.taluk}</Text>}

        <Label text="Beats (comma separated)" />
        <TextInput
          style={styles.input}
          placeholder="Beat1, Beat2"
          placeholderTextColor="#888"
          value={form.beats}
          onChangeText={(v) => onChange('beats', v)}
        />
        <Text style={styles.hint}>Separate multiple beats with commas</Text>

        <Label text="Assign FSE (optional)" />
        <TextInput
          style={styles.input}
          placeholder="Enter FSE name"
          placeholderTextColor="#888"
          value={form.assignedTo}
          onChangeText={(v) => onChange('assignedTo', v)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Save Territory</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

export default AddTerritory;

//++++++++++++++++++++++++++++++++++++++++++++++++++++++
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { useDispatch } from "react-redux";
// import styles from "./AddTerritoryStyle";
// import Header from "../../components/Header";
// import { addTerritory } from "../../services/features/Territory/TerritorySlice";

// const AddTerritory = ({ navigation }) => {
//   const dispatch = useDispatch();

//   const [form, setForm] = useState({
//     state: "",
//     district: "",
//     taluk: "",
//     beats: "",
//     assignedTo: "",
//   });

//   const onChange = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   const submit = async () => {
//     if (!form.state || !form.district || !form.taluk) {
//       Alert.alert("Error", "Please fill all required fields");
//       return;
//     }

//     const payload = {
//       state: form.state,
//       district: form.district,
//       taluk: form.taluk,
//       beats: form.beats
//         ? form.beats.split(",").map(b => b.trim()).filter(Boolean)
//         : [],
//       assignedTo: form.assignedTo || null,
//       active: true,
//     };

//     try {
//       await dispatch(addTerritory(payload)).unwrap();
//       Alert.alert("Success", "Territory added successfully");
//       navigation.goBack();
//     } catch (err) {
//       Alert.alert("Error", err.message || "Something went wrong");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Add Territory" />

//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Create Territory</Text>

//         <Label text="State *" />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter state"
//           value={form.state}
//           onChangeText={(v) => onChange("state", v)}
//         />

//         <Label text="District *" />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter district"
//           value={form.district}
//           onChangeText={(v) => onChange("district", v)}
//         />

//         <Label text="Taluk *" />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter taluk"
//           value={form.taluk}
//           onChangeText={(v) => onChange("taluk", v)}
//         />

//         <Label text="Beats (comma separated)" />
//         <TextInput
//           style={styles.input}
//           placeholder="Beat1, Beat2"
//           value={form.beats}
//           onChangeText={(v) => onChange("beats", v)}
//         />

//         <Label text="Assign Distributor (optional)" />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter distributor"
//           value={form.assignedTo}
//           onChangeText={(v) => onChange("assignedTo", v)}
//         />

//         <TouchableOpacity style={styles.button} onPress={submit}>
//           <Text style={styles.buttonText}>Save Territory</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// const Label = ({ text }) => (
//   <Text style={styles.label}>{text}</Text>
// );

// export default AddTerritory;
