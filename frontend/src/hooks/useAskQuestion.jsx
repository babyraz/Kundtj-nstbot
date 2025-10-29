import { useState } from "react";

const API_URL = "http://localhost:3000/api/ask";

export function useAskQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function askQuestion(question) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ question }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const { answer } = await response.json();
      return answer;
    } catch (err) {
      console.error("Fetch error:", err);

      const message = err.message || "Kunde inte få ett svar, försök igen senare.";
      setError(message);
      return message;
    } finally {
      setLoading(false);
    }
  }

  return { askQuestion, loading, error };
}