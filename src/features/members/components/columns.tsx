import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { MemberActions } from "@/features/members/components/MemberActions";
import type { Member } from "../types/member.types";

export const columns = (onRefresh: () => void): ColumnDef<Member>[] => [
  {
    id: "firstName",
    accessorFn: (row) => row.user.firstName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.user.firstName}</div>
    ),
  },
  {
    id: "lastName",
    accessorFn: (row) => row.user.lastName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.user.lastName}</div>
    ),
  },
  {
    id: "email",
    accessorFn: (row) => row.user.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.user.email}</div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const value = row.original.user.createdAt;

      if (!value) {
        return "-";
      }

      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(value));
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => {
      return row.original.user.isActive ? "Yes" : "No";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <MemberActions member={row.original} onRefresh={onRefresh} />
    ),
  },
];
