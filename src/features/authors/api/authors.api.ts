import { apiClient } from "@/lib/api-client";
import type { Author, AuthorCreate, AuthorUpdate } from "../types/author.types";
import { api } from "@/lib/api";

export const getAuthors = async (): Promise<Author[]> => {
  const response = await api.get<Author[]>("/Author");
  return response.data;
};

export const authorsApi = {
  getAll: () => apiClient<Author[]>("/Author"),

  getById: (id: number) => apiClient<Author>(`/Author/${id}`),

  create: (author: AuthorCreate) =>
    apiClient<number>("/Author", {
      method: "POST",
      body: JSON.stringify(author),
    }),

  update: (id: number, author: AuthorUpdate) =>
    apiClient<{ message: string }>(`/Author/${id}`, {
      method: "PUT",
      body: JSON.stringify(author),
    }),

  delete: (id: number) =>
    apiClient<void>(`/Author/${id}`, {
      method: "DELETE",
    }),
};
