import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getAuthors } from "@/features/authors/api/authors.api";
import { getCategories } from "@/features/categories/api/categories.api";
import { createBook } from "@/features/books/api/books.api";
import type { BookCreate } from "@/features/books/types/book.types";
import type { Author } from "@/features/authors/types/author.types";
import type { Category } from "@/features/categories/types/category.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";

import {
  createBookSchema,
  type CreateBookFormData,
} from "../schemas/book.schema";

interface CreateBookFormProps {
  onSuccess: () => void;
}

export function CreateBookForm({ onSuccess }: CreateBookFormProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoadingAuthors, setIsLoadingAuthors] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      isbn: "",
      authorId: 0,
      categoryId: 0,
      publishedDate: "",
      quantity: 1,
    },
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await getAuthors();
        setAuthors(data);
      } catch (error) {
        console.error("Failed to load authors:", error);
        toast.error("Failed to load authors.");
      } finally {
        setIsLoadingAuthors(false);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Failed to load categories.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  async function onSubmit(data: CreateBookFormData) {
    try {
      setIsSubmitting(true);

      const book: BookCreate = {
        title: data.title.trim(),
        isbn: data.isbn.trim(),
        authorId: data.authorId,
        categoryId: data.categoryId,
        publishedDate: data.publishedDate,
        quantity: data.quantity,
      };

      await createBook(book);

      toast.success("Book added successfully");

      reset();
      onSuccess();
    } catch (error) {
      console.error("Failed to add book:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to add book",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        {/* Title */}
        <FormField label="Title" required error={errors.title?.message}>
          <Input
            id="book-title"
            placeholder="Enter book title..."
            {...register("title")}
          />
        </FormField>

        {/* ISBN */}
        <FormField label="ISBN" required error={errors.isbn?.message}>
          <Input
            id="book-isbn"
            placeholder="Enter ISBN..."
            {...register("isbn")}
          />
        </FormField>

        {/* Author */}
        <FormField label="Author" required error={errors.authorId?.message}>
          <select
            id="book-author"
            {...register("authorId", {
              valueAsNumber: true,
            })}
            disabled={isLoadingAuthors}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={0}>
              {isLoadingAuthors ? "Loading authors..." : "Select an author"}
            </option>

            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.firstName} {author.lastName}
              </option>
            ))}
          </select>
        </FormField>

        {/* Category */}
        <FormField label="Category" required error={errors.categoryId?.message}>
          <select
            id="book-category"
            {...register("categoryId", {
              valueAsNumber: true,
            })}
            disabled={isLoadingCategories}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={0}>
              {isLoadingCategories
                ? "Loading categories..."
                : "Select a category"}
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        {/* Published Date */}
        <FormField
          label="Published Date"
          required
          error={errors.publishedDate?.message}
        >
          <Input
            id="book-published-date"
            type="date"
            {...register("publishedDate")}
          />
        </FormField>

        {/* Quantity */}
        <FormField label="Quantity" required error={errors.quantity?.message}>
          <Input
            id="book-quantity"
            type="number"
            min={1}
            {...register("quantity", {
              valueAsNumber: true,
            })}
          />
        </FormField>
      </div>

      <FormSubmitButton isPending={isSubmitting} pendingText="Adding...">
        Add Book
      </FormSubmitButton>
    </form>
  );
}
