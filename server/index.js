const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5000;

// Security: Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Limit each IP to 3 requests per 24 hours
  message: { error: 'You have reached your limit of 3 roasts for today. Even we have to pay the electric bill! 💀' }
});

// Manual CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url}`);
  console.log(`[DEBUG] Origin: ${origin}`);
  
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    console.log('[DEBUG] Handled PREFLIGHT (OPTIONS)');
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use('/api/', limiter);

// OpenAI integration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/roast', async (req, res) => {
  console.log('-------------------------------------------');
  console.log(`[${new Date().toISOString()}] POST /api/roast`);
  const { input, mode, intensity } = req.body;
  console.log(`[DEBUG] Metadata: mode=${mode}, intensity=${intensity}`);
  console.log(`[DEBUG] Input Snippet: ${input?.substring(0, 50)}...`);

  if (!input) {
    console.warn('[ERROR] Request received with no input!');
    return res.status(400).json({ error: 'Startup data is required.' });
  }

  try {
    console.log('[DEBUG] Initializing gemini-1.5-flash model');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

Always be SPECIFIC to their actual idea. Never give generic advice.`;

    const prompt = `System Instructions: ${systemPrompt}\n\nUser Input: Roast this ${mode}: ${input}\nIntensity: ${intensity}`;

    console.log('[DEBUG] Calling Google Generative AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    console.log('[DEBUG] Received Generative AI Response');
    
    // Clean JSON from potential markdown markers
    const cleanedJson = responseText.replace(/`\`\`json|`\`\`/g, "").trim();
    const roastData = JSON.parse(cleanedJson);

    console.log('[DEBUG] Successfully generated JSON roast. Sending response.');
    res.json(roastData);
  } catch (error) {
    console.error('[CRITICAL] Error generating roast:', error);
    res.status(500).json({ 
      error: 'Failed to generate roast.', 
      message: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`💀 RoastBot Server running on port ${port}`);
  console.log(`[DEBUG] Environment: PORT=${process.env.PORT}, GEMINI_KEY_SET=${!!process.env.GEMINI_API_KEY}`);
});
