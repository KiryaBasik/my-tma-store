"use client";

import { useState, useRef, MouseEvent } from "react";
import { ChevronRight, Star, PlusCircle, Rocket, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type GridItem =
  | { type: "app"; data: any }
  | { type: "parallax"; data?: never }
  | { type: "promo"; data?: never }
  | { type: "empty"; data?: never };

interface TopListsProps {
  initialApps: any[];
  dict: any;
}

export default function TopAppsOfDay({ initialApps, dict }: TopListsProps) {
  const getIconUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `http://155.212.219.98${url}`;
  };

  let safeApps =
    Array.isArray(initialApps) && initialApps.length > 0 ? initialApps : [];
  if (safeApps.length > 0 && safeApps.length < 6) {
    while (safeApps.length < 6) {
      safeApps = [...safeApps, ...safeApps];
    }
  }
  const apps = safeApps.slice(0, 6);

  const gridItems: GridItem[] = [];
  gridItems.push(apps[0] ? { type: "app", data: apps[0] } : { type: "empty" });
  gridItems.push(apps[1] ? { type: "app", data: apps[1] } : { type: "empty" });
  gridItems.push(apps[2] ? { type: "app", data: apps[2] } : { type: "empty" });
  gridItems.push({ type: "parallax" });
  gridItems.push(apps[3] ? { type: "app", data: apps[3] } : { type: "empty" });
  gridItems.push(apps[4] ? { type: "app", data: apps[4] } : { type: "empty" });
  gridItems.push({ type: "promo" });
  gridItems.push(apps[5] ? { type: "app", data: apps[5] } : { type: "empty" });

  if (safeApps.length === 0) return null;

  return (
    <section className="relative py-8 md:py-12 z-20">
      {/* ИЗМЕНЕНИЯ В ЗАГОЛОВКЕ:
          1. flex-col для мобилок, md:flex-row для ПК
          2. items-start для мобилок, md:items-center для ПК
          3. gap-4 для отступа между заголовком и кнопкой
      */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 relative z-10 px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white drop-shadow-sm flex items-center gap-3">
          <Rocket className="text-blue-500 w-6 h-6 md:w-8 md:h-8" />
          {dict?.topApps?.title || "Top Apps"}
        </h2>

        {/* Кнопка на мобильном растягивается или прижимается влево */}
        <Link
          href="/categories"
          className="flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-gray-600 dark:text-white/80 hover:text-black dark:hover:text-white transition bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 backdrop-blur-md px-5 py-3 md:py-2 rounded-xl md:rounded-full w-full md:w-auto"
        >
          {dict?.topApps?.viewAll || "View All"} <ChevronRight size={18} />
        </Link>
      </div>

      {/* ИЗМЕНЕНИЯ В СЕТКЕ:
          1. gap-4 для мобилок (было gap-6 везде)
          2. px-4 для мобилок
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10 px-4 md:px-2">
        {gridItems.map((item, idx) => {
          if (item.type === "app") {
            return (
              <AppCard
                key={`app-${idx}`}
                app={item.data}
                getIconUrl={getIconUrl}
                userLabel={dict?.topApps?.users}
              />
            );
          } else if (item.type === "parallax") {
            return (
              <div key="parallax" className="hidden lg:block h-full w-full">
                <ParallaxCard />
              </div>
            );
          } else if (item.type === "promo") {
            return <PromoCard key="promo" />;
          }
          return <div key={`empty-${idx}`} className="hidden lg:block" />;
        })}
      </div>
    </section>
  );
}

function AppCard({ app, getIconUrl, userLabel }: any) {
  if (!app) return null;
  const cleanUsername = app.username ? app.username.replace("@", "") : "#";

  return (
    // Уменьшили padding на мобильных p-4, на ПК p-5
    <div className="group relative h-full bg-white/80 dark:bg-[#1a1d24]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-4 md:p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-black/50 hover:border-blue-500/30 cursor-pointer overflow-hidden flex flex-col min-h-[200px] md:min-h-[220px]">
      <Link href={`/app/${cleanUsername}`} className="absolute inset-0 z-10">
        <span className="sr-only">View App</span>
      </Link>

      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between mb-4 relative z-20 pointer-events-none">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-lg flex items-center justify-center bg-secondary text-2xl rotate-3 group-hover:rotate-6 transition-transform overflow-hidden relative">
          {app.icon ? (
            <Image
              src={getIconUrl(app.icon)}
              alt={app.title || "App"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="font-bold">{app.title?.[0] || "?"}</span>
          )}
        </div>

        <a
          href={app.telegram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto bg-gray-100 dark:bg-white/10 hover:bg-blue-500 hover:text-white text-gray-900 dark:text-white p-2 rounded-xl transition shadow-sm active:scale-95 z-30"
        >
          <Download size={20} />
        </a>
      </div>

      <div className="relative z-0 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg text-[10px] font-bold text-gray-500 dark:text-white/50 uppercase tracking-wider">
            {app.category || "App"}
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate">
          {app.title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
          {app.short_description || app.description || ""}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md text-xs font-bold">
            <Star size={12} fill="currentColor" /> {app.rating}
          </div>
          <span className="text-xs font-medium text-gray-400">
            {app.users_count_str || "N/A"} {userLabel || "users"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ParallaxCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { width, height, left, top } =
      containerRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full w-full rounded-[2.5rem] bg-[#0d0f14] border border-white/5 p-6 flex items-center justify-center overflow-hidden z-10 cursor-default"
    >
      <div
        className="relative w-40 h-40 transition-transform duration-100 ease-out z-20"
        style={{
          transform: `translate(${offset.x / 10}px, ${offset.y / 10}px)`,
        }}
      >
        <Image
          src="/icon2.png"
          alt="Parallax icon"
          fill
          className="object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]"
          unoptimized
        />
      </div>
      <div
        className="absolute w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none transition-transform duration-300"
        style={{
          transform: `translate(${-offset.x / 5}px, ${-offset.y / 5}px)`,
        }}
      />
    </div>
  );
}

function PromoCard() {
  // На мобильных скрываем промо-карточку, если она ломает сетку или выглядит плохо
  // Но пока оставляем видимой (hidden lg:block выше в логике gridItems управляет видимостью)
  // В основном коде PromoCard видна только на >= lg (в GridItems logic)
  return (
    <div className="relative h-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-20 rotate-12 group-hover:rotate-0 transition-all duration-500">
        <Image
          src="/icon1.png"
          alt="Promo"
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3 leading-tight">
          Want your app here?
        </h3>
        <p className="text-blue-100 text-sm font-medium">
          Get featured and reach millions of users daily.
        </p>
      </div>
      <button className="relative z-10 mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg active:scale-95">
        <PlusCircle size={18} /> Submit App
      </button>
    </div>
  );
}
