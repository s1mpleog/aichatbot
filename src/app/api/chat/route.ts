"use server";
import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

// Initialize Google Generative AI SDK
const genAI = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    if (!content || content === "") {
      return new NextResponse(null, { status: 400 });
    }

    let accumulatedContent = "";

    const { textStream } = await streamText({
      model: genAI("gemini-1.5-pro-latest"),
      prompt: content,
      maxTokens: 12000,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const textPart of textStream) {
          accumulatedContent += textPart;
          controller.enqueue(encoder.encode(textPart));
        }
        controller.close();

        await fetchMutation(api.messages.createTask, {
          content: accumulatedContent,
          userId: "simpleog",
          userQuestion: content,
        });
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error processing your request" }, { status: 500 });
  }
}
