"use server";

import { db } from "@/lib/db";
import { adminCustomerOrder } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface CreateOrderInput {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  subtotal: string;
  tax?: string;
  shippingFee?: string;
  total: string;
  currency?: string;
  status?: PaymentStatus;
  orderStatus?: OrderStatus;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
}

export interface UpdateOrderInput extends Partial<CreateOrderInput> {
  id: string;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };


export async function listAllCustomerOrders(): Promise<
  ActionResult<any[]>
> {
  try {
    const orders = await db.query.adminCustomerOrder.findMany({
      with: {
        items: {
          with: {
            product: {
              with: {
                productImages: true,
              },
            },
          },
        },
      },
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });
    return { success: true, data: orders };
  } catch (error) {
    console.error("[listAllCustomerOrders]", error);
    return { success: false, error: "Failed to fetch orders." };
  }
}


export async function getCustomerOrderById(
  id: string
): Promise<ActionResult<any>> {
  try {
    const order = await db.query.adminCustomerOrder.findFirst({
      where: eq(adminCustomerOrder.id, id),
      with: {
        items: {
          with: {
            product: {
              with: {
                productImages: true,
              },
            },
          },
        },
      },
    });
    if (!order) return { success: false, error: "Order not found." };
    return { success: true, data: order };
  } catch (error) {
    console.error("[getCustomerOrderById]", error);
    return { success: false, error: "Failed to fetch order." };
  }
}

export async function createCustomerOrder(
  input: CreateOrderInput
): Promise<ActionResult<typeof adminCustomerOrder.$inferSelect>> {
  try {
    const id = randomUUID();
    const [order] = await db
      .insert(adminCustomerOrder)
      .values({
        id,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        customerAddress: input.customerAddress,
        subtotal: input.subtotal,
        tax: input.tax ?? "0",
        shippingFee: input.shippingFee ?? "0",
        total: input.total,
        currency: input.currency ?? "EUR",
        status: input.status ?? "pending",
        orderStatus: input.orderStatus ?? "pending",
        stripePaymentIntentId: input.stripePaymentIntentId,
        stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      })
      .returning();

    revalidatePath("/admin/orders");
    return { success: true, data: order };
  } catch (error) {
    console.error("[createCustomerOrder]", error);
    return { success: false, error: "Failed to create order." };
  }
}

export async function updateCustomerOrder(
  input: UpdateOrderInput
): Promise<ActionResult<typeof adminCustomerOrder.$inferSelect>> {
  try {
    const { id, ...rest } = input;
    const [updated] = await db
      .update(adminCustomerOrder)
      .set({
        ...rest,
        updatedAt: new Date(),
      })
      .where(eq(adminCustomerOrder.id, id))
      .returning();

    if (!updated) return { success: false, error: "Order not found." };

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateCustomerOrder]", error);
    return { success: false, error: "Failed to update order." };
  }
}


export async function updateOrderPaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<ActionResult<typeof adminCustomerOrder.$inferSelect>> {
  return updateCustomerOrder({ id, status });
}


export async function updateOrderFulfillmentStatus(
  id: string,
  orderStatus: OrderStatus
): Promise<ActionResult<typeof adminCustomerOrder.$inferSelect>> {
  return updateCustomerOrder({ id, orderStatus });
}


export async function deleteCustomerOrder(
  id: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const [deleted] = await db
      .delete(adminCustomerOrder)
      .where(eq(adminCustomerOrder.id, id))
      .returning({ id: adminCustomerOrder.id });

    if (!deleted) return { success: false, error: "Order not found." };

    revalidatePath("/admin/orders");
    return { success: true, data: { id: deleted.id } };
  } catch (error) {
    console.error("[deleteCustomerOrder]", error);
    return { success: false, error: "Failed to delete order." };
  }
}