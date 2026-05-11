import { CreateNoteDialog } from "./components/create-note-dialog";
import { NotesList } from "./components/notes-list";

function App() {
  return (
    <>
      <main className="mx-auto px-8 max-w-4xl">
        <div className="flex justify-between items-center my-8">
          <h1>AI Note</h1>

          <CreateNoteDialog />
        </div>

        <NotesList />
      </main>
    </>
  );
}

export default App;
