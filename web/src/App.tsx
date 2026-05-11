import "./App.css";
import { NotebookPen } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyContent,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "./components/ui/empty";
import { CreateNoteDialog } from "./components/create-note-dialog";

function App() {
  return (
    <>
      <main className="mx-auto max-w-4xl">
        <div className="flex justify-between items-center my-8">
          <h1>AI Note</h1>

          <CreateNoteDialog />
        </div>

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
      </main>
    </>
  );
}

export default App;
