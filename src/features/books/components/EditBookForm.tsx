import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getAuthors } from "@/features/authors/api/authors.api";
import { getCategories } from "@/features/categories/api/categories.api";
import { updateBook } from "@/features/books/api/books.api";
import type { Author } from "@/features/authors/types/author.types";
import type { Category } from "@/features/categories/types/category.types";
import type { Book, BookUpdate } from "@/features/books/types/book.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { editBookSchema, type EditBookFormData } from "../schemas/book.schema";

interface EditBookFormProps {
  book: Book;
  onSuccess: () => void;
}

export function EditBookForm({ book, onSuccess }: EditBookFormProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoadingAuthors, setIsLoadingAuthors] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditBookFormData>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      title: book.title,
      isbn: book.isbn,
      authorId: book.author.id,
      categoryId: book.category.id,
      publishedDate: book.publishedDate
        ? book.publishedDate.substring(0, 10)
        : "",
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

  async function onSubmit(data: EditBookFormData) {
    try {
      setIsSubmitting(true);

      const bookData: BookUpdate = {
        title: data.title.trim(),
        isbn: data.isbn.trim(),
        authorId: data.authorId,
        categoryId: data.categoryId,
        publishedDate: data.publishedDate || null,
      };

      await updateBook(book.id, bookData);

      toast.success("Book updated successfully");

      onSuccess();
    } catch (error) {
      console.error("Failed to update book:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to update book",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div>
          <h2 className="text-xl font-semibold">Edit Book</h2>

          <p className="text-sm text-muted-foreground">
            Update the book information.
          </p>
        </div>

        <FormField label="Title" required error={errors.title?.message}>
          <Input
            id="book-title"
            placeholder="Enter book title..."
            {...register("title")}
          />
        </FormField>

        <FormField label="ISBN" required error={errors.isbn?.message}>
          <Input
            id="book-isbn"
            placeholder="Enter ISBN..."
            {...register("isbn")}
          />
        </FormField>

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
      </div>

      <FormSubmitButton
        isPending={isSubmitting}
        disabled={isSubmitting || !isDirty}
        pendingText="Updating..."
      >
        Update Book
      </FormSubmitButton>
    </form>
  );
}
