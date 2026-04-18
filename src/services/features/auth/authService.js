import API from '../../API/api';
import { setToken, clearToken, getToken } from '../../../services/AuthStorage/authStorgage';

/**
 * Register a new user
 */
const register = async (userData) => {
  try {
    const res = await API.post('/api/auth/register', userData);

    if (!res.data) {
      throw new Error('Empty response from server');
    }

    return res.data;
  } catch (error) {
    console.error('Registration error:', error.message);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

/**
 * Login user and store token
 */
const login = async (userData) => {
  try {
    const res = await API.post('/api/auth/login', userData);

    if (!res.data) {
      throw new Error('Empty response from server');
    }

    // Store token if provided
    if (res.data.token) {
      try {
        await setToken(res.data.token);
      } catch (storageError) {
        console.error('Failed to store token, but returning login response:', storageError);
      }
    }

    return res.data;
  } catch (error) {
    console.error('Login error:', error.message);

    if (error.response?.status === 401) {
      throw new Error('Invalid credentials');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid request');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet.');
    }

    throw error;
  }
};

/**
 * Logout user and clear token
 */
const logout = async () => {
  try {
    // Try to notify server
    try {
      await API.post('/api/auth/logout');
    } catch (serverError) {
      console.warn('Server logout failed, but clearing local token:', serverError);
    }

    // Always clear local token
    await clearToken();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Validate token with server
 * Checks if the stored token is still valid
 * 
 * @returns {Promise<{valid: boolean, user?: any}>}
 */
const validateToken = async () => {
  try {
    const token = await getToken();

    if (!token) {
      console.warn('No token found for validation');
      return { valid: false };
    }

    // Call server to validate token
    const res = await API.get('/api/auth/validate');

    return {
      valid: true,
      user: res.data.user,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn('Token is invalid/expired');
      await clearToken();
      return { valid: false };
    }

    // Other errors - might be network issue
    console.error('Token validation error:', error.message);
    // Return true optimistically for network errors
    return { valid: true };
  }
};

/**
 * Refresh token / validate auth on app resume
 * This is called when app comes back to foreground
 */
const refreshAuth = async () => {
  try {    
    const result = await validateToken();

    if (!result.valid) {
      console.warn('[AuthService] Token validation failed');
      await clearToken();
      throw new Error('Token invalid or expired');
    }

    return result;
  } catch (error) {
    console.error('[AuthService] Auth refresh failed:', error.message);
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  validateToken,
  refreshAuth,
};