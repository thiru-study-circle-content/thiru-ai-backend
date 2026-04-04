export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let userMsg = "Hello";
    if (req.method === "POST" && req.body) {
      userMsg = req.body.message || userMsg;
    }

    // ✅ UPDATED FOR APRIL 2026 STABILITY
    const apiURL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
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
        reply: `Google Error: ${data.error?.message || "Model Name Issue"}` 
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
