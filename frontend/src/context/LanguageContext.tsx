"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import faMessages from "@/locales/fa.json";
import enMessages from "@/locales/en.json";

export type Language = "fa" | "en";

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Language, Record<string, string>> = {
  fa: faMessages as Record<string, string>,
  en: enMessages as Record<string, string>,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("fa"); // Default to Persian
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("app_language") as Language | null;
      if (savedLang === "fa" || savedLang === "en") {
        setLanguageState(savedLang);
      } else {
        // Default Persian
        setLanguageState("fa");
      }
    } catch {
      setLanguageState("fa");
    }
    setMounted(true);
  }, []);

  const isRTL = useMemo(() => language === "fa", [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("app_language", lang);
      document.cookie = `django_language=${lang};path=/;max-age=31536000`;
    } catch (e) {
      console.error("Could not persist language", e);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev: Language) => {
      const nextLang: Language = prev === "fa" ? "en" : "fa";
      try {
        localStorage.setItem("app_language", nextLang);
        document.cookie = `django_language=${nextLang};path=/;max-age=31536000`;
      } catch (e) {
        console.error("Could not persist language", e);
      }
      return nextLang;
    });
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = language;
      if (isRTL) {
        document.documentElement.classList.add("rtl");
        document.documentElement.classList.remove("ltr");
      } else {
        document.documentElement.classList.add("ltr");
        document.documentElement.classList.remove("rtl");
      }
    }
  }, [isRTL, language]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (!key) return "";
      const dict = dictionaries[language];
      if (dict && dict[key]) {
        return dict[key];
      }
      // Check trimmed
      const trimmed = key.trim();
      if (dict && dict[trimmed]) {
        return dict[trimmed];
      }
      return fallback !== undefined ? fallback : key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Convenient shorthand hook
export const useTranslation = () => {
  const { t, language, isRTL, toggleLanguage, setLanguage } = useLanguage();
  return { t, language, isRTL, toggleLanguage, setLanguage };
};