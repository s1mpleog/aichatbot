import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ArrowDown } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface ShowResponseProps {
  content: string;
}

export default function ShowResponse({ content }: ShowResponseProps) {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const saveMessage = useMutation(api.messages.createTask);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchResponse = async () => {
      setIsLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: content,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let completeMessage = "";

      if (reader) {
        const readChunk = async () => {
          const { done, value } = await reader.read();
          if (done) {
            setIsLoading(false);
            if (message !== "") {
              saveMessage({ content: completeMessage, userId: "simpleog", userQuestion: content });
            }
            return;
          }

          const chunkText = decoder.decode(value, { stream: true });

          // Update completeMessage instead of the state here
          completeMessage += chunkText;

          // Update state with the current message chunk
          setMessage((prev) => prev + chunkText);

          await delay(100); // Optional delay to simulate slower streaming

          await readChunk();
        };

        await readChunk();
      }
    };

    fetchResponse();
    scrollToBottom();
  }, [content, saveMessage]);

  return (
    <div className="p-6 max-w-7xl h-full mx-auto mb-20 overflow-y-auto">
      <div className="max-w-3xl flex-col flex items-center justify-between mx-auto">
        {content && (
          <div className="flex relative text-sm ml-auto mb-5 items-start justify-start bg-[#2f2f2f] py-3 max-w-xl rounded-full px-6">
            {content}
          </div>
        )}
        <div className="flex justify-center gap-x-4 w-full">
          <div className="mb-6">
            <img
              width={28}
              height={28}
              src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_advanced_1743d7b7a7bc01f38e6f4.svg"
              alt="gemini"
              className="mr-2"
            />
          </div>
          <div className="w-full">
            {isLoading && <LoadingSkeleton />}
            {message && (
              <Markdown
                className="space-y-4 prose prose-headings:text-white prose-strong:text-white prose-ul:text-white prose-a:text-white prose-li:text-white text-white mb-20 leading-[2.5]"
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                children={message}
                components={{
                  code(props) {
                    const { children, className, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      // @ts-ignore
                      <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        children={String(children).replace(/\n$/, "")}
                        language={match[1]}
                        style={oneDark}
                      />
                    ) : (
                      <code {...rest} className="text-gray-200 font-bold">
                        {children}
                      </code>
                    );
                  },
                }}
              />
            )}
            <div className="flex items-center justify-center">
              <button
                onClick={scrollToBottom}
                className="fixed bg-[#2f2f2f] border-[1px] border-[#2f2f2f]/60 py-2 px-2 rounded-full bottom-[160px] z-[9999] text-white"
              >
                <ArrowDown className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={scrollRef}></div>
    </div>
  );
}
