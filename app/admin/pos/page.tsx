import { getPosOrders } from "@/lib/actions/pos-orders";
import OrderRow from "./ordersRow/page";

export default async function POSOrdersPage() {
  const orders = await getPosOrders();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">POS Orders</h1>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Payment</th>
              <th className="p-2"></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
