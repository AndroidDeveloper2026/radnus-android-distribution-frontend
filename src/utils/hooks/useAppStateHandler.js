import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { cancelAllRequests } from '../../services/API/api';
 
/**
 * Hook to handle app state changes (background/foreground)
 * Cancels pending requests when app goes to background
 * Refreshes auth when app comes to foreground
 */
export const useAppStateHandler = (onAppResume = null, onAppBackground = null) => {
  const appState = useRef(AppState.currentState);
  const appStateSubscription = useRef(null);
 
  useEffect(() => {
    // Add listener for app state changes
    appStateSubscription.current = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
 
    return () => {
      // Cleanup listener
      if (appStateSubscription.current) {
        appStateSubscription.current.remove();
      }
    };
  }, []);
 
  const handleAppStateChange = async (nextAppState) => {
    const currentState = appState.current;
 
    // App is transitioning to background or inactive
    if (
      currentState.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      console.log('[AppState] App is going to background/inactive');
 
      // Cancel all pending API requests
      cancelAllRequests();
 
      // Call custom background handler if provided
      if (onAppBackground) {
        try {
          await onAppBackground();
        } catch (error) {
          console.error('[AppState] Error in onAppBackground:', error);
        }
      }
    }
 
    // App is transitioning from background/inactive to active (foreground)
    if (
      currentState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('[AppState] App is resuming to foreground');
 
      // Call custom resume handler if provided
      if (onAppResume) {
        try {
          await onAppResume();
        } catch (error) {
          console.error('[AppState] Error in onAppResume:', error);
        }
      }
    }
 
    appState.current = nextAppState;
  };
};
 
/**
 * Example usage in your screen:
 * 
 * const handleAppResume = async () => {
 *   console.log('App resumed - refresh data here');
 * };
 * 
 * const handleAppBackground = async () => {
 *   console.log('App going to background - save state here');
 * };
 * 
 * const MyScreen = () => {
 *   useAppStateHandler(handleAppResume, handleAppBackground);
 *   return <View>...</View>;
 * };
 */