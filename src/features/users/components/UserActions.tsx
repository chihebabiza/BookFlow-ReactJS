"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ActionButtons } from "@/components/common/ActionButtons";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FormSheet } from "@/components/common/FormSheet";
import { deleteUser } from "@/features/users/api/users.api";
import type { User } from "@/features/users/types/user.types";
import { EditUserForm } from "./EditUserForm";

export function UserActions({
  user,
  onRefresh,
}: {
  user: User;
  onRefresh: () => void;
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteUser(user.id);
      toast.success("User deleted successfully");
      setDeleteOpen(false);
      onRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <ActionButtons
        actions={[
          {
            label: "Edit user",
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => setEditOpen(true),
            className: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
          },
          {
            label: "Delete user",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => setDeleteOpen(true),
            destructive: true,
            className: "text-red-600 hover:bg-red-50 hover:text-red-700",
          },
        ]}
      />
      <FormSheet open={editOpen} onOpenChange={setEditOpen}>
        <EditUserForm
          user={user}
          onSuccess={() => {
            setEditOpen(false);
            onRefresh();
          }}
        />
      </FormSheet>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        isPending={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
