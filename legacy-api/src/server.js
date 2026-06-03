import express from "express";
import { addCandidate } from "./controllers/candidate.controller.js";

const app = express();
const port = 4040;

const LEGACY_API_KEY = "0194ec39-4437-7c7f-b720-7cd7b2c8d7f4";

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== LEGACY_API_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }

  next();
};

app.use(express.json({ limit: "5mb" }));

app.post("/candidates", verifyApiKey, addCandidate);

app.get("/", (_, res) => {
  res.send("Legacy Recruitment API");
});

app.listen(port, () => {
  console.log(`External API is running at http://localhost:${port}`);
});
