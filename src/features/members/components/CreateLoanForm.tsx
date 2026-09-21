import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { getBooks } from "@/features/books/api/books.api";
import { createLoan } from "@/features/loans/api/loans.api";
import type { Book } from "@/features/books/types/book.types";
import type { BookCopy } from "@/features/book-copies/types/book-copy.types";
import type { Member } from "@/features/members/types/member.types";
import { getBookCopyById } from "@/features/book-copies/api/book-copies.api";

type Props = { member: Member; onSuccess: () => void };
type FormData = {
  bookId: number;
  bookCopyId: number;
  borrowedDate: string;
  period: number;
};
type Errors = Partial<Record<keyof FormData, string>>;
const today = () => new Date().toISOString().slice(0, 10);

export function CreateLoanForm({ member, onSuccess }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [copies, setCopies] = useState<BookCopy[]>([]);
  const [formData, setFormData] = useState<FormData>({
    bookId: 0,
    bookCopyId: 0,
    borrowedDate: today(),
    period: 14,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [booksLoading, setBooksLoading] = useState(true);
  const [copiesLoading, setCopiesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => toast.error("Failed to load books."))
      .finally(() => setBooksLoading(false));
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!formData.bookId) {
        setCopies([]);
        return;
      }
      setCopiesLoading(true);
      getBookCopyById(formData.bookId)
        .then(setCopies)
        .catch(() => toast.error("Failed to load copies."))
        .finally(() => setCopiesLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [formData.bookId]);
  const handleChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Errors = {};
    if (!formData.bookId) nextErrors.bookId = "Please select a book.";
    if (!formData.bookCopyId) nextErrors.bookCopyId = "Please select a copy.";
    if (formData.period < 1) nextErrors.period = "Period must be at least 1.";
    if (!formData.borrowedDate)
      nextErrors.borrowedDate = "Borrowed date is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setIsSubmitting(true);
      await createLoan({
        memberId: member.id,
        bookCopyId: formData.bookCopyId,
        borrowedDate: formData.borrowedDate,
        period: formData.period,
      });
      toast.success("Loan added successfully");
      setFormData({
        bookId: 0,
        bookCopyId: 0,
        borrowedDate: today(),
        period: 14,
      });
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add loan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div>
          <h2 className="text-xl font-semibold">Add Loan</h2>
          <p className="text-sm text-muted-foreground">
            Create a loan for {member.user.firstName} {member.user.lastName}.
          </p>
        </div>
        <FormField label="Book" required error={errors.bookId}>
          <select
            value={formData.bookId}
            onChange={(e) => handleChange("bookId", Number(e.target.value))}
            disabled={booksLoading}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
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
        <FormField label="Copy Number" required error={errors.bookCopyId}>
          <select
            value={formData.bookCopyId}
            onChange={(e) => handleChange("bookCopyId", Number(e.target.value))}
            disabled={!formData.bookId || copiesLoading}
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
        <FormField label="Period (days)" required error={errors.period}>
          <Input
            type="number"
            min={1}
            value={formData.period}
            onChange={(e) => handleChange("period", Number(e.target.value))}
          />
        </FormField>
        <FormField label="Borrowed Date" required error={errors.borrowedDate}>
          <Input
            type="date"
            value={formData.borrowedDate}
            onChange={(e) => handleChange("borrowedDate", e.target.value)}
          />
        </FormField>
      </div>
      <FormSubmitButton isPending={isSubmitting} pendingText="Adding...">
        Add Loan
      </FormSubmitButton>
    </form>
  );
}
