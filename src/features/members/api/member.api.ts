import type { Member, MemberCreate, MemberUpdate } from "../types/member.types";
import { api } from "@/lib/api";

export const getMembers = async (): Promise<Member[]> => {
  const response = await api.get<Member[]>("/Member");
  return response.data;
};

export const getMemberById = async (id: number): Promise<Member> => {
  const response = await api.get<Member>(`/Member/${id}`);
  return response.data;
};

export const createMember = async (member: MemberCreate): Promise<Member> => {
  const response = await api.post<Member>("/Member", member);
  return response.data;
};

export const updateMember = async (
  id: number,
  member: MemberUpdate,
): Promise<Member> => {
  const response = await api.put<Member>(`/Member/${id}`, member);
  return response.data;
};

export const deleteMember = async (id: number): Promise<void> => {
  await api.delete(`/Member/${id}`);
};
