// import Geolocation from "@react-native-community/geolocation";
// import socket from "../services/socket/socket";
// import API from "../services/API/api";

// let watchId = null;

// export const startTrackingService = (userId, sessionId) => {

//   watchId = Geolocation.watchPosition(

//     async position => {

//       const { latitude, longitude } = position.coords;

//       socket.emit("send-location", {
//         userId,
//         sessionId,
//         latitude,
//         longitude
//       });

//       await API.post("/api/session/location/update", {
//         userId,
//         sessionId,
//         latitude,
//         longitude
//       });

//     },

//     error => console.log(error),

//     {
//       enableHighAccuracy: true,
//       distanceFilter: 10,
//       interval: 10000
//     }

//   );

// };

// export const stopTrackingService = () => {

//   if (watchId !== null) {
//     Geolocation.clearWatch(watchId);
//   }

// };

// import Geolocation from "@react-native-community/geolocation";
// import io from "socket.io-client";
// import { Platform, PermissionsAndroid } from "react-native";

// let watchId = null;
// let socket = null;

// const SERVER = "http://YOUR_SERVER_IP:5000";

// export const startTrackingService = async (userId, sessionId) => {

//  socket = io(SERVER);

//  if (Platform.OS === "android") {
//    await PermissionsAndroid.request(
//      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//    );
//  }

//  watchId = Geolocation.watchPosition(
//    position => {

//      const { latitude, longitude } = position.coords;

//      socket.emit("send-location", {
//        userId,
//        sessionId,
//        latitude,
//        longitude,
//      });

//    },
//    error => {
//      console.log("GPS error", error);
//    },
//    {
//      enableHighAccuracy: true,
//      distanceFilter: 5,
//      interval: 5000,
//      fastestInterval: 2000,
//      maximumAge: 0,
//    }
//  );
// };

// export const stopTrackingService = () => {

//  if (watchId !== null) {
//    Geolocation.clearWatch(watchId);
//    watchId = null;
//  }

//  if (socket) {
//    socket.disconnect();
//  }

// };

import Geolocation from "@react-native-community/geolocation";
import io from "socket.io-client";
import { PermissionsAndroid, Platform } from "react-native";

let watchId = null;
let socket = null;

const SERVER_URL = "https://radnus-android-distribution-backend.onrender.com"; // 🔴 change to your backend IP

export const startTrackingService = async (userId, sessionId) => {

 if (Platform.OS === "android") {
   await PermissionsAndroid.request(
     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
   );
 }

 socket = io(SERVER_URL, {
   transports: ["websocket"],
 });

 socket.on("connect", () => {
   console.log("Socket connected:", socket.id);
 });

 watchId = Geolocation.watchPosition(
   position => {

     const { latitude, longitude } = position.coords;

     console.log("GPS:", latitude, longitude);

     socket.emit("send-location", {
       userId,
       sessionId,
       latitude,
       longitude,
     });

   },
   error => {
     console.log("GPS error:", error);
   },
   {
     enableHighAccuracy: true,
     distanceFilter: 5,
     interval: 5000,
     fastestInterval: 2000,
     maximumAge: 0,
   }
 );
};

export const stopTrackingService = () => {

 if (watchId !== null) {
   Geolocation.clearWatch(watchId);
   watchId = null;
 }

 if (socket) {
   socket.disconnect();
   socket = null;
 }

};
