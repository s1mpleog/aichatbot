"use client";
/* eslint-disable react/no-children-prop */
import { useQuery } from "convex/react";
import React, { FC, useEffect, useRef } from "react";
import { api } from "../../../../convex/_generated/api";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import LoadingSkeleton from "./LoadingSkeleton";

interface ShowOldMessagesProps {
  userId: string;
}

const ShowOldMessages: FC<ShowOldMessagesProps> = ({}) => {
  const messages = useQuery(api.messages.get, { userId: "simpleog" });
  const isLoading = messages === undefined;
  const ref = useRef<HTMLDivElement | null>(null);
  console.log(messages);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      {isLoading && <LoadingSkeleton />}
      {messages?.map((message) => (
        <div key={message._id} className="flex flex-col items-start justify-between w-full">
          <div className="flex relative w-fit text-sm mx-auto mb-5 mr-2 items-start justify-start bg-[#2f2f2f] py-3 max-w-xl rounded-full px-6">
            {message.userQuestion}
          </div>
          <Markdown
            className="space-y-4 prose prose-headings:text-white prose-strong:text-white prose-ul:text-white prose-a:text-white prose-li:text-white text-white mb-20 leading-[2.5]"
            remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
            children={message.content}
            components={{
              code(props) {
                const { children, className, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  // @ts-expect-error giving random error
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
        </div>
      ))}
      <div ref={ref}></div>
    </div>
  );
};

export default ShowOldMessages;
