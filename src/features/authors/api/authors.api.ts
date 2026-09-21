import type { Author, AuthorCreate, AuthorUpdate } from "../types/author.types";
import { api } from "@/lib/api";

export const getAuthors = async (): Promise<Author[]> => {
  const response = await api.get<Author[]>("/Author");
  return response.data;
};

export const createAuthor = async (author: AuthorCreate): Promise<Author> => {
  const response = await api.post<Author>("/Author", author);
  return response.data;
};

export const updateAuthor = async (
  id: number,
  author: AuthorUpdate,
): Promise<Author> => {
  const response = await api.put<Author>(`/Author/${id}`, author);
  return response.data;
};

export const deleteAuthor = async (id: number): Promise<void> => {
  await api.delete(`/Author/${id}`);
};

export const authorsApi = {
  getAll: async () => (await api.get<Author[]>("/Author")).data,

  getById: async (id: number) => (await api.get<Author>(`/Author/${id}`)).data,

  create: async (author: AuthorCreate) =>
    (await api.post<Author>("/Author", author)).data,

  update: async (id: number, author: AuthorUpdate) =>
    (await api.put<Author>(`/Author/${id}`, author)).data,

  delete: async (id: number) => {
    await api.delete(`/Author/${id}`);
  },
};
