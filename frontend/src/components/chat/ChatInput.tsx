
import { useState } from "react";
import { ArrowUp, LoaderCircle } from "lucide-react";

interface ChatInputProps {
  onSend: (question: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [question, setQuestion] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();

    if (!trimmed || disabled) return;

    setQuestion("");
    await onSend(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
      <div className="flex items-end gap-3 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Ask a question about your documents…"
          rows={2}
          maxLength={4000}
          disabled={disabled}
          className="max-h-36 min-h-12 flex-1 resize-y bg-transparent px-3 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || !question.trim()}
          aria-label="Send question"
          className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {disabled ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <ArrowUp size={19} />
          )}
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        Answers are generated from retrieved document content. Verify important details against the sources.
      </p>
    </form>
  );
}
