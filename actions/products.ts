"use server";
import slugify from "slugify";

import { createClient } from "@/utils/supabase/server";
import {
  ProductsWithCategoriesResponse,
  UpdateProductSchema,
} from "@/app/admin/products/products.types";

import { CreateProductSchemaServer } from "@/app/admin/products/schema";

const supabase = await createClient();

export const getProductsWithCategories =
  async (): Promise<ProductsWithCategoriesResponse> => {
    const { data, error } = await supabase
      .from("product")
      .select("*, category:category(*)")
      .returns<ProductsWithCategoriesResponse>();
    if (error) {
      throw new Error(
        `Error fetching products with categories: ${error.message}`
      );
    }
    return data || [];
  };

export const createProduct = async ({
  category,
  heroImage,
  images,
  maxQuantity,
  price,
  title,
}: CreateProductSchemaServer) => {
  const slug = slugify(title, { lower: true });
  const { data, error } = await supabase.from("product").insert({
    category,
    hero_image: heroImage,
    images_url: images,
    max_quantity: maxQuantity,
    price,
    slug,
    title,
  });
  if (error) {
    throw new Error(`Error creating product ${title}: ${error.message}`);
  }
  return data;
};

export const updateProduct = async ({
  category,
  images_url,
  hero_image,
  max_quantity,
  price,
  slug,
  title,
}: UpdateProductSchema) => {
  const { data, error } = await supabase
    .from("product")
    .update({
      category,
      hero_image,
      images_url,
      max_quantity,
      price,
      title,
    })
    .match({ slug });
  if (error) {
    throw new Error(`Error updating product ${title}:  ${error.message}`);
  }
  return data;
};

export const deleteProduct = async (slug: string) => {
  const { error } = await supabase.from("product").delete().match({ slug });
  if (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
};
