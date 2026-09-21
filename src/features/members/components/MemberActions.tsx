"use client";

import * as React from "react";
import { BookPlus, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { ActionButtons } from "@/components/common/ActionButtons";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FormSheet } from "@/components/common/FormSheet";
import { deleteUser } from "@/features/users/api/users.api";
import type { Member } from "@/features/members/types/member.types";
import { CreateLoanForm } from "./CreateLoanForm";
import { EditMemberForm } from "./EditMemberForm";

type MemberActionsProps = {
  member: Member;
  onRefresh: () => void;
};

export function MemberActions({ member, onRefresh }: MemberActionsProps) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [loanOpen, setLoanOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteUser(member.user.id);
      toast.success("Member deleted successfully");
      setDeleteOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete member:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete member",
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
            label: "See member loans",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => navigate(`/members/${member.id}/loans`),
            className:
              "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700",
          },
          {
            label: "Add loan for member",
            icon: <BookPlus className="h-4 w-4" />,
            onClick: () => setLoanOpen(true),
            className: "text-green-600 hover:bg-green-50 hover:text-green-700",
          },
          {
            label: "Edit member",
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => setEditOpen(true),
            className: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
          },
          {
            label: "Delete member",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => setDeleteOpen(true),
            destructive: true,
            className: "text-red-600 hover:bg-red-50 hover:text-red-700",
          },
        ]}
      />
      <FormSheet open={editOpen} onOpenChange={setEditOpen}>
        <EditMemberForm
          member={member}
          onSuccess={() => {
            setEditOpen(false);
            onRefresh();
          }}
        />
      </FormSheet>
      <FormSheet open={loanOpen} onOpenChange={setLoanOpen}>
        <CreateLoanForm member={member} onSuccess={() => setLoanOpen(false)} />
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
