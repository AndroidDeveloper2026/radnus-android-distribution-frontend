import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from './TermsConditionsStyle';
import Header from '../../components/Header';
import { CheckSquare, Square } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../services/features/auth/registerSlice';

const TermsConditions = ({ navigation, route }) => {
  const [accepted, setAccepted] = useState(false);
  const dispatch = useDispatch();
  const { registerData } = route.params;

  const onAccept = async () => {
    console.log('onAccept called with accepted:', accepted);
    if (!accepted) return;

    const result = await dispatch(registerUser(registerData));

    if (registerUser.fulfilled.match(result)) {
      navigation.replace('OtpScreen', {
        mobile: registerData.mobile,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Terms & Conditions" />

      {/* TERMS TEXT */}
      <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Terms of Use</Text>

        <Text style={styles.text}>
          By using this application, you agree to comply with all company
          policies related to sales operations, stock handling, billing, and
          customer management.
        </Text>

        <Text style={styles.text}>
          Location data may be captured during working hours to verify retailer
          visits and ensure accurate reporting. No tracking is performed outside
          working hours.
        </Text>

        <Text style={styles.text}>
          Any misuse of the application, data manipulation, or unauthorized
          access may lead to suspension or termination of access.
        </Text>

        <Text style={styles.text}>
          The company reserves the right to update these terms at any time.
          Continued use of the application implies acceptance of the updated
          terms.
        </Text>

        <Text style={styles.text}>
          If you do not agree with these terms, please do not proceed with
          registration.
        </Text>
      </ScrollView>

      {/* ACCEPT CHECKBOX */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setAccepted(!accepted)}
      >
        {accepted ? (
          <CheckSquare size={20} color="#D32F2F" />
        ) : (
          <Square size={20} color="#777" />
        )}

        <Text style={styles.checkboxText}>
          I have read and agree to the Terms & Conditions
        </Text>
      </TouchableOpacity>

      {/* ACTION BUTTON */}
      <TouchableOpacity
        style={[styles.okButton, !accepted && styles.disabledBtn]}
        disabled={!accepted}
        onPress={onAccept}
      >
        <Text style={styles.okText}>OK & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TermsConditions;
