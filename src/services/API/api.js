import axios from "axios";
import { getToken } from "../../services/AuthStorage/authStorgage";
// import config from '../../config';
import { API_BASE_URL } from '@env';

const API = axios.create({
  baseURL:API_BASE_URL,  //baseURL:`http://10.0.2.2:3000`,
  timeout: 10000,
});

API.interceptors.request.use(
  async (request) => {
    const token = await getToken();

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // optional: logout user
    }
    return Promise.reject(error);
  }
);

export default API;

