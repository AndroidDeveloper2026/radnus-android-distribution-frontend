
// HeadlessLocation.js - COMPLETE FIXED VERSION

import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/API/api';
import NetInfo from '@react-native-community/netinfo';

export const LOCATION_STORAGE_KEY = '@fse_last_location';
export const ROUTE_STORAGE_KEY = '@fse_route_points';
export const DISTANCE_STORAGE_KEY = '@fse_total_distance';
export const OFFLINE_QUEUE_KEY = '@fse_offline_queue';
// ⚠️ This used to be 500 with a queue.shift() dropping the oldest point
// once exceeded — meaning a device offline for long enough would silently
// lose real GPS history before it ever reached the server, in direct
// violation of "unsynced points must never be deleted before the server
// confirms them". Raised generously (a full day of 3s-interval tracking
// is ~28,800 points) and points are never shifted off; if this is ever
// hit it means sync has been failing for a very long time and that's
// something to see in logs, not something to solve by deleting data.
const MAX_QUEUE = 30000;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = v => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getTrackingMeta = async () => {
  try {
    const meta = await AsyncStorage.getItem('@fse_tracking_meta');
    return meta ? JSON.parse(meta) : null;
  } catch (e) {
    return null;
  }
};

export const sendBackgroundLocation = async (data) => {
  try {
    let { userId, sessionId, latitude, longitude, accuracy, timestamp, speed } = data;

    if (!userId || !sessionId) {
      const meta = await getTrackingMeta();
      if (meta) {
        userId = meta.userId || userId;
        sessionId = meta.sessionId || sessionId;
      }
    }

    if (!userId || !sessionId) {
      console.error('❌ Missing userId or sessionId for location save');
      return false;
    }

    const point = {
      userId,
      sessionId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      accuracy: parseFloat(accuracy) || 0,
      timestamp: timestamp || Date.now(),
      speed: parseFloat(speed) || 0,
    };

    if (isNaN(point.latitude) || isNaN(point.longitude)) {
      console.error('❌ Invalid coordinates:', { latitude, longitude });
      return false;
    }

    // ✅ 1. Save to LOCAL storage (for UI display)
    await storeLocationPoint(point);
    const last = await getLastLocation();
    if (last) {
      const d = calculateDistance(last.latitude, last.longitude, point.latitude, point.longitude);
      if (d > 0.001) {
        await updateTotalDistance(d);
      }
    }
    await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(point));

    // ✅ 2. ALWAYS queue points for batch processing
    const payload = {
      userId: point.userId,
      sessionId: point.sessionId,
      latitude: point.latitude,
      longitude: point.longitude,
      accuracy: point.accuracy,
      timestamp: new Date(point.timestamp).toISOString(),
    };

    await enqueuePoint(payload);
    console.log(`📌 Point queued (${await getOfflineQueueSize()} pending)`);

    // ✅ 3. Auto-flush in background
    flushQueue().catch(() => {});

    return true;
  } catch (error) {
    console.error('❌ sendBackgroundLocation error:', error);
    return false;
  }
};

const storeLocationPoint = async (location) => {
  try {
    const existing = await AsyncStorage.getItem(ROUTE_STORAGE_KEY);
    let points = existing ? JSON.parse(existing) : [];
    points.push(location);
    if (points.length > 2000) points = points.slice(-2000);
    await AsyncStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(points));
  } catch (e) {
    console.error('❌ storeLocationPoint error:', e);
  }
};

const getLastLocation = async () => {
  try {
    const str = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
    return str ? JSON.parse(str) : null;
  } catch (e) { return null; }
};

const updateTotalDistance = async (distanceKm) => {
  try {
    const str = await AsyncStorage.getItem(DISTANCE_STORAGE_KEY);
    let current = str ? parseFloat(str) : 0;
    const newTotal = current + distanceKm;
    await AsyncStorage.setItem(DISTANCE_STORAGE_KEY, newTotal.toFixed(6));
  } catch (e) {
    console.error('❌ updateTotalDistance error:', e);
  }
};

const enqueuePoint = async (point) => {
  try {
    const queueStr = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    let queue = queueStr ? JSON.parse(queueStr) : [];
    queue.push(point);
    if (queue.length > MAX_QUEUE) {
      console.error(`🚨 Offline GPS queue at ${queue.length} points — sync has likely been failing for a long time. Keeping all points; none are being dropped.`);
    }
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('❌ enqueuePoint error:', e);
  }
};

export const getOfflineQueue = async () => {
  try {
    const queue = JSON.parse(await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)) || [];
    return queue;
  } catch (e) {
    return [];
  }
};

export const getOfflineQueueSize = async () => {
  try {
    const queue = JSON.parse(await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)) || [];
    return queue.length;
  } catch (e) {
    return 0;
  }
};

const SYNC_BATCH_SIZE = 100; // Keep in sync with EndDaySummary's BATCH_SIZE
const BATCH_SYNC_TIMEOUT_MS = 20000;

// Send one chunk of the queue to /batch-sync and report which of ITS
// points were actually confirmed saved by the server (success !== false).
// Never removes anything from storage itself — the caller decides what to
// persist, so a crash mid-flush can't lose points that were never
// confirmed.
const flushChunk = async (chunk) => {
  const response = await Promise.race([
    API.post('/api/location/batch-sync', { points: chunk }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('BATCH_TIMEOUT')), BATCH_SYNC_TIMEOUT_MS)),
  ]);

  // ⚠️ IMPORTANT: A 200 response from /batch-sync does NOT mean every
  // point was saved — the endpoint can report per-point failures (missing
  // fields, session not active, GPS-jump rejection, etc.) inside
  // response.data.results while still returning HTTP 200 overall. Only
  // treat points the backend actually confirms (success:true, whether
  // saved or intentionally skipped as a dup/GPS-jump) as flushed; keep
  // genuine failures for retry instead of losing them.
  const results = response?.data?.results;
  if (Array.isArray(results) && results.length === chunk.length) {
    const stillFailed = chunk.filter((_, i) => results[i]?.success === false);
    return { confirmed: chunk.length - stillFailed.length, failed: stillFailed };
  }

  // No trustworthy per-point results — assume success rather than
  // looping forever, but this should not normally happen.
  console.warn('⚠️ batch-sync response had no usable results array — assuming all points in this chunk saved');
  return { confirmed: chunk.length, failed: [] };
};

// ✅ IMPROVED flushQueue: chunks the queue into SYNC_BATCH_SIZE-point
// batches (instead of sending the whole queue as one request, which could
// time out once the queue grew past a hundred or so points) and persists
// progress after every chunk so points already confirmed by the server
// are removed immediately, while everything else stays in AsyncStorage
// for the next retry.
export const flushQueue = async () => {
  try {
    const queue = JSON.parse(await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)) || [];
    if (!queue.length) {
      return { flushed: 0, remaining: 0 };
    }

    console.log(`📦 Flushing ${queue.length} queued points...`);

    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      console.log('⚠️ No network, skipping flush');
      return { flushed: 0, remaining: queue.length };
    }

    let flushed = 0;
    // Points not yet removed from storage: everything from the first
    // not-yet-processed chunk onward, plus any failures collected so far.
    let remainingInStorage = [...queue];
    const failedSoFar = [];

    for (let i = 0; i < queue.length; i += SYNC_BATCH_SIZE) {
      const chunk = queue.slice(i, i + SYNC_BATCH_SIZE);

      try {
        const { confirmed, failed } = await flushChunk(chunk);
        flushed += confirmed;
        failedSoFar.push(...failed);
      } catch (batchErr) {
        console.log(`⚠️ Batch sync failed for chunk starting at ${i}, falling back to individual points:`, batchErr.message);

        for (const point of chunk) {
          try {
            await Promise.race([
              API.post('/api/location/update', point),
              new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 8000)),
            ]);
            flushed++;
          } catch (err) {
            failedSoFar.push(point);
            console.error('❌ Failed to flush point individually:', err.message);
          }
        }
      }

      // Persist after every chunk: only points from here to the end of
      // the queue, plus confirmed failures, remain — everything before
      // this point has now been accounted for.
      remainingInStorage = [...failedSoFar, ...queue.slice(i + SYNC_BATCH_SIZE)];
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingInStorage));
    }

    console.log(`✅ Flush complete: ${flushed}/${queue.length} points confirmed saved, ${remainingInStorage.length} kept for retry`);
    return { flushed, remaining: remainingInStorage.length };
  } catch (e) {
    console.error('❌ flushQueue error:', e);
    return { flushed: 0, remaining: -1 };
  }
};

export const getRoutePoints = async () => {
  try {
    const str = await AsyncStorage.getItem(ROUTE_STORAGE_KEY);
    return str ? JSON.parse(str) : [];
  } catch (e) { return []; }
};

export const getTotalDistance = async () => {
  try {
    const str = await AsyncStorage.getItem(DISTANCE_STORAGE_KEY);
    return str ? parseFloat(str) : 0;
  } catch (e) { return 0; }
};

// ✅ FIX: AUTOMATIC RETRY FOR THE OFFLINE QUEUE
//
// Before this, flushQueue() was only ever called from two places:
//   1. sendBackgroundLocation() — but only when a NEW GPS fix arrives,
//      i.e. only while tracking is actively running.
//   2. useLocationTracking.startTracking() — a single one-shot call the
//      moment a NEW day's tracking starts.
//
// That means once a day ends — especially via "Skip Sync & End Day",
// which explicitly tells the user "will be synced automatically when
// you reconnect" — there was NO code path left that ever retried the
// leftover queue. It just sat in AsyncStorage until the next day's
// tracking produced a fresh GPS fix, by which point the points belong
// to a session the backend has already marked ENDED and (pre-fix,
// see locationRoutes.js) would reject outright.
//
// This starts a lightweight retry loop — on network reconnect and on a
// periodic timer — that keeps trying to flush whatever is left in the
// queue regardless of whether tracking is currently active. Call this
// once at app startup (see index.js).
let autoRetryStarted = false;
export const startOfflineQueueAutoRetry = ({ intervalMs = 60000 } = {}) => {
  if (autoRetryStarted) return () => {};
  autoRetryStarted = true;

  const tryFlush = async () => {
    try {
      const size = await getOfflineQueueSize();
      if (size > 0) {
        console.log(`🔁 Auto-retry: ${size} offline point(s) pending, attempting flush`);
        await flushQueue();
      }
    } catch (e) {
      // best-effort background retry — never let this crash the app
    }
  };

  const netUnsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      tryFlush();
    }
  });

  const interval = setInterval(tryFlush, intervalMs);

  // Try once immediately at startup too, in case points were left over
  // from a previous session that ended while offline.
  tryFlush();

  return () => {
    netUnsubscribe();
    clearInterval(interval);
    autoRetryStarted = false;
  };
};

export const resetDailyTracking = async ({ preserveQueue = false } = {}) => {
  const keys = [LOCATION_STORAGE_KEY, ROUTE_STORAGE_KEY, DISTANCE_STORAGE_KEY];
  if (!preserveQueue) keys.push(OFFLINE_QUEUE_KEY);
  await AsyncStorage.multiRemove(keys);
  console.log('🗑️ Tracking data reset');
};

//--------------- 09-09-26 -------------------
// // HeadlessLocation.js - COMPLETE FIXED VERSION

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import API from '../services/API/api';
// import NetInfo from '@react-native-community/netinfo';

// export const LOCATION_STORAGE_KEY = '@fse_last_location';
// export const ROUTE_STORAGE_KEY = '@fse_route_points';
// export const DISTANCE_STORAGE_KEY = '@fse_total_distance';
// export const OFFLINE_QUEUE_KEY = '@fse_offline_queue';
// const MAX_QUEUE = 500;

// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371;
//   const toRad = v => (v * Math.PI) / 180;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// };

// const getTrackingMeta = async () => {
//   try {
//     const meta = await AsyncStorage.getItem('@fse_tracking_meta');
//     return meta ? JSON.parse(meta) : null;
//   } catch (e) {
//     return null;
//   }
// };

// export const sendBackgroundLocation = async (data) => {
//   try {
//     let { userId, sessionId, latitude, longitude, accuracy, timestamp, speed } = data;

//     if (!userId || !sessionId) {
//       const meta = await getTrackingMeta();
//       if (meta) {
//         userId = meta.userId || userId;
//         sessionId = meta.sessionId || sessionId;
//       }
//     }

//     if (!userId || !sessionId) {
//       console.error('❌ Missing userId or sessionId for location save');
//       return false;
//     }

//     const point = {
//       userId,
//       sessionId,
//       latitude: parseFloat(latitude),
//       longitude: parseFloat(longitude),
//       accuracy: parseFloat(accuracy) || 0,
//       timestamp: timestamp || Date.now(),
//       speed: parseFloat(speed) || 0,
//     };

//     if (isNaN(point.latitude) || isNaN(point.longitude)) {
//       console.error('❌ Invalid coordinates:', { latitude, longitude });
//       return false;
//     }

//     // ✅ 1. Save to LOCAL storage (for UI display)
//     await storeLocationPoint(point);
//     const last = await getLastLocation();
//     if (last) {
//       const d = calculateDistance(last.latitude, last.longitude, point.latitude, point.longitude);
//       if (d > 0.001) {
//         await updateTotalDistance(d);
//       }
//     }
//     await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(point));

//     // ✅ 2. ALWAYS queue points for batch processing
//     const payload = {
//       userId: point.userId,
//       sessionId: point.sessionId,
//       latitude: point.latitude,
//       longitude: point.longitude,
//       accuracy: point.accuracy,
//       timestamp: new Date(point.timestamp).toISOString(),
//     };

//     await enqueuePoint(payload);
//     console.log(`📌 Point queued (${await getOfflineQueueSize()} pending)`);

//     // ✅ 3. Auto-flush in background
//     flushQueue().catch(() => {});

//     return true;
//   } catch (error) {
//     console.error('❌ sendBackgroundLocation error:', error);
//     return false;
//   }
// };

// const storeLocationPoint = async (location) => {
//   try {
//     const existing = await AsyncStorage.getItem(ROUTE_STORAGE_KEY);
//     let points = existing ? JSON.parse(existing) : [];
//     points.push(location);
//     if (points.length > 2000) points = points.slice(-2000);
//     await AsyncStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(points));
//   } catch (e) {
//     console.error('❌ storeLocationPoint error:', e);
//   }
// };

// const getLastLocation = async () => {
//   try {
//     const str = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
//     return str ? JSON.parse(str) : null;
//   } catch (e) { return null; }
// };

// const updateTotalDistance = async (distanceKm) => {
//   try {
//     const str = await AsyncStorage.getItem(DISTANCE_STORAGE_KEY);
//     let current = str ? parseFloat(str) : 0;
//     const newTotal = current + distanceKm;
//     await AsyncStorage.setItem(DISTANCE_STORAGE_KEY, newTotal.toFixed(6));
//   } catch (e) {
//     console.error('❌ updateTotalDistance error:', e);
//   }
// };

// const enqueuePoint = async (point) => {
//   try {
//     const queueStr = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
//     let queue = queueStr ? JSON.parse(queueStr) : [];
//     queue.push(point);
//     if (queue.length > MAX_QUEUE) queue.shift();
//     await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
//   } catch (e) {
//     console.error('❌ enqueuePoint error:', e);
//   }
// };

// export const getOfflineQueue = async () => {
//   try {
//     const queue = JSON.parse(await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)) || [];
//     return queue;
//   } catch (e) {
//     return [];
//   }
// };

// export const getOfflineQueueSize = async () => {
//   try {
//     const queue = JSON.parse(await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)) || [];
//     return queue.length;
//   } catch (e) {
//     return 0;
//   }
// };

// // ✅ IMPROVED flushQueue with better error handling
// export const flushQueue = async () => {
//   try {
//     const queue = JSON.parse(await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)) || [];
//     if (!queue.length) {
//       return { flushed: 0, remaining: 0 };
//     }

//     console.log(`📦 Flushing ${queue.length} queued points...`);

//     const net = await NetInfo.fetch();
//     if (!net.isConnected) {
//       console.log('⚠️ No network, skipping flush');
//       return { flushed: 0, remaining: queue.length };
//     }

//     // ✅ Try batch sync first
//     try {
//       await Promise.race([
//         API.post('/api/location/batch-sync', { points: queue }),
//         new Promise((_, reject) => setTimeout(() => reject(new Error('BATCH_TIMEOUT')), 15000))
//       ]);
      
//       await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
//       console.log(`✅ Batch sync complete: ${queue.length} points sent`);
//       return { flushed: queue.length, remaining: 0 };
      
//     } catch (batchErr) {
//       console.log('⚠️ Batch sync failed, falling back to individual points');
      
//       let flushed = 0;
//       const failed = [];
      
//       for (let i = 0; i < queue.length; i++) {
//         const point = queue[i];
//         try {
//           await Promise.race([
//             API.post('/api/location/update', point),
//             new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 8000))
//           ]);
//           flushed++;
//           console.log(`✅ Flushed point ${flushed}/${queue.length}`);
//         } catch (err) {
//           failed.push(point);
//           console.error(`❌ Failed to flush point ${i + 1}:`, err.message);
//         }
//       }

//       await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(failed));
//       console.log(`✅ Flush complete: ${flushed} sent, ${failed.length} remaining`);
//       return { flushed, remaining: failed.length };
//     }
//   } catch (e) {
//     console.error('❌ flushQueue error:', e);
//     return { flushed: 0, remaining: -1 };
//   }
// };

// export const getRoutePoints = async () => {
//   try {
//     const str = await AsyncStorage.getItem(ROUTE_STORAGE_KEY);
//     return str ? JSON.parse(str) : [];
//   } catch (e) { return []; }
// };

// export const getTotalDistance = async () => {
//   try {
//     const str = await AsyncStorage.getItem(DISTANCE_STORAGE_KEY);
//     return str ? parseFloat(str) : 0;
//   } catch (e) { return 0; }
// };

// export const resetDailyTracking = async ({ preserveQueue = false } = {}) => {
//   const keys = [LOCATION_STORAGE_KEY, ROUTE_STORAGE_KEY, DISTANCE_STORAGE_KEY];
//   if (!preserveQueue) keys.push(OFFLINE_QUEUE_KEY);
//   await AsyncStorage.multiRemove(keys);
//   console.log('🗑️ Tracking data reset');
// };
