"use server";

import { db } from "@/lib/db";
import { notification } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { getUserSession } from "@/server";

export async function createNotification(type: string, message: string) {
  const session = await getUserSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.insert(notification).values({
    id: uuid(),
    type,
    message,
    userId: session.user.id,
  });
}

export async function getUserNotifications() {
  const session = await getUserSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await db
    .select()
    .from(notification)
    .where(eq(notification.userId, session.user.id))
    .orderBy(notification.isRead);
}

export async function markNotificationRead(id: string) {
  await db
    .update(notification)
    .set({ isRead: true })
    .where(eq(notification.id, id));
}

export async function deleteNotification(id: string) {
  await db.delete(notification).where(eq(notification.id, id));
}

export async function clearNotifications() {
  const session = await getUserSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(notification).where(eq(notification.userId, session.user.id));
}
