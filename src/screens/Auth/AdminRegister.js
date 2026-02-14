// import React, { useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity } from 'react-native';
// import styles from './LoginStyle';

// import LeftArrow from '../../assets/svg/white-left-arrow.svg';

// import { Formik } from 'formik';

// import * as Yup from 'yup';

// const AdminRegisterSchema = Yup.object().shape({
//   emailID: Yup.string().email('Invalid email').required('Email is required'),

//   password: Yup.string()
//     .min(6, 'Password must be at least 6 characters')
//     .required('Password is required'),
// });

// const AdminRegisterScreen = ({ navigation }) => {

  
//   const handleBackBtn = () => {
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={handleBackBtn}>
//           <LeftArrow width={35} height={35} />
//         </TouchableOpacity>
//         <Text style={styles.heading}>Admin Register</Text>
//       </View>
//       <Formik
//         initialValues={{ emailID: '', password: '' }}
//         validationSchema={AdminRegisterSchema}
//         onSubmit={values => {
//           dispatch(adminRegister(values))
//           console.log(values);
//         }}
//       >
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           values,
//           errors,
//           touched,
//         }) => (
//           <View style={styles.card}>
//             {/* EMAIL */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Email ID</Text>
//               <TextInput
//                 style={styles.input}
//                 value={values.emailID}
//                 onChangeText={handleChange('emailID')}
//                 onBlur={handleBlur('emailID')}
//                 autoCapitalize="none"
//                 placeholder="Enter email"
//               />
//               {touched.emailID && errors.emailID && (
//                 <Text style={styles.error}>{errors.emailID}</Text>
//               )}
//             </View>

//             {/* PASSWORD */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Password</Text>
//               <TextInput
//                 style={styles.input}
//                 secureTextEntry
//                 value={values.password}
//                 onChangeText={handleChange('password')}
//                 onBlur={handleBlur('password')}
//                 placeholder="Enter password"
//               />
//               {touched.password && errors.password && (
//                 <Text style={styles.error}>{errors.password}</Text>
//               )}
//             </View>

//             <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//               <Text style={styles.buttonText}>REGISTER</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </Formik>
//     </View>
//   );
// };

// export default AdminRegisterScreen;
