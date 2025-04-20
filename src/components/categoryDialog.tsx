import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

interface CategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefreshKey: (value: number) => void;
  refreshKey: number;
}

const categorySchema = z
  .object({
    action: z.enum(["add", "edit", "delete"]),
    categoryId: z.string().optional(),
    name: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.action !== "add") {
        return !!data.categoryId;
      }
      return true;
    },
    { message: "Please select a category", path: ["categoryId"] },
  )
  .refine(
    (data) => {
      if (data.action === "add" || data.action === "edit") {
        return !!data.name;
      }
      return true;
    },
    { message: "Name is required", path: ["name"] },
  );

export default function CategoryDialog({
  open,
  setOpen,
  refreshKey,
  setRefreshKey,
}: CategoryDialogProps) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      action: "add",
      categoryId: "",
      name: "",
    },
  });

  const action = form.watch("action");
  const categories = api.category.getCategories.useQuery();
  const createCategory = api.category.createCategory.useMutation();
  const deleteCategory = api.category.deleteCategory.useMutation();
  const editCategory = api.category.editCategory.useMutation();

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    console.log("submit data", data);
    if (data.action === "add" && data.name) {
      createCategory.mutate(
        { name: data.name },
        {
          onSuccess: () => {
            setOpen(false);
            setRefreshKey(refreshKey + 1);
            form.reset();
          },
        },
      );
    } else if (data.action === "edit" && data.categoryId) {
      editCategory.mutate(
        {
          id: Number(data.categoryId),
          name: data.name,
        },
        {
          onSuccess: () => {
            setOpen(false);
            setRefreshKey(refreshKey + 1);
            form.reset();
          },
        },
      );
    } else if (data.action === "delete" && data.categoryId) {
      deleteCategory.mutate(
        { id: Number(data.categoryId) },
        {
          onSuccess: () => {
            setOpen(false);
            setRefreshKey(refreshKey + 1);
            form.reset();
          },
        },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Category Settings</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[200px] bg-[#e0ecfc]">
                        <SelectValue placeholder="Select an action" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#e0ecfc]">
                      <SelectItem value="add">Add</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(action === "edit" || action === "delete") && (
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[200px] bg-[#e0ecfc]">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#e0ecfc]">
                        {!categories.data?.length && (
                          <div className="px-2">No Category available</div>
                        )}
                        {categories.data?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                            className="bg-[#e0ecfc]"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(action === "add" || action === "edit") && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="flex w-full flex-row">
              <DialogClose asChild>
                <Button
                  variant="neutral"
                  type="button"
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                {action === "add" && "Add Category"}
                {action === "edit" && "Edit Category"}
                {action === "delete" && "Delete Category"}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
