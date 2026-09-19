/**
 * LocationConstants.js
 * Centralized constants for location tracking system
 */

import { clearSelectedSession } from "../services/features/fse/sessionSlice";

// AsyncStorage keys
export const LOCATION_STORAGE_KEY = '@fse_last_location';
export const ROUTE_STORAGE_KEY = '@fse_route_points';
export const DISTANCE_STORAGE_KEY = '@fse_total_distance';
export const SESSION_STORAGE_KEY = '@fse_tracking_session';

// Location tracking configuration
export const LOCATION_CONFIG = {
  // Update interval in milliseconds (3 seconds)
  UPDATE_INTERVAL: 3000,

  // Minimum distance for location update (5 meters)
  DISTANCE_FILTER: 5,

  // GPS accuracy (HIGH_ACCURACY)
  PRIORITY: 'high',

  // Maximum age of location (5 seconds)
  MAX_AGE: 5000,

  // Timeout for location request (10 seconds)
  TIMEOUT: 10000,
  // clearSelectedSession
};

// Distance calculation
export const DISTANCE_FILTER_THRESHOLD = 0.005; // ~5 meters in km

// Notification config
export const NOTIFICATION_CONFIG = {
  CHANNEL_ID: 'location_tracking_channel',
  NOTIFICATION_ID: 999,
  TITLE: 'FSE Tracking Active',
  MESSAGE: 'Tracking your route for today\'s work',
};

// Map styling constants
export const MAP_CONFIG = {
  // Default zoom level when showing route
  DEFAULT_ZOOM: 15,

  // Polyline color (route line)
  ROUTE_COLOR: '#FF6B35',

  // Polyline width
  ROUTE_WIDTH: 3,

  // Start marker color
  START_MARKER_COLOR: '#4CAF50',

  // End marker color
  END_MARKER_COLOR: '#F44336',

  // Intermediate point color
  POINT_COLOR: '#FF9800',
};
