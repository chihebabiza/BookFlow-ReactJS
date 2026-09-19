import type {
  Book,
  BookCreate,
  BookUpdate,
} from "@/features/books/types/book.types";
import { api } from "@/lib/api";

export const getBooks = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>("/Book");
  return response.data;
};

export const getBookById = async (id: number): Promise<Book> => {
  const response = await api.get<Book>(`/Book/${id}`);
  return response.data;
};

export const createBook = async (book: BookCreate): Promise<Book> => {
  const response = await api.post<Book>("/Book", book);
  return response.data;
};

export const updateBook = async (
  id: number,
  book: BookUpdate,
): Promise<Book> => {
  const response = await api.put<Book>(`/Book/${id}`, book);
  return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/Book/${id}`);
};
