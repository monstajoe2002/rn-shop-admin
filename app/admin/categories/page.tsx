import { getCategoriesWithProducts } from "@/actions/categories";
import CategoryPageComponent from "@/components/category-page-component";
export default async function CategoriesPage() {
    const categories = await getCategoriesWithProducts()
    return <CategoryPageComponent categories={categories} />
}