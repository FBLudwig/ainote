import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const notesTable = pgTable("notes", {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    content: text().notNull(),
    summary: text(),
    tags: text(),
    created_at: timestamp().notNull().defaultNow(),
});
