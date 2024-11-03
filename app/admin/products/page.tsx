import { getCategoriesWithProducts } from "@/actions/categories";
import ProductPageComponent from "@/app/admin/products/product-page-component";

export default async function ProductsPage() {
  const categories = await getCategoriesWithProducts();

  return <ProductPageComponent categories={categories} />;
}
