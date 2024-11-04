import { getCategoriesWithProducts } from "@/actions/categories";
import { getProductsWithCategories } from "@/actions/products";
import ProductPageComponent from "@/app/admin/products/product-page-component";

export default async function ProductsPage() {
  const categories = await getCategoriesWithProducts();
  const productsWithCategories = await getProductsWithCategories();
  return (
    <ProductPageComponent
      categories={categories}
      productsWithCategories={productsWithCategories}
    />
  );
}
