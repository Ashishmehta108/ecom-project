"use server";

import { db } from "@/lib/db";
import { address } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { getUserSession } from "@/server";
import { and, eq } from "drizzle-orm";
import { Address } from "../types/address.types";

export async function createAddress(form: {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}) {
  const session = await getUserSession();

  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const id = nanoid();

  try {
    await db.insert(address).values({
      id,
      userId: session.user.id,
      fullName: form.fullName,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
    });

    return { success: true, addressId: id };
  } catch (err) {
    console.log("Address Error:", err);
    return { success: false, error: "Failed to save address" };
  }
}

export async function getAddress() {
  const session = await getUserSession();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    const results = await db.query.address.findMany({
      where: (table) => eq(table.userId, session.user.id),
    });
    const addresses: Address[] = results.map((addr) => ({
      ...addr,
      line2: addr.line2 === null ? undefined : addr.line2,
    }));
    return { success: true, addresses };
  } catch (err) {
    console.log("Address Error:", err);
    return { success: false, error: "Failed to get addresses" };
  }
}

export async function getAddressById(id: string) {
  const session = await getUserSession();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    const result = await db.query.address.findFirst({
      where: (table) => and(eq(table.id, id), eq(table.userId, session.user.id)),
    });
    console.log(result);
    return { success: true, address: result };
  } catch (err) {
    console.log("Address Error:", err);
    return {
      success: false,
      error: "Failed to get address by id",
      address: null,
    };
  }
}
