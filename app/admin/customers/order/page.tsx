
import { getProductsForAdmin, getCustomerCart } from "@/lib/queries/admin-cart";
import { AdminCustomerOrderClient } from "./client";
import { getUserSession } from "@/server";

export default async function AdminCustomerOrderPage() {
  const user = await getUserSession();
  const customerId = user?.user.id;

  const [products, cartData] = await Promise.all([
    getProductsForAdmin(),
    getCustomerCart(customerId!),
  ]);

  return (
    <AdminCustomerOrderClient
      customerId={customerId!}
      products={products}
      cartData={cartData}
    />
  );
}
