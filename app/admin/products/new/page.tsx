import AdminProductPanel from "@/components/admin/AdminProductPanel";
import { getAllCategories } from "@/lib/actions/categories.actions";

export default async function NewProductPage() {
    const categories = await getAllCategories();
    return <AdminProductPanel isNew={true} categories={categories} />
}