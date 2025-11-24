import { getAllOrders } from "@/lib/actions/order.actions";
import OrdersClient from "@/components/admin/adminorder";
export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  console.log(orders)
  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-neutral-900">Orders</h1>

      <OrdersClient orders={orders} />
    </div>
  );
}
