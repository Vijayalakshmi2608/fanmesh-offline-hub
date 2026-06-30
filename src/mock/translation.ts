import type { TranslationSample, TranslationHistoryItem } from "@/types";
import { TRANSLATION_RECENT } from "./shared";

export const TRANSLATION_HISTORY: TranslationHistoryItem[] = TRANSLATION_RECENT.map((item, index) => ({
  id: `tr-${index}`,
  original: item.src,
  translated: item.out,
  sourceLang: item.from,
  targetLang: item.to,
  timestamp: 1_700_000_000_000 - index * 60_000,
}));

export const TRANSLATION_SAMPLES: TranslationSample[] = [...TRANSLATION_RECENT];
