/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import * as React from "react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import { DateRangePicker } from "~/components/ui/date-picker-range";
import { type DateRange } from "react-day-picker";
import type { Category } from "@prisma/client";
export type Book = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publicationDate: Date;
  categoryId: number;
};

interface DataTableProps {
  setOpenEditBook: (open: boolean) => void;
  setOpenDeleteBook: (open: boolean) => void;
  setOpenCreateBook: (open: boolean) => void;
  setSelectedBook: (book: Book) => void;
  onRegisterRefetch: (refetchFn: () => void) => void;
}

export default function DataTable({
  setOpenEditBook,
  setOpenDeleteBook,
  setOpenCreateBook,
  setSelectedBook,
  onRegisterRefetch,
}: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const { data: fetchBook, refetch } = api.book.getAllBooks.useQuery({});
  const { data: categories } = api.category.getCategories.useQuery();
  useEffect(() => {
    onRegisterRefetch(refetch);
  }, [refetch, onRegisterRefetch]);

  const columns: ColumnDef<Book>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            className="p-0"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            className="p-0"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("author")}</div>
      ),
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => {
        const category = categories?.find(
          (cat) => cat.id === row.getValue("categoryId"),
        );
        return <div>{category?.name ?? "Unknown"}</div>;
      },
      filterFn: (row, columnId, filterValue) => {
        if (!Array.isArray(filterValue) || filterValue.length === 0)
          return true;
        return filterValue.includes(String(row.getValue(columnId)));
      },
    },
    {
      accessorKey: "publisher",
      header: "Publisher",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("publisher")}</div>
      ),
    },
    {
      accessorKey: "publicationDate",
      header: "Publication Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("publicationDate"));
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return <div>{formattedDate}</div>;
      },
      filterFn: (row, columnId, filterValue) => {
        const rowDate = new Date(row.getValue(columnId));
        const from = filterValue?.from;
        const to = filterValue?.to;

        if (from && to) {
          return rowDate >= from && rowDate <= to;
        }
        if (from) return rowDate >= from;
        if (to) return rowDate <= to;
        return true;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="noShadow" className="size-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#e0ecfc]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="bg-[#e0ecfc]"
                  onClick={() => {
                    setSelectedBook(book);
                    setOpenEditBook(true);
                  }}
                >
                  <div className="flex gap-2">
                    <Pencil />
                    <span>Edit Book</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="bg-[#e0ecfc]"
                  onClick={() => {
                    setSelectedBook(book);
                    setOpenDeleteBook(true);
                  }}
                >
                  <div className="flex gap-2">
                    <Trash2 />
                    <button onClick={() => setOpenDeleteBook(true)}>
                      Delete Book
                    </button>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const sortedBooks = React.useMemo(() => {
    return (fetchBook ?? [])
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [fetchBook]);

  const table = useReactTable({
    data: sortedBooks,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const { title, author, publisher } = row.original;
      return [title, author, publisher].some((field) =>
        field.toLowerCase().includes(filterValue.toLowerCase()),
      );
    },
  });
  useEffect(() => {
    const categoryIds = selectedCategories.map((cat) => String(cat.id));
    table.getColumn("categoryId")?.setFilterValue(categoryIds);
  }, [selectedCategories, table]);

  useEffect(() => {
    table.getColumn("publicationDate")?.setFilterValue(date);
  }, [date, table]);

  return (
    <div className="font-base text-main-foreground w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search title, author, publisher..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-[250px]"
          />
          <DateRangePicker date={date} setDate={setDate} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#5894fc]">Filter Categories</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 bg-[#e0ecfc]">
              <DropdownMenuLabel className="flex items-center justify-between">
                List Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories?.map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  onSelect={(e) => e.preventDefault()}
                  asChild
                  className="bg-[#e0ecfc]"
                >
                  <label className="flex cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={(checked) => {
                        setSelectedCategories((prev) =>
                          checked
                            ? [...prev, cat]
                            : prev.filter((catid) => catid.id !== cat.id),
                        );
                      }}
                    />
                    {cat.name}
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex w-[210px] justify-between">
          <Button className="bg-[#ff4d50]">
            <Trash2 />
          </Button>
          <Button onClick={() => setOpenCreateBook(true)}>
            Create New Book
          </Button>
        </div>
      </div>
      <div>
        <Table
          key={JSON.stringify(sortedBooks.map((b) => b.id))}
          className="border-2"
        >
          <TableHeader className="font-heading">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-secondary-background text-foreground"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-foreground border-2 bg-[#5894fc] p-0 text-center"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="text-foreground data-[state=selected]:bg-main data-[state=selected]:text-main-foreground"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-2 py-2" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="noShadow"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="noShadow"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
