import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { eq, desc } from "drizzle-orm";
import { db } from "./db/index.js";
import { notesTable } from "./db/schema.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// List all notes
app.get("/notes", async (_req: Request, res: Response) => {
  const notes = await db
    .select()
    .from(notesTable)
    .orderBy(desc(notesTable.created_at));

  res.json(notes);
});

// Get a single note
app.get("/notes/:id", async (req: Request, res: Response) => {
  const notes = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.id, req.params.id as string));

  if (notes.length === 0) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(notes[0]);
});

// Create a note
app.post("/notes", async (req: Request, res: Response) => {
  const { title, content, summary, tags } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: "title and content are required" });
    return;
  }

  const created = await db
    .insert(notesTable)
    .values({ title, content, summary, tags })
    .returning();

  res.status(201).json(created[0]);
});

// Update a note
app.put("/notes/:id", async (req: Request, res: Response) => {
  const { title, content, summary, tags } = req.body;
  const updates: Partial<typeof notesTable.$inferInsert> = {};
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (summary !== undefined) updates.summary = summary;
  if (tags !== undefined) updates.tags = tags;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const updated = await db
    .update(notesTable)
    .set(updates)
    .where(eq(notesTable.id, req.params.id as string))
    .returning();

  if (updated.length === 0) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(updated[0]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
