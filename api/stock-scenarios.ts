import { HISTORICAL_SCENARIOS } from "../src/data/scenariosData";

export default async function handler(req: any, res: any) {
  try {
    const safeScenarios = HISTORICAL_SCENARIOS.map((sc) => ({
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
      prices: sc.prices.slice(0, 6),
    }));

    res.status(200).json(safeScenarios);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
}