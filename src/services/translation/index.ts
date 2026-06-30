import type { TranslationHistoryItem, TranslationSample } from "@/types";
import { TRANSLATION_HISTORY, TRANSLATION_SAMPLES } from "@/mock";
import { cloneMock, withMockLatency } from "../mockLatency";

export const TranslationService = {
  // TODO: Replace TranslationService with QVAC
  async getRecentTranslations(): Promise<TranslationSample[]> {
    return withMockLatency(() => cloneMock(TRANSLATION_SAMPLES));
  },

  // TODO: Replace TranslationService with QVAC
  async getTranslationHistory(): Promise<TranslationHistoryItem[]> {
    return withMockLatency(() => cloneMock(TRANSLATION_HISTORY));
  },

  // TODO: Replace TranslationService with QVAC
  async translateText(input: string, sourceLang: string, targetLang: string): Promise<string> {
    return withMockLatency(() => {
      if (!input.trim()) return "";
      void sourceLang;
      void targetLang;
      return `[Translated] ${input}`;
    });
  },

  async getLanguages(): Promise<string[]> {
    return withMockLatency(() => [
      "English",
      "Spanish",
      "Portuguese",
      "French",
      "German",
      "Arabic",
      "Italian",
      "Japanese",
      "Dutch",
      "Korean",
    ]);
  },
};
