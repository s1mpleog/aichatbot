"use client";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useState } from "react";

interface MessageInputProps {
  onContentChange: (content: string) => void;
}

export default function MessageInput({ onContentChange }: MessageInputProps) {
  const [content, setContent] = useState<string>("");

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    onContentChange(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex py-4 z-50 items-center bg-[#212121] justify-start">
      <div className="max-w-3xl flex items-center justify-center mx-auto w-full">
        <div className="w-full -ml-[250px]">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-[#2f2f2f] placeholder:text-base indent-6 text-lg  py-6 rounded-full"
            placeholder="Enter a prompt"
            type="text"
            required
          />
        </div>
      </div>
    </form>
  );
}
