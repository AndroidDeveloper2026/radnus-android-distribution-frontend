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

  const title =
    remoteMessage?.data?.title ||
    remoteMessage?.notification?.title ||
    'Notification';

  const body =
    remoteMessage?.data?.body ||
    remoteMessage?.notification?.body ||
    '';

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
  });
}