import { useEffect } from "react";
import { useLanguageStore } from "./languageStore";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

/**
 * Initializes and orchestrates Google Translate across React single-page route changes.
 * Prevents "flash of original English text" when navigating between pages.
 */
export function GoogleTranslateManager() {
  const { language } = useLanguageStore();

  // Helper to trigger translation change safely
  const triggerTranslation = (targetLang: string) => {
    try {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (combo && combo.value !== targetLang) {
        combo.value = targetLang;
        combo.dispatchEvent(new Event("change"));
      }
    } catch {
      // Ignore if element not ready
    }
  };

  useEffect(() => {
    // 1. Ensure the element container exists
    let container = document.getElementById("google_translate_element");
    if (!container) {
      container = document.createElement("div");
      container.id = "google_translate_element";
      container.style.display = "none";
      document.body.appendChild(container);
    }

    // 2. Define translation callback
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,or",
              autoDisplay: false,
            },
            "google_translate_element",
          );
        }
      } catch {
        // Safe fallback
      }
    };

    // 3. Inject Google script if not already added
    const SCRIPT_ID = "google-translate-script";
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "text/javascript";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // 4. Continuously guard against Google Translate banner frames being injected into DOM
    const observer = new MutationObserver(() => {
      try {
        const bannerFrames = document.querySelectorAll<HTMLElement>(
          "iframe.skiptranslate, .goog-te-banner-frame, iframe[id^=':1'], iframe[id^=':2']",
        );
        bannerFrames.forEach((frame) => {
          frame.style.display = "none";
          frame.style.visibility = "hidden";
          frame.style.height = "0px";
        });
        if (document.body.style.top !== "0px") {
          document.body.style.top = "0px";
        }
      } catch {
        // Safe fallback
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Update cookies & sync when language changes
  useEffect(() => {
    try {
      const targetLang = language === "or" ? "or" : "en";
      const cookieVal = targetLang === "or" ? "/en/or" : "/en/en";
      const domain = window.location.hostname;

      document.cookie = `googtrans=${cookieVal}; path=/;`;
      document.cookie = `googtrans=${cookieVal}; domain=.${domain}; path=/;`;

      // Apply translation directly
      triggerTranslation(targetLang);

      const t1 = setTimeout(() => triggerTranslation(targetLang), 300);
      const t2 = setTimeout(() => triggerTranslation(targetLang), 1000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } catch {
      // Safe fallback
    }
  }, [language]);

  return null;
}



