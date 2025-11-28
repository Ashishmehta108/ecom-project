"use server";

import { nanoid } from "nanoid";
import { db } from "../db";
import { appointment } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import tbar from "@/public/Tech Bar (11).svg";




function appointmentBookedTemplate({
  name,
  date,
  service,
  customerPhone,
  id,
}: {
  name: string;
  date: string;

  service: string;
  customerPhone: string;
  id: string;
}) {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 12px;">

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img 
          src="https://www.techbar.store/_next/static/media/Tech%20Bar%20(10).41147356.svg" 
          alt="Techbar Logo" 
          style="width: 140px; height: auto; margin: auto;"
        />
      </div>

      <h2 style="text-align:center; color:#4F46E5;">Appointment Confirmed</h2>

      <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
      <p style="font-size: 15px; color:#333;">
        Your appointment has been successfully booked. Below are your appointment details:
      </p>

      <div style="margin:20px 0; padding: 15px; background:#f1f1ff; border-left:4px solid #4F46E5;">
        <p><strong>Appointment ID:</strong> ${id}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Phone:</strong> ${customerPhone}</p>
      </div>

      <p style="font-size: 14px; color:#555;">
        If you need to reschedule or cancel, just reply to this email.
      </p>

      <p style="margin-top: 25px; font-size: 14px; color:#888; text-align:center;">
        — Techbar.store Team
      </p>
    </div>
  </div>
  `;
}

export async function createAppointment(data: any) {
  const id = await nanoid();
  const result = await db
    .insert(appointment)
    .values({
      id: id,
      ...data,
    })
    .returning();
  const html = appointmentBookedTemplate({
    name: data.customerName,
    date: data.scheduledDate,
    customerPhone: data.customerPhone,
    id: id,
    service: data.issueDescription,
  });
  console.log(data,appointmentBookedTemplate)
  const d=await sendEmail({
    to: data.customerEmail,
    html: html,
    subject: "Appointment Booked Sucessfully Tecbar.store"
  });
  // await appointmentBookedTemplate(
  //  name: data.name,
  //   data.scheduledDate,
  //   data.issueDescription,
  //   data.deviceType,
  //   id
  // );
  console.log(d)
  return result[0];
}

import { sql } from "drizzle-orm";
import { sendEmail } from "../sendemail";
import { DatabaseError } from "pg";

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
