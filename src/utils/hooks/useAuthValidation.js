import { getToken, clearToken } from '../../services/AuthStorage/authStorgage';
import { useCallback } from 'react';


/**
 * OPTION 1: Local Token Validation Only
 * 
 * This hook validates authentication by checking if a token exists locally.
 * It does NOT call any backend endpoint.
 * 
 * Perfect for:
 * - Quick implementation
 * - Testing/MVP
 * - When you don't have /api/auth/validate endpoint
 * 
 * How it works:
 * - On app resume: Check if token exists in AsyncStorage
 * - If token exists → User is logged in, stay on current screen
 * - If no token → User is logged out, redirect to Login
 * 
 * Upgrade path:
 * If you later implement /api/auth/validate endpoint, uncomment the
 * server validation block at the end of validateToken()
 */
export const useAuthValidation = (navigation) => {
  /**
   * Validate if token exists in local storage
   * 
   * @returns {Promise<boolean>} true if token exists, false otherwise
   */
  const validateToken = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.warn('[Auth] No token found - user must login');
        return false;
      }

      console.log('[Auth] Token found - user is logged in');
      return true;
      
      // =========================================================================
      // OPTION 2: SERVER VALIDATION (Uncomment when /api/auth/validate exists)
      // =========================================================================
      // Uncomment the block below if you create /api/auth/validate endpoint
      // 
      // console.log('[Auth] Validating token with server...');
      // try {
      //   await authService.refreshAuth();
      //   console.log('[Auth] Token validated by server');
      //   return true;
      // } catch (error) {
      //   if (error.response?.status === 401) {
      //     console.warn('[Auth] Server rejected token');
      //     await clearToken();
      //     return false;
      //   }
      //   // Non-401 errors = server issue, assume token is valid
      //   console.warn('[Auth] Server validation failed:', error.message);
      //   return true;
      // }
      // =========================================================================

    } catch (error) {
      console.error('[Auth] Error checking token:', error);
      return false;
    }
  }, []);

  /**
   * Called when app comes to foreground
   * Checks if user is still logged in
   */
  const handleAppResume = useCallback(async () => {
    console.log('[Auth] App resumed from background');

    try {
      const isValid = await validateToken();

      if (!isValid) {
        console.warn('[Auth] Token lost - redirecting to login');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        console.log('[Auth] User still logged in - continuing');
      }
    } catch (error) {
      console.error('[Auth] Error on app resume:', error);
      // Be safe - go to login if anything fails
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [validateToken, navigation]);

  /**
   * Called when app goes to background
   * Cleanup if needed
   */
  const handleAppBackground = useCallback(async () => {
    console.log('[Auth] App going to background');
    // Currently just logging
    // Add cleanup code here if needed later
  }, []);

  return {
    validateToken,
    handleAppResume,
    handleAppBackground,
  };
};