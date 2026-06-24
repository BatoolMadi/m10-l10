import { useState } from "react";
import { apiUrl } from "../lib/api";
import { KGResponse } from "../lib/types";

function normalizeKgResponse(data: Record<string, unknown>): KGResponse {
  if (Array.isArray(data.rows)) {
    return data as unknown as KGResponse;
  }

  const results = Array.isArray(data.results) ? data.results : [];
  return {
    cypher: typeof data.cypher === "string" ? data.cypher : "",
    rows: results.map((row) => {
      const record = row as Record<string, unknown>;
      return {
        id: record.id,
        recipe: record.recipe ?? record.name ?? "",
      };
    }),
    count: typeof data.count === "number" ? data.count : results.length,
  };
}

export default function KgPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<KGResponse | null>(null);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setResult(null);

    try {
      const res = await fetch(apiUrl("/kg/query"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(JSON.stringify(data.detail));
        return;
      }

      setResult(normalizeKgResponse(data));
    } catch {
      setError("Could not reach the backend.");
    }
  }

  return (
    <main>
      <h1>Knowledge Graph — Recipe Query</h1>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. find vegetarian recipes"
      />

      <button onClick={submit} disabled={!question}>
        Ask
      </button>

      {error && <p>{error}</p>}

      {result && (
        <>
          <pre>{result.cypher}</pre>

          <table>
            <thead>
              <tr>
                <th>Recipe</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, idx) => (
                <tr key={idx} data-testid="kg-row">
                  <td>{row.recipe}</td>
                  <td>{row.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}