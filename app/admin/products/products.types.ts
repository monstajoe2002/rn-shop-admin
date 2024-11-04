import { Category } from "@/app/admin/categories/categories.types";

export type ProductWithCategory = {
  id: number;
  title: string;
  slug: string;
  images_url: string[];
  price: number;
  hero_image: string;
  category: Category;
  max_quantity: number;
};
export type ProductsWithCategoriesResponse = ProductWithCategory[];

export type UpdateProductSchema = {
  category: number;
  hero_image: string;
  images_url: string[];
  max_quantity: number;
  price: number;
  slug: string;
  title: string;
};
