"use server";

import { revalidatePath } from "next/cache";
import { ProductFormValues } from "@/lib/validations/product-schema";
import {
  createProduct,
  updateProduct,
  deleteProduct as deleteProductDb,
} from "@/lib/actions/product-actions";
import { isAdmin } from "@/lib/rbac";
import { getUserSession } from "@/server";

export async function createProductAction(data: ProductFormValues) {
  const user = await getUserSession();
  if (!user?.user) throw new Error("User not found");
  await isAdmin(user.user);
  const product = await createProduct({
    ...data,
    productImages: data.productImages.map((img, idx) => ({
      ...img,
      position: idx,
    })),
    //@ts-ignore
    specifications: data.specifications,
  });
 
  revalidatePath("/admin/products");
  return product;
}

export async function updateProductAction(id: string, data: ProductFormValues) {
  const user = await getUserSession();
  if (!user?.user) throw new Error("User not found");
  await isAdmin(user.user);
  const product = await updateProduct(id, {
    ...data,
    productImages: data.productImages.map((img, idx) => ({
      ...img,
      position: idx,
    })),
    specifications: data.specifications as any,
  });
revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${id}`);
  return product;
}

export async function deleteProductAction(id: string) {
  await deleteProductDb(id);
  revalidatePath("/admin/products");
  return { success: true };
}
