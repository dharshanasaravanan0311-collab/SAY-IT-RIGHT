# Say It Right — High-Stakes Communication Coach
> *"Help people say hard things in the right way."*

When you need to message a professor about an emergency extension, explain a production bug to your manager, or set a financial boundary with a friend, you know what you mean—but not how to say it. One wrong tone changes the whole message.

**Say It Right** is a pedagogical communication coach built for **first-year / first-generation university students and early-career interns**. It moves beyond generic AI text rewriters to **teach communication psychology**, deconstruct why your draft feels risky, and give you calibrated, authentic options.

---

## 🎯 The Niche: Campus to Career

First-gen students and interns often navigate the "hidden curriculum" of professional etiquette without a roadmap. When stakes are high, fear of negative evaluation leads to paralysis—drafting and deleting emails for 45+ minutes.

### Curated High-Stakes Scenarios:
1. **Academic Suite**:
   - 🎓 *Emergency Assignment Extension* (Asking for 48h during personal hardship without oversharing)
   - 🎓 *Respectful Grade Review / Regrade Inquiry* (Seeking rubric understanding without sounding entitled)
   - 🎓 *Letter of Recommendation Request* (Approaching faculty with sufficient lead time and materials)
   - 🎓 *Falling Behind / Missed Lectures* (Re-engaging after illness/burnout with an actionable recovery plan)
2. **Early Career Suite**:
   - 💼 *Pushing Back on Unrealistic Deadlines* (Negotiating scope/tradeoffs proactively)
   - 💼 *Reporting a Mistake / Production Bug* (Owning the incident and offering mitigation steps)
   - 💼 *Asking for Help When Blocked* (Using the 15-minute rule and structured problem summary)
3. **Crucial Personal Boundaries**:
   - 🤝 *Refusing to Lend Money/Gear* (Holding boundaries kindly without fake excuses)
   - 🤝 *Canceling a Commitment Last-Minute* (Burnout communication with proactive rescheduling)

---

## 🧠 Teaching, Not Just Rewriting: The 4 Pedagogical Pillars

### 1. Recipient Empathy Lens
Before drafting, the app simulates the recipient's reality:
> *"Professors receive 100+ emails/day. They are fatigued by open-ended excuses, but receptive to accountability, specific dates, and concise solutions."*

### 2. Tone & Risk Diagnostic (The Mirror)
- **Readiness Score (0–100%)**: Quantitative confidence gauge.
- **Tone Radar**: Assesses **Directness**, **Warmth**, **Assertiveness**, and **Professional Deference**.
- **Anti-Pattern Flags**: Pinpoints specific traps like *Over-Apologizing Syndrome* (apologizing 3+ times), *Excessive Throat-Clearing*, or *Buried Ask*.

### 3. Phrase-by-Phrase Diffs & The Lesson ("Why This Works")
Side-by-side interactive breakdown explaining the social psychology of every change:
- **Original:** *"I'm really sorry to bother you because I know you're super busy..."*
- **Calibrated:** *"I am writing to respectfully request a 48-hour extension..."*
- **Rule of Thumb:** *"Replace apologies with purposeful action."*
- **Psychological Principle:** *"Apologizing for emailing about a legitimate academic need creates friction. Stating your purpose upfront projects academic maturity."*

### 4. Next Step Simulator (Follow-Up Playbook)
Prepares the user for what comes next:
- Recommended response waiting window (e.g., 36–48h).
- Pre-scripted polite nudge template if there's no response.
- Graceful response template if the request is declined.

---

## 🚀 Quickstart & Running the App

### Requirements
- **Python 3.10+** (Uses Python standard library; **zero external dependencies required**).

### Start the Server
Double-click `run.bat` or run:
```bash
python app.py
```
Open your browser to:
👉 **`http://localhost:8000`**

---

## ⚡ Dual-Engine Architecture

1. **Built-in Zero-Latency Rule Engine**:
   - Works 100% offline with zero setup.
   - Computes syntactic anti-patterns, tone metrics, diffs, and calibrated options instantly.
2. **Google Gemini 2.5 Flash Mode**:
   - Enter your `GEMINI_API_KEY` in the top-right settings modal or in a `.env` file.
   - Unlocks open-ended real-time pedagogical coaching for any custom draft.

---

## 📂 Project Structure

```
h2s/
├── app.py                  # Threading HTTP server & REST API router
├── coach_engine.py         # Gemini API handler + smart pedagogical rule engine
├── scenarios.py            # Taxonomy of academic, career, and personal scenarios
├── static/
│   ├── index.html          # Clean coaching studio UI
│   ├── css/
│   │   └── styles.css      # Custom styles & animations
│   └── js/
│       └── app.js          # Reactive state, diff renderer & clipboard handlers
├── run.bat                 # One-click Windows runner
├── .env.example            # Environment variables template
└── README.md               # Documentation & project overview
```
