import express from "express";
import db from "../db/database.js";

const router = express.Router();

// Unbiased Fisher–Yates shuffle
function pickRandom(array, count) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

router.post("/", (req, res) => {
  const { class_id, count } = req.body;

  const parsedClassId = Number(class_id);
  const parsedCount = Number(count);

  // Validate input
  if (!Number.isInteger(parsedClassId) || parsedClassId <= 0) {
    return res.status(400).json({
      error: "class_id must be a positive integer",
    });
  }

  if (!Number.isInteger(parsedCount) || parsedCount <= 0) {
    return res.status(400).json({
      error: "count must be a positive integer",
    });
  }

  db.all(
    "SELECT id, name FROM students WHERE class_id = ?",
    [parsedClassId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({
          error: "No students found for this class",
        });
      }

      // Clamp count to available students
      const safeCount = Math.min(parsedCount, rows.length);

      const picked = pickRandom(rows, safeCount);
      res.json(picked);
    }
  );
});

export default router;
