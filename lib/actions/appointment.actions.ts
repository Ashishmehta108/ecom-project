"use server";

import { db } from "../db";
import { appointment } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export async function createAppointment(data: any) {
  const result = await db.insert(appointment).values(data).returning();
  return result[0];
}

import { sql} from "drizzle-orm";


export async function getAppointmentsPaginated(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  // Fetch paginated appointments
  const apps = await db.query.appointment.findMany({
    limit,
    offset,
    orderBy: desc(appointment.createdAt),
  });

  // Count total appointments
  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointment);

  const total = Number(totalResult[0].count);

  return {
    data: apps,
    total,
    pages: Math.ceil(total / limit),
  };
}


export async function updateAppointmentStatus(id: string, status: string) {
  return await db
    .update(appointment)
    .set({ status })
    .where(eq(appointment.id, id))
    .returning();
}

export async function deleteAppointment(id: string) {
  return await db.delete(appointment).where(eq(appointment.id, id));
}
