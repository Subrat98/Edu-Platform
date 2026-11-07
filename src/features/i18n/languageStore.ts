import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storageKey } from "@/lib/storage";
import { translations, type Language, type TranslationKey } from "@/lib/i18n";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
      t: (key) => {
        const currentLang = get().language;
        const dict = translations[currentLang] as Record<string, string>;
        if (dict && dict[key]) {
          return dict[key];
        }
        // Fallback to English
        const fallback = translations.en as Record<string, string>;
        return fallback[key] || key;
      },
    }),
    { name: storageKey("language") },
  ),
);

// Helper hook for functional components
export function useTranslation() {
  const { language, setLanguage, t } = useLanguageStore();
  return { language, setLanguage, t };
}
