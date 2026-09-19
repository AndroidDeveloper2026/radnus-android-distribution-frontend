import React, { useEffect } from 'react';
import StackNavigator from './StackNavigator';
import { CartProvider } from '../context/CartContext';
import { startOfflineQueueAutoRetry } from '../utils/HeadlessLocation';

const RootNavigator = () => {
  // ✅ FIX: wire up the offline-queue auto-retry loop.
  //
  // utils/HeadlessLocation.js defines startOfflineQueueAutoRetry() precisely
  // to solve FSE GPS points getting stuck as "pending" forever (e.g. after
  // "Skip Sync & End Day", or the app being reopened after time offline) —
  // but nothing in the app ever called it, so the retry loop never actually
  // ran. Queued points just sat in AsyncStorage (@fse_offline_queue) until
  // a brand-new GPS fix happened to trigger a manual flush, which is why
  // "some points couldn't be synced" could persist indefinitely and never
  // reach the database. Starting it once here, at the app root, means it
  // runs for the lifetime of the app (on network reconnect + every 60s)
  // regardless of which screen the FSE is on.
  useEffect(() => {
    const stop = startOfflineQueueAutoRetry();
    return () => stop && stop();
  }, []);

  return (
    <CartProvider>
      <StackNavigator/>
    </CartProvider>
  );
};

export default RootNavigator;

//------------- 17.09.2026 --------------
// import React from 'react';
// import StackNavigator from './StackNavigator';
// import { CartProvider } from '../context/CartContext';

// const RootNavigator = () => {
//   return (
//     <CartProvider>
//       <StackNavigator/>
//     </CartProvider>
//   );
// };

// export default RootNavigator;


