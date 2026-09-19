// routeOptimizer.js - COMPLETE FIXED VERSION
// Fixes: Route optimization with actual reduction

/**
 * Calculate perpendicular distance from point to line
 */
const perpendicularDistance = (point, lineStart, lineEnd) => {
  const { latitude: lat, longitude: lng } = point;
  const { latitude: lat1, longitude: lng1 } = lineStart;
  const { latitude: lat2, longitude: lng2 } = lineEnd;

  const dx = lng2 - lng1;
  const dy = lat2 - lat1;

  if (dx === 0 && dy === 0) {
    return Math.sqrt((lng - lng1) ** 2 + (lat - lat1) ** 2);
  }

  const t = ((lng - lng1) * dx + (lat - lat1) * dy) / (dx * dx + dy * dy);
  
  if (t < 0) {
    return Math.sqrt((lng - lng1) ** 2 + (lat - lat1) ** 2);
  }
  if (t > 1) {
    return Math.sqrt((lng - lng2) ** 2 + (lat - lat2) ** 2);
  }

  const projLng = lng1 + t * dx;
  const projLat = lat1 + t * dy;
  
  return Math.sqrt((lng - projLng) ** 2 + (lat - projLat) ** 2);
};

/**
 * Simplify route using Douglas-Peucker algorithm
 */
export const simplifyRoute = (points, tolerance = 0.0001) => {
  if (!points || points.length <= 2) return points || [];

  let maxDist = 0;
  let maxIndex = 0;
  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], first, last);
    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }

  if (maxDist > tolerance) {
    const left = simplifyRoute(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyRoute(points.slice(maxIndex), tolerance);
    return [...left.slice(0, -1), ...right];
  } else {
    return [first, last];
  }
};

/**
 * Smooth route using moving average
 */
export const smoothRoute = (points, windowSize = 3) => {
  if (!points || points.length < windowSize) return points || [];

  const smoothed = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < points.length; i++) {
    let sumLat = 0;
    let sumLng = 0;
    let count = 0;

    for (let j = -halfWindow; j <= halfWindow; j++) {
      const idx = i + j;
      if (idx >= 0 && idx < points.length) {
        sumLat += points[idx].latitude;
        sumLng += points[idx].longitude;
        count++;
      }
    }

    smoothed.push({
      latitude: sumLat / count,
      longitude: sumLng / count,
      timestamp: points[i]?.timestamp || Date.now(),
    });
  }

  return smoothed;
};

/**
 * Get optimized GeoJSON for map rendering
 */
export const getOptimizedRouteGeoJSON = (routePoints, options = {}) => {
  const {
    simplify = true,
    smooth = true,
    tolerance = 0.00008, // ✅ Increased from 0.00005
    smoothingWindow = 3,
    maxPoints = 200, // ✅ Max points to return
  } = options;

  if (!routePoints || routePoints.length < 2) return null;

  let points = [...routePoints];
  let originalCount = points.length;
  
  console.log(`🔧 Optimizing route: ${points.length} points`);

  // ✅ Step 1: Simplify points
  if (simplify && points.length > 5) {
    const simplified = simplifyRoute(points, tolerance);
    console.log(`📉 Simplified: ${points.length} → ${simplified.length} points`);
    points = simplified;
  }

  // ✅ Step 2: Smooth the route
  if (smooth && points.length > 5) {
    const smoothed = smoothRoute(points, smoothingWindow);
    console.log(`📈 Smoothed: ${points.length} → ${smoothed.length} points`);
    points = smoothed;
  }

  // ✅ Step 3: If still too many points, apply second pass
  if (points.length > maxPoints) {
    const secondPass = simplifyRoute(points, tolerance * 2);
    console.log(`📉 Second pass: ${points.length} → ${secondPass.length} points`);
    points = secondPass;
  }

  // ✅ Step 4: Ensure we have at least 2 points
  if (points.length < 2) {
    console.warn('⚠️ Optimization resulted in < 2 points, returning original with sampling');
    const sampleSize = Math.min(50, originalCount);
    const step = Math.floor(originalCount / sampleSize);
    const sampled = [];
    for (let i = 0; i < originalCount; i += step) {
      sampled.push(routePoints[i]);
    }
    if (sampled.length < 2) sampled.push(routePoints[routePoints.length - 1]);
    points = sampled;
  }

  const coordinates = points.map(p => [p.longitude, p.latitude]);
  const reduction = ((originalCount - points.length) / originalCount * 100);
  console.log(`✅ Optimization complete: ${originalCount} → ${points.length} points (${Math.round(reduction)}% reduction)`);

  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates,
    },
    properties: {
      pointCount: points.length,
      originalCount: originalCount,
      reduction: Math.round(reduction),
      simplified: simplify,
      smoothed: smooth,
    },
  };
};

export const getRouteStats = (routePoints) => {
  if (!routePoints || routePoints.length < 2) {
    return { original: 0, simplified: 0, reduction: 0 };
  }

  const simplified = simplifyRoute(routePoints, 0.00008);
  const reduction = ((routePoints.length - simplified.length) / routePoints.length * 100);

  return {
    original: routePoints.length,
    simplified: simplified.length,
    reduction: Math.round(reduction),
  };
};

export default {
  simplifyRoute,
  smoothRoute,
  getOptimizedRouteGeoJSON,
  getRouteStats,
};

//----------------- 07.09.2026 ----------------------
// // routeOptimizer.js - Complete Route Optimization Utility
// // Makes routes look like Zepto/Swiggy/Blinkit

// /**
//  * Douglas-Peucker algorithm for route simplification
//  * Reduces 1000+ points to ~30-50 while preserving shape
//  */

// // Calculate perpendicular distance from point to line
// const perpendicularDistance = (point, lineStart, lineEnd) => {
//   const { latitude: lat, longitude: lng } = point;
//   const { latitude: lat1, longitude: lng1 } = lineStart;
//   const { latitude: lat2, longitude: lng2 } = lineEnd;

//   const dx = lng2 - lng1;
//   const dy = lat2 - lat1;

//   if (dx === 0 && dy === 0) {
//     return Math.sqrt((lng - lng1) ** 2 + (lat - lat1) ** 2);
//   }

//   const t = ((lng - lng1) * dx + (lat - lat1) * dy) / (dx * dx + dy * dy);
  
//   if (t < 0) {
//     return Math.sqrt((lng - lng1) ** 2 + (lat - lat1) ** 2);
//   }
//   if (t > 1) {
//     return Math.sqrt((lng - lng2) ** 2 + (lat - lat2) ** 2);
//   }

//   const projLng = lng1 + t * dx;
//   const projLat = lat1 + t * dy;
  
//   return Math.sqrt((lng - projLng) ** 2 + (lat - projLat) ** 2);
// };

// /**
//  * Simplify route using Douglas-Peucker algorithm
//  * @param {Array} points - Array of {latitude, longitude, timestamp}
//  * @param {Number} tolerance - Higher = more simplification (0.00005 recommended)
//  * @returns {Array} Simplified points
//  */
// export const simplifyRoute = (points, tolerance = 0.00005) => {
//   if (!points || points.length <= 2) return points || [];

//   // Find point with maximum distance
//   let maxDist = 0;
//   let maxIndex = 0;
//   const first = points[0];
//   const last = points[points.length - 1];

//   for (let i = 1; i < points.length - 1; i++) {
//     const dist = perpendicularDistance(points[i], first, last);
//     if (dist > maxDist) {
//       maxDist = dist;
//       maxIndex = i;
//     }
//   }

//   // If max distance > tolerance, recursively simplify
//   if (maxDist > tolerance) {
//     const left = simplifyRoute(points.slice(0, maxIndex + 1), tolerance);
//     const right = simplifyRoute(points.slice(maxIndex), tolerance);
//     return [...left.slice(0, -1), ...right];
//   } else {
//     return [first, last];
//   }
// };

// /**
//  * Smooth route using moving average
//  * Creates smoother curves by averaging nearby points
//  * @param {Array} points - Array of {latitude, longitude, timestamp}
//  * @param {Number} windowSize - Number of points to average (3-5 recommended)
//  * @returns {Array} Smoothed points
//  */
// export const smoothRoute = (points, windowSize = 3) => {
//   if (!points || points.length < windowSize) return points || [];

//   const smoothed = [];
//   const halfWindow = Math.floor(windowSize / 2);

//   for (let i = 0; i < points.length; i++) {
//     let sumLat = 0;
//     let sumLng = 0;
//     let count = 0;

//     for (let j = -halfWindow; j <= halfWindow; j++) {
//       const idx = i + j;
//       if (idx >= 0 && idx < points.length) {
//         sumLat += points[idx].latitude;
//         sumLng += points[idx].longitude;
//         count++;
//       }
//     }

//     smoothed.push({
//       latitude: sumLat / count,
//       longitude: sumLng / count,
//       timestamp: points[i]?.timestamp || Date.now(),
//     });
//   }

//   return smoothed;
// };

// /**
//  * Get optimized GeoJSON for map rendering
//  * @param {Array} routePoints - Array of {latitude, longitude, timestamp}
//  * @param {Object} options - Configuration options
//  * @returns {Object} GeoJSON Feature
//  */
// export const getOptimizedRouteGeoJSON = (routePoints, options = {}) => {
//   const {
//     simplify = true,
//     smooth = true,
//     tolerance = 0.00005,
//     smoothingWindow = 3,
//   } = options;

//   if (!routePoints || routePoints.length < 2) return null;

//   let points = routePoints;

//   // Step 1: Simplify points (reduce noise)
//   if (simplify && points.length > 3) {
//     points = simplifyRoute(points, tolerance);
//   }

//   // Step 2: Smooth the route (create curves)
//   if (smooth && points.length > 3) {
//     points = smoothRoute(points, smoothingWindow);
//   }

//   // Convert to GeoJSON format
//   const coordinates = points.map(p => [p.longitude, p.latitude]);

//   return {
//     type: 'Feature',
//     geometry: {
//       type: 'LineString',
//       coordinates,
//     },
//     properties: {
//       pointCount: points.length,
//       originalCount: routePoints.length,
//       simplified: simplify,
//       smoothed: smooth,
//     },
//   };
// };

// /**
//  * Get route statistics for debugging
//  */
// export const getRouteStats = (routePoints) => {
//   if (!routePoints || routePoints.length < 2) {
//     return { original: 0, simplified: 0, reduction: 0 };
//   }

//   const simplified = simplifyRoute(routePoints, 0.00005);
//   const reduction = ((routePoints.length - simplified.length) / routePoints.length * 100);

//   return {
//     original: routePoints.length,
//     simplified: simplified.length,
//     reduction: Math.round(reduction),
//   };
// };

// export default {
//   simplifyRoute,
//   smoothRoute,
//   getOptimizedRouteGeoJSON,
//   getRouteStats,
// };