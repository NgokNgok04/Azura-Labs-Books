"use client";
import ActionDialog from "~/components/actionDialog";
import DataTable from "./data-table";
import { useState } from "react";

export default function Books() {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center sm:px-10">
      <ActionDialog type="edit" open={openEdit} setOpen={setOpenEdit} />
      <ActionDialog type="delete" open={openDelete} setOpen={setOpenDelete} />
      <DataTable setOpenEdit={setOpenEdit} setOpenDelete={setOpenDelete} />
    </div>
  );
}
