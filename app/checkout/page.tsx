import CheckoutAddressPage from "@/components/checkout/checkoutAddressPage";
import { getAddress } from "@/lib/actions/address-action";

export default async function Checkout() {
  const address = await getAddress();

  return <CheckoutAddressPage address={address.addresses!} />;
}
