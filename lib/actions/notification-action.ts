"use server";

import { db } from "@/lib/db";
import { notification } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { getUserSession } from "@/server";
import { revalidatePath } from "next/cache";

// ---- CREATE ----
export async function createNotification(type: string, message: string) {
  const session = await getUserSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.insert(notification).values({
    id: uuid(),
    type,
    message,
    isRead: false,
    userId: session.user.id,
  });

  // 👇 Auto-refresh UI
  revalidatePath("/");
}

// ---- GET ----
export async function getUserNotifications() {
  const session = await getUserSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await db
    .select()
    .from(notification)
    .where(eq(notification.userId, session.user.id))
}

// ---- MARK AS READ ----
export async function markNotificationRead(id: string) {
  await db
    .update(notification)
    .set({ isRead: true })
    .where(eq(notification.id, id));

  // 👇 Auto-refresh UI
  revalidatePath("/");
}

// ---- DELETE SINGLE ----
export async function deleteNotification(id: string) {
  await db.delete(notification).where(eq(notification.id, id));

  // 👇 Auto-refresh UI
  revalidatePath("/");
}

// ---- CLEAR ALL ----
export async function clearNotifications() {
  const session = await getUserSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(notification).where(eq(notification.userId, session.user.id));

  // 👇 Auto-refresh UI
  revalidatePath("/");
}
