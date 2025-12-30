import { db } from "@/lib/db";
import OrdersClient from "@/components/orders/page";
import { getUserSession } from "@/server";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getUserSession();
  const locale = session?.user.locale ?? "en";

  if (!session?.user.id) {
    const message = locale === "pt" ? "Por favor, faça login para ver os pedidos." : "Please log in to view orders.";
    const loginBtn = locale === "pt" ? "Entrar" : "Sign In";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
          {message}
        </p>
        <Link
          href="/auth/signin"
          className="px-6 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-200 dark:text-neutral-900 font-medium"
        >
          {loginBtn}
        </Link>
      </div>
    );
  }

  const orders = await db.query.orders.findMany({
    where: (t, { eq }) => eq(t.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          product: {
            with: { productImages: true },
          },
        },
      },
    },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return <OrdersClient orders={orders} locale={locale} />;
}
