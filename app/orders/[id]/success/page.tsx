import OrderSuccessPage from "./client";
import { revalidatePath } from "next/cache";

export default async function SuccessPage() {
  revalidatePath("/cart");

  return <OrderSuccessPage />;
}
