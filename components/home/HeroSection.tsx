"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Rocket,
  ChevronRight,
  ChevronLeft,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface HeroAppProps {
  id: number;
  title: string;
  version: string;
  description: string;
  icon: string;
  category: string;
  users_count_str: string;
  username: string;
  telegram_url: string;
  rating?: number;
}

export default function HeroSection({
  apps,
  dict,
  lang,
}: {
  apps: HeroAppProps[];
  dict: any;
  lang: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const safeApps = Array.isArray(apps) ? apps : [];

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((prev) => {
        let nextIndex = prev + newDirection;
        if (nextIndex < 0) nextIndex = safeApps.length - 1;
        if (nextIndex >= safeApps.length) nextIndex = 0;
        return nextIndex;
      });
    },
    [safeApps.length]
  );

  useEffect(() => {
    if (safeApps.length <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(interval);
  }, [paginate, safeApps.length]);

  const getIconUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `http://155.212.219.98${url}`;
  };

  const currentApp = safeApps.length > 0 ? safeApps[currentIndex] : null;

  const data = currentApp
    ? {
        title: currentApp.title || "Unknown App",
        category: currentApp.category || "Utility",
        description: currentApp.description || "No description available.",
        icon: getIconUrl(currentApp.icon),
        users: currentApp.users_count_str || "1M+",
        username: currentApp.username
          ? currentApp.username.replace("@", "")
          : "",
        telegramLink: currentApp.telegram_url || "#",
        rating: currentApp.rating || 5.0,
        isLive: true,
      }
    : {
        title: "FindMini Catalog",
        category: "Platform",
        description: "The best catalog of Telegram Mini Apps.",
        icon: null,
        users: "---",
        username: "",
        telegramLink: "#",
        rating: 5.0,
        isLive: false,
      };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  // Компонент иконки (вынесли, чтобы использовать и для мобилки, и для десктопа)
  const AppIcon = ({ sizeClass = "w-48 h-48" }) => (
    <div className="relative group cursor-pointer inline-block">
      <Link href={data.username ? `/${lang}/app/${data.username}` : "#"}>
        <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />

        <div
          className={`relative ${sizeClass} rounded-[2rem] bg-gray-100 dark:bg-[#1a1d24] border border-white/20 dark:border-white/10 shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500`}
        >
          {data.icon ? (
            <img
              src={data.icon}
              alt={data.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl font-black text-gray-300 dark:text-white/10">
                {data.title[0]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
        </div>
      </Link>

      <div
        className="absolute -bottom-4 -right-4 bg-white dark:bg-[#252932] px-3 py-1.5 rounded-xl shadow-lg border border-gray-100 dark:border-white/5 flex items-center gap-2 animate-bounce"
        style={{ animationDuration: "3s" }}
      >
        <div className="bg-yellow-500/20 p-1 rounded-full">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
        </div>
        <div>
          <div className="text-[9px] text-gray-400 font-bold uppercase leading-none">
            {dict.hero.rating}
          </div>
          <div className="text-xs font-black text-gray-900 dark:text-white leading-none">
            {data.rating}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative mt-4 mb-10 md:mt-10 md:mb-16 w-full max-w-[1400px] mx-auto px-4">
      <div className="relative bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 overflow-hidden shadow-xl dark:shadow-none min-h-[auto] md:min-h-[550px] flex items-center">
        {/* Фон */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
          <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 dark:bg-blue-600/20 blur-[80px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-purple-600/10 dark:bg-purple-600/20 blur-[80px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
        </div>

        {/* Кнопки навигации (только на планшетах и ПК) */}
        {safeApps.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/10 border border-black/5 dark:border-white/5 backdrop-blur-md transition-all active:scale-90 hidden md:flex text-gray-700 dark:text-gray-200"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/10 border border-black/5 dark:border-white/5 backdrop-blur-md transition-all active:scale-90 hidden md:flex text-gray-700 dark:text-gray-200"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 w-full relative z-10 px-0 md:px-12"
          >
            {/* --- ЛЕВАЯ КОЛОНКА (Контент) --- */}
            <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-5 md:space-y-6 order-2 lg:order-1">
              {/* Бейджи */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 md:gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                  <Star size={10} fill="currentColor" />
                  {dict.hero.featured}
                </div>
                {data.isLive && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    <TrendingUp size={10} />
                    {dict.hero.trending}
                  </div>
                )}
              </div>

              {/* Заголовок (уменьшен для мобилок) */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.1]">
                {data.title}
              </h1>

              {/* --- МОБИЛЬНАЯ ИКОНКА (Видна только на lg:hidden) --- */}
              {/* Вставляем иконку МЕЖДУ заголовком и описанием на мобильных */}
              <div className="block lg:hidden py-2">
                <AppIcon sizeClass="w-36 h-36" />
              </div>

              {/* Описание */}
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg line-clamp-3">
                {data.description}
              </p>

              {/* Кнопки */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
                <a
                  href={data.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm md:text-base"
                >
                  <Rocket size={18} />
                  {dict.hero.launch}
                </a>

                {data.username && (
                  <Link
                    href={`/${lang}/app/${data.username}`}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold transition-all active:scale-95 text-sm md:text-base"
                  >
                    {dict.hero.more}
                  </Link>
                )}
              </div>

              {/* Статистика */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-500">
                <span>
                  {dict.hero.category}:{" "}
                  <span className="text-gray-900 dark:text-gray-300">
                    {data.category}
                  </span>
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <span>
                  {dict.hero.users}:{" "}
                  <span className="text-gray-900 dark:text-gray-300">
                    {data.users}
                  </span>
                </span>
              </div>
            </div>

            {/* --- ПРАВАЯ КОЛОНКА (Иконка для ПК) --- */}
            {/* Скрываем на мобильных (hidden), показываем на lg (lg:flex) */}
            <div className="hidden lg:flex items-center justify-center relative order-1 lg:order-2">
              <div className="absolute w-[300px] h-[300px] border border-dashed border-gray-300 dark:border-white/10 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="absolute w-[450px] h-[450px] border border-gray-200 dark:border-white/5 rounded-full" />

              {/* Большая иконка для десктопа */}
              <AppIcon sizeClass="w-64 h-64" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Индикаторы (точки) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {safeApps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-blue-600 dark:bg-white"
                  : "w-1.5 bg-gray-300 dark:bg-white/20 hover:bg-blue-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
