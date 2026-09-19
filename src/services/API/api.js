import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearAuth,
} from "../AuthStorage/authStorgage";
import { API_BASE_URL } from "@env";

console.log("🔥 API_BASE_URL:", API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// ── Optional hook the app can register to react to a hard logout
//    (e.g. navigate to the login screen) without this module needing
//    to import navigation directly.
let onAuthFailure = null;
export const registerAuthFailureHandler = (handler) => {
  onAuthFailure = handler;
};

// 🔐 Attach Access Token
API.interceptors.request.use(async (config) => {
  try {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // If token retrieval fails, continue the request unauthenticated
    // rather than blocking it entirely.
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

// handle queue of requests that piled up while a refresh was in-flight
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const MAX_NETWORK_RETRIES = 2;
const NETWORK_RETRY_BASE_DELAY = 1000;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const isNetworkOrTimeoutError = (error) =>
  !error.response && (error.code === 'ECONNABORTED' || error.message === 'Network Error');

// 🔁 Refresh logic + transient network retry
API.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config || {};

    // ✅ Retry transient network/timeout failures with backoff before giving up
    if (isNetworkOrTimeoutError(error)) {
      originalRequest._networkRetryCount = originalRequest._networkRetryCount || 0;

      if (originalRequest._networkRetryCount < MAX_NETWORK_RETRIES) {
        originalRequest._networkRetryCount += 1;
        const delay = NETWORK_RETRY_BASE_DELAY * Math.pow(2, originalRequest._networkRetryCount - 1);
        await sleep(delay);
        return API(originalRequest);
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const res = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken || refreshToken;

        await setTokens(newAccessToken, newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (err) {
        processQueue(err, null);

        // ✅ Refresh token itself is invalid/expired — fully log the user out
        //    so the app can redirect to login instead of looping on 401s.
        try {
          await clearAuth();
        } catch (clearErr) {
          // ignore — nothing more we can do here
        }

        if (typeof onAuthFailure === 'function') {
          try {
            onAuthFailure();
          } catch (handlerErr) {
            // don't let a bad handler crash the request pipeline
          }
        }

        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;

//+++++++++++++ FSE Code +++++++++++++++++

// import axios from "axios";
// import { getAccessToken, getRefreshToken, setTokens } from "../AuthStorage/authStorgage";
// import { API_BASE_URL } from "@env";

// const API = axios.create({
//  baseURL: API_BASE_URL,
//  timeout: 30000,
// });

// // 🔐 Attach Access Token
// API.interceptors.request.use(async (config) => {
//  const token = await getAccessToken();

//  if (token) {
//    config.headers.Authorization = `Bearer ${token}`;
//  }

//  return config;
// });

// let isRefreshing = false;
// let failedQueue = [];

// // handle queue
// const processQueue = (error, token = null) => {
//  failedQueue.forEach(prom => {
//    if (error) prom.reject(error);
//    else prom.resolve(token);
//  });
//  failedQueue = [];
// };

// // 🔁 Refresh logic
// API.interceptors.response.use(
//  res => res,
//  async error => {
//    const originalRequest = error.config;

//    if (error.response?.status === 401 && !originalRequest._retry) {

//      if (isRefreshing) {
//        return new Promise((resolve, reject) => {
//          failedQueue.push({ resolve, reject });
//        }).then(token => {
//          originalRequest.headers.Authorization = `Bearer ${token}`;
//          return API(originalRequest);
//        });
//      }

//      originalRequest._retry = true;
//      isRefreshing = true;

//      try {
//        const refreshToken = await getRefreshToken();

//        const res = await axios.post(
//          `${API_BASE_URL}/api/auth/refresh`,
//          { refreshToken }
//        );

//        const newAccessToken = res.data.accessToken;

//        await setTokens(newAccessToken, refreshToken);

//        processQueue(null, newAccessToken);

//        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//        return API(originalRequest);

//      } catch (err) {
//        processQueue(err, null);
//        return Promise.reject(err);

//      } finally {
//        isRefreshing = false;
//      }
//    }

//    return Promise.reject(error);
//  }
// );

// export default API;

