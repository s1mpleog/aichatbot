import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const content = await req.text();
    if (content.trim()) {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          candidateCount: 1,
          maxOutputTokens: 36000,
          temperature: 1.0,
        },
      });

      const result = await model.generateContentStream(content);

      // Create a stream to progressively send the response
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Stream each chunk of content as it comes in
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              controller.enqueue(new TextEncoder().encode(chunkText));
            }

            controller.close();
          } catch (error) {
            console.error("Error streaming content:", error);
            controller.error(error);
          }
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    } else {
      return new NextResponse(null);
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      error: "Error processing your request",
    });
  }
}

// const content = await req.text();

// if (!content.trim()) {
//   return NextResponse.json({
//     error: "No content provided",
//   });
// }

// const completion = await groq.chat.completions.create({
//   messages: [
//     {
//       role: "user",
//       content: content,
//     },
//   ],
//   model: "llama3-8b-8192",

//   max_tokens: 2048,
// });
// return NextResponse.json({
//   response: completion.choices[0].message.content || "No response found",
// });
