import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Define historical scenario type
interface StockScenario {
  ticker: string;
  name: string;
  logo: string;
  scenarioName: string;
  description: string;
  startDate: string;
  prices: { date: string; open: number; high: number; low: number; close: number; volume: number }[];
  marketCap: string;
  peRatio: string;
  high52Week: number;
  low52Week: number;
  volatility: string;
  riskScore: number; // 1-100
  aiContext: string; // Background for Gemini
}

import { HISTORICAL_SCENARIOS } from "./src/data/scenariosData";

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get available game scenarios / tickers
  app.get("/api/stock-scenarios", (req, res) => {
    try {
      // Return details without revealing future outcome days to prevent cheating!
      const safeScenarios = HISTORICAL_SCENARIOS.map((sc) => {
        const visiblePrices = sc.prices.slice(0, 6); // Only the first 6 days (up to decision day)
        return {
          ticker: sc.ticker,
          name: sc.name,
          logo: sc.logo,
          scenarioName: sc.scenarioName,
          description: sc.description,
          startDate: sc.startDate,
          marketCap: sc.marketCap,
          peRatio: sc.peRatio,
          high52Week: sc.high52Week,
          low52Week: sc.low52Week,
          volatility: sc.volatility,
          riskScore: sc.riskScore,
          prices: visiblePrices,
        };
      });
      res.json(safeScenarios);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Submit game prediction and get outcome + AI coaching explanation
  app.post("/api/submit-decision", async (req, res) => {
    try {
      const { ticker, decision } = req.body; // decision: 'buy' | 'sell' | 'hold'
      const scenario = HISTORICAL_SCENARIOS.find((sc) => sc.ticker === ticker);

      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }

      // Calculate outcome score
      const decisionDayPrice = scenario.prices[5].close;
      const futurePrice = scenario.prices[scenario.prices.length - 1].close; // 180d price
      const priceDiffPercent = ((futurePrice - decisionDayPrice) / decisionDayPrice) * 100;

      let isCorrect = false;
      let outcomeMessage = "";
      let rewardXP = 50;

      if (decision === "buy") {
        if (priceDiffPercent > 10) {
          isCorrect = true;
          rewardXP = Math.round(100 + priceDiffPercent);
          outcomeMessage = `Spectacular decision! The stock surged by ${priceDiffPercent.toFixed(1)}% in the subsequent months!`;
        } else {
          isCorrect = false;
          outcomeMessage = `Ouch! Buying here led to a poor return. The stock ended with a change of ${priceDiffPercent.toFixed(1)}% over the next 180 days.`;
        }
      } else if (decision === "sell") {
        // 'Sell' is correct if the stock crashed or performed poorly (< 0%)
        if (priceDiffPercent < -10) {
          isCorrect = true;
          rewardXP = Math.round(100 + Math.abs(priceDiffPercent));
          outcomeMessage = `Masterful! You avoided a devastating drop of ${Math.abs(priceDiffPercent).toFixed(1)}%!`;
        } else {
          isCorrect = false;
          outcomeMessage = `Missed out! Selling here was premature. The stock went up by ${priceDiffPercent.toFixed(1)}%.`;
        }
      } else if (decision === "hold") {
        // 'Hold' is correct if the stock was flat (between -10% and +10%)
        if (Math.abs(priceDiffPercent) <= 10) {
          isCorrect = true;
          rewardXP = 100;
          outcomeMessage = `Smart and conservative! The stock remained relatively stable, moving only ${priceDiffPercent.toFixed(1)}%.`;
        } else {
          isCorrect = false;
          outcomeMessage = `Hold was incorrect. The stock didn't stay flat; it moved dramatically by ${priceDiffPercent.toFixed(1)}%.`;
        }
      }

      // Generate AI Coaching Insights using Gemini
      let aiAnalysis = "";
      if (process.env.GEMINI_API_KEY) {
        try {
          const prompt = `
            You are a elite Wall Street mentor coaching a student playing 'Stock Survivor'.
            The student made a '${decision.toUpperCase()}' decision on ${scenario.name} (${scenario.ticker}) during the historical scenario: "${scenario.scenarioName}".
            
            Historical Factsheet:
            - Context: ${scenario.description}
            - Price on Decision Day: $${decisionDayPrice.toFixed(2)}
            - Price 180 Days Later: $${futurePrice.toFixed(2)} (${priceDiffPercent.toFixed(1)}% change)
            - Student Decision: ${decision.toUpperCase()}
            - Was student correct? ${isCorrect ? "YES" : "NO"}

             Provide a concise, extremely high-value professional explanation (max 150 words) structured as follows:
            1. **The Catalyst**: Briefly state what real-world events caused this outcome.
            2. **The Mentorship Takeaway**: Give an invaluable rule or nugget of wisdom regarding risk management, technical trend prediction, or emotional bias that applies to this scenario.

            Keep it professional, engaging, and friendly. Do not output JSON or Markdown headers, just use clean bold bullet points or short paragraphs.
          `;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              temperature: 0.7,
            }
          });
          aiAnalysis = response.text || "";
        } catch (aiErr) {
          console.error("Gemini call failed, using fallback coaching:", aiErr);
          aiAnalysis = `**The Catalyst**: ${scenario.description} \n\n**Mentorship Takeaway**: In high-stakes events, market momentum or fundamental changes can overshadow short-term noise. Always match your risk capacity to the volatility.`;
        }
      } else {
        aiAnalysis = `**The Catalyst**: ${scenario.description} \n\n**Mentorship Takeaway**: Understanding catalysts is the key to survivability. High-stakes market scenarios require studying the fundamentals, managing cash flows, and sizing positions carefully to withstand emotional swings.`;
      }

      res.json({
        isCorrect,
        outcomeMessage,
        priceChangePercent: priceDiffPercent,
        rewardXP,
        actualPrices: scenario.prices, // Reveal ALL prices for playback/replay charts!
        aiAnalysis: aiAnalysis.trim()
      });

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: AI-Based Daily Stock Market Tip / Analysis
  app.get("/api/market-sentiment", async (req, res) => {
    try {
      if (process.env.GEMINI_API_KEY) {
        const prompt = `
          Generate a beautiful daily market sentiment report for a stock learning platform.
          Include:
          1. Overall Sentiment Index (e.g. 68/100, Mildly Bullish)
          2. Three dynamic bullet points of 'Hot Market Focus' (AI boom, inflation, interest rate shifts)
          3. One Golden Investing Tip for beginners.

          Format as strict JSON:
          {
            "score": 68,
            "sentiment": "Mildly Bullish",
            "bullets": ["Point 1", "Point 2", "Point 3"],
            "goldenTip": "Your golden investing tip here."
          }
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const jsonStr = response.text?.trim() || "{}";
        res.json(JSON.parse(jsonStr));
      } else {
        // High-quality static fallback to keep the experience polished
        res.json({
          score: 72,
          sentiment: "Bullish (AI Tech Surge)",
          bullets: [
            "Tech Sector leadership remains dominant, powered by continuous capital investments in compute infrastructure.",
            "Federal Reserve signals a stable pause on interest rates, reassuring retail liquidity and equity inflows.",
            "Defensive utilities and oil show subtle consolidations as commodities adjust to global trade demands."
          ],
          goldenTip: "Never buy a stock solely because its price is moving up. Investigate the underlying 'moat' and cash flows first."
        });
      }
    } catch (err: any) {
      res.json({
        score: 65,
        sentiment: "Stable / Consolidation",
        bullets: [
          "Broader market indices fluctuate within narrow historical bands.",
          "Bond yields stabilize, drawing some conservative asset allocation.",
          "Retail volumes remain healthy as learning platforms rise."
        ],
        goldenTip: "Diversification is your armor in volatile markets. Do not place all your resources into a single stock."
      });
    }
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
