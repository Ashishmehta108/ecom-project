import AdminProductPanel from "@/components/admin/AdminProductPanel";
import { getProductByIdRaw } from "@/lib/actions/product-actions";
import { getAllCategories } from "@/lib/actions/categories.actions";

export default async function ProductEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const product = await getProductByIdRaw(p.id);
  const allCategories = await getAllCategories();

  if (!product) {
    return <div>Product not found</div>;
  }

  // Extract category names from multilingual structure
  const categoryNames = allCategories.map((c: any) => {
    if (typeof c.name === "string") return c.name;
    return c.name?.en || c.name?.pt || "";
  }).filter(Boolean);

  return (
    <div className="p-8">
      <AdminProductPanel
        categories={categoryNames}
        initialProduct={product}
      />
    </div>
  );
}
