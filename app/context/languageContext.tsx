"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Locale = "en" | "pt";

interface LanguageContextProps {
  locale: Locale;
  setLocale: (value: Locale) => void;
  t: (key: string) => string;
}

// Translation files (extend anytime)
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // default basic content — add more gradually
    hello: "Hello",
    language: "Language",
  },
  pt: {
    hello: "Olá",
    language: "Idioma",
  },
};

const LanguageContext = createContext<LanguageContextProps | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  // save & restore selected language
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Locale | null;
    if (saved && (saved === "en" || saved === "pt")) {
      setLocale(saved);
    }
  }, []);

  const changeLanguage = (lang: Locale) => {
    setLocale(lang);
    localStorage.setItem("lang", lang);
  };

  const t = (key: string) => {
    return translations[locale][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
};
