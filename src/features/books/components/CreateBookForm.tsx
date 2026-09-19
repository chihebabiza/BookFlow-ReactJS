import { useEffect, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { getAuthors } from "@/features/authors/api/authors.api";
import { getCategories } from "@/features/categories/api/categories.api";
import { createBook } from "@/features/books/api/books.api";
import type { BookCreate } from "@/features/books/types/book.types";
import type { Author } from "@/features/authors/types/author.types";
import type { Category } from "@/features/categories/types/category.types";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";

interface CreateBookFormProps {
  onSuccess: () => void;
}

type FormData = {
  title: string;
  isbn: string;
  authorId: number;
  categoryId: number;
  publishedDate: string;
  quantity: number;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  title: "",
  isbn: "",
  authorId: 0,
  categoryId: 0,
  publishedDate: "",
  quantity: 1,
};

export function CreateBookForm({ onSuccess }: CreateBookFormProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoadingAuthors, setIsLoadingAuthors] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

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

  function handleChange(field: keyof FormData, value: string | number) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN is required.";
    }

    if (formData.authorId <= 0) {
      newErrors.authorId = "Please select an author.";
    }

    if (formData.categoryId <= 0) {
      newErrors.categoryId = "Please select a category.";
    }

    if (!formData.publishedDate) {
      newErrors.publishedDate = "Published date is required.";
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const book: BookCreate = {
        title: formData.title.trim(),
        isbn: formData.isbn.trim(),
        authorId: formData.authorId,
        categoryId: formData.categoryId,
        publishedDate: formData.publishedDate,
        quantity: formData.quantity,
      };

      await createBook(book);

      toast.success("Book added successfully");

      setFormData(initialFormData);
      setErrors({});

      onSuccess();
    } catch (error) {
      console.error("Failed to add book:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to add book.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        {/* Title */}
        <FormField label="Title" required error={errors.title}>
          <Input
            id="book-title"
            placeholder="Enter book title..."
            value={formData.title}
            onChange={(event) => handleChange("title", event.target.value)}
          />
        </FormField>

        {/* ISBN */}
        <FormField label="ISBN" required error={errors.isbn}>
          <Input
            id="book-isbn"
            placeholder="Enter ISBN..."
            value={formData.isbn}
            onChange={(event) => handleChange("isbn", event.target.value)}
          />
        </FormField>

        {/* Author */}
        <FormField label="Author" required error={errors.authorId}>
          <select
            id="book-author"
            value={formData.authorId}
            onChange={(event) =>
              handleChange("authorId", Number(event.target.value))
            }
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
        <FormField label="Category" required error={errors.categoryId}>
          <select
            id="book-category"
            value={formData.categoryId}
            onChange={(event) =>
              handleChange("categoryId", Number(event.target.value))
            }
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
        <FormField label="Published Date" required error={errors.publishedDate}>
          <Input
            id="book-published-date"
            type="date"
            value={formData.publishedDate}
            onChange={(event) =>
              handleChange("publishedDate", event.target.value)
            }
          />
        </FormField>

        {/* Quantity */}
        <FormField label="Quantity" required error={errors.quantity}>
          <Input
            id="book-quantity"
            type="number"
            min={1}
            value={formData.quantity}
            onChange={(event) =>
              handleChange("quantity", Number(event.target.value))
            }
          />
        </FormField>
      </div>

      <FormSubmitButton isPending={isSubmitting} pendingText="Adding...">
        Add Book
      </FormSubmitButton>
    </form>
  );
}
