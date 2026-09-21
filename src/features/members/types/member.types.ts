import type { UserCreate } from "@/features/users/types/user.types";

export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
};

export type MemberCreate = UserCreate;

export type MemberUpdate = {
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
};
