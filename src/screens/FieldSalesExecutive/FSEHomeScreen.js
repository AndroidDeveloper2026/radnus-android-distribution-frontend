import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
import FSEHomeStyles from "./FSEHomeStyle";
import Header from "../../components/Header";

const FSEHomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, );

  //  REQUEST GPS PERMISSION
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert("Permission Denied", "GPS permission is required");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  //  GET CURRENT LOCATION
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        Alert.alert("Error", "Unable to fetch GPS location");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // ✅ MARK ATTENDANCE
  const markAttendance = () => {
    if (!location) {
      Alert.alert("GPS Error", "Location not captured");
      return;
    }

    setLoading(true);

    const payload = {
      latitude: location.latitude,
      longitude: location.longitude,
      time: new Date(),
    };

    console.log("Attendance Payload:", payload);

    //  CALL ATTENDANCE API HERE

    setTimeout(() => {
      setAttendanceMarked(true);
      setLoading(false);

      Alert.alert("Success", "Attendance marked successfully", [
        {
          text: "OK",
          onPress: () => navigation.replace("FseDashboard"),
        },
      ]);
    }, 1000);
  };

  return (
    <View style={FSEHomeStyles.container}>

      <Header title = {'Start Day'} showBackArrow={false}/>

      <View style={FSEHomeStyles.content}>
        <Text style={FSEHomeStyles.title}>Mark Attendance</Text>

        {/* DATE & TIME */}
        <View style={FSEHomeStyles.infoBox}>
          <Text style={FSEHomeStyles.infoLabel}>Date</Text>
          <Text style={FSEHomeStyles.infoValue}>
            {new Date().toDateString()}
          </Text>
        </View>

        <View style={FSEHomeStyles.infoBox}>
          <Text style={FSEHomeStyles.infoLabel}>Time</Text>
          <Text style={FSEHomeStyles.infoValue}>
            {new Date().toLocaleTimeString()}
          </Text>
        </View>

        {/* GPS */}
        <View style={FSEHomeStyles.infoBox}>
          <Text style={FSEHomeStyles.infoLabel}>GPS Location</Text>
          {location ? (
            <>
              <Text style={FSEHomeStyles.infoValue}>
                Lat: {location.latitude}
              </Text>
              <Text style={FSEHomeStyles.infoValue}>
                Long: {location.longitude}
              </Text>
            </>
          ) : (
            <Text style={FSEHomeStyles.gpsStatus}>Fetching location…</Text>
          )}
        </View>

        {/* ATTENDANCE BUTTON */}
        <TouchableOpacity
          style={[
            FSEHomeStyles.button,
            (!location || loading || attendanceMarked) &&
              FSEHomeStyles.buttonDisabled,
          ]}
          onPress={markAttendance}
          disabled={!location || loading || attendanceMarked}
        >
          <Text style={FSEHomeStyles.buttonText}>
            {attendanceMarked ? "ATTENDANCE MARKED" : "START DAY"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FSEHomeScreen;
