
import { revalidatePath } from "next/cache";
import CancelPage from "./client";

export default async function Cancel() {
  revalidatePath("/cart");
  return <CancelPage />;
}
