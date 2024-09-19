import { GoogleGenerativeAI } from "@google/generative-ai";

export async function gemeni(text: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      candidateCount: 1,
      maxOutputTokens: 4080,
      temperature: 1.0,
    },
  });

  const result = await model.generateContent(text);
  console.log(result.response.text());
}
