import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "./OtpStyle";
import LeftArrow from "../../assets/svg/white-left-arrow.svg";

const OTP_LENGTH = 6;
const OTP_TIMER = 45;

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(OTP_TIMER);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- OTP INPUT ---------------- */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updatedOtp.join("").length === OTP_LENGTH) {
      verifyOtp(updatedOtp.join(""));
    }
  };

  const handleKeyPress = (e, index) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = (code) => {
    if (code.length !== OTP_LENGTH) {
      Alert.alert("Error", "Please enter 6-digit OTP");
      return;
    }

    console.log("OTP:", code);
    // 🔐 VERIFY OTP API CALL

    Alert.alert("Success", "OTP verified");

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  /* ---------------- RESEND OTP ---------------- */
  const resendOtp = () => {
    if (!canResend) return;

    // 🔁 RESEND OTP API
    Alert.alert("OTP Sent", "New OTP sent");

    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(OTP_TIMER);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const formatTime = () =>
    `00:${timer < 10 ? `0${timer}` : timer}`;

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
          We have sent a 6-digit code to
        </Text>
        <Text style={styles.mobileText}>+91 XXXXXXXX90</Text>

        {/* OTP BOXES */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpBox,
                digit && styles.otpBoxActive,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) =>
                handleOtpChange(v, index)
              }
              onKeyPress={(e) =>
                handleKeyPress(e, index)
              }
              autoFocus={index === 0}
              autoComplete="sms-otp"          // Android
              textContentType="oneTimeCode"  // iOS
              importantForAutofill="yes"
            />
          ))}
        </View>

        {/* TIMER / RESEND */}
        {!canResend ? (
          <Text style={styles.timerText}>
            Resend OTP in {formatTime()}
          </Text>
        ) : (
          <TouchableOpacity onPress={resendOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => verifyOtp(otp.join(""))}
        >
          <Text style={styles.buttonText}>VERIFY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpScreen;


