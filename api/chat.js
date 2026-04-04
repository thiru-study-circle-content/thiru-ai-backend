=export default async function handler(req, res) {
  try {
    const message =
      req.method === "POST"
        ? req.body?.message
        : "Hello Thiru";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    // 🔥 SAFE RESPONSE EXTRACTION
    let reply = "No reply";

    if (data && data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0]?.content?.parts;
      if (parts && parts.length > 0) {
        reply = parts.map(p => p.text).join(" ");
      }
    }

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: error.message });
  }
}
