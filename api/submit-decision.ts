import { GoogleGenAI } from "@google/genai";
import { HISTORICAL_SCENARIOS } from "../src/data/scenariosData";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { ticker, decision } = req.body;

    const scenario = HISTORICAL_SCENARIOS.find(
      (s) => s.ticker === ticker
    );

    if (!scenario) {
      return res.status(404).json({
        error: "Scenario not found",
      });
    }

    const decisionDayPrice = scenario.prices[5].close;
    const futurePrice =
      scenario.prices[scenario.prices.length - 1].close;

    const priceDiffPercent =
      ((futurePrice - decisionDayPrice) / decisionDayPrice) * 100;

    let isCorrect = false;
    let rewardXP = 50;
    let outcomeMessage = "";

    switch (decision) {
      case "buy":
        if (priceDiffPercent > 10) {
          isCorrect = true;
          rewardXP = Math.round(100 + priceDiffPercent);
          outcomeMessage = `Spectacular decision! The stock surged by ${priceDiffPercent.toFixed(
            1
          )}% in the following months!`;
        } else {
          outcomeMessage = `Buying here resulted in a ${priceDiffPercent.toFixed(
            1
          )}% return over the next 180 days.`;
        }
        break;

      case "sell":
        if (priceDiffPercent < -10) {
          isCorrect = true;
          rewardXP = Math.round(
            100 + Math.abs(priceDiffPercent)
          );

          outcomeMessage = `Excellent decision! You avoided a ${Math.abs(
            priceDiffPercent
          ).toFixed(1)}% decline.`;
        } else {
          outcomeMessage = `Selling early missed a ${priceDiffPercent.toFixed(
            1
          )}% move upward.`;
        }
        break;

      case "hold":
        if (Math.abs(priceDiffPercent) <= 10) {
          isCorrect = true;
          rewardXP = 100;

          outcomeMessage = `Good patience! The stock remained relatively stable (${priceDiffPercent.toFixed(
            1
          )}%).`;
        } else {
          outcomeMessage = `Holding wasn't ideal. The stock moved ${priceDiffPercent.toFixed(
            1
          )}%.`;
        }
        break;

      default:
        return res.status(400).json({
          error: "Invalid decision",
        });
    }

    let aiAnalysis = "";

    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `
You are an elite Wall Street mentor.

Stock:
${scenario.name} (${scenario.ticker})

Scenario:
${scenario.scenarioName}

Context:
${scenario.description}

Decision:
${decision}

Decision Day Price:
$${decisionDayPrice.toFixed(2)}

180-Day Price:
$${futurePrice.toFixed(2)}

Price Change:
${priceDiffPercent.toFixed(1)}%

Correct:
${isCorrect}

Write a concise coaching explanation (max 150 words).

Structure:

1. The Catalyst

2. Mentorship Takeaway
`;

        const response =
          await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });

        aiAnalysis = response.text ?? "";
      } catch {
        aiAnalysis =
          `The Catalyst: ${scenario.description}\n\n` +
          `Mentorship Takeaway: Focus on understanding market catalysts and managing risk instead of reacting emotionally.`;
      }
    } else {
      aiAnalysis =
        `The Catalyst: ${scenario.description}\n\n` +
        `Mentorship Takeaway: Diversification and disciplined investing outperform emotional decision-making over time.`;
    }

    return res.status(200).json({
      isCorrect,
      rewardXP,
      outcomeMessage,
      priceChangePercent: priceDiffPercent,
      actualPrices: scenario.prices,
      aiAnalysis: aiAnalysis.trim(),
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
}