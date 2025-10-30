// import express from "express";
// import { chain } from "../langchain/chains.mjs";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const { question } = req.body;

//     if (!question) {
//       return res.status(400).json({ error: "Question is required" });
//     }

//     const answer = await chain.invoke({ question });
//     res.json({ answer });
//   } catch (err) {
//     console.error("Full error in /api/ask:", err);
//     res.status(500).json({ error: err.message || "Internal server error" });
//   }
// });

// export default router;


import express from "express";
import { chain } from "../langchain/chains.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: "Fråga krävs." });
    }

    console.log("🔹 Incoming question:", question);

    // Kör kedjan
    const result = await chain.invoke({ question });

    // Hantera olika returtyper (string eller objekt)
    const answer =
      typeof result === "string"
        ? result
        : result?.output_text || result?.invoke || JSON.stringify(result);

    console.log("🔹 Answer from chain:", answer);

    // Skicka tillbaka svaret som JSON
    res.json({ answer });
  } catch (err) {
    console.error("❌ Full error in /api/ask:", err);
    res.status(500).json({
      error: err.message || "Ett internt fel uppstod vid bearbetning av frågan.",
    });
  }
});

export default router;


