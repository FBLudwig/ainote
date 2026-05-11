import { useQuery } from "@tanstack/react-query";
import { NotebookPen } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyContent,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "./ui/empty";
import { CreateNoteDialog } from "./create-note-dialog";
import { Skeleton } from "./ui/skeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  tags: string | null;
  created_at: string;
}

export function NotesList() {
  const [animationParent] = useAutoAnimate();

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/notes`).then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<Note[]>;
      }),
  });

  if (isLoading) {
    return (
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i}>
            <NoteCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (notes.length === 0) {
    return (
      <Empty className="mt-24">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <NotebookPen />
          </EmptyMedia>
          <EmptyTitle>No Notes yet</EmptyTitle>
          <EmptyDescription>
            Create your first note to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateNoteDialog />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ul ref={animationParent} className="flex flex-col gap-4">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteCard note={note} />
        </li>
      ))}
    </ul>
  );
}

function NoteCard({ note }: { note: Note }) {
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(note.created_at));

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-xs">
      <h2 className="font-semibold text-base leading-snug">{note.title}</h2>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap flex-1">
        {note.content}
      </p>
      <div className="flex justify-end">
        <time
          dateTime={note.created_at}
          className="text-xs text-muted-foreground"
        >
          {formattedDate}
        </time>
      </div>
    </div>
  );
}

function NoteCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-xs">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex justify-end">
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
