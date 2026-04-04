export default async function handler(req, res) {
  // 1. Set CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 2. Handle Preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let userMsg = "Hello";
    if (req.method === "POST" && req.body) {
      userMsg = req.body.message || userMsg;
    }

    // 3. Call Gemini 3 API (Corrected Syntax for 2026)
    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMsg }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ 
        reply: `Google Error: ${data.error?.message || "Check API Key"}` 
      });
    }

    let aiReply = "AI not responding";
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      aiReply = data.candidates[0].content.parts[0].text;
    }

    res.status(200).json({ reply: aiReply });

  } catch (err) {
    res.status(500).json({ reply: `Vercel Error: ${err.message}` });
  }
}
