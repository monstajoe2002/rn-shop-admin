"use client";

import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { OrdersWithProducts } from "@/app/admin/orders/type";
import { updateOrderStatus } from "@/actions/orders";
const statusOptions = ["Pending", "Shipped", "In Transit", "Completed"];

type Props = {
  ordersWithProducts: OrdersWithProducts;
};

type OrderedProducts = {
  order_id: number;
  product: number & {
    category: number;
    created_at: string;
    hero_image: string;
    id: number;
    images_url: string[];
    max_quantity: number;
    price: number;
    slug: string;
    title: string;
  };
}[];

export default function PageComponent({ ordersWithProducts }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<OrderedProducts>([]);
  const orderedProducts = ordersWithProducts.flatMap((order) =>
    order.order_items.map((item) => ({
      order_id: order.id,
      product: item.product,
    }))
  );

  const handleStatusChange = async (orderedId: number, status: string) => {
    await updateOrderStatus(orderedId, status);
  };

  const openProductsModal = (products: OrderedProducts) =>
    setSelectedProducts(products);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management Dashboard</h1>
      <Table>
        <TableHeader>
          <TableHead>ID</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {ordersWithProducts.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {format(new Date(order.created_at), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <Select
                  onValueChange={(value) => {
                    handleStatusChange(order.id, value);
                  }}
                  defaultValue={order.status}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue>{order.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{order.description || "No description"}</TableCell>
              {/* @ts-expect-error Supabase doesn't infer nested types well*/}
              <TableCell>{order.user.email}</TableCell>
              <TableCell>{order.slug}</TableCell>
              <TableCell>$ {order.total_price.toFixed(2)}</TableCell>
              <TableCell>
                {order.order_items.length} item
                {order.order_items.length > 1 ? "s" : ""}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size={"sm"}
                      onClick={() =>
                        openProductsModal(
                          orderedProducts.filter(
                            (item) => item.order_id === order.id
                          )
                        )
                      }
                    >
                      View Products
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Order Products</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      {selectedProducts.map(({ product }, index) => (
                        <div
                          key={index}
                          className="mr-2 mb-2 flex space-x-2 items-center"
                        >
                          <Image
                            width={64}
                            height={64}
                            className="size-16 rounded object-cover"
                            alt={product.title}
                            src={product.hero_image}
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {product.title}
                            </span>
                            <span className="text-gray-600">
                              $ {product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Available Quantity: {product.max_quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
