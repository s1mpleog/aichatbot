"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const content = await req.text();

    if (content.trim()) {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-exp-0827",
        generationConfig: {
          maxOutputTokens: 12000,
        },
      });

      const result = await model.generateContentStream(content);

      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Loop through each chunk and stream it without repeating
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();

              // Avoid sending empty or repeated chunks
              if (chunkText && chunkText.trim()) {
                controller.enqueue(new TextEncoder().encode(chunkText));
              }
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
