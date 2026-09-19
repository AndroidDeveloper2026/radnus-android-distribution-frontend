
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, NativeModules } from 'react-native';
import LocationService from '../LocationService';
import { flushQueue } from '../HeadlessLocation';
import { startTrackingService } from '../TrackingService';
import { getSessionId as getStoredSessionId } from '../../services/AuthStorage/authStorgage';
import API from '../../services/API/api';

// How often we reconcile the displayed distance with the backend's
// authoritative total. Kept separate from the fast local poll
// (updateInterval, default 2s) since this one hits the network — 2s
// would be excessive. This mirrors FSETracking's own poll cadence so
// both screens converge on the same number at roughly the same pace.
const BACKEND_SYNC_INTERVAL_MS = 10000;

const { LocationServiceModule } = NativeModules;

export const useLocationTracking = (updateInterval = 2000) => {
  const [distance, setDistance] = useState('0.00 KM');
  const [routePoints, setRoutePoints] = useState([]);
  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const intervalRef = useRef(null);

  const fetchLocationData = useCallback(async () => {
    try {
      const [totalDistance, points, sessionData, routeSummary, stats] =
        await Promise.all([
          LocationService.getTotalDistance(),
          LocationService.getRoutePoints(),
          LocationService.getSession(),
          LocationService.getRouteSummary(),
          LocationService.getStatistics(),
        ]);

      const dist = parseFloat(totalDistance) || 0;
      const formatted = dist >= 1 ? `${dist.toFixed(2)} KM` : `${(dist * 1000).toFixed(0)} M`;

      setDistance(formatted);
      setRoutePoints(points);
      setSession(sessionData);
      setSummary(routeSummary);
      setStatistics(stats);
      setPointCount(points.length);
      setIsTracking(!!sessionData && sessionData.status === 'active');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // ✅ Reconcile the displayed distance with the backend's authoritative
  // total (Session.totalDistanceKm in the DB), the same source FSETracking
  // reads from. The local calc above updates instantly but uses a looser
  // movement threshold and never talks to the server, so left alone it
  // can drift from — and confusingly disagree with — what FSETracking
  // shows. When the backend fetch succeeds, its number wins; if it's
  // unreachable (offline, session not started yet, etc.) we silently
  // keep showing the local estimate rather than blocking the UI on it.
  const syncingRef = useRef(false);
  const syncDistanceFromBackend = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    try {
      const meta = await LocationService.getTrackingMeta();
      const sessionId = meta?.sessionId;
      if (!sessionId) return;

      const res = await Promise.race([
        API.get(`/api/session/${sessionId}`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('sync timeout')), 8000)),
      ]);

      const data = res?.data;
      if (!data) return;

      if (typeof data.totalDistanceKm === 'number') {
        const dist = data.totalDistanceKm;
        const formatted = dist >= 1 ? `${dist.toFixed(2)} KM` : `${(dist * 1000).toFixed(0)} M`;
        setDistance(formatted);
      }
      if (typeof data.pointCount === 'number') {
        setPointCount(data.pointCount);
      }
    } catch (err) {
      // Offline or session not reachable yet — keep the local estimate,
      // don't surface this as a user-facing error.
    } finally {
      syncingRef.current = false;
    }
  }, []);

  const startTracking = useCallback(
    async (userId, sessionId, isRecovery = false) => {
      // ✅ Don't fail silently on a bad call — this is the exact spot the
      // "missing userId or sessionId" error traces back to. Try a
      // one-time recovery from storage (covers the case where this was
      // called before the caller's own state finished hydrating), then
      // fail loudly with the actual values so it's obvious what's wrong
      // instead of a bare early-return.
      let resolvedUserId = userId;
      let resolvedSessionId = sessionId;

      if (!resolvedSessionId) {
        try {
          resolvedSessionId = await getStoredSessionId();
        } catch (e) {
          // ignore — handled by the check below
        }
      }

      if (!resolvedUserId || !resolvedSessionId) {
        const msg = `useLocationTracking.startTracking called with invalid args: userId=${resolvedUserId ?? 'undefined'}, sessionId=${resolvedSessionId ?? 'undefined'}`;
        console.error('❌', msg);
        setError(msg);
        return false;
      }

      try {
        setLoading(true);
        if (!isRecovery) {
          await LocationService.resetTracking();
        }
        await LocationService.startSession();
        await LocationService.setTrackingMeta(resolvedUserId, resolvedSessionId);

        // ✅ START NATIVE FOREGROUND SERVICE — this is the real tracking
        // pipeline (FusedLocationProviderClient -> HeadlessJsTaskService
        // "LocationTask" -> locationTaskHandler.js -> sendBackgroundLocation()).
        // Falls back to the JS Geolocation.watchPosition path only if the
        // native module isn't present on this build, so we never run both
        // and double-count points/distance.
        if (LocationServiceModule) {
          LocationServiceModule.startService(resolvedUserId, resolvedSessionId);
        } else {
          console.warn('⚠️ LocationServiceModule unavailable — falling back to JS GPS watcher');
          startTrackingService(resolvedUserId, resolvedSessionId);
        }

        flushQueue();
        setIsTracking(true);
        await fetchLocationData();
        syncDistanceFromBackend();
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchLocationData, syncDistanceFromBackend]
  );

  const endTracking = useCallback(async () => {
    try {
      setLoading(true);

      // ✅ STOP NATIVE FOREGROUND SERVICE
      if (LocationServiceModule) {
        LocationServiceModule.stopService();
      }

      await LocationService.endSession();
      setIsTracking(false);
      await fetchLocationData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchLocationData]);

  const resetTracking = useCallback(async () => {
    try {
      setLoading(true);
      if (LocationServiceModule) {
        LocationServiceModule.stopService();
      }
      await LocationService.resetTracking();
      setDistance('0.00 KM');
      setRoutePoints([]);
      setSession(null);
      setSummary(null);
      setStatistics(null);
      setPointCount(0);
      setIsTracking(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const recalculateDistance = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await LocationService.getStatistics();
      if (stats) {
        const dist = parseFloat(stats.totalDistance) || 0;
        const formatted =
          dist >= 1
            ? `${dist.toFixed(2)} KM`
            : `${(dist * 1000).toFixed(0)} M`;
        setDistance(formatted);
        setStatistics(stats);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPolylineCoordinates = useCallback(async () => {
    try {
      return await LocationService.getPolylineCoordinates();
    } catch (err) {
      return [];
    }
  }, []);

  const getBoundingRegion = useCallback(async () => {
    try {
      return await LocationService.getBoundingRegion();
    } catch (err) {
      return null;
    }
  }, []);

  const getStatistics = useCallback(async () => {
    try {
      return await LocationService.getStatistics();
    } catch (err) {
      return null;
    }
  }, []);

  const exportData = useCallback(async () => {
    try {
      return await LocationService.exportRouteData();
    } catch (err) {
      return null;
    }
  }, []);

  const getDebugInfo = useCallback(async () => {
    try {
      return await LocationService.getDebugInfo();
    } catch (err) {
      return null;
    }
  }, []);

  useEffect(() => {
    fetchLocationData();
    intervalRef.current = setInterval(fetchLocationData, updateInterval);
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        fetchLocationData();
        syncDistanceFromBackend();
      }
    });
    return () => {
      clearInterval(intervalRef.current);
      sub.remove();
    };
  }, [updateInterval, fetchLocationData, syncDistanceFromBackend]);

  // ✅ Separate, slower interval for the backend reconciliation — see
  // syncDistanceFromBackend above for why this isn't folded into the
  // fast local poll.
  const backendSyncIntervalRef = useRef(null);
  useEffect(() => {
    syncDistanceFromBackend();
    backendSyncIntervalRef.current = setInterval(syncDistanceFromBackend, BACKEND_SYNC_INTERVAL_MS);
    return () => clearInterval(backendSyncIntervalRef.current);
  }, [syncDistanceFromBackend]);

  return {
    distance,
    routePoints,
    session,
    summary,
    statistics,
    pointCount,
    isTracking,
    loading,
    error,
    fetchLocationData,
    syncDistanceFromBackend,
    startTracking,
    endTracking,
    resetTracking,
    recalculateDistance,
    getPolylineCoordinates,
    getBoundingRegion,
    getStatistics,
    exportData,
    getDebugInfo,
  };
};

export default useLocationTracking;