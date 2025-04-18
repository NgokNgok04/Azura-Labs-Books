"use client";
import ActionDialog from "~/components/actionDialog";
import DataTable, { type Book } from "./data-table";
import { useState } from "react";

export default function Books() {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center sm:px-10">
      <ActionDialog
        type="edit"
        open={openEdit}
        setOpen={setOpenEdit}
        book={selectedBook}
        setRefreshKey={setRefreshKey}
        refreshKey={refreshKey}
      />
      <ActionDialog
        type="delete"
        open={openDelete}
        setOpen={setOpenDelete}
        setRefreshKey={setRefreshKey}
        refreshKey={refreshKey}
      />
      <DataTable
        key={refreshKey}
        setOpenEdit={setOpenEdit}
        setOpenDelete={setOpenDelete}
        setSelectedBook={setSelectedBook}
      />
    </div>
  );
}
