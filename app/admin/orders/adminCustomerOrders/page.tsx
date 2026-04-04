// app/admin/orders/page.tsx
import { listAllCustomerOrders } from "@/lib/actions/admin-actions/adminCustomerOrder";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const result = await listAllCustomerOrders();
  const orders = result.success ? result.data : [];

  return <OrdersClient initialOrders={orders} />;
}