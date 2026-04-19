import AdminProductPanel from "@/components/admin/AdminProductPanel";
import { getAllCategories } from "@/lib/actions/categories.actions";
import { getAllProductsBasic } from "@/lib/actions/product-actions";

export default async function NewProductPage() {
    const [categories, allProducts] = await Promise.all([
      getAllCategories(),
      getAllProductsBasic(),
    ]);
    
    // Build category options with id and display name
    const categoryOptions = categories.map((c: any) => ({
      id: c.id,
      name: typeof c.name === "string" ? c.name : (c.name?.en || c.name?.pt || ""),
    })).filter((c: any) => c.name);
    
    return <AdminProductPanel isNew={true} categoryOptions={categoryOptions} allProducts={allProducts} />
}