import Payment from "@/components/payments/paymentclient";
import { getAddressById } from "@/lib/actions/address-action";
import { getCart } from "@/lib/actions/cart-actions";
import { getUserSession } from "@/server";

export default async function Payments({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const session = await getUserSession();
  if (!session?.user?.id) {
    return <div>Error: No user found</div>;
  }
  const cart = await getCart(session.user.id as string);
  console.log(cart);

  if (!cart.success) {
    return <div>Error: {cart.error}</div>;
  }
  const address = await getAddressById(params.id! as string);
  console.log(address);
  if (!address.success) {
    return <div>Error: {address.error}</div>;
  }
  return <Payment address={address.address!} cart={cart.data.items} />;
}
