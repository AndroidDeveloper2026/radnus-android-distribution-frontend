// import axios from "axios";
// import { getToken } from "../../services/AuthStorage/authStorgage";
// // import config from '../../config';
// import { API_BASE_URL } from '@env';



// const API = axios.create({
//   baseURL:API_BASE_URL,  
//   timeout: 60000,
// });



// API.interceptors.request.use(
//   async (request) => {
//     const token = await getToken();

//     if (token) {
//       request.headers.Authorization = `Bearer ${token}`;
//     }

//     return request;
//   },
//   (error) => Promise.reject(error)
// );

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // optional: logout user
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;

import axios from "axios";
import { getToken } from "../../services/AuthStorage/authStorgage";
import { API_BASE_URL } from '@env';

const API = axios.create({ 
  baseURL: API_BASE_URL,  
  timeout: 30000, // Reduced timeout
});

// Store request sources for cancellation
const requestSources = [];

API.interceptors.request.use(
  async (request) => {
    try {
      // Create cancel token for this request
      const cancelToken = axios.CancelToken.source();
      request.cancelToken = cancelToken.token;
      requestSources.push(cancelToken);

      // Get token with timeout
      const token = await Promise.race([
        getToken(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Token fetch timeout')), 5000)
        )
      ]);

      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }

      return request;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request setup error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    // Clean up from pending requests
    const index = requestSources.indexOf(response.config.cancelToken);
    if (index > -1) {
      requestSources.splice(index, 1);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.warn('Unauthorized - token may have expired');
      // Optionally trigger logout here
    }
    
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export function to cancel all pending requests (call when app goes to background)
export const cancelAllRequests = () => {
  requestSources.forEach(source => {
    source.cancel('App going to background');
  });
  requestSources.length = 0;
};

export default API;