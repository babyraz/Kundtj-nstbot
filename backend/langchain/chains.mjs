import { RunnableSequence } from "@langchain/core/runnables";
import { Ollama } from "@langchain/ollama";
import { answerTemplate } from "./promptTemplates.mjs";
import { retreiveDocuments } from "../service/setupRetriever.mjs";
import { BufferMemory } from "langchain/memory";

// 🧠 Tillfälligt minne i RAM
const memory = new BufferMemory({
  memoryKey: "chat_history",
});

// 🦙 LLM
const llm = new Ollama({
  model: "llama3.2",
  temperature: 0.3,
});

// 🔗 Kedja
const chain = RunnableSequence.from([
  // {
  //   invoke: async (input) => {
  //     // Hämta befintlig historik
  //     const memoryVars = await memory.loadMemoryVariables({});
  //     const chatHistory = memoryVars.chat_history || "";

  //     // Hämta kontext
  //     const contextDocs = await retreiveDocuments.invoke(input.question);
  //     const context = (contextDocs || []).map(d => d.pageContent).join("\n\n");

  //     // Skapa textprompt
  //     const prompt = await answerTemplate.format({
  //       context,
  //       question: input.question,
  //       chat_history: chatHistory,
  //     });
      
  //     console.log("🧩 Generated prompt inside first invoke:\n", prompt);
      
  //     return { prompt, question: input.question, chatHistory };
  //   },
  // },
  {
    invoke: async (input) => {
      console.log("🟢 chain input =", input);
      const memoryVars = await memory.loadMemoryVariables({});
      const chatHistory = memoryVars.chat_history || "";
  
      const contextDocs = await retreiveDocuments.invoke(input.question);
      const context = (contextDocs || []).map(d => d.pageContent).join("\n\n");
  
      console.log("🧠 DEBUG values before formatting prompt:");
      console.log(" - context length:", context?.length);
      console.log(" - question:", input?.question);
      console.log(" - chatHistory length:", chatHistory?.length);
  
      const prompt = await answerTemplate.format({
        context,
        question: input.question,
        chat_history: chatHistory,
      });
  
      console.log("🧩 Generated prompt inside first invoke:\n", prompt);
  
      return { prompt, question: input.question, chatHistory };
    },
  },
  
  {
    invoke: async (rawInput) => {
      console.log("🔍 rawInput received by second invoke:", rawInput);
  
      // 🧩 Unwrap depending on how LangChain nested the object
      const data =
        rawInput?.invoke ??
        rawInput?.input ??
        rawInput?.output ??
        rawInput;
  
      const { prompt, question, chatHistory } = data || {};
  
      console.log("🧩 Prompt about to send:\n", prompt);
  
      if (!prompt || typeof prompt !== "string") {
        throw new Error(
          "Prompt is not a string. Got: " +
            typeof prompt +
            " | rawInput keys: " +
            Object.keys(rawInput || {})
        );
      }
  
      // 🦙 Call the model
      const response = await llm.invoke(prompt);
      const answerText = response.output_text || response;
  
      // 🧠 Update chat history
      const newHistory =
        `${chatHistory}\nAnvändare: ${question}\nBot: ${answerText}\n`;
      memory.chat_history = newHistory;
  
      console.log("🧠 Chat history updated:\n", newHistory);
  
      return answerText;
    },
  },
  
  
  
  
  
  
]);

export { chain };









// function combineDocuments(docs) {
//   return docs.map((doc) => doc.pageContent).join("\n\n");
// }

// const standaloneQuestionChain = RunnableSequence.from([
//   standaloneQuestionTemplate,
//   llm,
//   new StringOutputParser(),
// ]);

// const retreiveDocumentsChain = RunnableSequence.from([
//   (data) => {
//     console.log(data);
//     return data.standaloneQuestion;
//   },
//   retreiveDocuments,
//   combineDocuments,
// ]);

// const answerChain = RunnableSequence.from([
//   answerTemplate,
//   llm,
//   new StringOutputParser(),
// ]);

// export const chain = RunnableSequence.from([
//   {
//     standaloneQuestion: standaloneQuestionChain,
//     originalQuestion: new RunnablePassthrough(),
//   },
//   {
//     context: retreiveDocumentsChain,
//     question: ({ originalQuestion }) => originalQuestion.question,
//   },
//   answerChain,
// ]);