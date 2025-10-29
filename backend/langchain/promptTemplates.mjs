import { PromptTemplate } from "@langchain/core/prompts";

export const standaloneQuestionTemplate =
  PromptTemplate.fromTemplate(`Givet en fråga, omformulera frågan till en fristående fråga och returnera endast den fristående frågan.
  Fråga: {question}
  fristående fråga:`);

export const answerTemplate =
  PromptTemplate.fromTemplate(`Du är en hjälpsam supportbot för Technova AB som strikt utgår från kontexten för att svara på kundens fråga. Ge kunden så mycket information som du bedömer vara relevant men använd endast kontexten som grund för ditt svar. Förklara alltid vart i dokumentationen/kontexten du hämtar dina svar ifrån. Om kunden ställer en fråga som inte är relaterad till kontexten, ge ett vänligt svar där du förklarar att du inte kan svara på frågan.
kontext: {context}
fråga: {question}
svar:`);