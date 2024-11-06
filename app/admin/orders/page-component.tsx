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

type Props = {
  ordersWithProducts: OrdersWithProducts;
};

export default function PageComponent({ ordersWithProducts }: Props) {
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
              <TableCell>status</TableCell>
              <TableCell>{order.description || "No description"}</TableCell>
              {/* @ts-expect-error Supabase doesn't infer nested types well*/}
              <TableCell>{order.user.email}</TableCell>
              <TableCell>{order.slug}</TableCell>
              <TableCell>$ {order.total_price.toFixed(2)}</TableCell>
              <TableCell>
                {order.order_items.length} item
                {order.order_items.length > 1 ? "s" : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
