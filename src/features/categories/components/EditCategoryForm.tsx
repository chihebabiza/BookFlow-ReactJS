import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { updateCategory } from "@/features/categories/api/categories.api";
import type { Category } from "@/features/categories/types/category.types";
type FormErrors = { name?: string };

type EditCategoryFormProps = {
  category: Category;
  onSuccess: () => void;
};

export function EditCategoryForm({
  category,
  onSuccess,
}: EditCategoryFormProps) {
  const [name, setName] = useState(category.name);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDirty = name !== category.name;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setErrors({ name: "Name is required." });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateCategory(category.id, { name: name.trim() });
      toast.success("Category updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update category",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div>
          <h2 className="text-xl font-semibold">Edit Category</h2>
          <p className="text-sm text-muted-foreground">
            Update the category information.
          </p>
        </div>
        <FormField label="Name" required error={errors.name}>
          <Input
            id="category-name"
            placeholder="Enter category name..."
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors({});
            }}
          />
        </FormField>
      </div>
      <FormSubmitButton
        isPending={isSubmitting}
        disabled={!isDirty}
        pendingText="Updating..."
      >
        Update Category
      </FormSubmitButton>
    </form>
  );
}
