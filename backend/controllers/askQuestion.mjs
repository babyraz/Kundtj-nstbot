// import { chain } from "../langchain/chains.mjs";

// export async function askQuestion(req, res) {
//   try {
//     const { question } = req.body;

//     if (!question) {
//       return res.status(400).json({ error: "Question is required" });
//     }

//     const answer = await chain.invoke({ question });

//     res.json({ answer });
//   } catch (err) {
//     console.error("Error in /api/ask:", err);
//     res.status(500).json({ error: err.message || "Internal server error" });
//   }
// }

import { chain } from "../langchain/chains.mjs";

export async function askQuestion(req, res) {
  const { question } = req.body;

  const answer = await chain.invoke({ question });

  res.json({ answer });
}