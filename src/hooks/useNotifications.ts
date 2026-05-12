import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const requestPermissions = async () => {
    if (!Device.isDevice) {
      console.warn("[Notifications] emulador detectado, las notificaciones pueden no funcionar bien");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Recordatorios",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    }
    return true;
  };

  const scheduleNotification = async (
    title: string,
    body: string,
    date: Date
  ): Promise<string | null> => {
    const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
    if (seconds <= 0) {
      console.warn("[Notifications] la fecha ya pasó, no se programa");
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: "default" },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
      },
    });
    console.log("[Notifications] programada, id:", id);
    return id;
  };

  const cancelNotification = async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
  };

  return { requestPermissions, scheduleNotification, cancelNotification };
}
