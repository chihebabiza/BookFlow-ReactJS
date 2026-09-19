import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/features/categories/api/categories.api";

type FormErrors = { name?: string };

type CreateCategoryFormProps = {
  onSuccess: () => void;
};

export function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setErrors({ name: "Name is required." });
      return;
    }

    try {
      setIsSubmitting(true);
      await createCategory({ name: name.trim() });
      toast.success("Category added successfully");
      setName("");
      setErrors({});
      onSuccess();
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add category",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
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
      <FormSubmitButton isPending={isSubmitting} pendingText="Adding...">
        Add Category
      </FormSubmitButton>
    </form>
  );
}
