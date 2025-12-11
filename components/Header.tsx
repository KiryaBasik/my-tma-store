"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface HeaderProps {
  lang: string;
  dict: any;
}

export default function Header({ lang, dict }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Закрываем меню при переходе по ссылке
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Блокируем скролл фона при открытом меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navItems = [
    { name: dict.home, href: "/" },
    { name: dict.categories, href: "/categories" },
    { name: dict.ads, href: "/ads" },
    { name: dict.sensor, href: "#" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-300">
        <div className="w-full mx-auto px-5 md:px-[100px] xl:px-[240px] h-20 flex items-center justify-between">
          {/* Логотип */}
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 cursor-pointer group z-50 relative"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition shadow-lg shadow-blue-500/20">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              FindMini
            </span>
          </Link>

          {/* Десктопная Навигация */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={
                  item.href.startsWith("/")
                    ? `/${lang}${item.href === "/" ? "" : item.href}`
                    : "#"
                }
                className="hover:text-primary transition relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Десктопные Действия */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher currentLang={lang} />
            <ThemeSwitcher />
            <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95 ml-2">
              {dict.submit}
            </button>
          </div>

          {/* Мобильная кнопка Бургер */}
          <button
            className="lg:hidden p-2 text-foreground z-50 relative active:scale-90 transition-transform"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Мобильное Меню (Полноэкранное) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl pt-28 px-6 lg:hidden flex flex-col gap-8 overflow-y-auto"
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={
                      item.href.startsWith("/")
                        ? `/${lang}${item.href === "/" ? "" : item.href}`
                        : "#"
                    }
                    className="text-3xl font-bold text-foreground hover:text-primary transition-colors block"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="h-px w-full bg-border my-2"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
                <span className="text-lg font-medium text-gray-500">Язык</span>
                <LanguageSwitcher currentLang={lang} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
                <span className="text-lg font-medium text-gray-500">Тема</span>
                <ThemeSwitcher />
              </div>

              <button className="w-full bg-primary hover:bg-blue-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform mt-2">
                {dict.submit}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
