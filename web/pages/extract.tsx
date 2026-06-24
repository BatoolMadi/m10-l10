import { useState } from "react";
import { apiUrl } from "../lib/api";
import { ExtractResponse } from "../lib/types";

function normalizeExtractResponse(data: Record<string, unknown>): ExtractResponse {
  const entities = Array.isArray(data.entities) ? data.entities : [];
  return {
    entities: entities.map((entity) => {
      const record = entity as Record<string, unknown>;
      return {
        text: String(record.text ?? ""),
        label: String(record.label ?? record.type ?? ""),
        start: typeof record.start === "number" ? record.start : 0,
        end: typeof record.end === "number" ? record.end : 0,
      };
    }),
  };
}

export default function ExtractPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setResult(null);

    try {
      const res = await fetch(apiUrl("/extract"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(JSON.stringify(data.detail));
        return;
      }

      setResult(normalizeExtractResponse(data));
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