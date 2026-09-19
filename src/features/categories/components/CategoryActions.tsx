"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ActionButtons } from "@/components/common/ActionButtons";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FormSheet } from "@/components/common/FormSheet";
import { deleteCategory } from "@/features/categories/api/categories.api";
import type { Category } from "@/features/categories/types/category.types";
import { EditCategoryForm } from "./EditCategoryForm";

type CategoryActionsProps = {
  category: Category;
};

export function CategoryActions({ category }: CategoryActionsProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteCategory(category.id);
      toast.success("Category deleted successfully");
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <ActionButtons
        actions={[
          {
            label: "Edit category",
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => setEditOpen(true),
            className: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
          },
          {
            label: "Delete category",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => setDeleteOpen(true),
            destructive: true,
            className: "text-red-600 hover:bg-red-50 hover:text-red-700",
          },
        ]}
      />
      <FormSheet open={editOpen} onOpenChange={setEditOpen}>
        <EditCategoryForm
          category={category}
          onSuccess={() => setEditOpen(false)}
        />
      </FormSheet>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        isPending={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
