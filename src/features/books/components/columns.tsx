import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import { BookActions } from "@/features/books/components/BookActions";
import type { Book } from "@/features/books/types/book.types";

export const columns = (onRefresh: () => void): ColumnDef<Book>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },

  {
    accessorKey: "isbn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ISBN" />
    ),
  },

  {
    id: "author",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => {
      const author = row.original.author;

      return (
        <div>
          {author.firstName} {author.lastName}
        </div>
      );
    },
  },

  {
    id: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.category.name}</div>;
    },
  },

  {
    accessorKey: "publishedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("publishedDate") as string | null;

      if (!value) {
        return "-";
      }

      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(value));
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;

      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(value));
    },
  },

  {
    accessorKey: "availableCopies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available Copies" />
    ),
  },
  {
    accessorKey: "totalCopies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Copies" />
    ),
  },
  {
    accessorKey: "borrowedCopies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Borrowed Copies" />
    ),
  },
  {
    accessorKey: "damagedCopies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Damaged Copies" />
    ),
  },
  {
    accessorKey: "lostCopies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lost Copies" />
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <BookActions book={row.original} onRefresh={onRefresh} />;
    },
  },
];
