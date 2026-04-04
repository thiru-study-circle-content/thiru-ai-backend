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
    let userMsg = req.body?.message || "Hello";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // ✅ UPDATED MODEL NAME FOR APRIL 2026
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: userMsg }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ 
        reply: `Groq Error: ${data.error?.message || "Check API Key"}` 
      });
    }

    const aiReply = data.choices[0]?.message?.content || "AI not responding";
    res.status(200).json({ reply: aiReply });

  } catch (err) {
    res.status(500).json({ reply: `Server Error: ${err.message}` });
  }
}
