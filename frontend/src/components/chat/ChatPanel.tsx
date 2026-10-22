
import { useEffect, useRef } from "react";
import { Bot, Sparkles } from "lucide-react";
import type { ChatMessageData } from "../../types";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

interface ChatPanelProps {
  messages: ChatMessageData[];
  loading: boolean;
  error: string;
  onSend: (question: string) => Promise<void>;
}

export function ChatPanel({
  messages,
  loading,
  error,
  onSend,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <section className="flex min-h-[560px] min-w-0 flex-1 flex-col bg-slate-50 md:min-h-screen">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
        <div>
          <h1 className="font-semibold tracking-tight text-slate-900">
            Document chat
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Ask questions. Explore answers grounded in your files.
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          RAG enabled
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 && (
            <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Sparkles size={30} />
              </div>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">
                Your documents, in conversation.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Upload a document, then ask a question. The assistant retrieves
                relevant passages and provides an answer with source references.
              </p>
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-500">
                <Bot size={18} className="shrink-0 text-indigo-600" />
                Try: “Summarize the key points in my document.”
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Bot size={18} />
              </span>
              Searching your documents and preparing an answer…
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-4 md:px-8">
        <ChatInput onSend={onSend} disabled={loading} />
      </footer>
    </section>
  );
}
