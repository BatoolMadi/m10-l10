import { useState } from "react";
import { apiUrl } from "../lib/api";
import { RAGResponse } from "../lib/types";

function normalizeRagResponse(data: Record<string, unknown>): RAGResponse {
  const citations = Array.isArray(data.citations) ? data.citations : [];
  return {
    answer: typeof data.answer === "string" ? data.answer : "",
    citations: citations.map((citation, idx) => {
      const record = citation as Record<string, unknown>;
      return {
        chunk_id: typeof record.chunk_id === "number" ? record.chunk_id : idx + 1,
        score: typeof record.score === "number" ? record.score : 0,
      };
    }),
    confidence: typeof data.confidence === "number" ? data.confidence : 0,
  };
}

export default function RagPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<RAGResponse | null>(null);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setResult(null);

    try {
      const res = await fetch(apiUrl("/rag/answer"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, k: 4 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(JSON.stringify(data.detail));
        return;
      }

      setResult(normalizeRagResponse(data));
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