export default async function handler(req, res) {
  // ✅ 1. ADD CORS HEADERS FIRST
  // This allows your Firebase frontend to talk to this Vercel backend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // You can replace '*' with 'https://thiruai.web.app' later for extra security
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // ✅ 2. Handle the "Pre-flight" request browsers send before POSTing
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // ✅ Safe message handling
    let message = "Hello Thiru";

    if (req.method === "POST" && req.body) {
      message = req.body.message || message;
    }

    // ✅ Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // ✅ Safe response parsing
    let reply = "AI not responding";

    if (data && data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0]?.content?.parts;
      if (parts && parts.length > 0) {
        reply = parts.map(p => p.text).join(" ");
      }
    }

    res.status(200).json({ reply });

  } catch (error) {
    // 🔥 show real error
    res.status(500).json({
      error: error.message
    });
  }
}
