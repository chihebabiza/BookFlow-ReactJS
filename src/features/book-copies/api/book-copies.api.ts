import type { BookCopy } from "../types/book-copy.types";
import { api } from "@/lib/api";

export const getBookCopyById = async (id: number): Promise<BookCopy[]> => {
  const response = await api.get<BookCopy[]>(`/BookCopy/${id}`);
  return response.data;
};
