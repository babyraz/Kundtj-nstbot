import { PromptTemplate } from "@langchain/core/prompts";

const tpl = PromptTemplate.fromTemplate("Hej {name}");
const txt = await tpl.format({ name: "Rasmus" });
console.log(txt);
