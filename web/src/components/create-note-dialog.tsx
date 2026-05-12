import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
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
  summary: string;
  tags: string;
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
    setValue,
    watch,
  } = useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/notes`, {
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

  const [title, content] = watch(["title", "content"]);
  const canGenerate = !!title?.trim() && content?.trim().length > 5;

  const summaryMutation = useMutation({
    mutationFn: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      }).then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<{ summary: string }>;
      }),
    onSuccess: (data) => {
      setValue("summary", data.summary);
    },
  });

  const tagsMutation = useMutation({
    mutationFn: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      }).then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<{ tags: string }>;
      }),
    onSuccess: (data) => {
      setValue("tags", data.tags);
    },
  });

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

          <Field data-invalid={!!errors.summary} className="mt-8">
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="note-summary">Summary</FieldLabel>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-6 gap-1 text-xs"
                disabled={!canGenerate || summaryMutation.isPending}
                onClick={() => summaryMutation.mutate()}
              >
                Generate
                {summaryMutation.isPending ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Sparkles className="size-3" />
                )}
              </Button>
            </div>
            <Textarea
              id="note-summary"
              placeholder="Brief summary…"
              rows={2}
              aria-invalid={!!errors.summary}
              {...register("summary")}
            />
            <FieldError errors={[errors.summary]} />
          </Field>

          <Field data-invalid={!!errors.tags}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="note-tags">Tags</FieldLabel>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-6 gap-1 text-xs"
                disabled={!canGenerate || tagsMutation.isPending}
                onClick={() => tagsMutation.mutate()}
              >
                Generate
                {tagsMutation.isPending ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Sparkles className="size-3" />
                )}
              </Button>
            </div>
            <Input
              id="note-tags"
              type="text"
              placeholder="e.g. work, ideas, todo"
              aria-invalid={!!errors.tags}
              {...register("tags")}
            />
            <FieldError errors={[errors.tags]} />
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
