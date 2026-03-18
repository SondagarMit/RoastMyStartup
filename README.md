# 💀 Roast My Startup (RoastBot 3000)

**Roast My Startup** is a brutally honest AI-powered platform that reviews your startup ideas with the wit of a jaded VC and the timing of a stand-up comedian. It doesn't just roast you for the sake of it — it gives you the reality check you didn't know you needed.

---

## ⚡ Technical Flow

1.  **Input Phase**: User submits startup details (mode, description, intensity).
2.  **API Request**: The frontend sends a POST request to `/api/roast`.
3.  **Refinement Layer**:
    *   **Rate Limiting**: Express middleware limits each IP to **3 roasts per 24 hours**.
    *   **Trust Proxy**: Configured to accurately identify client IPs behind load balancers.
4.  **AI Engine (Gemini 2.5 Flash)**:
    *   **System Prompting**: Injects a personality layer (RoastBot 3000) into the LLM.
    *   **Retry Logic**: Implemented a custom exponential backoff helper that handles `429 RESOURCE_EXHAUSTED` errors from the Gemini API, ensuring higher reliability during peak traffic.
5.  **Output Generation**: Returns a structured JSON containing a comedy roast, actionable feedback, scores, and a shareable one-liner.

---

## 🧠 Core Logic & Innovation

### 🔄 Gemini Retry Helper
The server features a robust retry mechanism to handle the volatility of AI rate limits:
```javascript
const generateWithRetry = async (model, prompt, retries = 3, delayMs = 30000) => {
  // Retries specifically on 429 errors with a 30s delay
  // Ensures standard users don't face "Server Errors" due to API limits
}
```

### 🎭 Intensity Scaling
The prompt dynamically adjusts its "mercilessness" based on user selection:
*   **Gentle**: Encouraging jokes, supportive scores (5-8).
*   **Medium**: Fair but funny.
*   **Savage**: Maximum brutality, direct competitor comparisons.
*   **Destroy**: Existential crisis level honesty (scores 1-4).

---

## 🎨 Design System & Color Palette

The project uses a **Rich Dark / Cyber-Vibrant** aesthetic designed to feel premium yet edgy.

| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Rich Black** | `#0a0a0a` | Main Background |
| **Card Grey** | `#111111` | Surface levels / Glassmorphism |
| **Electric Red**| `#ff3131` | Primary Actions / Branding |
| **Neon Orange** | `#ff6b00` | Secondary accents / Flames |
| **Spring Green**| `#00ff88` | Success states / Positive badges |
| **Pure White**  | `#ffffff` | Primary Typography |
| **Muted Grey**  | `#666666` | Secondary details / Metadata |

### Typography
*   **Headings**: `Syne` — A wide, modern geometric font for a bold presence.
*   **Body**: `Inter` — For maximum readability in dense roast texts.

---

## 🛠️ Project Structure

```text
├── server/             # Express.js Proxy (AI logic & Rate limiting)
├── src/                # React (Vite) Frontend
│   ├── components/     # UI Design System
│   ├── pages/          # Application Views
│   └── context/        # State Management
├── public/             # Static Assets
└── functions/          # Firebase Cloud Functions (Alternative deployment)
```

## 🚀 Deployment

The project is configured for multi-platform deployment:
*   **Frontend**: Hosted on **Firebase Hosting** or **Vercel**.
*   **Backend**: Deployed as a standalone Node server or via **Firebase Functions**.

---

*Built with salt, tears, and Google Gemini AI.*
