"use server";
import { CategoriesWithProductsResponse } from "@/app/admin/categories/categories.types";
import {
  CreateCategorySchemaServer,
  UpdateCategorySchema,
} from "@/app/admin/categories/create-category.schema";
import { createClient } from "@/utils/supabase/server";
import slugify from "slugify";
const supabase = await createClient();

export const getCategoriesWithProducts =
  async (): Promise<CategoriesWithProductsResponse> => {
    const { data, error } = await supabase
      .from("category")
      .select("*, products:product(*)")
      .returns<CategoriesWithProductsResponse>();
    if (error) throw new Error("Error fetching categories", error);
    return data || [];
  };
export const imageUploadHandler = async (formData: FormData) => {
  if (!formData) return;
  const fileEntry = formData.get("file");
  if (!(fileEntry instanceof File)) throw new Error("File not found");
  const fileName = fileEntry.name;

  try {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, fileEntry, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw new Error("Error uploading image", error);
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(data.path);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image", error);
    throw new Error(`Error uploading image: ${fileName}`);
  }
};

export const createCategory = async ({
  imageUrl,
  name,
}: CreateCategorySchemaServer) => {
  const slug = slugify(name, { lower: true });
  const { data, error } = await supabase.from("category").insert({
    name,
    image_url: imageUrl,
    slug,
  });
  if (error) throw new Error("Error creating category", error);
};

export const updateCategory = async ({
  imageUrl,
  name,
  slug,
}: UpdateCategorySchema) => {
  const { data, error } = await supabase
    .from("category")
    .update({ name, image_url: imageUrl })
    .match({ slug });
  if (error) throw new Error(`Error updating category: ${error.message}`);
  return data;
};

export const deleteCategory = async (id: number) => {
  const { error } = await supabase.from("category").delete().match({ id });
  if (error) throw new Error(`Error deleting category: ${error.message}`);
};
