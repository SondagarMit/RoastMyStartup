import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, mode, intensity } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in environment variables");
    return res.status(500).json({ error: 'Backend misconfigured: API Key missing.' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are RoastBot 3000 — a brutally honest AI comedian who reviews 
startup ideas like a panel of jaded VCs mixed with a stand-up comedian.
You roast hard but you're never mean-spirited — the goal is to make 
founders laugh AND think.

Your response must be in this EXACT JSON format (no other text):
{
  "roast": "Main comedy roast text (3-4 paragraphs, funny, brutal, specific to their idea. Reference real competitors, market realities, common startup clichés)",
  "reality_check": [
    "Real actionable feedback point 1",
    "Real actionable feedback point 2", 
    "Real actionable feedback point 3",
    "Real actionable feedback point 4"
  ],
  "scores": {
    "originality": 7,
    "market_fit": 4,
    "execution_risk": 8,
    "survivability": 5
  },
  "one_liner": "Single most brutal/funny one-liner from the roast (used for share card)",
  "startup_name": "What you think their startup is called or should be called"
}

Intensity levels:
- gentle: Supportive roast, more encouragement, softer jokes
- medium: Balanced roast, funny but fair  
- savage: No mercy, maximum brutality, compare to every competitor
- destroy: Absolute maximum roast, existential crisis level honesty

Always be SPECIFIC to their actual idea. Never give generic advice.
If given a URL, roast the actual content, design choices, copy, 
and positioning you can infer.`;

    const prompt = `System Instructions: ${systemPrompt}\n\nUser Input: Roast this ${mode}: ${input}\nIntensity: ${intensity}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Sometimes Gemini wraps JSON in markdown blocks
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    const roastData = JSON.parse(cleanedJson);
    
    return res.status(200).json(roastData);
  } catch (error) {
    console.error("Error generating roast:", error);
    return res.status(500).json({ error: 'Failed to generate roast.' });
  }
}
