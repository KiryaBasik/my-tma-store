"use client";

import { ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher({
  currentLang,
}: {
  currentLang: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Логика смены языка в URL
  const redirectedPathName = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  // Закрытие при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
  ];

  const activeLang =
    languages.find((l) => l.code === currentLang) || languages[0];
  const otherLang =
    languages.find((l) => l.code !== currentLang) || languages[1];

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-all text-sm font-medium"
      >
        <span className="uppercase">{activeLang.code}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-full right-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-xl overflow-hidden transition-all duration-200 origin-top-right z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <Link
          href={redirectedPathName(otherLang.code)}
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-sm text-foreground"
        >
          <Globe size={16} className="text-blue-500" />
          <div className="flex flex-col">
            <span className="font-medium">{otherLang.label}</span>
            <span className="text-xs text-gray-500 uppercase">
              {otherLang.code}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
