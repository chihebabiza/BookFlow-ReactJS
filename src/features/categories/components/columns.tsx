import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { CategoryActions } from "@/features/categories/components/CategoryActions";
import type { Category } from "../types/category.types";

export const columns = (onRefresh: () => void): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string | null;

      if (!value) {
        return "-";
      }

      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(value));
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <CategoryActions category={row.original} onRefresh={onRefresh} />
    ),
  },
];
