import { Router } from "express";
import { LogEntrySchema, BatchLogSchema } from "@modelsights/utils";
import { validate } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/auth.js";
import { insertRequest, insertRequestBatch } from "../db/queries.js";

const router = Router();

// All log routes require authentication
router.use(authMiddleware);

// POST /log — single log entry
router.post("/log", validate(LogEntrySchema), async (req, res) => {
  try {
    const row = await insertRequest(req.body);
    res.status(201).json({ success: true, id: row.id, requestId: row.requestId });
  } catch (err: any) {
    if (err?.code === "23505") {
      // Unique constraint violation — duplicate requestId
      res.status(409).json({ error: "Duplicate requestId", requestId: req.body.requestId });
      return;
    }
    throw err;
  }
});

// POST /log/batch — batch log entries
router.post("/log/batch", validate(BatchLogSchema), async (req, res) => {
  try {
    const rows = await insertRequestBatch(req.body.entries);
    res.status(201).json({ success: true, count: rows.length });
  } catch (err: any) {
    if (err?.code === "23505") {
      res.status(409).json({ error: "Duplicate requestId in batch" });
      return;
    }
    throw err;
  }
});

export { router as logRouter };
