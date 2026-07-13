/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LearnTopic {
  id: string;
  category: "Basics" | "Analysis" | "Risk & Strategy";
  title: string;
  summary: string;
  illustration: string;
  content: string[];
  keyTerms: { term: string; definition: string }[];
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: "stock-market-101",
    category: "Basics",
    title: "What is the Stock Market?",
    summary: "The ultimate marketplace where fractional ownership of public companies is bought and sold.",
    illustration: "🏛️",
    content: [
      "Think of the stock market as a giant, highly regulated global superstore. Instead of groceries, the items on shelves are tiny fractions of massive corporations like Apple, Google, or Reliance.",
      "The primary purpose of the stock market is twofold: it allows companies to raise massive capital to expand, and it gives everyday citizens (retail investors) the opportunity to grow their wealth alongside those companies.",
      "When you buy a stock, you are purchasing an actual, legal slice of ownership in that company. If the company thrives, your slice becomes more valuable."
    ],
    keyTerms: [
      { term: "Stock Exchange", definition: "The platform (like NYSE, NASDAQ, or NSE) where buyers and sellers meet to trade stocks." },
      { term: "Retail Investor", definition: "An individual, non-professional investor who buys and sells securities for their personal account." }
    ]
  },
  {
    id: "stocks-vs-shares",
    category: "Basics",
    title: "Stocks vs. Shares",
    summary: "Understand the subtle grammatical and financial difference between these two common terms.",
    illustration: "🎫",
    content: [
      "While often used interchangeably in casual talk, 'Stock' and 'Share' have distinct precise meanings.",
      "'Stock' is a general term used to describe certificate-based ownership in one or more companies (e.g., 'I own tech stocks').",
      "'Share' refers to a specific, singular unit of ownership in a particular company (e.g., 'I own 50 shares of Apple stock').",
      "Owning more shares increases your percentage of ownership, voting rights (in some cases), and potential dividend payouts."
    ],
    keyTerms: [
      { term: "Equity", definition: "Ownership interest in a corporation, represented by shares of stock." },
      { term: "Dividend", definition: "A portion of a company's earnings distributed directly to its shareholders, usually quarterly." }
    ]
  },
  {
    id: "bull-vs-bear",
    category: "Basics",
    title: "Bull Market vs. Bear Market",
    summary: "The emotional charge of the market: charge upward like a bull, or swipe downward like a bear.",
    illustration: "🐂",
    content: [
      "The terms 'Bull' and 'Bear' represent the overall direction and investor sentiment of the stock market.",
      "A BULL MARKET occurs when stock prices are rising or expected to rise, driven by economic strength, high employment, and strong investor optimism. The name comes from how a bull charges—thrusting its horns UP into the air.",
      "A BEAR MARKET occurs when the market falls by 20% or more from recent highs. Investor sentiment is pessimistic, and economic contraction is feared. The name comes from how a bear swipes—sweeping its claws DOWN."
    ],
    keyTerms: [
      { term: "Market Sentiment", definition: "The collective attitude or crowd psychology of investors toward a stock or the broader market." },
      { term: "Correction", definition: "A short-term price decline of 10% or more, often viewed as a healthy reset during a bull market." }
    ]
  },
  {
    id: "ipo-demystified",
    category: "Basics",
    title: "Initial Public Offering (IPO)",
    summary: "How a private startup graduates into a public company on the global stage.",
    illustration: "🚀",
    content: [
      "An Initial Public Offering (IPO) is the very first time a private company sells its shares to the general public.",
      "Before an IPO, the company has a small number of private shareholders (founders, venture capitalists, early employees). During an IPO, investment banks price millions of new shares and list them on public exchanges.",
      "IPOs generate massive capital for the company to fund ambitious growth, but also subject it to strict public reporting, audit requirements, and market scrutiny."
    ],
    keyTerms: [
      { term: "Underwriter", definition: "An investment bank that manages the IPO process, values the company, and sells initial shares." },
      { term: "Lock-up Period", definition: "A window (usually 90-180 days) after the IPO during which company insiders cannot sell their shares." }
    ]
  },
  {
    id: "market-capitalization",
    category: "Basics",
    title: "Market Capitalization (Market Cap)",
    summary: "The price tag of an entire company. Size matters when choosing where to invest.",
    illustration: "🏷️",
    content: [
      "Market Capitalization is the total market value of all of a company's outstanding shares.",
      "It is calculated with a simple formula: **Market Cap = Share Price × Total Outstanding Shares**.",
      "Companies are grouped into three primary sizes: Large-Cap ($10B+; highly stable, slower growth), Mid-Cap ($2B-$10B; moderate risk, strong growth), and Small-Cap (under $2B; high risk, extreme growth potential)."
    ],
    keyTerms: [
      { term: "Outstanding Shares", definition: "The total number of shares currently held by all investors, including institutional holders and company insiders." },
      { term: "Blue Chip Stocks", definition: "Highly respected, financially sound, large-cap companies with a track record of stable performance." }
    ]
  },
  {
    id: "trading-volume",
    category: "Basics",
    title: "Trading Volume",
    summary: "The heartbeat of stock liquidities. High volume means high conviction.",
    illustration: "📈",
    content: [
      "Trading volume is the total number of shares of a stock bought and sold during a specific time period (usually a single day).",
      "Volume represents interest and momentum. A large price movement accompanied by high volume indicates high investor conviction and institutional participation.",
      "Low volume indicates low interest, meaning the stock might have wide price spreads (illiquidity) making it harder to buy or sell quickly without shifting the price."
    ],
    keyTerms: [
      { term: "Liquidity", definition: "How easily an asset can be converted into cash without affecting its market price." },
      { term: "Spread", definition: "The difference between the highest price a buyer is willing to pay (bid) and the lowest price a seller is willing to accept (ask)." }
    ]
  },
  {
    id: "candlestick-patterns",
    category: "Analysis",
    title: "Candlestick Patterns",
    summary: "The language of traders. Read the battle lines between bulls and bears.",
    illustration: "🕯️",
    content: [
      "A candlestick chart displays the high, low, opening, and closing prices of a security for a specific period.",
      "The thick part is the 'body', showing the range between open and close. If the body is green (or white), the stock closed higher than it opened. If red (or black), it closed lower.",
      "The thin lines stretching above and below are 'shadows' or 'wicks', representing the highest and lowest prices reached during that period.",
      "Patterns of candlesticks (like Doji, Hammer, or Engulfing) help traders predict future market sentiment and directional shifts."
    ],
    keyTerms: [
      { term: "Doji", definition: "A candlestick with an extremely small body, signaling complete indecision between buyers and sellers." },
      { term: "Hammer", definition: "A bullish reversal candlestick with a small upper body and a long lower wick, indicating sellers pushed hard but buyers rallied." }
    ]
  },
  {
    id: "technical-analysis",
    category: "Analysis",
    title: "Technical Analysis",
    summary: "Predicting future prices by studying historic price trends and charts.",
    illustration: "📊",
    content: [
      "Technical Analysis is a methodology for forecasting price directions through the study of past market data, primarily price and volume.",
      "Unlike fundamentalists, technical analysts do not look at a company's products, balance sheet, or management. They believe that 'all public information is already reflected in the stock price' and that prices move in predictable patterns.",
      "Key tools include Support/Resistance levels, Moving Averages, and oscillators like the Relative Strength Index (RSI)."
    ],
    keyTerms: [
      { term: "Support", definition: "A price level where buying interest is strong enough to overcome selling pressure, pausing a decline." },
      { term: "Resistance", definition: "A price level where selling interest is strong enough to overcome buying pressure, pausing an advance." }
    ]
  },
  {
    id: "fundamental-analysis",
    category: "Analysis",
    title: "Fundamental Analysis",
    summary: "Measuring a company's intrinsic value by digging into its financials, management, and industry.",
    illustration: "🔍",
    content: [
      "Fundamental Analysis is the practice of evaluating a stock's value based on its financial performance and economic foundation.",
      "You examine the company's Balance Sheet (assets and liabilities), Income Statement (revenues, expenses, profits), and Cash Flow.",
      "The ultimate goal is to find 'undervalued' stocks—excellent businesses trading for less than their actual worth, which are likely to appreciate in the long run."
    ],
    keyTerms: [
      { term: "P/E Ratio", definition: "Price-to-Earnings ratio. Calculated as stock price divided by annual earnings per share. High P/E can mean growth or overvaluation." },
      { term: "Intrinsic Value", definition: "The actual, objective, calculated economic value of a company, independent of its current stock price." }
    ]
  },
  {
    id: "risk-management",
    category: "Risk & Strategy",
    title: "Risk Management",
    summary: "The difference between an investor and a gambler. Survive to win.",
    illustration: "🛡️",
    content: [
      "The number one rule of trading is not 'making money'—it is 'capital preservation'. If you run out of capital, you cannot play the game.",
      "Risk management involves planning your trade sizes, setting strict exit boundaries, and emotional self-control.",
      "An essential tool is the Stop-Loss Order—an automatic instruction to sell a stock once it drops to a predetermined price, capping your maximum loss."
    ],
    keyTerms: [
      { term: "Stop-Loss Order", definition: "An order placed with a broker to sell a security when it reaches a certain price limit to limit losses." },
      { term: "Risk/Reward Ratio", definition: "A calculation comparing the potential profit of a trade to the potential maximum loss. A good ratio is 1:2 or higher." }
    ]
  },
  {
    id: "diversification",
    category: "Risk & Strategy",
    title: "Diversification",
    summary: "Don't put all your golden eggs in one single basket.",
    illustration: "🧺",
    content: [
      "Diversification is an investment strategy that spreads capital across various assets, sectors, and industries to reduce risk.",
      "If you put 100% of your money into one airline stock, and a global pandemic hits, your entire portfolio crashes. If you split your capital across Tech, Healthcare, Utilities, and Consumer Goods, a crash in one sector will be cushioned by stability or gains in others.",
      "Diversification reduces unsystematic risk—the risk associated with a specific company or sector."
    ],
    keyTerms: [
      { term: "Asset Allocation", definition: "The distribution of an investment portfolio across broad asset classes, such as stocks, bonds, cash, or real estate." },
      { term: "ETF", definition: "Exchange-Traded Fund. A single basket of securities (stocks, bonds, etc.) that trades on an exchange, offering instant diversification." }
    ]
  },
  {
    id: "long-term-investing",
    category: "Risk & Strategy",
    title: "Long-Term Investing & Compounding",
    summary: "The eighth wonder of the world: money making money on top of money.",
    illustration: "⏳",
    content: [
      "Long-term investing focuses on holding assets for years or decades, ignoring short-term market noise and daily price fluctuations.",
      "This strategy harnesses the power of Compound Interest, where the returns you earn on your investments start generating their own returns.",
      "Historically, despite dozens of recessions, wars, and bubbles, the broader stock market has consistently climbed over multi-decade periods, rewarding patient investors."
    ],
    keyTerms: [
      { term: "Compound Interest", definition: "Interest or investment gains calculated on both the initial principal and the accumulated interest from prior periods." },
      { term: "HODL", definition: "A popular investment slang representing 'Hold On for Dear Life'—refusing to sell assets during major market panics." }
    ]
  },
  {
    id: "beginner-mistakes",
    category: "Risk & Strategy",
    title: "Common Beginner Mistakes",
    summary: "Avoid the psychological traps that wipe out 90% of rookie accounts.",
    illustration: "⚠️",
    content: [
      "1. **FOMO (Fear Of Missing Out)**: Buying a stock when it is already at an all-time high, driven by news hype, right before smart money sells.",
      "2. **Catching a Falling Knife**: Buying a stock that is crashing rapidly under the assumption that 'it has to go back up', without understanding the fundamental problems causing the crash.",
      "3. **Overtrading**: Buying and selling constantly throughout the day, racking up commission fees and letting short-term stress dictate decisions.",
      "4. **Revenge Trading**: Increasing your position sizes immediately after a loss to try and 'win the money back', which leads to even larger emotional losses."
    ],
    keyTerms: [
      { term: "FOMO", definition: "Fear of Missing Out. An emotional state where an investor buys high because they fear others are getting rich without them." },
      { term: "Sunk Cost Fallacy", definition: "Continuing to put money into a bad investment because you have already invested so much, rather than cutting losses." }
    ]
  }
];
