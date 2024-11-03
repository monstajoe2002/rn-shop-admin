"use client"
import React from 'react'
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CategoryTableRow } from "@/components/category";
import { CategoriesWithProductsResponse } from '@/app/admin/categories/categories.types';
import { type CreateCategorySchema, createCategorySchema } from '@/app/admin/categories/create-category.schema';

type Props = {
    categories: CategoriesWithProductsResponse
};

const CategoryPageComponent = ({ categories }: Props) => {
    return (
        <div>CategoryPageComponent</div>
    )
}

export default CategoryPageComponent