import type { User, UserCreate, UserUpdate } from "../types/user.types";
import { api } from "@/lib/api";

export const getUsers = async (): Promise<User[]> =>
  (await api.get<User[]>("/User")).data;
export const createUser = async (user: UserCreate): Promise<User> =>
  (await api.post<User>("/User", user)).data;
export const updateUser = async (id: number, user: UserUpdate): Promise<User> =>
  (await api.put<User>(`/User/${id}`, user)).data;
export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/User/${id}`);
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => (await api.post<{ token: string }>("/User/login", credentials)).data;
