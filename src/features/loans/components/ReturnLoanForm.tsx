import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { updateLoan } from "@/features/loans/api/loans.api";
import type { Loan } from "@/features/loans/types/loan.types";

type ReturnLoanFormProps = {
  loan: Loan;
  onSuccess: () => void;
};

type ReturnLoanFormData = {
  returnedDate: string;
};

export function ReturnLoanForm({ loan, onSuccess }: ReturnLoanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<ReturnLoanFormData>({
    defaultValues: {
      returnedDate: new Date().toISOString().slice(0, 10),
    },
  });

  async function onSubmit(data: ReturnLoanFormData) {
    try {
      setIsSubmitting(true);
      await updateLoan(loan.id, { returnedDate: data.returnedDate });
      toast.success("Book returned successfully");
      onSuccess();
    } catch (error) {
      console.error("Failed to return book:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to return book",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div>
          <h2 className="text-xl font-semibold">Return Book</h2>
          <p className="text-sm text-muted-foreground">
            Confirm the date this book was returned.
          </p>
        </div>
        <FormField label="Returned Date" required>
          <Input
            type="date"
            {...register("returnedDate", { required: true })}
          />
        </FormField>
      </div>
      <FormSubmitButton isPending={isSubmitting} pendingText="Returning...">
        Return Book
      </FormSubmitButton>
    </form>
  );
}
