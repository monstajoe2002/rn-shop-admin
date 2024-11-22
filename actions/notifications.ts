"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();
export const sendNotification = async (userId: string, status: string) => {
  const tokenData = await getUserNotificationToken(userId);
  if (!tokenData.expo_notification_token) {
    return;
  }
  await sendPushNotification({
    expoPushToken: tokenData.expo_notification_token,
    title: "monstajoe",
    body: `Your order status is now ${status}`,
  });
};

const sendPushNotification = async ({
  expoPushToken,
  body,
  title,
}: {
  expoPushToken: string;
  title: string;
  body: string;
}) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { someData: "goes here" },
  };
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

export const getUserNotificationToken = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("expo_notification_token")
    .eq("id", userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};
