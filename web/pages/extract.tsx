import { useState } from "react";
import { ExtractResponse } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ExtractPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
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
      <h1>Extract Entities</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
      />

      <button onClick={submit} disabled={!text}>
        Extract
      </button>

      {error && <p>{error}</p>}

      {result && (
        <ul>
          {result.entities.map((entity, idx) => (
            <li key={idx}>
              <span data-testid="entity-span">
                {entity.text} — {entity.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}