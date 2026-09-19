import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";
const MAX_RETRIES = 3;
const SESSION_KEY = "sessionId";
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";
const LOCATION_DISCLOSURE_KEY = "locationDisclosureAcknowledged";


const asyncStorageWithRetry = async (operation, key, value = null) => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      switch (operation) {
        case 'get':
          return await AsyncStorage.getItem(key);
        case 'set':
          await AsyncStorage.setItem(key, value);
          return value;
        case 'remove':
          await AsyncStorage.removeItem(key);
          return null;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      console.error(
        `AsyncStorage ${operation} attempt ${attempt + 1}/${MAX_RETRIES} failed:`,
        error
      );

      // Don't retry if it's the last attempt
      if (attempt === MAX_RETRIES - 1) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = 100 * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Get stored authentication token
 */
export const getToken = async () => {
  try {
    const token = await asyncStorageWithRetry('get', TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Failed to get token after retries:', error);
    return null; // Return null instead of throwing, so app doesn't crash
  }
};


export const hasToken = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error('Failed to check token:', error);
    return false;
  }
};


export const setSessionId = async (sessionId) => {
  try {
    await asyncStorageWithRetry('set', SESSION_KEY, sessionId);
    return true;
  } catch (error) {
    console.error('Failed to store sessionId:', error);
    throw error;
  }
};


export const getSessionId = async () => {
  try {
    return await asyncStorageWithRetry('get', SESSION_KEY);
  } catch (error) {
    console.error('Failed to get sessionId:', error);
    return null;
  }
};


export const clearSessionId = async () => {
  try {
    await asyncStorageWithRetry('remove', SESSION_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear sessionId:', error);
    return false;
  }
};

export const setTokens = async (access, refresh) => {
  try {
    await asyncStorageWithRetry('set', ACCESS_TOKEN, access);
    // ✅ Only overwrite the refresh token when a new one is actually provided —
    //    some refresh endpoints only rotate the access token.
    if (refresh) {
      await asyncStorageWithRetry('set', REFRESH_TOKEN, refresh);
    }
    return true;
  } catch (error) {
    console.error('Failed to store tokens:', error);
    throw error;
  }
};

export const getAccessToken = async () => {
  try {
    return await asyncStorageWithRetry('get', ACCESS_TOKEN);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    return await asyncStorageWithRetry('get', REFRESH_TOKEN);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

export const hasValidTokens = async () => {
  try {
    const [access, refresh] = await Promise.all([getAccessToken(), getRefreshToken()]);
    return !!(access && refresh);
  } catch (error) {
    console.error('Failed to check token validity:', error);
    return false;
  }
};

export const clearTokens = async () => {
  try {
    await asyncStorageWithRetry('remove', ACCESS_TOKEN);
    await asyncStorageWithRetry('remove', REFRESH_TOKEN);
    return true;
  } catch (error) {
    console.error('Failed to clear tokens:', error);
    return false;
  }
};

// ✅ Full logout helper — clears auth tokens and any active session pointer,
//    used when token refresh ultimately fails (refresh token expired/invalid).
export const clearAuth = async () => {
  await Promise.all([clearTokens(), clearSessionId()]);
};

// ✅ Google Play "Prominent Disclosure" requirement — records that THIS user,
// on THIS device, has been shown and has explicitly accepted the in-app
// location disclosure before we ever trigger the OS permission dialog.
// Stored per-user so a shared/reset device or a new account still sees it.
const disclosureKeyFor = (userId) => `${LOCATION_DISCLOSURE_KEY}:${userId || 'anonymous'}`;

export const hasAcknowledgedLocationDisclosure = async (userId) => {
  try {
    const value = await asyncStorageWithRetry('get', disclosureKeyFor(userId));
    return value === 'true';
  } catch (error) {
    console.error('Failed to read location disclosure flag:', error);
    return false;
  }
};

export const setLocationDisclosureAcknowledged = async (userId) => {
  try {
    await asyncStorageWithRetry('set', disclosureKeyFor(userId), 'true');
    return true;
  } catch (error) {
    console.error('Failed to store location disclosure flag:', error);
    return false;
  }
};


//-------- 14.08.2026 ---------------
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const TOKEN_KEY = "token";
// const MAX_RETRIES = 3;
// const SESSION_KEY = "sessionId";
// const ACCESS_TOKEN = "accessToken";
// const REFRESH_TOKEN = "refreshToken";


// const asyncStorageWithRetry = async (operation, key, value = null) => {
//   for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
//     try {
//       switch (operation) {
//         case 'get':
//           return await AsyncStorage.getItem(key);
//         case 'set':
//           await AsyncStorage.setItem(key, value);
//           return value;
//         case 'remove':
//           await AsyncStorage.removeItem(key);
//           return null;
//         default:
//           throw new Error(`Unknown operation: ${operation}`);
//       }
//     } catch (error) {
//       console.error(
//         `AsyncStorage ${operation} attempt ${attempt + 1}/${MAX_RETRIES} failed:`,
//         error
//       );

//       // Don't retry if it's the last attempt
//       if (attempt === MAX_RETRIES - 1) {
//         throw error;
//       }

//       // Wait before retrying (exponential backoff)
//       const delay = 100 * Math.pow(2, attempt);
//       await new Promise(resolve => setTimeout(resolve, delay));
//     }
//   }
// };

// /**
//  * Get stored authentication token
//  */
// export const getToken = async () => {
//   try {
//     const token = await asyncStorageWithRetry('get', TOKEN_KEY);
//     return token;
//   } catch (error) {
//     console.error('Failed to get token after retries:', error);
//     return null; // Return null instead of throwing, so app doesn't crash
//   }
// };


// export const hasToken = async () => {
//   try {
//     const token = await getToken();
//     return !!token;
//   } catch (error) {
//     console.error('Failed to check token:', error);
//     return false;
//   }
// };


// export const setSessionId = async (sessionId) => {
//   try {
//     await asyncStorageWithRetry('set', SESSION_KEY, sessionId);
//     return true;
//   } catch (error) {
//     console.error('Failed to store sessionId:', error);
//     throw error;
//   }
// };


// export const getSessionId = async () => {
//   try {
//     return await asyncStorageWithRetry('get', SESSION_KEY);
//   } catch (error) {
//     console.error('Failed to get sessionId:', error);
//     return null;
//   }
// };


// export const clearSessionId = async () => {
//   try {
//     await asyncStorageWithRetry('remove', SESSION_KEY);
//     return true;
//   } catch (error) {
//     console.error('Failed to clear sessionId:', error);
//     return false;
//   }
// };

// export const setTokens = async (access, refresh) => {
//   try {
//     await asyncStorageWithRetry('set', ACCESS_TOKEN, access);
//     // ✅ Only overwrite the refresh token when a new one is actually provided —
//     //    some refresh endpoints only rotate the access token.
//     if (refresh) {
//       await asyncStorageWithRetry('set', REFRESH_TOKEN, refresh);
//     }
//     return true;
//   } catch (error) {
//     console.error('Failed to store tokens:', error);
//     throw error;
//   }
// };

// export const getAccessToken = async () => {
//   try {
//     return await asyncStorageWithRetry('get', ACCESS_TOKEN);
//   } catch (error) {
//     console.error('Failed to get access token:', error);
//     return null;
//   }
// };

// export const getRefreshToken = async () => {
//   try {
//     return await asyncStorageWithRetry('get', REFRESH_TOKEN);
//   } catch (error) {
//     console.error('Failed to get refresh token:', error);
//     return null;
//   }
// };

// export const hasValidTokens = async () => {
//   try {
//     const [access, refresh] = await Promise.all([getAccessToken(), getRefreshToken()]);
//     return !!(access && refresh);
//   } catch (error) {
//     console.error('Failed to check token validity:', error);
//     return false;
//   }
// };

// export const clearTokens = async () => {
//   try {
//     await asyncStorageWithRetry('remove', ACCESS_TOKEN);
//     await asyncStorageWithRetry('remove', REFRESH_TOKEN);
//     return true;
//   } catch (error) {
//     console.error('Failed to clear tokens:', error);
//     return false;
//   }
// };

// // ✅ Full logout helper — clears auth tokens and any active session pointer,
// //    used when token refresh ultimately fails (refresh token expired/invalid).
// export const clearAuth = async () => {
//   await Promise.all([clearTokens(), clearSessionId()]);
// };

//++++++++++++ FSE old code ++++++++++++++++++++++++++++++
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const TOKEN_KEY = "token";
// const MAX_RETRIES = 3;
// const SESSION_KEY = "sessionId";
// const ACCESS_TOKEN = "accessToken";
// const REFRESH_TOKEN = "refreshToken";


// const asyncStorageWithRetry = async (operation, key, value = null) => {
//   for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
//     try {
//       switch (operation) {
//         case 'get':
//           return await AsyncStorage.getItem(key);
//         case 'set':
//           await AsyncStorage.setItem(key, value);
//           return value;
//         case 'remove':
//           await AsyncStorage.removeItem(key);
//           return null;
//         default:
//           throw new Error(`Unknown operation: ${operation}`);
//       }
//     } catch (error) {
//       console.error(
//         `AsyncStorage ${operation} attempt ${attempt + 1}/${MAX_RETRIES} failed:`,
//         error
//       );
      
//       // Don't retry if it's the last attempt
//       if (attempt === MAX_RETRIES - 1) {
//         throw error;
//       }
      
//       // Wait before retrying (exponential backoff)
//       const delay = 100 * Math.pow(2, attempt);
//       await new Promise(resolve => setTimeout(resolve, delay));
//     }
//   }
// };

// /**
//  * Get stored authentication token
//  */
// export const getToken = async () => {
//   try {
//     const token = await asyncStorageWithRetry('get', TOKEN_KEY);
//     return token;
//   } catch (error) {
//     console.error('Failed to get token after retries:', error);
//     return null; // Return null instead of throwing, so app doesn't crash
//   }
// };


// export const hasToken = async () => {
//   try {
//     const token = await getToken();
//     return !!token;
//   } catch (error) {
//     console.error('Failed to check token:', error);
//     return false;
//   }
// };


// export const setSessionId = async (sessionId) => {
//   try {
//     await asyncStorageWithRetry('set', SESSION_KEY, sessionId);
//     return true;
//   } catch (error) {
//     console.error('Failed to store sessionId:', error);
//     throw error;
//   }
// };


// export const getSessionId = async () => {
//   try {
//     return await asyncStorageWithRetry('get', SESSION_KEY);
//   } catch (error) {
//     console.error('Failed to get sessionId:', error);
//     return null;
//   }
// };


// export const clearSessionId = async () => {
//   try {
//     await asyncStorageWithRetry('remove', SESSION_KEY);
//     return true;
//   } catch (error) {
//     console.error('Failed to clear sessionId:', error);
//     return false;
//   }
// };

// export const setTokens = async (access, refresh) => {
//  await AsyncStorage.setItem(ACCESS_TOKEN, access);
//  await AsyncStorage.setItem(REFRESH_TOKEN, refresh);
// };

// export const getAccessToken = () => AsyncStorage.getItem(ACCESS_TOKEN);
// export const getRefreshToken = () => AsyncStorage.getItem(REFRESH_TOKEN);

// export const clearTokens = async () => {
//  await AsyncStorage.removeItem(ACCESS_TOKEN);
//  await AsyncStorage.removeItem(REFRESH_TOKEN);
// };


