"use client";
import React from "react";
import { useLanguage } from "@/lib/context/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex rounded-full bg-primary-light p-1 mt-4 self-start">
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-4 py-1.5 text-small-regular font-semibold transition-all duration-200 ${
          lang === "en" ? "bg-white text-primary-light" : "text-white"
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLang("sw")}
        className={`rounded-full px-4 py-1.5 text-small-regular font-semibold transition-all duration-200 ${
          lang === "sw" ? "bg-white text-primary-light" : "text-white"
        }`}
      >
        Kiswahili
      </button>
    </div>
  );
};

export default LanguageToggle;
