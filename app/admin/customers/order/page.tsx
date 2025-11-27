import { AdminCustomerOrderClient } from "./client";
import {
  ensurePosCustomerAndCart,
  clearPosCart,
  getPosCart,
  getProductsForAdmin,
} from "@/lib/queries/admin-cart";

export default async function AdminCustomerOrderPage() {
  const [products, { customer, cart }] = await Promise.all([
    getProductsForAdmin(),
    ensurePosCustomerAndCart(),
  ]);

  const cartData = await getPosCart(customer.id);
console.log(cartData)
  return (
    <AdminCustomerOrderClient
      customer={customer}
      customerId={customer.id}
      products={products}
      cartData={cartData}
    />
  );
}
