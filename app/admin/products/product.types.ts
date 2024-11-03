export type ProductWithCategory = {
  id: number;
  title: string;
  slug: string;
  images_url: string[];
  price: number;
  heroImage: string;
  category: number;
  max_quantity: number;
};
export type ProductWithCategoryResponse = ProductWithCategory[];

export type UpdateProductSchema = {
  category: number;
  hero_image: string;
  images_url: string[];
  max_quantity: number;
  price: number | null;
  slug: string;
  title: string;
};
