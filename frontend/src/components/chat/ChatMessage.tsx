
import { Bot, UserRound } from "lucide-react";
import type { ChatMessageData } from "../../types";
import { SourceReferences } from "./SourceReferences";

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          isUser
            ? "bg-slate-200 text-slate-700"
            : "bg-indigo-600 text-white"
        }`}>
        {isUser ? <UserRound size={18} /> : <Bot size={18} />}
      </div>

      <div className={`min-w-0 max-w-[85%] ${isUser ? "text-right" : ""}`}>
        <p className="mb-1 text-xs font-semibold text-slate-500">
          {isUser ? "You" : "Recall AI"}
        </p>
        <div
          className={`rounded-2xl px-4 py-3 text-left text-sm leading-7 ${
            isUser
              ? "rounded-tr-sm bg-indigo-600 text-white"
              : "rounded-tl-sm border border-slate-200 bg-white text-slate-700 shadow-sm"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          {!isUser && message.sources && (
            <SourceReferences sources={message.sources} />
          )}
        </div>
      </div>
    </div>
  );
}
