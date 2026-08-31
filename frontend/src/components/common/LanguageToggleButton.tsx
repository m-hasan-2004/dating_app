"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const LanguageToggleButton: React.FC = () => {
  const { language, toggleLanguage, isRTL } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="fixed bottom-5 left-5 z-[99999] flex items-center justify-center gap-2 h-10 px-3.5 text-xs font-bold text-gray-800 transition-all bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/90 dark:border-gray-700/90 rounded-full hover:border-brand-500 hover:bg-brand-50/70 dark:text-gray-200 dark:hover:border-brand-500/60 dark:hover:bg-brand-950/40 shadow-lg hover:shadow-xl group cursor-pointer hover:scale-105 active:scale-95"
      title={isRTL ? "تغییر زبان به انگلیسی (Switch to English)" : "تغییر زبان به فارسی (Switch to Persian)"}
    >
      <svg
        className="w-4 h-4 text-brand-500 transition-transform group-hover:rotate-45"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
      <span className="font-extrabold uppercase tracking-wider text-[11px]">
        {language === "fa" ? "FA (فا)" : "EN"}
      </span>
    </button>
  );
};

export default LanguageToggleButton;