import express from "express";
import { chain } from "../langchain/chains.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Fråga krävs." });
    }

    const result = await chain.invoke({ question });
    const answer =
      typeof result === "string"
        ? result
        : result?.output_text || result?.invoke || JSON.stringify(result);

    res.json({ answer });
  } catch (err) {
    res.status(500).json({
      error: err?.message || "Ett internt fel uppstod vid bearbetning av frågan.",
    });
  }
});

export default router;
