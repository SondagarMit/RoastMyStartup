export default {
  async fetch(request, env) {
    // 1. CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // You can restrict this to your domain later
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. Handle Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const { input, mode, intensity } = await request.json();
      const apiKey = env.GEMINI_API_KEY;

      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Worker: API Key missing." }), { status: 500, headers: corsHeaders });
      }

      const systemPrompt = `You are RoastBot 3000 — a brutally honest AI comedian who reviews 
startup ideas like a panel of jaded VCs mixed with a stand-up comedian.
Your response must be in this EXACT JSON format (no other text):
{
  "roast": "Main comedy roast text",
  "reality_check": ["point 1", "point 2", "point 3", "point 4"],
  "scores": { "originality": 7, "market_fit": 4, "execution_risk": 8, "survivability": 5 },
  "one_liner": "Single funny one-liner",
  "startup_name": "Startup name"
}`;

      // 3. Call Gemini API Directly
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
      
      const geminiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: `${systemPrompt}\n\nUser Input: Roast this ${mode}: ${input}\nIntensity: ${intensity}` 
            }] 
          }],
          generationConfig: {
            response_mime_type: "application/json"
          }
        }),
      });

      const data = await geminiResponse.json();
      
      if (!geminiResponse.ok) {
        return new Response(JSON.stringify({ error: data.error?.message || "Gemini API error" }), { 
          status: geminiResponse.status, 
          headers: corsHeaders 
        });
      }

      // 4. Extract and Return
      const roastText = data.candidates[0].content.parts[0].text;
      return new Response(roastText, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  },
};
