export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let message = "Hello";
    if (req.method === "POST" && req.body) {
      message = req.body.message || message;
    }

    // ✅ Call Gemini API with the NEW 2.5 model
    const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${process.env.GEMINI_API_KEY}`      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    // Check if Google sent an error back
    if (!response.ok) {
      return res.status(200).json({ 
        reply: `Google Error: ${data.error?.message || "Check Vercel Logs"}` 
      });
    }

    // Safe response parsing
    let reply = "AI not responding";
    if (data && data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0]?.content?.parts;
      if (parts && parts.length > 0) {
        reply = parts.map(p => p.text).join(" ");
      }
    }

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: `Vercel Error: ${error.message}` });
  }
}
