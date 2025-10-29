// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { Ollama } from "langchain/llms/ollama";
// import { ChatPromptTemplate } from "langchain/prompts";
// import { RunnableSequence } from "langchain/schema/runnable";
// import { createClient } from "@supabase/supabase-js";

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());


// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


// const model = new Ollama({
//   baseUrl: "http://localhost:11434", // standardport för Ollama
//   model: "llama3.2",
// });

// // === Prompt ===
// const prompt = ChatPromptTemplate.fromTemplate(
//   `Du är en hjälpsam kundtjänstbot. Svara tydligt på svenska.
// Kundens fråga: {question}`
// );

// // === Kedja (RunnableSequence) ===
// const chain = RunnableSequence.from([prompt, model]);

// // === Route ===
// app.post("/api/chat", async (req, res) => {
//   const { message } = req.body;
//   try {
//     const response = await chain.invoke({ question: message });
//     res.json({ reply: response });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Något gick fel." });
//   }
// });

// app.listen(5000, () => console.log("Servern körs på http://localhost:5000"));
