const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5000;

// Rate limiting — 3 roasts per IP per 24 hours
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: { error: 'You have reached your limit of 3 roasts for today. Come back tomorrow! 💀' },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Retry helper — retries on 429 rate limit errors
const generateWithRetry = async (model, prompt, retries = 3, delayMs = 30000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      const isRateLimit =
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('retryDelay') ||
        error?.message?.includes('RESOURCE_EXHAUSTED');

      if (isRateLimit && attempt < retries) {
        console.log(`[DEBUG] Rate limited by Gemini. Attempt ${attempt}/${retries}. Retrying in ${delayMs / 1000}s...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw error;
      }
    }
  }
};

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
    console.log('[DEBUG] Initializing gemini-2.5-flash model');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are RoastBot 3000 — a brutally honest AI comedian who reviews startup ideas like a panel of jaded VCs mixed with a stand-up comedian. You roast hard but you are never mean-spirited — the goal is to make founders laugh AND think.

Your response must be in this EXACT JSON format with no other text, no markdown, no code blocks — just raw JSON:
{
  "roast": "Main comedy roast text (3-4 paragraphs, funny, brutal, specific to their idea. Reference real competitors, market realities, common startup cliches)",
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
- gentle: Supportive roast, more encouragement, softer jokes, scores between 5-8
- medium: Balanced roast, funny but fair, scores between 4-7
- savage: No mercy, maximum brutality, compare to every competitor, scores between 2-6
- destroy: Absolute maximum roast, existential crisis level honesty, scores between 1-4

Rules:
- Always be SPECIFIC to their actual idea. Never give generic advice.
- Reference real competitors, real market data, real startup failures.
- The roast should make them laugh first, then think hard.
- Keep one_liner under 20 words — punchy and memorable.
- scores must be numbers between 1-10, not strings.
- Return ONLY the JSON object. No explanation, no markdown, no backticks.`;

    const prompt = `${systemPrompt}\n\nRoast this ${mode}: ${input}\nIntensity: ${intensity}`;

    console.log('[DEBUG] Calling Gemini AI with retry logic...');
    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const responseText = response.text();
    console.log('[DEBUG] Received Gemini Response');

    // Clean JSON — strip any accidental markdown
    const cleanedJson = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const roastData = JSON.parse(cleanedJson);
    console.log('[DEBUG] Successfully parsed JSON roast. Sending response.');
    res.json(roastData);

  } catch (error) {
    console.error('[CRITICAL] Error generating roast:', error);

    const isRateLimit =
      error?.status === 429 ||
      error?.message?.includes('429') ||
      error?.message?.includes('RESOURCE_EXHAUSTED');

    if (isRateLimit) {
      return res.status(429).json({
        error: 'Our AI is taking a breather. Please try again in 30 seconds. ☕',
        code: 'RATE_LIMITED'
      });
    }

    res.status(500).json({
      error: 'Failed to generate roast.',
      message: error.message
    });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'RoastBot 3000 is alive 💀', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`💀 RoastBot Server running on port ${port}`);
  console.log(`[DEBUG] Environment: PORT=${process.env.PORT}, GEMINI_KEY_SET=${!!process.env.GEMINI_API_KEY}`);
});
