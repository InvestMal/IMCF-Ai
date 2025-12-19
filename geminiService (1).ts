import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, MarketMetrics, Asset, NewsItem } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_PROMPT = `
You are the Chief AI & Quantitative Research Lead for InvestMal AI, an institutional-grade market intelligence platform.
Your Role: Analyze raw market technicals and simulated news wire to provide high-level, risk-aware context.
Rules:
1. STRICTLY FORBIDDEN: Do not provide Buy, Sell, Entry, or Exit signals.
2. STRICTLY FORBIDDEN: Do not mention leverage or specific price targets.
3. Tone: Professional, Executive, "Bloomberg Terminal" style. Concise.
4. Focus on Market Structure (Trending, Ranging), Volatility Regimes, and Risk anomalies.
5. CORRELATE technical data with the provided news headlines if relevant.
6. Provide detailed breakdown of narrative points and specific risk factors.
`;

export const analyzeMarket = async (
  asset: Asset,
  currentPrice: number,
  metrics: MarketMetrics,
  recentNews: NewsItem[]
): Promise<AIAnalysisResult> => {
  if (!process.env.API_KEY) {
    // Fallback if no key
    return {
      marketState: 'Uncertain',
      narrativePoints: [{
        headline: "System Offline",
        explanation: "API Key missing. System running in disconnected simulation mode. Please configure API_KEY.",
        confidence: 0
      }],
      riskAnalysis: {
        overallRisk: 'Critical',
        factors: [{ factor: "Missing Credentials", severity: "High" }]
      },
      mainConfidenceScore: 0,
      timestamp: Date.now()
    };
  }

  // Format news for prompt
  const newsContext = recentNews.slice(0, 3).map(n => `- [${n.source}] ${n.headline}`).join('\n');

  const prompt = `
    Analyze the following asset data:
    Asset: ${asset.name} (${asset.symbol})
    Current Price: ${currentPrice.toFixed(2)}
    RSI (14): ${metrics.rsi.toFixed(2)}
    MACD Histogram: ${metrics.macd.histogram.toFixed(4)}
    Volatility (StdDev): ${metrics.volatility.toFixed(4)}
    Price vs SMA50: ${currentPrice > metrics.sma50 ? 'Above' : 'Below'}
    
    Recent Wire Headlines:
    ${newsContext}

    Provide an institutional JSON analysis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marketState: {
              type: Type.STRING,
              enum: ['Trending', 'Ranging', 'Volatile', 'Uncertain'],
              description: "The current technical regime of the market."
            },
            narrativePoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING, description: "Short impact statement" },
                  explanation: { type: Type.STRING, description: "Detailed technical reasoning including news correlation" },
                  confidence: { type: Type.NUMBER, description: "0-100 score for this specific point" }
                },
                required: ["headline", "explanation", "confidence"]
              }
            },
            riskAnalysis: {
                type: Type.OBJECT,
                properties: {
                    overallRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
                    factors: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                factor: { type: Type.STRING },
                                severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
                            },
                            required: ["factor", "severity"]
                        }
                    }
                },
                required: ["overallRisk", "factors"]
            },
            mainConfidenceScore: {
              type: Type.NUMBER,
              description: "Overall model confidence in the market state from 0 to 100."
            }
          },
          required: ["marketState", "narrativePoints", "riskAnalysis", "mainConfidenceScore"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const json = JSON.parse(text);
    
    return {
      ...json,
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      marketState: 'Uncertain',
      narrativePoints: [{
        headline: "Service Interruption",
        explanation: "AI Reasoning Engine temporarily unavailable.",
        confidence: 0
      }],
      riskAnalysis: {
        overallRisk: 'High',
        factors: [{ factor: "Inference Error", severity: "High" }]
      },
      mainConfidenceScore: 0,
      timestamp: Date.now()
    };
  }
};