import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOllama } from "@langchain/ollama";

import { retreiveDocuments } from "../service/setupRetriever.mjs";
import {
  standaloneQuestionTemplate,
  answerTemplate,
} from "./promptTemplates.mjs";

const llm = new ChatOllama({
  model: "llama3.2",
});

const memory = new BufferMemory({
  memoryKey: "chat_history",
  inputKey: "question",
  outputKey: "answer",
});

const prompt = ChatPromptTemplate.fromTemplate(`
  Du är en hjälpsam kundtjänstassistent för TechNova AB.
  
  Tidigare konversation:
  {chat_history}
  
  Fråga:
  {question}
  
  Relevanta dokument:
  {context}
  
  Svara tydligt och kortfattat på svenska.
  `);
  
  const chain = RunnableSequence.from([
    {
      // Step 1: Add chat history to the question
      invoke: async (input) => {
        const memoryVars = await memory.loadMemoryVariables({});
        const chatHistory = memoryVars.chat_history || "";
        const contextDocs = await retreiveDocuments.invoke(input.question);
        const context = contextDocs.map((d) => d.pageContent).join("\n\n");
  
        const result = await prompt.format({
          chat_history: chatHistory,
          question: input.question,
          context,
        });
  
        return { formattedPrompt: result, question: input.question };
      },
    },
    {
      // Step 2: Send to LLM
      invoke: async ({ formattedPrompt, question }) => {
        const answer = await model.invoke(formattedPrompt);
        await memory.saveContext({ question }, { answer });
        return answer;
      },
    },
    new StringOutputParser(),
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