import { chain } from "../langchain/chains.mjs";

export async function askQuestion(req, res) {
  const { question } = req.body;

  const answer = await chain.invoke({ question });

  res.json({ answer });
}