import AdminProductPanel from "@/components/admin/AdminProductPanel";
import { getAllCategories } from "@/lib/actions/categories.actions";

export default async function NewProductPage() {
    const categories = await getAllCategories();
    
    // Extract category names from multilingual structure
    const categoryNames = categories.map((c: any) => {
      if (typeof c.name === "string") return c.name;
      return c.name?.en || c.name?.pt || "";
    }).filter(Boolean);
    
    return <AdminProductPanel isNew={true} categories={categoryNames} />
}