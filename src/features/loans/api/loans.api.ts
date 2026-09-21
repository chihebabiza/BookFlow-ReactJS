import { api } from "@/lib/api";
import type {
  Loan,
  LoanCreate,
  LoanUpdate,
} from "@/features/loans/types/loan.types";

export const getLoansByMemberId = async (memberId: number): Promise<Loan[]> => {
  const response = await api.get<Loan[]>(`/Loan/member/${memberId}`);
  return response.data;
};

export const createLoan = async (loan: LoanCreate): Promise<number> => {
  const response = await api.post<number>("/Loan", loan);
  return response.data;
};

export const updateLoan = async (
  id: number,
  loan: LoanUpdate,
): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>(`/Loan/${id}`, loan);
  return response.data;
};
