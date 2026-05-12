import type { NotesRepository } from "./notes.repository.js";
import { notesTable } from "../db/schema.js";

type NoteUpdate = Partial<
  Pick<typeof notesTable.$inferInsert, "title" | "content" | "summary" | "tags">
>;

export class NotesService {
  constructor(private repo: NotesRepository) {}

  listNotes() {
    return this.repo.findAll();
  }

  async getNote(id: string) {
    const notes = await this.repo.findById(id);
    if (notes.length === 0) return null;
    return notes[0];
  }

  async createNote(
    title: string,
    content: string,
    summary?: string,
    tags?: string,
  ) {
    // AI summarization hook goes here later
    const created = await this.repo.create({ title, content, summary, tags });
    return created[0];
  }

  async updateNote(id: string, data: NoteUpdate) {
    const updated = await this.repo.update(id, data);
    if (updated.length === 0) return null;
    return updated[0];
  }
}
