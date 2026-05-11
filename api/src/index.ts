import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";

dotenv.config();

import { db } from "./db/index.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Hello from Express + TypeScript!"
    });
});

app.get("/health", async (req: Request, res: Response) => {
    await db.execute(sql`SELECT 1`);
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});