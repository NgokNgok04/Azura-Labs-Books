"use client";
import ActionDialog from "~/components/actionDialog";
import DataTable, { type Book } from "./data-table";
import { useEffect, useState } from "react";
import CategoryDialog from "~/components/categoryDialog";

export default function Books() {
  const [openEditBook, setOpenEditBook] = useState(false);
  const [openDeleteBook, setOpenDeleteBook] = useState(false);
  const [openCreateBook, setOpenCreateBook] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<() => void>(() => {
    console.log();
  });
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center sm:px-10">
      <button onClick={() => setOpenCategory(true)}>open</button>
      <CategoryDialog
        open={openCategory}
        setOpen={setOpenCategory}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
      />
      <ActionDialog
        type="edit"
        open={openEditBook}
        setOpen={setOpenEditBook}
        book={selectedBook}
        setRefreshKey={setRefreshKey}
        refreshKey={refreshKey}
      />
      <ActionDialog
        type="delete"
        open={openDeleteBook}
        setOpen={setOpenDeleteBook}
        book={selectedBook}
        setRefreshKey={setRefreshKey}
        refreshKey={refreshKey}
      />
      <ActionDialog
        type="create"
        open={openCreateBook}
        setOpen={setOpenCreateBook}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
      />
      <h1 className="w-full text-4xl font-bold">Welcome to Books!</h1>
      <div className="hidden w-full lg:flex">
        <DataTable
          key={refreshKey}
          setOpenEditBook={setOpenEditBook}
          setOpenDeleteBook={setOpenDeleteBook}
          setOpenCreateBook={setOpenCreateBook}
          setSelectedBook={setSelectedBook}
          onRegisterRefetch={setRefetchTrigger}
        />
      </div>
    </div>
  );
}
