import { eq, desc } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { notesTable } from "../db/schema.js";
import type * as schema from "../db/schema.js";

type DB = NodePgDatabase<typeof schema>;

export class NotesRepository {
  constructor(private db: DB) {}

  findAll() {
    return this.db
      .select()
      .from(notesTable)
      .orderBy(desc(notesTable.created_at));
  }

  findById(id: string) {
    return this.db.select().from(notesTable).where(eq(notesTable.id, id));
  }

  create(data: typeof notesTable.$inferInsert) {
    return this.db.insert(notesTable).values(data).returning();
  }

  update(id: string, data: Partial<typeof notesTable.$inferInsert>) {
    return this.db
      .update(notesTable)
      .set(data)
      .where(eq(notesTable.id, id))
      .returning();
  }
}
