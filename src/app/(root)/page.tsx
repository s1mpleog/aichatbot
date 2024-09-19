"use client";
import { useState } from "react";
import MessageInput from "./components/MessageInput";
import ShowResponse from "./components/ShowResponse";

export default function Home() {
  const [messageContent, setMessageContent] = useState<string>("");

  return (
    <div className="h-[calc(100vh-100px)] w-full">
      <div className="h-full">
        <ShowResponse content={messageContent} />
      </div>
      <div className="fixed w-full bottom-0">
        <MessageInput onContentChange={setMessageContent} />
      </div>
    </div>
  );
}
