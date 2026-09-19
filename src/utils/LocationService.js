
/**
 * LocationService.js
 * Complete Location Management Service with Fixed Distance Calculation
 * 
 * This file contains all methods for managing location tracking data
 * Including the FIXED getStatistics() method with proper distance calculation
 * 
 * Copy this ENTIRE file to: src/utils/LocationService.js
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LOCATION_STORAGE_KEY,
  ROUTE_STORAGE_KEY,
  DISTANCE_STORAGE_KEY,
  SESSION_STORAGE_KEY,
} from './LocationConstants';

class LocationService {

  // static async startSession() {
  //   try {
  //     const session = {
  //       startTime: Date.now(),
  //       startLocation: await this.getLastLocation(),
  //       status: 'active',
  //     };

  //     await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  //     console.log('🚀 [LocationService] Tracking session started');
  //     return session;
  //   } catch (error) {
  //     console.error('❌ [LocationService] Error starting session:', error);
  //     return null;
  //   }
  // }

  /**
   * Start a new tracking session
   *
   * ⚠️ IMPORTANT: this must NOT wipe route/distance data unconditionally.
   * It used to call AsyncStorage.multiRemove([...]) every time it ran —
   * including during session *recovery* (isRecovery=true in
   * useLocationTracking.js), which happens every time FSEHomeScreen
   * re-mounts/re-verifies an already-active session (e.g. navigating
   * FSETracking -> back -> FSEHomeScreen -> "View Tracking" again).
   * That silently reset today's accumulated KM/route back to 0 mid-day.
   *
   * A genuine "new day" wipe is already handled explicitly by
   * resetTracking(), which useLocationTracking.js calls first when
   * isRecovery is false. This method should only ensure a session
   * marker exists — it must be safe to call repeatedly without losing
   * data for an in-progress day.
   */
  static async startSession() {
    try {
      const existing = await this.getSession();
      if (existing && existing.status === 'active') {
        // Already have an active local session — leave route/distance
        // untouched, just confirm it's still marked active.
        return existing;
      }

      const session = {
        startTime: Date.now(),
        startLocation: null,
        status: 'active',
      };

      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      console.log('🚀 [LocationService] Tracking session marked active (local cache preserved)');
      return session;
    } catch (error) {
      console.error('❌ [LocationService] Error starting session:', error);
      return null;
    }
  }

  static async setTrackingMeta(userId, sessionId) {
    try {
      await AsyncStorage.setItem(
        '@fse_tracking_meta',
        JSON.stringify({ userId, sessionId })
      );
    } catch (error) {
      console.error('❌ [LocationService] Error saving meta:', error);
    }
  }

  static async getTrackingMeta() {
    try {
      const str = await AsyncStorage.getItem('@fse_tracking_meta');
      return str ? JSON.parse(str) : null;
    } catch (error) {
      return null;
    }
  }
  

  /**
   * End the current tracking session
   */
  static async endSession() {
    try {
      const session = await this.getSession();
      if (session) {
        session.endTime = Date.now();
        session.status = 'completed';
        session.endLocation = await this.getLastLocation();
        session.totalDistance = await this.getTotalDistance();
        session.duration = Math.floor((session.endTime - session.startTime) / 1000);

        await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        console.log('🏁 [LocationService] Tracking session ended');
        return session;
      }
    } catch (error) {
      console.error('❌ [LocationService] Error ending session:', error);
    }
    return null;
  }

  /**
   * Get current session data
   */
  static async getSession() {
    try {
      const sessionStr = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (error) {
      console.error('❌ [LocationService] Error getting session:', error);
      return null;
    }
  }

  /**
   * Get all route points (GPS coordinates)
   */
  static async getRoutePoints() {
    try {
      const routeStr = await AsyncStorage.getItem(ROUTE_STORAGE_KEY);
      return routeStr ? JSON.parse(routeStr) : [];
    } catch (error) {
      console.error('❌ [LocationService] Error getting route points:', error);
      return [];
    }
  }

  /**
   * Get total distance traveled in kilometers
   */
  static async getTotalDistance() {
    try {
      const distanceStr = await AsyncStorage.getItem(DISTANCE_STORAGE_KEY);
      return distanceStr ? parseFloat(distanceStr) : 0;
    } catch (error) {
      console.error('❌ [LocationService] Error getting total distance:', error);
      return 0;
    }
  }

  /**
   * Get route summary with basic statistics
   */
  static async getRouteSummary() {
    try {
      const session = await this.getSession();
      const routePoints = await this.getRoutePoints();
      const totalDistance = await this.getTotalDistance();

      if (!session) {
        return null;
      }

      const duration = Math.floor((session.endTime || Date.now() - session.startTime) / 1000);
      const durationMinutes = Math.floor(duration / 60);
      const averageSpeed = durationMinutes > 0 ? ((totalDistance / durationMinutes) * 60).toFixed(2) : 0;

      return {
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
        totalDistance: totalDistance.toFixed(2),
        duration: duration,
        durationMinutes: durationMinutes,
        averageSpeed: averageSpeed,
        pointCount: routePoints.length,
        startLocation: session.startLocation,
        endLocation: session.endLocation,
      };
    } catch (error) {
      console.error('❌ [LocationService] Error getting route summary:', error);
      return null;
    }
  }

  /**
   * ✅ FIXED STATISTICS METHOD - WITH PROPER DISTANCE RECALCULATION
   * 
   * This method now:
   * 1. Retrieves all data from storage
   * 2. RECALCULATES distance from GPS points (verification)
   * 3. Calculates duration, speed, and other metrics
   * 4. Provides detailed logging for debugging
   */
  static async getStatistics() {
    try {
      console.log('═══════════════════════════════════════════');
      console.log('📊 [LocationService] CALCULATING STATISTICS');
      console.log('═══════════════════════════════════════════');

      // Get all data
      const routePoints = await this.getRoutePoints();
      const totalDistanceFromStorage = await this.getTotalDistance();
      const session = await this.getSession();

      console.log(`📍 Route Points Count: ${routePoints.length}`);
      console.log(`💾 Distance from Storage: ${totalDistanceFromStorage.toFixed(6)} km`);
      console.log(`📋 Session: ${session ? 'Found' : 'Not Found'}`);

      // Validate we have data
      if (!routePoints.length || !session) {
        console.warn('⚠️ [LocationService] Missing route points or session');
        return null;
      }

      // ✅ STEP 1: RECALCULATE DISTANCE FROM ALL ROUTE POINTS (VERIFICATION)
      console.log('\n🔄 [LocationService] RECALCULATING DISTANCE FROM GPS POINTS...');
      let calculatedDistance = 0;
      let validSegments = 0;
      let filteredSegments = 0;

      for (let i = 1; i < routePoints.length; i++) {
        const prev = routePoints[i - 1];
        const curr = routePoints[i];

        // Validate coordinates
        if (
          !prev ||
          !curr ||
          typeof prev.latitude !== 'number' ||
          typeof curr.latitude !== 'number'
        ) {
          console.warn(`⚠️ [LocationService] Invalid coordinates at segment ${i}`);
          continue;
        }

        // Calculate distance between consecutive points
        const distance = this.calculateDistance(
          prev.latitude,
          prev.longitude,
          curr.latitude,
          curr.longitude
        );

        // ✅ Filter out noise (< 5 meters = 0.005 km)
        if (distance > 0.005) {
          calculatedDistance += distance;
          validSegments++;
          console.log(`  ✅ Segment ${i}: ${(distance * 1000).toFixed(2)}m`);
        } else {
          filteredSegments++;
          console.log(`  🔕 Segment ${i}: ${(distance * 1000).toFixed(2)}m (filtered - noise)`);
        }
      }

      console.log('\n📈 Distance Recalculation Summary:');
      console.log(`  Total Segments: ${routePoints.length - 1}`);
      console.log(`  Valid Segments: ${validSegments}`);
      console.log(`  Filtered (Noise): ${filteredSegments}`);
      console.log(`  Recalculated Distance: ${calculatedDistance.toFixed(6)} km`);
      console.log(`  Distance from Storage: ${totalDistanceFromStorage.toFixed(6)} km`);

      // ✅ Use recalculated distance (more accurate than stored)
      const finalDistance = calculatedDistance > 0 ? calculatedDistance : totalDistanceFromStorage;
      console.log(`  ✅ Final Distance Used: ${finalDistance.toFixed(2)} km`);

      // ✅ STEP 2: CALCULATE DURATION
      const startTime = session.startTime;
      const endTime = session.endTime || Date.now();
      const duration = Math.floor((endTime - startTime) / 1000); // seconds
      const durationMinutes = Math.floor(duration / 60);
      const durationHours = duration / 3600;

      console.log(`\n⏱️ Duration Calculation:`);
      console.log(`  Start: ${new Date(startTime).toLocaleTimeString()}`);
      console.log(`  End: ${new Date(endTime).toLocaleTimeString()}`);
      console.log(`  Duration: ${duration}s = ${durationMinutes}m = ${durationHours.toFixed(2)}h`);

      // ✅ STEP 3: CALCULATE AVERAGE SPEED (km/h)
      let averageSpeed = 0;
      if (durationHours > 0) {
        averageSpeed = (finalDistance / durationHours).toFixed(2);
        console.log(`\n⚡ Average Speed: ${averageSpeed} km/h`);
      } else {
        console.log(`\n⚡ Average Speed: N/A (no time elapsed)`);
      }

      // ✅ STEP 4: CALCULATE MAX SPEED (km/h)
      let maxSpeed = 0;
      let maxSpeedIndex = -1;

      for (let i = 1; i < routePoints.length; i++) {
        const prev = routePoints[i - 1];
        const curr = routePoints[i];

        if (!prev || !curr) continue;

        const distance = this.calculateDistance(
          prev.latitude,
          prev.longitude,
          curr.latitude,
          curr.longitude
        );

        const timeDiff = (curr.timestamp - prev.timestamp) / 3600000; // hours
        if (timeDiff > 0) {
          const speed = distance / timeDiff;
          if (speed > maxSpeed) {
            maxSpeed = speed;
            maxSpeedIndex = i;
          }
        }
      }

      console.log(`\n🏃 Max Speed: ${maxSpeed.toFixed(2)} km/h (at segment ${maxSpeedIndex})`);

      // ✅ COMPILE FINAL STATISTICS
      const statistics = {
        totalDistance: finalDistance.toFixed(2),
        averageSpeed: averageSpeed,
        maxSpeed: maxSpeed.toFixed(2),
        pointCount: routePoints.length,
        duration: duration,
        durationMinutes: durationMinutes,
        startTime: startTime,
        endTime: endTime,
        validSegments: validSegments,
        filteredSegments: filteredSegments,
      };

      console.log('\n═══════════════════════════════════════════');
      console.log('✅ FINAL STATISTICS:');
      console.log('═══════════════════════════════════════════');
      console.log(`  📏 Distance: ${statistics.totalDistance} km`);
      console.log(`  ⏱️ Duration: ${durationMinutes} minutes`);
      console.log(`  ⚡ Avg Speed: ${statistics.averageSpeed} km/h`);
      console.log(`  🏃 Max Speed: ${statistics.maxSpeed} km/h`);
      console.log(`  📍 GPS Points: ${statistics.pointCount}`);
      console.log(`  ✅ Valid Segments: ${statistics.validSegments}`);
      console.log('═══════════════════════════════════════════\n');

      return statistics;

    } catch (error) {
      console.error('❌ [LocationService] Error getting statistics:', error);
      console.error('Stack:', error.stack);
      return null;
    }
  }

  /**
   * Get formatted distance string
   */
  static async getFormattedDistance() {
    try {
      const distance = await this.getTotalDistance();
      if (distance >= 1) {
        return `${distance.toFixed(2)} KM`;
      } else {
        return `${(distance * 1000).toFixed(0)} M`;
      }
    } catch (error) {
      console.error('❌ [LocationService] Error formatting distance:', error);
      return '0.00 KM';
    }
  }

  /**
   * Get last known location
   */
  static async getLastLocation() {
    try {
      const locationStr = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      return locationStr ? JSON.parse(locationStr) : null;
    } catch (error) {
      console.error('❌ [LocationService] Error getting last location:', error);
      return null;
    }
  }

  /**
   * ✅ HAVERSINE FORMULA - Calculate distance between two GPS coordinates
   * Returns distance in KILOMETERS
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    try {
      // Earth's radius in kilometers
      const R = 6371;

      // Convert degrees to radians
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      // Haversine formula
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Distance in kilometers
      const distance = R * c;

      return distance;
    } catch (error) {
      console.error('❌ [LocationService] Error in distance calculation:', error);
      return 0;
    }
  }

  /**
   * Get polyline coordinates for map visualization
   */
  static async getPolylineCoordinates() {
    try {
      const routePoints = await this.getRoutePoints();
      return routePoints.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }));
    } catch (error) {
      console.error('❌ [LocationService] Error getting polyline coordinates:', error);
      return [];
    }
  }

  /**
   * Get bounding region for map that contains all points
   */
  static async getBoundingRegion() {
    try {
      const routePoints = await this.getRoutePoints();

      if (routePoints.length === 0) {
        return null;
      }

      let minLat = routePoints[0].latitude;
      let maxLat = routePoints[0].latitude;
      let minLon = routePoints[0].longitude;
      let maxLon = routePoints[0].longitude;

      for (const point of routePoints) {
        if (point.latitude < minLat) minLat = point.latitude;
        if (point.latitude > maxLat) maxLat = point.latitude;
        if (point.longitude < minLon) minLon = point.longitude;
        if (point.longitude > maxLon) maxLon = point.longitude;
      }

      const midLat = (minLat + maxLat) / 2;
      const midLon = (minLon + maxLon) / 2;

      // Calculate zoom level based on bounding box
      const latDelta = maxLat - minLat;
      const lonDelta = maxLon - minLon;
      const delta = Math.max(latDelta, lonDelta) + 0.05; // Add 5% padding

      return {
        latitude: midLat,
        longitude: midLon,
        latitudeDelta: delta,
        longitudeDelta: delta,
      };
    } catch (error) {
      console.error('❌ [LocationService] Error getting bounding region:', error);
      return null;
    }
  }

  /**
   * Export route data (useful for reports or backend sync)
   */
  static async exportRouteData() {
    try {
      const summary = await this.getRouteSummary();
      const stats = await this.getStatistics();
      const routePoints = await this.getRoutePoints();

      return {
        summary,
        statistics: stats,
        routePoints,
        exportTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ [LocationService] Error exporting route data:', error);
      return null;
    }
  }

  /**
   * Reset all tracking data (end of day)
   */
  static async resetTracking() {
    try {
      await AsyncStorage.multiRemove([
        LOCATION_STORAGE_KEY,
        ROUTE_STORAGE_KEY,
        DISTANCE_STORAGE_KEY,
        SESSION_STORAGE_KEY,
      ]);
      console.log('✨ [LocationService] All tracking data reset');
      return true;
    } catch (error) {
      console.error('❌ [LocationService] Error resetting tracking:', error);
      return false;
    }
  }

  /**
   * Get debug information (for troubleshooting)
   */
  static async getDebugInfo() {
    try {
      const totalDistance = await this.getTotalDistance();
      const routePoints = await this.getRoutePoints();
      const lastLocation = await this.getLastLocation();
      const session = await this.getSession();
      const stats = await this.getStatistics();

      return {
        timestamp: new Date().toISOString(),
        totalDistance: totalDistance.toFixed(2),
        routePointsCount: routePoints.length,
        lastLocation,
        session,
        statistics: stats,
      };
    } catch (error) {
      console.error('❌ [LocationService] Error getting debug info:', error);
      return null;
    }
  }
}

export default LocationService;
