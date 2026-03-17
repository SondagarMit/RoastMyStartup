const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const db = admin.firestore();

exports.generateRoast = functions.https.onCall(async (data, context) => {
  const { input, mode, intensity } = data;
  const userId = context.auth ? context.auth.uid : null;
  const ip = context.rawRequest.headers["x-forwarded-for"] || context.rawRequest.socket.remoteAddress;
  
  // Rate limiting logic
  const today = new Date().toISOString().split('T')[0];
  const usageId = userId ? `${userId}_${today}` : `ip_${ip.replace(/\./g, '_')}_${today}`;
  const usageRef = db.collection("usage").doc(usageId);

  if (!input) {
    throw new functions.https.HttpsError("invalid-argument", "Input is required.");
  }

  try {
    // Check current usage
    const usageDoc = await usageRef.get();
    const currentCount = usageDoc.exists ? usageDoc.data().count : 0;

    if (currentCount >= 3) {
      throw new functions.https.HttpsError(
        "resource-exhausted", 
        "You've reached your limit of 3 roasts for today. Come back tomorrow or upgrade for more! 💀"
      );
    }

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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `System Instructions: ${systemPrompt}\n\nUser Input: Roast this ${mode}: ${input}\nIntensity: ${intensity}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Sometimes Gemini wraps JSON in markdown blocks
    const cleanedJson = responseText.replace(/```json|```/g, "").trim();
    const roastData = JSON.parse(cleanedJson);
    
    // Increment usage count after successful roast
    await usageRef.set({ count: currentCount + 1, lastUsed: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    
    // Also save the roast to user history if they are logged in
    if (userId) {
      await db.collection("roasts").add({
        userId,
        ...roastData,
        input,
        mode,
        intensity,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return roastData;
  } catch (error) {
    console.error("Error generating roast:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", "Failed to generate roast.");
  }
});
