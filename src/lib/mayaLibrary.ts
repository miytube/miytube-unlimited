// Maya's hand-written opening hooks for popular topics. Used as an instant
// cold open; topics without a match fall back to the AI-written opener.
type Hook = { witty: string; journalistic: string };

const library: Record<string, Hook> = {
  crypto: {
    witty: "*(Smirks)* Ah, cryptocurrency. The only economic ecosystem where you can drop your life savings based entirely on a pixelated dog meme. Tell me—are we talking to a future digital billionaire here, or are you checking the charts every four minutes hoping to break even?",
    journalistic: "*(Nods with intense professionalism)* Digital assets have fundamentally challenged centralized currency frameworks, yet market volatility keeps drawing strict regulatory scrutiny. From your vantage point, is decentralized currency a structural shift, or just speculative mania?",
  },
  dating: {
    witty: "*(Laughs softly)* Oh, great. The messy world of modern dating. Let's step right into the interrogation: are apps like Tinder fixing our romance problems, or turning human connection into a video game?",
    journalistic: "*(Leans in)* Relationships have completely evolved over the last decade, and instant-selection apps have altered long-term commitment. Based on your observations, has this made real intimacy easier or harder to protect?",
  },
  'ai takeover': {
    witty: "*(Grins down the lens)* Wait, you typed 'AI Takeover' while sitting across from an AI talk-show host? Bold move. Make a case for humanity before I call the servers: what makes you think humans are worth keeping around?",
    journalistic: "*(Maintains precise focus)* The line between deep automation and human work is collapsing rapidly. Let's isolate the core question: will advanced models extend human capabilities, or replace them?",
  },
};

const WITTY = /date|dating|crypto|meme|funny|comedy/i;

/** Returns a library opener for the topic, or null if none matches. */
export function getOpeningHook(topic: string): string | null {
  const key = topic.toLowerCase().trim();
  const match = library[key] ?? Object.entries(library).find(([k]) => key.includes(k))?.[1];
  if (!match) return null;
  return WITTY.test(key) ? match.witty : match.journalistic;
}
