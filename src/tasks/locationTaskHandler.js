// locationTaskHandler.js
//
// Handler for the native "LocationTask" headless task. LocationTrackingService.java
// (foreground service) gets a GPS fix from FusedLocationProviderClient, then starts
// LocationHeadlessTask.java (a HeadlessJsTaskService) with task name "LocationTask"
// and the fix's data as extras. React Native only runs that task if something on
// the JS side has registered a handler for the same name via
// AppRegistry.registerHeadlessTask('LocationTask', ...) — see index.js.
//
// Without this registration, every native location fix reaches the JS bridge with
// nowhere to go and is silently dropped — which is why sessions previously ended
// up with 0 route points/distance despite the native service running correctly.

import { sendBackgroundLocation } from '../utils/HeadlessLocation';

const locationTaskHandler = async (data) => {
  if (!data) {
    console.warn('⚠️ [LocationTask] Received empty data from native side');
    return;
  }

  // ✅ Defensive guard: if the native service ever fires a fix with a
  // missing userId/sessionId (e.g. restarted by Android without its
  // original extras), drop it here instead of letting it reach the
  // backend, which would reject it with 400 "Missing required fields"
  // on every single point.
  if (!data.userId || !data.sessionId) {
    console.warn('⚠️ [LocationTask] Dropping fix — missing userId/sessionId', data);
    return;
  }

  try {
    const synced = await sendBackgroundLocation({
      userId: data.userId,
      sessionId: data.sessionId,
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      // Native sends epoch millis (Location.getTime()) — pass through as-is.
      timestamp: data.timestamp,
      speed: data.speed,
    });

    console.log(
      synced
        ? `✅ [LocationTask] Point synced: ${data.latitude}, ${data.longitude}`
        : `📌 [LocationTask] Point queued (offline): ${data.latitude}, ${data.longitude}`,
    );
  } catch (err) {
    console.error('❌ [LocationTask] Error handling location:', err.message);
  }
};

export default locationTaskHandler;