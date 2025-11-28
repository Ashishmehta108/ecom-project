"use server";
import { db } from "@/lib/db";
import {
  adminCustomerCart,
  adminCustomerCartItem,
  adminCustomerOrder,
  adminCustomerOrderItem,
  product,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import {
  customerInfoSchema,
  CustomerInfo,
  InsufficientStockError,
  CartNotFoundError,
} from "@/lib/validations/admin-cart.types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutResult {
  success: boolean;
  sessionUrl?: string;
  orderId?: string;
  error?: string;
}

/**
 * Create admin customer checkout session
 */
export async function createAdminCustomerCheckoutSession(
  cartId: string,
  customerInfo: CustomerInfo
): Promise<CheckoutResult> {
  try {
    // Validate customer info
    const validated = customerInfoSchema.parse(customerInfo);

    // Use DB transaction for atomicity
    const result = await db.transaction(async (tx) => {
      // Fetch cart with items
      const cart = await tx.query.adminCustomerCart.findFirst({
        where: eq(adminCustomerCart.id, cartId),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new CartNotFoundError(cartId);
      }

      // Validate stock for all items
      for (const item of cart.items) {
        if (!item.product.pricing.inStock) {
          throw new Error(`${item.product.productName} is out of stock`);
        }

        if (item.product.pricing.stockQuantity < item.quantity) {
          throw new InsufficientStockError(
            item.product.productName,
            item.product.pricing.stockQuantity,
            item.quantity
          );
        }
      }

      // Calculate totals
      const subtotal = cart.items.reduce((sum, item) => {
        return sum + parseFloat(item.price) * item.quantity;
      }, 0);

      const tax = 0; // Can implement tax logic here
      const shippingFee = 0; // Can implement shipping logic here
      const total = subtotal + tax + shippingFee;

      // Create order
      const orderId = nanoid();
      const [order] = await tx
        .insert(adminCustomerOrder)
        .values({
          id: orderId,
          customerName: validated.customerName,
          customerEmail: validated.customerEmail,
          customerPhone: validated.customerPhone,
          customerAddress: validated.customerAddress,
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          shippingFee: shippingFee.toFixed(2),
          total: total.toFixed(2),
          currency: "EUR",
          status: "pending",
          orderStatus: "pending",
        })
        .returning();

      // Create order items
      const orderItems = cart.items.map((item) => ({
        id: nanoid(),
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      await tx.insert(adminCustomerOrderItem).values(orderItems);

      // Create Stripe Checkout Session
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        cart.items.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
              description: `${item.product.brand} ${item.product.model}`,
            },
            unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to cents
          },
          quantity: item.quantity,
        }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin-customer-cart?canceled=true`,
        customer_email: validated.customerEmail,
        metadata: {
          adminCustomerOrderId: order.id,
          cartId: cartId,
        },
      });

      // Update order with Stripe session ID
      await tx
        .update(adminCustomerOrder)
        .set({
          stripeCheckoutSessionId: session.id,
        })
        .where(eq(adminCustomerOrder.id, order.id));

      return {
        sessionUrl: session.url,
        orderId: order.id,
      };
    });

    return {
      success: true,
      sessionUrl: result.sessionUrl!,
      orderId: result.orderId,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create checkout session",
    };
  }
}
