import notifee, { AndroidImportance } from '@notifee/react-native';

export async function createChannel() {
  return await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

export async function displayNotification(remoteMessage) {
  const channelId = await createChannel();

  await notifee.displayNotification({
    title: remoteMessage?.notification?.title || 'Notification',
    body: remoteMessage?.notification?.body || '',
    android: {
      channelId,
      smallIcon: 'ic_launcher', // REQUIRED
      pressAction: {
        id: 'default',
      },
    },
  });
}
