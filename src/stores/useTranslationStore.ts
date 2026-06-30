import { create } from "zustand";
import { TranslationHistoryItem } from "@/types";

interface TranslationStore {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  history: TranslationHistoryItem[];

  translate: (text: string, sourceLang: string, targetLang: string) => Promise<void>;
  swapLanguages: () => void;
  clearHistory: () => void;
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  getHistoryForLangPair: (
    sourceLang: string,
    targetLang: string
  ) => TranslationHistoryItem[];
}

// Mock translation function - replace with real backend later
const mockTranslate = (text: string, _sourceLang: string, _targetLang: string): string => {
  // Simple mock: just return a dummy translation
  // In production, integrate with QVAC or real translation API
  return `[Translated] ${text}`;
};

export const useTranslationStore = create<TranslationStore>((set, get) => ({
  originalText: "",
  translatedText: "",
  sourceLang: "Spanish",
  targetLang: "English",
  history: [],

  translate: async (text, sourceLang, targetLang) => {
    // Simulate async translation
    await new Promise((resolve) => setTimeout(resolve, 300));
    const translated = mockTranslate(text, sourceLang, targetLang);

    const historyItem: TranslationHistoryItem = {
      id: `trans-${Date.now()}`,
      original: text,
      translated,
      sourceLang,
      targetLang,
      timestamp: Date.now(),
    };

    set((state) => ({
      originalText: text,
      translatedText: translated,
      sourceLang,
      targetLang,
      history: [historyItem, ...state.history].slice(0, 50), // Keep last 50
    }));
  },

  swapLanguages: () =>
    set((state) => ({
      sourceLang: state.targetLang,
      targetLang: state.sourceLang,
      originalText: state.translatedText,
      translatedText: state.originalText,
    })),

  clearHistory: () => set({ history: [] }),

  setSourceLanguage: (lang) => set({ sourceLang: lang }),

  setTargetLanguage: (lang) => set({ targetLang: lang }),

  getHistoryForLangPair: (sourceLang, targetLang) => {
    const state = get();
    return state.history.filter(
      (item) => item.sourceLang === sourceLang && item.targetLang === targetLang
    );
  },
}));

// Selectors
export const selectOriginalText = (state: TranslationStore) =>
  state.originalText;
export const selectTranslatedText = (state: TranslationStore) =>
  state.translatedText;
export const selectSourceLanguage = (state: TranslationStore) =>
  state.sourceLang;
export const selectTargetLanguage = (state: TranslationStore) =>
  state.targetLang;
export const selectTranslationHistory = (state: TranslationStore) =>
  state.history;
