import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from './EditTerritoryStyle';
import Header from '../../components/Header';
import { updateTerritory } from '../../services/features/Territory/TerritorySlice';

const EditTerritory = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.territory);

  const { territory } = route.params;

  const [form, setForm] = useState({
    state: '',
    district: '',
    taluk: '',
    beats: '',
    assignedTo: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (territory) {
      setForm({
        state: territory.state || '',
        district: territory.district || '',
        taluk: territory.taluk || '',
        beats: territory.beats?.join(', ') || '',
        assignedTo: territory.assignedTo || '',
      });
    }
  }, [territory]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.district.trim()) newErrors.district = 'District is required';
    if (!form.taluk.trim()) newErrors.taluk = 'Taluk is required';
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
      await dispatch(
        updateTerritory({ id: territory._id, data: payload })
      ).unwrap();

      Alert.alert('Success', 'Territory updated successfully');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Update failed');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Territory" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Edit Territory</Text>

        <Label text="State *" />
        <TextInput
          style={[styles.input, errors.state && styles.inputError]}
          value={form.state}
          onChangeText={(v) => onChange('state', v)}
        />
        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

        <Label text="District *" />
        <TextInput
          style={[styles.input, errors.district && styles.inputError]}
          value={form.district}
          onChangeText={(v) => onChange('district', v)}
        />
        {errors.district && (
          <Text style={styles.errorText}>{errors.district}</Text>
        )}

        <Label text="Taluk *" />
        <TextInput
          style={[styles.input, errors.taluk && styles.inputError]}
          value={form.taluk}
          onChangeText={(v) => onChange('taluk', v)}
        />
        {errors.taluk && <Text style={styles.errorText}>{errors.taluk}</Text>}

        <Label text="Beats" />
        <TextInput
          style={styles.input}
          value={form.beats}
          onChangeText={(v) => onChange('beats', v)}
          placeholder="Beat 1, Beat 2"
        />
        <Text style={styles.hint}>Separate multiple beats with commas</Text>

        <Label text="Assigned To" />
        <TextInput
          style={styles.input}
          value={form.assignedTo}
          onChangeText={(v) => onChange('assignedTo', v)}
          placeholder="Enter FSE name"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Update Territory</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

export default EditTerritory;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { useDispatch } from "react-redux";
// import styles from "./EditTerritoryStyle";
// import Header from "../../components/Header";
// import { updateTerritory } from "../../services/features/Territory/TerritorySlice";

// const EditTerritory = ({ route, navigation }) => {
//   const dispatch = useDispatch();

//   const { territory } = route.params; // 👈 passed from previous screen

//   const [form, setForm] = useState({
//     state: "",
//     district: "",
//     taluk: "",
//     beats: "",
//     assignedTo: "",
//   });

//   // ✅ preload data
//   useEffect(() => {
//     if (territory) {
//       setForm({
//         state: territory.state || "",
//         district: territory.district || "",
//         taluk: territory.taluk || "",
//         beats: territory.beats?.join(", ") || "",
//         assignedTo: territory.assignedTo || "",
//       });
//     }
//   }, [territory]);

//   const onChange = (key, value) => {
//      setForm(prev => ({ ...prev, [key]: value }));
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
//       await dispatch(
//         updateTerritory({ id: territory._id, data: payload })
//       ).unwrap();

//       Alert.alert("Success", "Territory updated");
//       navigation.goBack();
//     } catch (err) {
//       Alert.alert("Error", err.message || "Update failed");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Edit Territory" />

//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Edit Territory</Text>

//         <Label text="State *" />
//         <TextInput
//           style={styles.input}
//           value={form.state}
//           onChangeText={(v) => onChange("state", v)}
//         />

//         <Label text="District *" />
//         <TextInput
//           style={styles.input}
//           value={form.district}
//           onChangeText={(v) => onChange("district", v)}
//         />

//         <Label text="Taluk *" />
//         <TextInput
//           style={styles.input}
//           value={form.taluk}
//           onChangeText={(v) => onChange("taluk", v)}
//         />

//         <Label text="Beats" />
//         <TextInput
//           style={styles.input}
//           value={form.beats}
//           onChangeText={(v) => onChange("beats", v)}
//         />

//         <Label text="Assigned To" />
//         <TextInput
//           style={styles.input}
//           value={form.assignedTo}
//           onChangeText={(v) => onChange("assignedTo", v)}
//         />

//         <TouchableOpacity style={styles.button} onPress={submit}>
//           <Text style={styles.buttonText}>Update Territory</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// const Label = ({ text }) => (
//   <Text style={styles.label}>{text}</Text>
// );

// export default EditTerritory;