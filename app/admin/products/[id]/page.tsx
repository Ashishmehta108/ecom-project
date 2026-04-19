import AdminProductPanel from "@/components/admin/AdminProductPanel";
import { getProductByIdRaw, getAllProductsBasic } from "@/lib/actions/product-actions";
import { getAllCategories } from "@/lib/actions/categories.actions";

export default async function ProductEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const product = await getProductByIdRaw(p.id);
  const [allCategories, allProducts] = await Promise.all([
    getAllCategories(),
    getAllProductsBasic(),
  ]);

  if (!product) {
    return <div>Product not found</div>;
  }

  // Build category options with id and display name
  const categoryOptions = allCategories.map((c: any) => ({
    id: c.id,
    name: typeof c.name === "string" ? c.name : (c.name?.en || c.name?.pt || ""),
  })).filter((c: any) => c.name);

  return (
    <div className="p-8">
      <AdminProductPanel
        categoryOptions={categoryOptions}
        initialProduct={product}
        allProducts={allProducts}
      />
    </div>
  );
}
