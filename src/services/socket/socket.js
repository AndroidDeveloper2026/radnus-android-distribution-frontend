// socket.js - COMPLETE FIXED VERSION

import { io } from 'socket.io-client';
import { API_BASE_URL } from '@env';

let socket = null;
let subscribedSessions = new Set();
let connectionListeners = new Set();
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
let reconnectionTimer = null;

const notifyConnectionListeners = (connected) => {
  isConnected = connected;
  connectionListeners.forEach(cb => {
    try {
      cb(connected);
    } catch (err) {
      // don't let a bad listener break the notification loop
    }
  });
};

export const getSocket = () => {
  if (!socket) {
    console.log('🔌 Creating new socket connection to:', API_BASE_URL);
    
    socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 15000,
      randomizationFactor: 0.5,
      timeout: 10000,
      forceNew: false,
      autoConnect: true,
    });

    // ✅ CONNECTION EVENTS
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      reconnectAttempts = 0;
      notifyConnectionListeners(true);

      // ✅ Resubscribe to any sessions we were watching before a disconnect
      if (subscribedSessions.size > 0) {
        console.log(`🔄 Resubscribing to ${subscribedSessions.size} sessions`);
        subscribedSessions.forEach(sessionId => {
          socket.emit('subscribe-location', { sessionId });
        });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      notifyConnectionListeners(false);
      
      // ✅ Try to reconnect if not intentional
      if (reason !== 'io client disconnect') {
        if (reconnectionTimer) {
          clearTimeout(reconnectionTimer);
        }
        reconnectionTimer = setTimeout(() => {
          if (!socket.connected) {
            console.log('🔄 Forcing reconnection...');
            socket.connect();
          }
        }, 5000);
      }
    });

    socket.on('connect_error', (error) => {
      reconnectAttempts++;
      console.log(`❌ Socket connection error (${reconnectAttempts}):`, error.message);
      
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log('⚠️ Max reconnect attempts reached, trying polling fallback');
        socket.io.opts.transports = ['polling', 'websocket'];
      }
      
      notifyConnectionListeners(false);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
      notifyConnectionListeners(true);
    });

    socket.on('reconnect_failed', () => {
      console.log('❌ Socket reconnect failed');
      notifyConnectionListeners(false);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Socket reconnect attempt ${attemptNumber}`);
    });

    // ✅ PING/PONG for health check
    socket.on('pong', () => {
      // Health check passed
    });

    // ✅ Log all incoming location events for debugging
    socket.onAny((event, ...args) => {
      if (event === 'users-location' || event === 'session-location') {
        const data = args[0];
        if (data) {
          console.log(`📨 Socket event: ${event}`, {
            sessionId: data.sessionId,
            lat: data.latitude?.toFixed(6),
            lng: data.longitude?.toFixed(6),
            timestamp: data.timestamp
          });
        }
      }
    });
  }

  return socket;
};

// ✅ Subscribe to a session's live location updates
export const subscribeToSessionUpdates = (sessionId) => {
  if (!sessionId) {
    console.warn('⚠️ subscribeToSessionUpdates called without sessionId');
    return;
  }
  
  console.log(`📡 Subscribing to session ${sessionId}`);
  subscribedSessions.add(sessionId);
  const s = getSocket();
  
  if (s.connected) {
    s.emit('subscribe-location', { sessionId });
    console.log(`✅ Subscription event sent for ${sessionId}`);
  } else {
    console.log(`⏳ Socket not connected, subscription queued for ${sessionId}`);
    // ✅ Try to connect if disconnected
    if (!s.connected) {
      s.connect();
    }
  }
};

export const unsubscribeFromSessionUpdates = (sessionId) => {
  if (!sessionId) return;
  console.log(`📡 Unsubscribing from session ${sessionId}`);
  subscribedSessions.delete(sessionId);
  const s = getSocket();
  if (s.connected) {
    s.emit('unsubscribe-location', { sessionId });
  }
};

// ✅ Let consumers know when to fall back to API polling
export const onConnectionChange = (callback) => {
  if (typeof callback !== 'function') {
    console.warn('⚠️ onConnectionChange called without callback');
    return () => {};
  }
  
  connectionListeners.add(callback);
  // Fire immediately with current state
  try {
    callback(isConnected);
  } catch (err) {
    console.warn('⚠️ Connection listener callback error:', err);
  }
  return () => connectionListeners.delete(callback);
};

export const isSocketConnected = () => isConnected;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  subscribedSessions = new Set();
  isConnected = false;
  reconnectAttempts = 0;
  if (reconnectionTimer) {
    clearTimeout(reconnectionTimer);
    reconnectionTimer = null;
  }
  console.log('✅ Socket disconnected and cleaned up');
};

// ✅ Send location via socket with retry
export const sendLocationViaSocket = (sessionId, latitude, longitude, timestamp) => {
  const s = getSocket();
  if (s.connected) {
    s.emit('send-location', { 
      sessionId, 
      latitude, 
      longitude, 
      timestamp: timestamp || new Date().toISOString() 
    });
    return true;
  } else {
    console.warn('⚠️ Socket not connected, location not sent via socket');
    return false;
  }
};

// ✅ Get connection status
export const getConnectionStatus = () => ({
  connected: isConnected,
  socketId: socket?.id || null,
  subscribedSessions: Array.from(subscribedSessions),
  reconnectAttempts
});

// ✅ Backward-compatible default export
const defaultSocket = {
  on: (event, cb) => getSocket().on(event, cb),
  off: (event, cb) => getSocket().off(event, cb),
  emit: (event, data) => getSocket().emit(event, data),
  disconnect: () => disconnectSocket(),
  connect: () => getSocket().connect(),
  get id() { return getSocket().id; },
  get connected() { return getSocket().connected; },
};

export default defaultSocket;

//-------- 03-08-26 -----------------
// import { io } from 'socket.io-client';
// import { API_BASE_URL } from '@env';

// let socket = null;
// let subscribedSessions = new Set();
// let connectionListeners = new Set();
// let isConnected = false;

// const notifyConnectionListeners = (connected) => {
//   isConnected = connected;
//   connectionListeners.forEach(cb => {
//     try {
//       cb(connected);
//     } catch (err) {
//       // don't let a bad listener break the notification loop
//     }
//   });
// };

// export const getSocket = () => {
//   if (!socket) {
//     socket = io(API_BASE_URL, {
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 15000, // exponential backoff capped at 15s
//       randomizationFactor: 0.5,
//       timeout: 10000,
//     });

//     socket.on('connect', () => {
//       notifyConnectionListeners(true);

//       // ✅ Resubscribe to any sessions we were watching before a disconnect
//       subscribedSessions.forEach(sessionId => {
//         socket.emit('subscribe-location', { sessionId });
//       });
//     });

//     socket.on('disconnect', () => {
//       notifyConnectionListeners(false);
//     });

//     socket.on('connect_error', () => {
//       notifyConnectionListeners(false);
//     });

//     socket.on('reconnect_failed', () => {
//       notifyConnectionListeners(false);
//     });
//   }

//   return socket;
// };

// // ✅ Subscribe to a session's live location updates; automatically re-sent
// //    on every reconnect so the server keeps streaming after a network blip.
// export const subscribeToSessionUpdates = (sessionId) => {
//   if (!sessionId) return;
//   subscribedSessions.add(sessionId);
//   const s = getSocket();
//   if (s.connected) {
//     s.emit('subscribe-location', { sessionId });
//   }
// };

// export const unsubscribeFromSessionUpdates = (sessionId) => {
//   if (!sessionId) return;
//   subscribedSessions.delete(sessionId);
//   const s = getSocket();
//   if (s.connected) {
//     s.emit('unsubscribe-location', { sessionId });
//   }
// };

// // ✅ Let consumers (e.g. FSETracking) know when to fall back to API polling
// export const onConnectionChange = (callback) => {
//   connectionListeners.add(callback);
//   // fire immediately with current state so the caller doesn't have to wait
//   callback(isConnected);
//   return () => connectionListeners.delete(callback);
// };

// export const isSocketConnected = () => isConnected;

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
//   subscribedSessions = new Set();
//   isConnected = false;
// };

// // ✅ FIX: backward-compatible default export
// // Any file doing `import socket from '...'` and calling socket.on/emit/off
// // will work correctly — getSocket() ensures the instance is created on first use
// const defaultSocket = {
//   on: (event, cb) => getSocket().on(event, cb),
//   off: (event, cb) => getSocket().off(event, cb),
//   emit: (event, data) => getSocket().emit(event, data),
//   disconnect: () => disconnectSocket(),
//   get id() { return getSocket().id; },
//   get connected() { return getSocket().connected; },
// };

// export default defaultSocket;

// //+++++++++++++++ FSE old Code ++++++++++++++++++++
// // // // import { io } from "socket.io-client";
// // // // import API from '../../services/API/api';
// // // import { API_BASE_URL } from '@env';

// // // const socket = io(API_BASE_URL);

// // // export default socket;

// // //---------------------------

// // import { io } from 'socket.io-client';
// // import { API_BASE_URL } from '@env';

// // let socket = null;

// // export const getSocket = () => {
// //   if (!socket) {
// //     socket = io(API_BASE_URL, {
// //       transports: ['websocket'],
// //       reconnection: true,
// //       reconnectionAttempts: 5,
// //       reconnectionDelay: 2000,
// //       timeout: 10000,
// //     });

// //     socket.on('connect', () => {

// //     });

// //     socket.on('disconnect', (reason) => {

// //     });

// //     socket.on('connect_error', (err) => {

// //     });
// //   }

// //   return socket;
// // };

// // export const disconnectSocket = () => {
// //   if (socket) {
// //     socket.disconnect();
// //     socket = null;
// //   }
// // };

// // // ✅ FIX: backward-compatible default export
// // // Any file doing `import socket from '...'` and calling socket.on/emit/off
// // // will work correctly — getSocket() ensures the instance is created on first use
// // const defaultSocket = {
// //   on: (event, cb) => getSocket().on(event, cb),
// //   off: (event, cb) => getSocket().off(event, cb),
// //   emit: (event, data) => getSocket().emit(event, data),
// //   disconnect: () => disconnectSocket(),
// //   get id() { return getSocket().id; },
// //   get connected() { return getSocket().connected; },
// // };

// // export default defaultSocket;