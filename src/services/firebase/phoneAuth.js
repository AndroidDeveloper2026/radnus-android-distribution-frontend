// import auth from '@react-native-firebase/auth';

// // Holds the in-flight phone sign-in confirmation. It's kept here (module
// // scope) rather than in Redux/navigation params because it's a live
// // Firebase SDK object and can't be serialized.
// let currentConfirmation = null;
// let currentE164Number = null;

// const toE164 = mobile => {
//   const digits = (mobile || '').toString().replace(/\D/g, '');
//   // Indian 10-digit mobile numbers, per the app's existing validation
//   // (Register schema / Yup schema both require /^[6-9]\d{9}$/).
//   return `+91${digits.slice(-10)}`;
// };

// /**
//  * Kicks off Firebase Phone Authentication for the given 10-digit mobile
//  * number. This sends a real SMS OTP to that exact number (not the
//  * device via FCM), which is what proves the user actually owns it.
//  */
// export const sendPhoneOtp = async mobile => {
//   const e164 = toE164(mobile);
//   const confirmation = await auth().signInWithPhoneNumber(e164);
//   currentConfirmation = confirmation;
//   currentE164Number = e164;
//   return confirmation;
// };

// /**
//  * Re-sends the OTP by simply re-initiating phone sign-in for the same
//  * number (Firebase doesn't expose a separate "resend" call).
//  */
// export const resendPhoneOtp = async mobile => {
//   return sendPhoneOtp(mobile);
// };

// /**
//  * Confirms the 6-digit code the user typed in against the in-flight
//  * Firebase phone sign-in, then returns a fresh Firebase ID token that
//  * the backend can verify with the Admin SDK.
//  */
// export const confirmPhoneOtp = async code => {
//   if (!currentConfirmation) {
//     throw new Error(
//       'No verification in progress. Please request a new OTP.',
//     );
//   }

//   const userCredential = await currentConfirmation.confirm(code);
//   const idToken = await userCredential.user.getIdToken(/* forceRefresh */ true);

//   return idToken;
// };

// export const clearPhoneAuthState = () => {
//   currentConfirmation = null;
//   currentE164Number = null;
// };
