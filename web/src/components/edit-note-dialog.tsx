import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { FieldError } from "./ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { NoteFormFields, type NoteFormValues } from "./note-form-fields";
import type { Note } from "./notes-list";

interface Props {
  noteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNoteDialog({ noteId, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    watch,
  } = useForm<NoteFormValues>();

  // Fetch note data when dialog opens
  const { data: note } = useQuery<Note>({
    queryKey: ["notes", noteId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/notes/${noteId}`).then(
        (res) => {
          if (!res.ok) throw new Error();
          return res.json() as Promise<Note>;
        },
      ),
    enabled: open,
  });

  // Populate form fields when note data is loaded
  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        content: note.content,
        summary: note.summary ?? "",
        tags: note.tags ?? "",
      });
    }
  }, [note, reset]);

  // Update note
  const mutation = useMutation({
    mutationFn: (data: NoteFormValues) =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      reset();
      onOpenChange(false);
    },
    onError: () => {
      setError("root", { message: "Failed to update note. Please try again." });
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  const [title, content] = watch(["title", "content"]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Note</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="flex flex-col gap-4"
        >
          <NoteFormFields
            register={register}
            errors={errors}
            setValue={setValue}
            title={title}
            content={content}
          />

          <FieldError errors={[errors.root]} />

          <DialogFooter>
            <Button type="submit" disabled={!note || mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
