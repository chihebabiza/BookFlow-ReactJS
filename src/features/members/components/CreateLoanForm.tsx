import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { getBooks } from "@/features/books/api/books.api";
import { useBookCopies } from "@/features/book-copies/hooks/useBookCopies";
import { useCreateLoan } from "@/features/loans/hooks/useLoans";
import {
  createLoanSchema,
  type CreateLoanFormData,
} from "@/features/loans/schemas/loan.schema";
import type { LoanCreate } from "@/features/loans/types/loan.types";
import type { Member } from "@/features/members/types/member.types";
import type { Book } from "@/features/books/types/book.types";

type CreateLoanFormProps = {
  member: Member;
  onSuccess: () => void;
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function CreateLoanForm({ member, onSuccess }: CreateLoanFormProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);

  const createLoanMutation = useCreateLoan();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateLoanFormData>({
    resolver: zodResolver(createLoanSchema),
    defaultValues: {
      bookId: 0,
      bookCopyId: 0,
      borrowedDate: getToday(),
      period: 14,
    },
  });

  const bookId = watch("bookId");

  const { data: copies = [], isLoading: copiesLoading } = useBookCopies(bookId);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true);

        const data = await getBooks();

        setBooks(data);
      } catch (error) {
        console.error("Failed to load books:", error);

        toast.error(
          error instanceof Error ? error.message : "Failed to load books",
        );
      } finally {
        setBooksLoading(false);
      }
    };

    fetchBooks();
  }, []);

  async function onSubmit(data: CreateLoanFormData) {
    try {
      const loan: LoanCreate = {
        memberId: member.id,
        bookCopyId: data.bookCopyId,
        borrowedDate: data.borrowedDate,
        period: data.period,
      };

      await createLoanMutation.mutateAsync(loan);

      toast.success("Loan added successfully");

      reset({
        bookId: 0,
        bookCopyId: 0,
        borrowedDate: getToday(),
        period: 14,
      });

      onSuccess();
    } catch (error) {
      console.error("Failed to add loan:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to add loan",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div>
          <h2 className="text-xl font-semibold">Add Loan</h2>

          <p className="text-sm text-muted-foreground">
            Create a loan for {member.firstName} {member.lastName}.
          </p>
        </div>

        <FormField label="Book" required error={errors.bookId?.message}>
          <select
            {...register("bookId", {
              valueAsNumber: true,
            })}
            disabled={booksLoading}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={0}>
              {booksLoading ? "Loading books..." : "Select a book"}
            </option>

            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Copy Number"
          required
          error={errors.bookCopyId?.message}
        >
          <select
            disabled={bookId <= 0 || copiesLoading}
            {...register("bookCopyId", {
              valueAsNumber: true,
            })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value={0}>
              {copiesLoading ? "Loading copies..." : "Select a copy"}
            </option>

            {copies.map((copy) => (
              <option key={copy.id} value={copy.id}>
                BC-{copy.copyNumber}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Period (days)"
          required
          error={errors.period?.message}
        >
          <Input
            type="number"
            min={1}
            {...register("period", {
              valueAsNumber: true,
            })}
          />
        </FormField>

        <FormField
          label="Borrowed Date"
          required
          error={errors.borrowedDate?.message}
        >
          <Input type="date" {...register("borrowedDate")} />
        </FormField>
      </div>

      <FormSubmitButton
        isPending={createLoanMutation.isPending}
        pendingText="Adding..."
      >
        Add Loan
      </FormSubmitButton>
    </form>
  );
}
