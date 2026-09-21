import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/features/books/types/book.types";
import { deleteBook } from "@/features/books/api/books.api";
import { EditBookForm } from "./EditBookForm";
import { ActionButtons } from "@/components/common/ActionButtons";
import { FormSheet } from "@/components/common/FormSheet";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { isAdmin, isLibrarian } from "@/features/auth/utils/auth.utils";

type BookActionsProps = {
  book: Book;
  onRefresh: () => void;
};

export function BookActions({ book, onRefresh }: BookActionsProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isAdminUser = isAdmin();
  const isLibrarianUser = isLibrarian();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deleteBook(book.id);

      toast.success("Book deleted successfully");
      setDeleteOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete book:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete book",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const actions = [];

  if (isAdminUser || isLibrarianUser) {
    actions.push({
      label: "Edit book",
      icon: <Pencil className="h-4 w-4" />,
      onClick: () => setEditOpen(true),
      className: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
    });
  }

  if (isAdminUser) {
    actions.push({
      label: "Delete book",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => setDeleteOpen(true),
      destructive: true,
      className: "text-red-600 hover:bg-red-50 hover:text-red-700",
    });
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      <ActionButtons actions={actions} />

      {(isAdminUser || isLibrarianUser) && (
        <FormSheet open={editOpen} onOpenChange={setEditOpen}>
          <EditBookForm
            book={book}
            onSuccess={() => {
              setEditOpen(false);
              onRefresh();
            }}
          />
        </FormSheet>
      )}

      {isAdminUser && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          isPending={isDeleting}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
