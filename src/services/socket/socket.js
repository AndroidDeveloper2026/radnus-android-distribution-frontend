// import { io } from "socket.io-client";
// // import API from '../../services/API/api';
// import { API_BASE_URL } from '@env';

// const socket = io(API_BASE_URL);

// export default socket;

//---------------------------

import { io } from 'socket.io-client';
import { API_BASE_URL } from '@env';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.log('❌ Socket connection error:', err.message);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ✅ FIX: backward-compatible default export
// Any file doing `import socket from '...'` and calling socket.on/emit/off
// will work correctly — getSocket() ensures the instance is created on first use
const defaultSocket = {
  on: (event, cb) => getSocket().on(event, cb),
  off: (event, cb) => getSocket().off(event, cb),
  emit: (event, data) => getSocket().emit(event, data),
  disconnect: () => disconnectSocket(),
  get id() { return getSocket().id; },
  get connected() { return getSocket().connected; },
};

export default defaultSocket;