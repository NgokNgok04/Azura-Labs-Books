import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { api } from "~/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Book } from "~/app/books/data-table";
import { useEffect } from "react";

interface actionProps {
  type: "edit" | "delete" | "create";
  open: boolean;
  book?: Book | null;
  setOpen: (open: boolean) => void;
  setRefreshKey: (value: number) => void;
  refreshKey: number;
}

const bookSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  author: z.string().min(1, {
    message: "Author is required",
  }),
  publisher: z.string().min(1, {
    message: "Publisher is required",
  }),
  publicationDate: z
    .string()
    .min(1, { message: "Publication date is required" }),
  category: z.string().min(1, {
    message: "Category is required",
  }),
});
export default function ActionDialog({
  type,
  open,
  setOpen,
  book,
  setRefreshKey,
  refreshKey,
}: actionProps) {
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      publisher: "",
      publicationDate: "",
      category: "",
    },
  });

  useEffect(() => {
    if (type === "edit" && book) {
      form.reset({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publicationDate: book.publicationDate.toISOString().split("T")[0],
        category: String(book.categoryId),
      });
    }
  }, [book, type, form]);

  const categories = api.book.getCategories.useQuery();
  const updateBook = api.book.editBook.useMutation();
  const createBook = api.book.createBook.useMutation();
  const onSubmit = (data: z.infer<typeof bookSchema>) => {
    console.log("Submited:", data);
    if (type === "edit") {
      updateBook.mutate(
        {
          id: book?.id ?? 0,
          author: data.author,
          title: data.title,
          publisher: data.publisher,
          publicationDate: new Date(data.publicationDate),
          categoryId: Number(data.category),
        },
        {
          onSuccess: () => {
            setRefreshKey(refreshKey + 1);
            form.reset();
            setOpen(false);
          },
        },
      );
    } else if (type === "create") {
      createBook.mutate({
        author: data.author,
        title: data.title,
        publisher: data.publisher,
        publicationDate: new Date(data.publicationDate),
        categoryId: Number(data.category),
      });
    }
    setOpen(false);
  };

  const deleteBook = api.book.deleteBook.useMutation();
  const onDelete = () => {
    deleteBook.mutate(
      {
        id: book?.id,
      },
      {
        onSuccess: () => {
          setRefreshKey(refreshKey + 1);
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "edit" && "Edit "}
            {type === "delete" && "Delete "}
            {type === "create" && "Create "} Book
          </DialogTitle>
        </DialogHeader>
        {type === "delete" && (
          <>
            <p>
              Are you sure you want to delete this book{" "}
              {book?.title ? `with title ` : ""}
              <span className="text-2xl font-bold">{book?.title}?</span>
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="neutral">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={() => {
                  onDelete();
                }}
              >
                Yes, Delete
              </Button>
            </DialogFooter>
          </>
        )}
        {(type === "edit" || type === "create") && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Azura Labs Terbaik" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Azura Siagian" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Azura Labs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publicationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-[160px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[160px] bg-[#e0ecfc]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#e0ecfc]">
                          {!categories.data && "No Category available"}
                          {categories.data?.map((category) => {
                            return (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                                className="bg-[#e0ecfc]"
                              >
                                {category.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="neutral"
                    onClick={() => {
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
