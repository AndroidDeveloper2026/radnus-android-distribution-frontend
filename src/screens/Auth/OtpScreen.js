import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from './OtpStyle';
import LeftArrow from '../../assets/svg/white-left-arrow.svg';
import {
  verifyOtp,
  resendOtp,
  resetOtpState,
} from '../../services/features/auth/otpSlice';
import { verifyResetOtp } from '../../services/features/auth/resetOTPSlice'

const OTP_LENGTH = 6;
const OTP_TIMER = 45;

const OtpScreen = ({ navigation, route }) => {
  const { mobile, email, type } = route.params;

  const dispatch = useDispatch();
  const { loading, error, verified } = useSelector(state => state.otp);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(OTP_TIMER);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  //for cehcking useeffect
  // useEffect(() => {
  //   console.log('Route mobile param:', mobile);
  // });

  // useEffect(() => {
  //   console.log('Reset OTP state');
  //   dispatch(resetOtpState());
  // }, [dispatch]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- SUCCESS HANDLER ---------------- */
  useEffect(() => {
    if (verified) {
      Alert.alert('Success', 'OTP verified');
      dispatch(resetOtpState());
      //   navigation.reset({
      //     index: 0,
      //     routes: [{ name: 'Login' }],
      //   });

      //    navigation.navigate('Resetpassword', {
      //   email,
      //   otp: otp.join(''),
      // });

      if (type === 'register') {
        // ✅ Go to login after signup
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else if (type === 'reset') {
        // ✅ Go to reset password
        navigation.navigate('Resetpassword', {
          email,
          otp: otp.join(''),
        });
      }
    }
  }, [verified, type, email, otp, dispatch, navigation]);

  /* ---------------- ERROR HANDLER ---------------- */
  useEffect(() => {
    if (error) {
      console.log('-- otp error --', error);
      Alert.alert('OTP Error', error);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  }, [error]);

  /* ---------------- OTP INPUT ---------------- */
  const handleOtpChange = (value, index) => {
    //  console.log("--- Digit typed: ---", value, "at index:", index);
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const submitOtp = () => {
    const code = otp.join('');

    console.log('--- OTP array: ---', otp);
    console.log('--- Final OTP code: ---', code);
    console.log('--- Mobile sent:---', mobile);

    if (code.length !== OTP_LENGTH) {
      Alert.alert('Error', 'Enter 6-digit OTP');
      return;
    }

    // if (type === 'register') {
    //   dispatch(
    //     verifyOtp({
    //       mobile,
    //       otp: code,
    //     }),
    //   );
    // } else if (type === 'reset') {
    //   dispatch(
    //     verifyResetOtp({
    //       email,
    //       otp: code,
    //     }),
    //   );
    // }

    dispatch(
      verifyOtp({
        type,
        mobile,
        email,
        otp: code,
      }),
    );

    // dispatch(verifyResetOtp({ email, otp: code }));
  };

  /* ---------------- RESEND OTP ---------------- */
  const resend = () => {
    if (!canResend) return;

  //   if (type === 'register') {
  //   dispatch(resendOtp({ mobile }));
  // } else {
  //   dispatch(resendOtp({ email })); // or create resendResetOtp
  // }

    dispatch(resendOtp({ mobile, type,email })); 

    setOtp(Array(OTP_LENGTH).fill(''));
    setTimer(OTP_TIMER);
    setCanResend(false);
  };

  const formatTime = () => `00:${timer < 10 ? `0${timer}` : timer}`;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <LeftArrow width={30} height={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify OTP</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          {type === 'register' ? `Sent to +91 ${mobile}` : `Sent to ${email}`}
        </Text>
        {/* <Text style={styles.subtitle}>Sent to +91 {mobile}</Text> */}

        {/* OTP INPUT */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={v => handleOtpChange(v, index)}
            />
          ))}
        </View>

        {!canResend ? (
          <Text style={styles.timerText}>Resend OTP in {formatTime()}</Text>
        ) : (
          <TouchableOpacity onPress={resend}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={submitOtp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'VERIFYING...' : 'VERIFY'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpScreen;
