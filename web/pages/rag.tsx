import { useState } from "react";
import { RAGResponse } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RagPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<RAGResponse | null>(null);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/rag/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, k: 4 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(JSON.stringify(data.detail));
        return;
      }

      setResult(data);
    } catch {
      setError("Could not reach the backend.");
    }
  }

  return (
    <main>
      <h1>RAG — Cited Answer</h1>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a recipe question..."
      />

      <button onClick={submit} disabled={!question}>
        Ask
      </button>

      {error && <p>{error}</p>}

      {result && (
        <>
          <p>{result.answer}</p>

          <div>
            {result.citations.map((c, idx) => (
              <span key={idx} data-testid="citation-marker">
                [{idx + 1}]
              </span>
            ))}
          </div>
        </>
      )}
    </main>
  );
}