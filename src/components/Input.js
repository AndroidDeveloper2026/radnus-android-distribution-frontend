import React from "react";
import { StyleSheet,View,Text,TextInput } from "react-native";

const Input = ({ label, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={`Enter ${label}`}
      placeholderTextColor="#999"
      {...props}
    />
  </View>
);


export default Input;

const styles = StyleSheet.create({
     inputContainer: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

    
})

