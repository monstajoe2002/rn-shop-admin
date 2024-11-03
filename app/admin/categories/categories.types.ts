export type Product = {
  id: number;
  title: string;
  slug: string;
  images_url: string[];
  price: number;
  heroImage: string;
  category: number;
  max_quantity: number;
};

export type CategoryWithProducts = {
  created_at: string;
  id: number;
  image_url: string;
  name: string;
  products: Product[];
  slug: string;
};

export type CategoriesWithProductsResponse = CategoryWithProducts[];
