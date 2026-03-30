"use client";
import Image from "next/image";
import React from "react";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { useLanguage } from "@/lib/context/LanguageContext";

const FunderLogo = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-6">
      <div className="flex flex-row border border-slate-400 rounded-lg px-2 py-2 space-x-3">
        <Image
          src="/images/finnish.png"
          className="h-8 w-8 object-cover"
          height={512}
          width={512}
          alt="Finnish Embassy logo"
        />
        <p className="text-slate-300 text-subtle-regular tracking-wide">
          {t("funder_text")}
        </p>
      </div>
      <LanguageToggle />
    </div>
  );
};

export default FunderLogo;
