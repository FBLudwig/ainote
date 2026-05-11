import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Field, FieldError, FieldLabel } from "./ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";

interface FormValues {
  title: string;
  content: string;
}

export function CreateNoteDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // Refresh the notes list
      reset();
      setOpen(false);
    },
    onError: () => {
      setError("root", {
        message: "Failed to create note. Please try again.",
      });
    },
  });

  function onSubmit(data: FormValues) {
    mutation.mutate(data);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>New Note</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">New Note</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="note-title">Title</FieldLabel>
            <Input
              id="note-title"
              type="text"
              placeholder="Note title"
              aria-invalid={!!errors.title}
              {...register("title", { required: "Title is required" })}
            />
            <FieldError errors={[errors.title]} />
          </Field>

          <Field data-invalid={!!errors.content}>
            <FieldLabel htmlFor="note-content">Content</FieldLabel>
            <Textarea
              id="note-content"
              placeholder="Write your note…"
              rows={4}
              aria-invalid={!!errors.content}
              {...register("content", { required: "Content is required" })}
            />
            <FieldError errors={[errors.content]} />
          </Field>

          <FieldError errors={[errors.root]} />

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating…" : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
