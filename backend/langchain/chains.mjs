import { RunnableSequence } from "@langchain/core/runnables";
import { Ollama } from "@langchain/ollama";
import { answerTemplate } from "./promptTemplates.mjs";
import { retreiveDocuments } from "../service/setupRetriever.mjs";
import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory({ memoryKey: "chat_history" });


const llm = new Ollama({
  model: "llama3.2",
  temperature: 0.3,
});

const chain = RunnableSequence.from([
  {

    invoke: async (input) => {
      const memoryVars = await memory.loadMemoryVariables({});
      const chatHistory = memoryVars.chat_history || "";

      const question =
        input?.question ?? input?.input?.question ?? input?.input ?? "";

      const contextDocs = await retreiveDocuments.invoke(question);
      const context = (contextDocs || [])
        .map((d) => d.pageContent)
        .join("\n\n");

      const prompt = await answerTemplate.format({
        context,
        question,
        chat_history: chatHistory,
      });

      return { prompt, question, chatHistory };
    },
  },
  {
    invoke: async (rawInput) => {
      const data = rawInput?.invoke ?? rawInput?.input ?? rawInput?.output ?? rawInput;
      const { prompt, question, chatHistory } = data || {};

      if (typeof prompt !== "string") {
        throw new Error("Prompt missing or not a string.");
      }

      const res = await llm.invoke(prompt);
      const answerText = res?.output_text ?? res;

      const newHistory =
        `${chatHistory}\nAnvändare: ${question}\nBot: ${answerText}\n`;
      memory.chat_history = newHistory;
      console.log("🧠 Memory after update:\n", memory.chat_history);

      return answerText;
    },
  },
]);

export { chain };




