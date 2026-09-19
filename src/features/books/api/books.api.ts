import type {
  Book,
  BookCreate,
  BookUpdate,
} from "@/features/books/types/book.types";
import { api } from "@/lib/api";
import { apiClient } from "@/lib/api-client";

export const getBooks = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>("/Book");
  return response.data;
};

export const booksApi = {
  getAll: () => apiClient<Book[]>("/Book"),

  getById: (id: number) => apiClient<Book>(`/Book/${id}`),

  create: (book: BookCreate) =>
    apiClient<number>("/Book", {
      method: "POST",
      body: JSON.stringify(book),
    }),

  update: (id: number, book: BookUpdate) =>
    apiClient<{ message: string }>(`/Book/${id}`, {
      method: "PUT",
      body: JSON.stringify(book),
    }),

  delete: (id: number) =>
    apiClient<void>(`/Book/${id}`, {
      method: "DELETE",
    }),
};
