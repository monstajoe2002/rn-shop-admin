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

const ProductPageComponent = ({
  categories,
  productsWithCategories,
}: Props) => {
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

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products Management</h1>
          <Button
            onClick={() => {
              setCurrentProduct(null);
              setIsProductModalOpen(true);
            }}
          >
            <PlusIcon className="size-4 mr-2" />
            Add Product
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Max Quantity</TableHead>
              <TableHead>Hero Image</TableHead>
              <TableHead>Product Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsWithCategories.map((product) => (
              <ProductTableRow
                setIsProductModalOpen={setIsProductModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                key={product.id.toString()}
                product={product}
                setCurrentProduct={setCurrentProduct}
              />
            ))}
          </TableBody>
        </Table>
        {/* Product Modal */}
        <ProductForm
          form={form}
          onSubmit={productUpdateCreateHandler}
          categories={categories}
          isProductModalOpen={isProductModalOpen}
          setIsProductModalOpen={setIsProductModalOpen}
          defaultValues={currentProduct}
        />
        {/* Delete modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete {currentProduct?.title}?</p>
            <DialogFooter>
              <Button variant={"destructive"} onClick={deleteProductHandler}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default ProductPageComponent;
