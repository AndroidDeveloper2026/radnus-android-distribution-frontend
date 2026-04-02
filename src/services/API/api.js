import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens } from "../AuthStorage/authStorgage";
import { API_BASE_URL } from "@env";

const API = axios.create({
 baseURL: API_BASE_URL,
 timeout: 30000,
});

// 🔐 Attach Access Token
API.interceptors.request.use(async (config) => {
 const token = await getAccessToken();

 if (token) {
   config.headers.Authorization = `Bearer ${token}`;
 }

 return config;
});

let isRefreshing = false;
let failedQueue = [];

// handle queue
const processQueue = (error, token = null) => {
 failedQueue.forEach(prom => {
   if (error) prom.reject(error);
   else prom.resolve(token);
 });
 failedQueue = [];
};

// 🔁 Refresh logic
API.interceptors.response.use(
 res => res,
 async error => {
   const originalRequest = error.config;

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

       const res = await axios.post(
         `${API_BASE_URL}/api/auth/refresh`,
         { refreshToken }
       );

       const newAccessToken = res.data.accessToken;

       await setTokens(newAccessToken, refreshToken);

       processQueue(null, newAccessToken);

       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

       return API(originalRequest);

     } catch (err) {
       processQueue(err, null);
       return Promise.reject(err);

     } finally {
       isRefreshing = false;
     }
   }

   return Promise.reject(error);
 }
);

export default API;

