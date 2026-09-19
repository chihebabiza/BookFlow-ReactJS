import type {
  Category,
  CategoryCreate,
  CategoryUpdate,
} from "../types/category.types";
import { api } from "@/lib/api";

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/Category");
  return response.data;
};

export const createCategory = async (category: CategoryCreate): Promise<Category> => {
  const response = await api.post<Category>("/Category", category);
  return response.data;
};

export const updateCategory = async (
  id: number,
  category: CategoryUpdate,
): Promise<Category> => {
  const response = await api.put<Category>(`/Category/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/Category/${id}`);
};

