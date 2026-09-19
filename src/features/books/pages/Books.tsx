import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/DataTable";
import { FormSheet } from "@/components/common/FormSheet";
import { Button } from "@/components/ui/button";
import { columns } from "@/features/books/components/columns";
import { CreateBookForm } from "@/features/books/components/CreateBookForm";
import { getBooks } from "@/features/books/api/books.api";
import type { Book } from "../types/book.types";
import { isAdmin, isLibrarian } from "@/features/auth/utils/auth.utils";

export function Books() {
  const [addOpen, setAddOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdminUser = isAdmin();
  const isLibrarianUser = isLibrarian();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const data = await getBooks();
        setBooks(data);
      } catch (error) {
        console.error("Failed to load books:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load books.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (isLoading) {
    return <div>Loading books...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Books</h1>

          <p className="text-muted-foreground">
            Manage and organize your library books.
          </p>
        </div>
        {isAdminUser ||
          (isLibrarianUser && (
            <Button onClick={() => setAddOpen(true)}>Add Book</Button>
          ))}
      </div>

      <FormSheet open={addOpen} onOpenChange={setAddOpen}>
        <CreateBookForm onSuccess={() => setAddOpen(false)} />
      </FormSheet>

      <DataTable columns={columns} data={books} />
    </div>
  );
}
