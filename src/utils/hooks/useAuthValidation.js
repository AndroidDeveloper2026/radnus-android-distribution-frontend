import { getToken, clearToken } from '../../services/AuthStorage/authStorgage';
import { useCallback } from 'react';

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
      


    } catch (error) {
      console.error('[Auth] Error checking token:', error);
      return false;
    }
  }, []);


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


  const handleAppBackground = useCallback(async () => {
    console.log('[Auth] App going to background');
  }, []);

  return {
    validateToken,
    handleAppResume,
    handleAppBackground,
  };
};