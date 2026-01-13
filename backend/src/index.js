import express from "express";
import cors from "cors";
import "./db/database.js";

import classesRouter from "./routes/classes.js";
import studentsRouter from "./routes/students.js";
import pickRouter from "./routes/pick.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/classes", classesRouter);
app.use("/students", studentsRouter);
app.use("/pick", pickRouter);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
