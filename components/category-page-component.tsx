"use client";
import React from "react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CategoryTableRow } from "@/components/category";
import { CategoriesWithProductsResponse } from "@/app/admin/categories/categories.types";
import {
    type CreateCategorySchema,
    createCategorySchema,
} from "@/app/admin/categories/create-category.schema";
import { PlusCircle } from "lucide-react";
import { CategoryForm } from "@/app/admin/categories/category-form";

type Props = {
    categories: CategoriesWithProductsResponse;
};

const CategoryPageComponent = ({ categories }: Props) => {
    const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
        useState(false);
    const [currentCategory, setCurrentCategory] =
        useState<CreateCategorySchema | null>(null);
    const form = useForm<CreateCategorySchema>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: "",
            image: undefined,
        },
    });
    const submitCategoryHandler: SubmitHandler<CreateCategorySchema> = async (
        data
    ) => {
        console.log("data", data);
    };

    return (
        <main className="grid flex-1 items-start gap-4 p-4 px-6 sm:py-0 md:gap-8">
            <div className="flex items-start my-10">
                <div className="ml-auto flex items-center gap-2">
                    <Dialog
                        open={isCreateCategoryModalOpen}
                        onOpenChange={() =>
                            setIsCreateCategoryModalOpen(!isCreateCategoryModalOpen)
                        }
                    >
                        <DialogTrigger asChild>
                            <Button
                                className="h-8 gap-1"
                                size="sm"
                                onClick={() => {
                                    setCurrentCategory(null);
                                    setIsCreateCategoryModalOpen(true);
                                }}
                            >
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Category
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Category</DialogTitle>
                            </DialogHeader>
                            <CategoryForm
                                form={form}
                                onSubmit={submitCategoryHandler}
                                defaultValues={currentCategory}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Card className="overflow-x-auto">
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] sm:table-cell">
                                    <span className="sr-only">Images</span>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="md:table-cell">Created At</TableHead>
                                <TableHead className="md:table-cell">Products</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                            <TableBody>
                                {categories.map((category) => (
                                    <CategoryTableRow
                                        key={category.id}
                                        category={category}
                                        setCurrentCategory={setCurrentCategory}
                                        setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen}
                                    />
                                ))}
                            </TableBody>
                        </TableHeader>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
};

export default CategoryPageComponent;
