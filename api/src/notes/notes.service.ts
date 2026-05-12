import { generateText } from "ai";
import type { LanguageModel } from "ai";
import type { NotesRepository } from "./notes.repository.js";
import { notesTable } from "../db/schema.js";

type NoteUpdate = Partial<
  Pick<typeof notesTable.$inferInsert, "title" | "content" | "summary" | "tags">
>;

function normalizeTags(tags?: string | null): string | undefined {
  if (!tags) return undefined;

  return [
    ...new Set(
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ].join(", ");
}

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
    if (notes.length === 0) {
      return null;
    }

    return notes[0];
  }

  async createNote(
    title: string,
    content: string,
    summary?: string,
    tags?: string,
  ) {
    const created = await this.repo.create({
      title,
      content,
      summary,
      tags: normalizeTags(tags),
    });

    return created[0];
  }

  async updateNote(id: string, data: NoteUpdate) {
    const note = { ...data, tags: normalizeTags(data.tags) };
    const updated = await this.repo.update(id, note);
    if (updated.length === 0) {
      return null;
    }

    return updated[0];
  }

  async generateSummary(title: string, content: string): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      system:
        "Summarize notes in maximum 2-3 sentences. Output only the summary, no preamble.",
      prompt: `Title: ${title}\n\n${content}`,
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
      system:
        "Generate 3-5 short, relevant tags for a note. Output only a comma-separated list, no other text.",
      prompt: `Title: ${title}\n\n${content}`,
      providerOptions: {
        openai: {
          textVerbosity: "low",
        },
      },
    });

    return normalizeTags(text) ?? "";
  }
}
