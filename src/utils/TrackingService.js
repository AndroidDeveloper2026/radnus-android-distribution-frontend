import Geolocation from "@react-native-community/geolocation";
import API from "../services/API/api";
import socket from "../services/socket/socket";

let intervalId = null;

// ✅ REAL-TIME LOCATION TRACKING SERVICE
export const startTrackingService = (userId, sessionId) => {
  
  // ✅ Clear any existing interval
  if (intervalId) {
    clearInterval(intervalId);
  }

  // ✅ Fetch GPS location every 5 seconds
  intervalId = setInterval(() => {
    
    Geolocation.getCurrentPosition(
      async (position) => {
        
        const { latitude, longitude } = position.coords;
        const timestamp = new Date();

        try {
          // ✅ Send location to backend via API
          await API.post("/api/location/update", {
            userId,
            sessionId,
            latitude,
            longitude,
            timestamp
          });

          // ✅ Also emit via Socket.io for real-time updates
          socket.emit("send-location", {
            sessionId,
            latitude,
            longitude,
            timestamp
          });

          console.log(
            `✅ Location updated: [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`
          );

        } catch (error) {
          console.log("❌ Location update error:", error.message);
        }
      },
      
      (error) => {
        console.log("❌ GPS error:", error);
      },
      
      {
        enableHighAccuracy: true, // ✅ High accuracy mode
        timeout: 15000,
        maximumAge: 0, // ✅ Don't use cached location
      }
    );

  }, 5000); // ✅ Every 5 seconds

  console.log("🚀 Tracking service started for session:", sessionId);
};

// ✅ STOP LOCATION TRACKING SERVICE
export const stopTrackingService = () => {
  
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("🛑 Tracking service stopped");
  }
};

// ✅ PAUSE/RESUME TRACKING (optional)
export const pauseTrackingService = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("⏸️  Tracking service paused");
  }
};

export const resumeTrackingService = (userId, sessionId) => {
  startTrackingService(userId, sessionId);
};
