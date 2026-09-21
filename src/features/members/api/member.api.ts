import type { Member } from "../types/member.types";
import { api } from "@/lib/api";

export const getMembers = async (): Promise<Member[]> => {
  const response = await api.get<Member[]>("/Member");
  return response.data;
};

export const getMemberById = async (id: number): Promise<Member> => {
  const response = await api.get<Member>(`/Member/${id}`);
  return response.data;
};
