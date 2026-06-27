import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './TermsConditionsStyle';
import Header from '../../components/Header';
import { CheckSquare, Square } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../services/features/auth/registerSlice';

const TermsConditions = ({ navigation, route }) => {
  const [accepted, setAccepted] = useState(false);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const registerData = route?.params?.registerData;

  const onAccept = async () => {
    if (!accepted) return;

    const result = await dispatch(registerUser(registerData));

    if (registerUser.fulfilled.match(result)) {
      navigation.replace('OtpScreen', {
        mobile: registerData.mobile,
        type: 'register',
        role: registerData.role,
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
          By using this application, you agree to comply with all company policies related to sales operations, stock handling, billing, and customer management. You are responsible for maintaining the confidentiality of your account and for all activities under your login.
        </Text>

        <Text style={styles.text}>
          Location data may be captured during working hours to verify retailer visits and ensure accurate reporting. No tracking is performed outside working hours, and this data is used only for business purposes.
        </Text>

        <Text style={styles.text}>
          Any misuse of the application, data manipulation, or unauthorized access may lead to suspension or termination of your access. The company reserves the right to update these terms at any time, and continued use implies acceptance of the updated terms.
        </Text>

        <Text style={styles.text}>
          If you do not agree with these terms, please do not proceed with registration.
        </Text>
      </ScrollView>

      {/* BOTTOM SECTION WITH SAFE AREA PADDING */}
      <View style={{ paddingBottom: insets.bottom }}>
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
    </View>
  );
};

export default TermsConditions;

//++++++++++++++++++++++++++++++++++++++++++++++++

// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import styles from './TermsConditionsStyle';
// import Header from '../../components/Header';
// import { CheckSquare, Square } from 'lucide-react-native';
// import { useDispatch } from 'react-redux';
// import { registerUser } from '../../services/features/auth/registerSlice';

// const TermsConditions = ({ navigation, route }) => {
//   const [accepted, setAccepted] = useState(false);
//   const dispatch = useDispatch();
//   const insets = useSafeAreaInsets();

//   const registerData = route?.params?.registerData;

//   const onAccept = async () => {
//     if (!accepted) return;

//     const result = await dispatch(registerUser(registerData));

//     if (registerUser.fulfilled.match(result)) {
//       navigation.replace('OtpScreen', {
//         mobile: registerData.mobile,
//         type: 'register',
//       });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Terms & Conditions" />

//       {/* TERMS TEXT */}
//       <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
//         <Text style={styles.heading}>Terms of Use</Text>

//         <Text style={styles.text}>
//           By using this application, you agree to comply with all company policies related to sales operations, stock handling, billing, and customer management. You are responsible for maintaining the confidentiality of your account and for all activities under your login.
//         </Text>

//         <Text style={styles.text}>
//           Location data may be captured during working hours to verify retailer visits and ensure accurate reporting. No tracking is performed outside working hours, and this data is used only for business purposes.
//         </Text>

//         <Text style={styles.text}>
//           Any misuse of the application, data manipulation, or unauthorized access may lead to suspension or termination of your access. The company reserves the right to update these terms at any time, and continued use implies acceptance of the updated terms.
//         </Text>

//         <Text style={styles.text}>
//           If you do not agree with these terms, please do not proceed with registration.
//         </Text>
//       </ScrollView>

//       {/* BOTTOM SECTION WITH SAFE AREA PADDING */}
//       <View style={{ paddingBottom: insets.bottom }}>
//         {/* ACCEPT CHECKBOX */}
//         <TouchableOpacity
//           style={styles.checkboxRow}
//           onPress={() => setAccepted(!accepted)}
//         >
//           {accepted ? (
//             <CheckSquare size={20} color="#D32F2F" />
//           ) : (
//             <Square size={20} color="#777" />
//           )}

//           <Text style={styles.checkboxText}>
//             I have read and agree to the Terms & Conditions
//           </Text>
//         </TouchableOpacity>

//         {/* ACTION BUTTON */}
//         <TouchableOpacity
//           style={[styles.okButton, !accepted && styles.disabledBtn]}
//           disabled={!accepted}
//           onPress={onAccept}
//         >
//           <Text style={styles.okText}>OK & Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default TermsConditions;