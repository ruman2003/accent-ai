// Netlify Function: AI Coaching Proxy
// Keeps the API key server-side. Frontend calls /api/ai-coach (or /.netlify/functions/ai-coach)
// Set AI_COACH_API_KEY in Netlify dashboard → Environment Variables

exports.handler = async (event) => {
  const CORS = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type":                  "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST")    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method not allowed" }) };

  const API_KEY = process.env.AI_COACH_API_KEY;
  if (!API_KEY) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "AI_COACH_API_KEY not configured in Netlify env vars" }) };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid JSON body" }) }; }

  const { targetPhrase, spokenText, wordAccuracy, flowErrors, wrongWords, phrasePhonemes, topErrors, masteryScore } = body;
  if (!targetPhrase || !spokenText) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "targetPhrase and spokenText required" }) };

  const prompt = `You are an expert English accent and pronunciation coach. Respond ONLY in valid JSON, no markdown.

Target phrase: "${targetPhrase}"
Student said: "${spokenText}"
Word accuracy: ${wordAccuracy}%
Wrong/missing words: ${JSON.stringify(wrongWords || [])}
Flow errors — Start:${flowErrors?.start || 0} Middle:${flowErrors?.middle || 0} End:${flowErrors?.end || 0}
Key focus phonemes: ${JSON.stringify(phrasePhonemes || [])}
Student recurring top errors: ${JSON.stringify(topErrors || [])}
Lifetime mastery: ${masteryScore || 0}

Return EXACTLY this JSON (no extra fields, no markdown wrapper):
{
  "score": <integer 0-100>,
  "overall": "<one warm encouraging sentence>",
  "wellDone": "<specific praise for something done well>",
  "phonemeErrors": [
    {"phoneme":"<IPA>","word":"<word>","type":"substitution|deletion|distortion|insertion","heardAs":"<IPA>","fix":"<plain English mouth-position fix in 1 sentence>"}
  ],
  "flowNote": "<one sentence on where in the sentence breakdown occurred and why>",
  "drills": ["<10-second drill 1>","<10-second drill 2>","<10-second drill 3>"],
  "nativeTip": "<one insider tip a native speaker would give>",
  "nextFocus": "<single most important phoneme to work on next session>"
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-6",
        max_tokens: 900,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", res.status, errText);
      return { statusCode: res.status, headers: CORS, body: JSON.stringify({ error: "Upstream AI error", detail: errText }) };
    }

    const data   = await res.json();
    const raw    = data.content?.map(c => c.text || "").join("") || "";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    return { statusCode: 200, headers: CORS, body: JSON.stringify(parsed) };
  } catch (err) {
    console.error("ai-coach function error:", err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Internal error", message: err.message }) };
  }
};
