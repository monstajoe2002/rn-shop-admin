"use client";
import React, { use, useState } from "react";
import { Category } from "@/app/admin/categories/categories.types";
import { PlusIcon } from "lucide-react";
import { v4 as uuidV4 } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ProductsWithCategoriesResponse } from "@/app/admin/products/products.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createOrUpdateProductSchema,
  CreateOrUpdateProductSchema,
} from "@/app/admin/products/schema";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/actions/products";
import { ProductForm } from "@/app/admin/products/product-form";
import { ProductTableRow } from "@/app/admin/products/product-table-row";
import { imageUploadHandler } from "@/actions/categories";
type Props = {
  categories: Category[];
  productsWithCategories: ProductsWithCategoriesResponse;
};

const ProductPageComponent = ({ categories }: Props) => {
  const [currentProduct, setCurrentProduct] =
    useState<CreateOrUpdateProductSchema | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const form = useForm<CreateOrUpdateProductSchema>({
    resolver: zodResolver(createOrUpdateProductSchema),
    defaultValues: {
      title: "",
      category: undefined,
      price: undefined,
      maxQuantity: undefined,
      images: [],
      intent: "create",
    },
  });
  const router = useRouter();
  const productUpdateCreateHandler = async (
    data: CreateOrUpdateProductSchema
  ) => {
    const {
      category,
      images,
      maxQuantity,
      price,
      title,
      heroImage,
      slug,
      intent = "create",
    } = data;
    const uploadFile = async (file: File) => {
      const uniqueId = uuidV4();
      const fileName = `product/product-${uniqueId}-${file.name}`;
      const formData = new FormData();
      formData.append("file", file, fileName);
      return imageUploadHandler(formData);
    };
    let heroImageUrl: string | undefined;
    let imageUrls: Array<string> = [];
    if (heroImage) {
      const imagePromise = Array.from(heroImage).map((file) =>
        uploadFile(file as File)
      );
      try {
        [heroImageUrl] = await Promise.all(imagePromise);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
        return;
      }
    }
    if (images.length > 0) {
      const imagePromises = Array.from(images).map((file) => uploadFile(file));
      try {
        imageUrls = (await Promise.all(imagePromises)) as string[];
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error("Error uploading images");
        return;
      }
    }
    switch (intent) {
      case "create": {
        if (heroImageUrl && imageUrls.length > 0) {
          await createProduct({
            category: Number(category),
            images: imageUrls,
            heroImage: heroImageUrl,
            maxQuantity: Number(maxQuantity),
            price: Number(price),
            title,
          });
          form.reset();
          router.refresh();
          setIsDeleteModalOpen(false);
          setIsProductModalOpen(false);
          toast.success("Product created successfully");
          break;
        }
      }
      case "update": {
        if (heroImageUrl && imageUrls.length > 0 && slug) {
          await updateProduct({
            category: Number(category),
            slug,
            images_url: imageUrls,
            hero_image: heroImageUrl,
            max_quantity: Number(maxQuantity),
            price: Number(price),
            title,
          });
        }
        break;
      }
      default:
        console.error("Invalid intent");
    }
  };

  const deleteProductHandler = async () => {
    if (currentProduct?.slug) {
      await deleteProduct(currentProduct.slug);
      router.refresh();
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    }
  };

  return <div>ProductPageComponent</div>;
};

export default ProductPageComponent;
