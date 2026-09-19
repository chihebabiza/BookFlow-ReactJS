import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FormSheet } from "@/components/common/FormSheet";
import { DataTable } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { CreateCategoryForm } from "@/features/categories/components/CreateCategoryForm";
import { getCategories } from "@/features/categories/api/categories.api";
import type { Category } from "@/features/categories/types/category.types";
import { columns } from "../components/columns";

export function Categories() {
  const [addOpen, setAddOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load categories.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>

          <p className="text-muted-foreground">
            Manage and organize your library categories.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>Add Category</Button>
      </div>

      <FormSheet open={addOpen} onOpenChange={setAddOpen}>
        <CreateCategoryForm onSuccess={() => setAddOpen(false)} />
      </FormSheet>

      <DataTable columns={columns} data={categories} />
    </div>
  );
}
