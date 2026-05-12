import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Field, FieldError, FieldLabel } from "./ui/field";

export interface NoteFormValues {
  title: string;
  content: string;
  summary: string;
  tags: string;
}

interface Props {
  register: UseFormRegister<NoteFormValues>;
  errors: FieldErrors<NoteFormValues>;
  setValue: UseFormSetValue<NoteFormValues>;
  title: string;
  content: string;
}

export function NoteFormFields({
  register,
  errors,
  setValue,
  title,
  content,
}: Props) {
  const canGenerate = !!title?.trim() && content?.trim().length >= 3;

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
    <>
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
    </>
  );
}
