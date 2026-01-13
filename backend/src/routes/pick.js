import { Router } from "express";
import { db } from "../db/database.js";
import { pickRandom } from "../utils/random.js";

const router = Router();

router.post("/", (req, res) => {
  const { class_id, count } = req.body;
  if (!class_id || !count)
    return res.status(400).json({ error: "class_id and count required" });

  db.all(
    "SELECT * FROM students WHERE class_id = ?",
    [class_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(pickRandom(rows, count));
    }
  );
});

export default router;
