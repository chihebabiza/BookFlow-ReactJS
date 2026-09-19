"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ActionButtons } from "@/components/common/ActionButtons";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FormSheet } from "@/components/common/FormSheet";
import { deleteAuthor } from "@/features/authors/api/authors.api";
import { isAdmin, isLibrarian } from "@/features/auth/utils/auth.utils";
import type { Author } from "@/features/authors/types/author.types";
import { EditAuthorForm } from "./EditAuthorForm";

type AuthorActionsProps = {
  author: Author;
};

export function AuthorActions({ author }: AuthorActionsProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const isAdminUser = isAdmin();
  const isLibrarianUser = isLibrarian();

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteAuthor(author.id);
      toast.success("Author deleted successfully");
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete author:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete author",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const actions = [];
  if (isAdminUser || isLibrarianUser) {
    actions.push({
      label: "Edit author",
      icon: <Pencil className="h-4 w-4" />,
      onClick: () => setEditOpen(true),
      className: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
    });
  }
  if (isAdminUser) {
    actions.push({
      label: "Delete author",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => setDeleteOpen(true),
      destructive: true,
      className: "text-red-600 hover:bg-red-50 hover:text-red-700",
    });
  }
  if (actions.length === 0) return null;

  return (
    <>
      <ActionButtons actions={actions} />
      {(isAdminUser || isLibrarianUser) && (
        <FormSheet open={editOpen} onOpenChange={setEditOpen}>
          <EditAuthorForm
            author={author}
            onSuccess={() => setEditOpen(false)}
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
