import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./db/index.js";
import { NotesRepository } from "./notes/notes.repository.js";
import { NotesService } from "./notes/notes.service.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

const notesService = new NotesService(new NotesRepository(db));

// List all notes
app.get("/notes", async (_req: Request, res: Response) => {
  const notes = await notesService.listNotes();
  res.json(notes);
});

// Get a single note
app.get("/notes/:id", async (req: Request, res: Response) => {
  const note = await notesService.getNote(req.params.id as string);
  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(note);
});

// Create a note
app.post("/notes", async (req: Request, res: Response) => {
  const { title, content, summary, tags } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: "title and content are required" });
    return;
  }

  const note = await notesService.createNote(title, content, summary, tags);
  res.status(201).json(note);
});

// Update a note
app.put("/notes/:id", async (req: Request, res: Response) => {
  const { title, content, summary, tags } = req.body;
  const data = { title, content, summary, tags };

  if (Object.values(data).every((v) => v === undefined)) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const note = await notesService.updateNote(req.params.id as string, data);
  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(note);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
