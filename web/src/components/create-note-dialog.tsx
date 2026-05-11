import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Field, FieldError, FieldLabel } from "./ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";

interface FormValues {
  title: string;
  content: string;
}

export function CreateNoteDialog() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormValues>();

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setError("root", {
          message: "Failed to create note. Please try again.",
        });
        return;
      }
    } catch {
      setError("root", {
        message: "Network error. Please check your connection and try again.",
      });
      return;
    }

    reset();
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>Create Note</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Add a new note to your collection.
          </DialogDescription>
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

          <DialogFooter showCloseButton>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
