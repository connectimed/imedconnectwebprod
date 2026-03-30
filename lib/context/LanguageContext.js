"use client";

import { useContext, createContext, useState, useEffect } from "react";
import translations from "@/lib/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("imedconnect_lang");
    if (saved === "en" || saved === "sw") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem("imedconnect_lang", newLang);
  };

  const t = (key) => {
    return (
      (translations[lang] && translations[lang][key]) ||
      (translations.en && translations.en[key]) ||
      key
    );
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
