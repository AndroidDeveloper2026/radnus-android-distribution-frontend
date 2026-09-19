import Geolocation from '@react-native-community/geolocation';
import { sendLocationViaSocket } from '../services/socket/socket';
import {
  sendBackgroundLocation,
  flushQueue,
  getOfflineQueueSize as getQueueSize,
} from './HeadlessLocation';

let watchId = null;
let isTracking = false;
let currentUserId = null;
let currentSessionId = null;
let lastPoint = null;
let locationUpdateCount = 0;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = v => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const startTrackingService = async (userId, sessionId) => {
  if (!userId || !sessionId) {
    // ✅ Log the actual values so the caller can be traced instead of
    // guessing — this fires whenever startTrackingService() is invoked
    // before the caller's own userId/sessionId has resolved.
    console.error(
      `❌ TrackingService: missing userId or sessionId (userId=${userId ?? 'undefined'}, sessionId=${sessionId ?? 'undefined'})`,
    );
    return;
  }

  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }

  currentUserId = userId;
  currentSessionId = sessionId;
  isTracking = true;
  lastPoint = null;
  locationUpdateCount = 0;

  console.log('🚀 TrackingService started:', { userId, sessionId });

  watchId = Geolocation.watchPosition(
    async position => {
      if (!isTracking || !position?.coords) return;

      const { latitude, longitude, accuracy, speed } = position.coords;
      if (isNaN(latitude) || isNaN(longitude)) return;
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return;

      const acc = accuracy || 0;
      if (acc > 200) {
        console.log(`⏭️ Skipping poor accuracy: ${acc}m`);
        return;
      }

      const lat = Number(latitude.toFixed(6));
      const lng = Number(longitude.toFixed(6));
      const timestamp = new Date().toISOString();

      if (lastPoint) {
        const dist = calculateDistance(lastPoint.lat, lastPoint.lng, lat, lng);
        if (dist < 0.005) {
          console.log(`⏭️ Too close: ${(dist * 1000).toFixed(1)}m`);
          return;
        }
        if (dist > 5) {
          console.warn(`🚨 GPS glitch: ${dist.toFixed(2)}km — ignored`);
          return;
        }
      }

      locationUpdateCount++;
      lastPoint = { lat, lng, timestamp };
      console.log(`📍 #${locationUpdateCount} ${lat}, ${lng} (±${Math.round(acc)}m)`);

      // ✅ Single write path: sendBackgroundLocation() persists the point
      // locally (temp cache for the live screen) AND syncs it to the
      // backend (source of truth). If the server call fails it queues the
      // point in the offline queue instead of dropping it, so it gets
      // retried later (by the next successful point, or at EndDay).
      // NOTE: previously this handler *also* POSTed the same point to
      // /api/location/update directly right after — that duplicate call
      // never queued on failure, so any point it lost was gone for good.
      // Removed to avoid double-writes and silent data loss.
      let synced = false;
      try {
        synced = await sendBackgroundLocation({
          userId: currentUserId,
          sessionId: currentSessionId,
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          timestamp: Date.now(),
          speed: speed || 0,
        });
      } catch (e) {
        console.error('❌ Local save/sync error:', e.message);
      }

      if (synced) {
        sendLocationViaSocket(currentSessionId, lat, lng, timestamp);
      }
    },
    error => {
      console.error('❌ GPS Error:', error.code, error.message);
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        watchId = null;
      }
      if (isTracking) {
        setTimeout(() => startTrackingService(currentUserId, currentSessionId), 5000);
      }
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 5,
      interval: 3000,
      fastestInterval: 2000,
      timeout: 30000,
      maximumAge: 10000,
      showsBackgroundLocationIndicator: true,
    }
  );

  console.log(`📡 GPS watcher registered: ${watchId}`);
};

export const stopTrackingService = () => {
  console.log('🛑 TrackingService stopped');
  isTracking = false;
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
  lastPoint = null;
  locationUpdateCount = 0;
};

export const forceStopTracking = () => stopTrackingService();

export const isTrackingActive = () => isTracking && watchId !== null;

// ✅ Real implementations (previously stubs that always reported "0 pending"
// and did nothing — this is why EndDay never actually flushed the offline
// GPS queue and pending points could be lost).
export const flushOfflineQueue = async () => flushQueue();
export const getOfflineQueueSize = async () => getQueueSize();

export const getTrackingStatus = () => ({
  isTracking,
  hasWatcher: watchId !== null,
  currentSessionId,
  currentUserId,
  locationUpdateCount,
  lastPoint,
});