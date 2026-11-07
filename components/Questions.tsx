"use client";
import { FormEvent, useEffect, useRef, useState } from "react";

type Turn = { q: string; a?: string; failed?: boolean };
const starters = ["Which projects have you built?", "What is your tech stack?", "Where do you study?", "How do I contact you?"];

interface QuestionsProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function Questions({ open, onOpen, onClose }: QuestionsProps) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        launcherRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  async function ask(raw: string) {
    const q = raw.trim();
    if (!q || busy) return;
    const history = turns.filter((t) => t.a && !t.failed).slice(-4)
      .flatMap((t) => [{ role: "user", text: t.q }, { role: "bot", text: t.a as string }]);
    setTurns((prev) => [...prev, { q }]);
    setText("");
    setBusy(true);
    let a = "";
    let failed = false;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", text: q }] }),
      });
      const data = await res.json();
      a = data.reply || "No answer came back.";
      failed = !res.ok;
    } catch {
      a = "The request did not go through. Check your connection and try again.";
      failed = true;
    }
    setTurns((prev) => prev.map((t, i) => (i === prev.length - 1 ? { ...t, a, failed } : t)));
    setBusy(false);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(text);
  };

  return (
    <div className="chat-widget">
      {open && (
        <section
          id="portfolio-chat-panel"
          className="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
        >
          <header className="chat-header">
            <div>
              <p className="chat-eyebrow mono">Portfolio assistant</p>
              <h2 id="chat-title">Ask me anything</h2>
            </div>
            <button
              className="chat-close"
              type="button"
              onClick={onClose}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="chat-body">
            <p className="chat-intro">
              Ask about my projects, skills, or studies. Answers are based on
              notes about my work.
            </p>
            {turns.length === 0 && (
              <ul className="chat-starters">
                {starters.map((starter) => (
                  <li key={starter}>
                    <button onClick={() => void ask(starter)} disabled={busy}>
                      {starter}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="chat-log" aria-live="polite">
              {turns.map((turn, index) => (
                <div className="chat-turn" key={`${turn.q}-${index}`}>
                  <p className="chat-question">{turn.q}</p>
                  <p className={`chat-answer${turn.failed ? " err" : ""}`}>
                    {turn.a ?? "Checking my notes"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <label htmlFor="portfolio-chat-question" className="mono">
              Your question
            </label>
            <div className="chat-input-row">
              <input
                ref={inputRef}
                id="portfolio-chat-question"
                value={text}
                onChange={(event) => setText(event.target.value)}
                maxLength={300}
                required
                autoComplete="off"
              />
              <button type="submit" disabled={busy}>
                {busy ? "Sending" : "Send"}
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        ref={launcherRef}
        id="portfolio-chat"
        className={`chat-launcher${open ? " is-open" : ""}`}
        type="button"
        onClick={open ? onClose : onOpen}
        aria-expanded={open}
        aria-controls="portfolio-chat-panel"
      >
        <span className="chat-launcher-icon" aria-hidden="true">
          {open ? "×" : "?"}
        </span>
        <span>{open ? "Close chat" : "Ask me"}</span>
      </button>
    </div>
  );
}
