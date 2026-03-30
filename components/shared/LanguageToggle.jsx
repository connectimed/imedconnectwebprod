"use client";
import React from "react";
import { useLanguage } from "@/lib/context/LanguageContext";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex mx-auto items-center justify-center">
      <div className="flex rounded-full bg-primary-deep-dark p-1 mt-4 self-start border border-slate-400">
        <button
          onClick={() => setLang("en")}
          className={`rounded-full px-4 py-1.5 text-small-regular font-normal transition-all duration-200 ${
            lang === "en" ? "bg-slate-400 text-black" : "text-slate-300"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLang("sw")}
          className={`rounded-full px-4 py-1.5 text-small-regular font-normal transition-all duration-200 ${
            lang === "sw" ? "bg-slate-400 text-black" : "text-slate-300"
          }`}
        >
          Kiswahili
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
