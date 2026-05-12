import { generateText } from "ai";
import type { LanguageModel } from "ai";
import type { NotesRepository } from "./notes.repository.js";
import { notesTable } from "../db/schema.js";

type NoteUpdate = Partial<
  Pick<typeof notesTable.$inferInsert, "title" | "content" | "summary" | "tags">
>;

export class NotesService {
  constructor(
    private repo: NotesRepository,
    private model: LanguageModel,
  ) {}

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
    const created = await this.repo.create({ title, content, summary, tags });
    return created[0];
  }

  async updateNote(id: string, data: NoteUpdate) {
    const updated = await this.repo.update(id, data);
    if (updated.length === 0) return null;
    return updated[0];
  }

  async generateSummary(title: string, content: string): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      prompt: `Write a short, concise summary for a note titled "${title}":\n\n${content}\n\nThe summary should be 1-2 sentences long and capture the main points of the note while being much shorter.`,
      providerOptions: {
        openai: {
          textVerbosity: "low",
        },
      },
    });

    return text.trim();
  }

  async generateTags(title: string, content: string): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      prompt: `Generate 3-5 relevant tags for a note titled "${title}":\n\n${content}\n\nRespond with only a comma-separated list of tags, no other text.`,
      providerOptions: {
        openai: {
          textVerbosity: "low",
        },
      },
    });

    return text;
  }
}
