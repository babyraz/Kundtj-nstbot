import express from "express";
import { chain } from "../langchain/chains.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const answer = await chain.invoke({ question });

    res.json({ answer });
  } catch (err) {
    console.error("Error in /api/ask:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
