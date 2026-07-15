export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  return res.status(200).json({ 
    score: 72,
    sentiment: "Bullish",
    bullets: [
      "Technology stocks continue showing strength.",
      "Interest rates remain stable.",
      "Long-term investors should stay diversified."
    ],
    goldenTip:
      "Never invest money you cannot afford to keep invested for the long term."
  });
}