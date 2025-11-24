import AdminProductPanel from "@/components/admin/AdminProductPanel";
import { getProductById } from "@/lib/actions/product-actions";

export default async function ProductEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const product = await getProductById((await params).id);
console.log(product)
  return (
    <div className="p-8">
      <AdminProductPanel
        //@ts-ignore
        initialProduct={product}
      />
    </div>
  );
}
