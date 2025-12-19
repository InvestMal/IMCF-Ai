import { Asset, NewsItem } from '../types';

const IMPACT_KEYWORDS = {
  High: ['fed', 'rate', 'inflation', 'cpi', 'fomc', 'crash', 'surge', 'record', 'plunge', 'crisis', 'war', 'ban', 'sec', 'lawsuit', 'approval', 'stimulus', 'debt', 'default'],
  Medium: ['earnings', 'forecast', 'support', 'resistance', 'upgrade', 'downgrade', 'momentum', 'volume', 'partnership', 'launch', 'merger', 'acquisition', 'profit'],
  Low: ['commentary', 'update', 'analysis', 'preview', 'recap', 'watch', 'opinion', 'summary']
};

const determineImpact = (text: string): 'High' | 'Medium' | 'Low' => {
  const lower = text.toLowerCase();
  if (IMPACT_KEYWORDS.High.some(k => lower.includes(k))) return 'High';
  if (IMPACT_KEYWORDS.Medium.some(k => lower.includes(k))) return 'Medium';
  return 'Low';
};

const SIMULATED_HEADLINES = [
  "Central banks signal potential shift in monetary policy amid global growth concerns.",
  "Institutional outflows detected in {ASSET} derivatives markets.",
  "Technical breakout above key moving averages sparks retail interest in {SYMBOL}.",
  "Analysts revise Q3 targets for {CATEGORY} sector citing supply chain easing.",
  "Regulatory body announces new framework for digital asset custody.",
  "Market sentiment shifts to 'Risk-Off' ahead of upcoming economic data prints.",
  "Liquidity crunch fears subside as overnight repo operations stabilize.",
  "{SYMBOL} correlation with equities reaches 3-month high.",
  "Hedge funds increase short exposure to {ASSET} as volatility metrics climb.",
  "Global trade data suggests cooling demand, impacting {CATEGORY} valuations."
];

const SOURCES = ["Bloomberg", "Reuters", "Financial Times", "WSJ Markets", "CNBC", "CoinDesk", "The Block", "Barron's"];

const generateSimulatedNews = (asset: Asset, count: number = 5): NewsItem[] => {
  return Array.from({ length: count }).map((_, i) => {
    const template = SIMULATED_HEADLINES[Math.floor(Math.random() * SIMULATED_HEADLINES.length)];
    const headline = template
      .replace("{ASSET}", asset.name)
      .replace("{SYMBOL}", asset.symbol)
      .replace("{CATEGORY}", asset.category);
    
    return {
      id: `sim-${Date.now()}-${i}`,
      time: Date.now() - (i * 1000 * 60 * Math.random() * 60), // Scattered over last hour
      source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
      headline,
      impact: determineImpact(headline)
    };
  });
};

export const fetchNews = async (asset: Asset): Promise<NewsItem[]> => {
  let newsItems: NewsItem[] = [];

  // REAL API integration for Crypto (Public Endpoint)
  if (asset.category === 'Crypto') {
    try {
      // Fetching from CryptoCompare Public News API
      const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
      if (response.ok) {
        const data = await response.json();
        
        if (data.Data) {
            // Filter specifically for the asset if possible, or take general crypto news
            // Simple keyword filtering for relevance
            const assetKeywords = [asset.symbol.split('/')[0], asset.name, 'Market', 'Bitcoin', 'Ethereum', 'Crypto'];
            
            newsItems = data.Data
                .filter((item: any) => {
                    const content = (item.title + item.body).toLowerCase();
                    // If generic crypto request, return all, otherwise filter
                    return assetKeywords.some(kw => content.includes(kw.toLowerCase()));
                })
                .map((item: any) => ({
                    id: item.id,
                    time: item.published_on * 1000,
                    source: item.source_info.name,
                    headline: item.title,
                    impact: determineImpact(item.title + " " + item.body)
                }));
        }
      }
    } catch (error) {
      console.warn("Failed to fetch real crypto news, falling back to simulation.", error);
      // Fallback to simulation if API fails
      newsItems = generateSimulatedNews(asset);
    }
  } else {
    // Simulation for other assets (due to lack of free public API keys for Real-time Equities/Forex news)
    // In a production environment, this would integrate with BloombergAPI, Refinitiv, or similar.
    await new Promise(r => setTimeout(r, 600)); // Simulate network latency
    newsItems = generateSimulatedNews(asset, 8);
  }

  // Fallback if API returned empty list
  if (newsItems.length === 0) {
      newsItems = generateSimulatedNews(asset);
  }

  // Filter and Rank
  // 1. Filter out very old news (older than 24h)
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  newsItems = newsItems.filter(n => n.time > cutoff);

  // 2. Rank by Impact (High first) then Time (Newest first)
  return newsItems.sort((a, b) => {
    const impactScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const scoreA = impactScore[a.impact];
    const scoreB = impactScore[b.impact];
    
    if (scoreA !== scoreB) return scoreB - scoreA; // High impact first
    return b.time - a.time; // Then recent first
  });
};