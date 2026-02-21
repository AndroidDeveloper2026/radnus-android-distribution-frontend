// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import styles from "./AddTerritoryStyle";
// import Header from "../../components/Header";

// const AddTerritory = ({ navigation }) => {
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

//   const submit = () => {
//     const payload = {
//       state: form.state,
//       district: form.district,
//       taluk: form.taluk,
//       beats: form.beats.split(",").map(b => b.trim()),
//       assignedTo: form.assignedTo || null,
//       active: true,
//     };

//     console.log("Territory Data:", payload);

//     // 👉 dispatch API here

//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Add Territory" />

//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Create Territory</Text>

//         {/* STATE */}
//         <Label text="State *" />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter state"
//           value={form.state}
//           onChangeText={(v) => onChange("state", v)}
//         />

//         {/* DISTRICT */}
//         <Label text="District *" />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter district"
//           value={form.district}
//           onChangeText={(v) => onChange("district", v)}
//         />

//         {/* TALUK */}
//         <Label text="Taluk *" />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter taluk"
//           value={form.taluk}
//           onChangeText={(v) => onChange("taluk", v)}
//         />

//         {/* BEATS */}
//         <Label text="Beats (comma separated)" />
//         <TextInput
//           style={styles.input}
//           placeholder="Beat1, Beat2, Beat3"
//           value={form.beats}
//           onChangeText={(v) => onChange("beats", v)}
//         />

//         {/* ASSIGN */}
//         <Label text="Assign Distributor (optional)" />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter distributor name"
//           value={form.assignedTo}
//           onChangeText={(v) => onChange("assignedTo", v)}
//         />

//         {/* SUBMIT */}
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


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import styles from "./AddTerritoryStyle";
import Header from "../../components/Header";
import { addTerritory } from "../../services/features/Territory/TerritorySlice";

const AddTerritory = ({ navigation }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    state: "",
    district: "",
    taluk: "",
    beats: "",
    assignedTo: "",
  });

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
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
      await dispatch(addTerritory(payload)).unwrap();
      Alert.alert("Success", "Territory added successfully");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Territory" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Territory</Text>

        <Label text="State *" />
        <TextInput
          style={styles.input}
          placeholder="Enter state"
          value={form.state}
          onChangeText={(v) => onChange("state", v)}
        />

        <Label text="District *" />
        <TextInput
          style={styles.input}
          placeholder="Enter district"
          value={form.district}
          onChangeText={(v) => onChange("district", v)}
        />

        <Label text="Taluk *" />
        <TextInput
          style={styles.input}
          placeholder="Enter taluk"
          value={form.taluk}
          onChangeText={(v) => onChange("taluk", v)}
        />

        <Label text="Beats (comma separated)" />
        <TextInput
          style={styles.input}
          placeholder="Beat1, Beat2"
          value={form.beats}
          onChangeText={(v) => onChange("beats", v)}
        />

        <Label text="Assign Distributor (optional)" />
        <TextInput
          style={styles.input}
          placeholder="Enter distributor"
          value={form.assignedTo}
          onChangeText={(v) => onChange("assignedTo", v)}
        />

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Save Territory</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Label = ({ text }) => (
  <Text style={styles.label}>{text}</Text>
);

export default AddTerritory;
