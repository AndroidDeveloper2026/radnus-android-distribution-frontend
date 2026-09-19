/**
 * formatDistance.js
 * Shared utility for consistent distance formatting
 * Converts KM to KM or M based on value
 * 
 * Usage:
 *   formatDistance(0.294)  // "294 M"
 *   formatDistance(2.45)   // "2.45 KM"
 *   formatDistance(0)      // "0 M"
 *   formatDistance(null)   // "0 M"
 */

export const formatDistance = (distKm, options = {}) => {
  const { 
    showUnit = true, 
    fixed = 2,
    fallback = '0 M'
  } = options;

  // Handle null, undefined, or invalid values
  if (distKm === null || distKm === undefined || isNaN(distKm)) {
    return showUnit ? fallback : '0';
  }

  // Ensure it's a number
  const distance = parseFloat(distKm);
  
  // Handle zero or very small values
  if (distance === 0) {
    return showUnit ? '0 M' : '0';
  }

  // Format based on distance
  if (distance >= 1) {
    // Show in Kilometers
    const formatted = distance.toFixed(fixed);
    return showUnit ? `${formatted} KM` : formatted;
  } else {
    // Show in Meters
    const meters = Math.round(distance * 1000);
    return showUnit ? `${meters} M` : String(meters);
  }
};

export default formatDistance;