const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security: Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Too many roasts from this IP, please try again tomorrow.' }
});

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://roastmystartup-7c06e.web.app',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use('/api/', limiter);

// OpenAI integration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/roast', async (req, res) => {
  const { input, mode, intensity } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Startup data is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean JSON from potential markdown markers
    const cleanedJson = responseText.replace(/`\`\`json|`\`\`/g, "").trim();
    const roastData = JSON.parse(cleanedJson);

    res.json(roastData);
  } catch (error) {
    console.error('Error in /api/roast:', error);
    res.status(500).json({ error: 'Failed to generate roast. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`💀 RoastBot Server running at http://localhost:${port}`);
});
