"use client";

import { useEffect, useRef } from "react";
import { ChevronRight, Star, PlusCircle } from "lucide-react";
import Image from "next/image";

// 1. ВАЖНО: Описываем типы
type GridItem =
  | { type: "app"; data: any }
  | { type: "parallax"; data?: never }
  | { type: "promo"; data?: never };

interface TopListsProps {
  initialApps: any[];
  dict: any;
}

export default function TopAppsOfDay({ initialApps, dict }: TopListsProps) {
  const getIconUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  // 2. ВАЖНО: Явно указываем тип массива
  const gridItems: GridItem[] = [];
  const apps = initialApps || [];

  // Логика заполнения (как было)
  apps.slice(0, 3).forEach((app) => gridItems.push({ type: "app", data: app }));
  gridItems.push({ type: "parallax" });
  apps.slice(3, 5).forEach((app) => gridItems.push({ type: "app", data: app }));
  gridItems.push({ type: "promo" });
  apps.slice(5, 8).forEach((app) => gridItems.push({ type: "app", data: app }));

  return (
    <section className="relative py-12 z-20">
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[#0f1115] dark:bg-[#0f1115] bg-white transition-colors duration-300" />
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10 px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
          {dict.title}
        </h2>
        <button className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-white/80 hover:text-black dark:hover:text-white transition bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
          {dict.viewAll} <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 px-2">
        {gridItems.map((item, idx) => {
          // TypeScript теперь поймет этот IF
          if (item.type === "app") {
            return (
              <AppCard
                // Используем ID или индекс как ключ
                key={item.data?.id || idx}
                app={item.data}
                getIconUrl={getIconUrl}
                userLabel={dict.users}
              />
            );
          } else if (item.type === "parallax") {
            return <ParallaxCard key="parallax" />;
          } else if (item.type === "promo") {
            return <PromoCard key="promo" />;
          }
          return null;
        })}
      </div>
    </section>
  );
}

// ... (Остальные функции AppCard, ParallaxCard, PromoCard оставьте без изменений)
function AppCard({ app, getIconUrl, userLabel }: any) {
  return (
    <div className="group relative bg-white/80 dark:bg-[#1a1d24]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-black/50 hover:border-blue-500/30 cursor-pointer overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center bg-secondary text-2xl rotate-3 group-hover:rotate-6 transition-transform overflow-hidden">
          {app.icon ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={getIconUrl(app.icon)}
              alt={app.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-bold">{app.title?.[0] || "?"}</span>
          )}
        </div>
        <div className="bg-gray-100 dark:bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/5 uppercase tracking-wider">
          {app.category || "App"}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate relative z-10">
        {app.title}
      </h3>
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium relative z-10">
        <span className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md">
          <Star size={14} fill="currentColor" /> {app.rating}
        </span>
        <span>
          {app.users_count_str || "N/A"} {userLabel}
        </span>
      </div>
    </div>
  );
}

function ParallaxCard() {
  const imageRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const updateTransform = () => {
      if (!imageRef.current || !blurRef.current) return;
      const scrollY = window.scrollY;
      const scrollOffset = scrollY * -0.15;
      const x = currentMouseX;
      const y = currentMouseY + scrollOffset;

      imageRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      blurRef.current.style.transform = `translate3d(${x * 0.5}px, ${
        y * 0.5
      }px, 0)`;
      rafId = requestAnimationFrame(updateTransform);
    };

    const handleMouseMove = (e: MouseEvent) => {
      currentMouseX = (e.clientX - window.innerWidth / 2) * -0.08;
      currentMouseY = (e.clientY - window.innerHeight / 2) * -0.08;
    };

    rafId = requestAnimationFrame(updateTransform);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative rounded-3xl p-6 flex items-center justify-center min-h-[200px] z-50 pointer-events-none">
      <div
        ref={imageRef}
        className="will-change-transform z-20 relative flex items-center justify-center"
        style={{
          transition: "transform 0.1s cubic-bezier(0.1, 0.7, 1.0, 0.1)",
        }}
      >
        <div className="relative w-64 h-64 flex items-center justify-center">
          <Image
            src="/icon2.png"
            alt="Parallax icon"
            fill
            className="object-contain drop-shadow-2xl"
            unoptimized
          />
        </div>
      </div>
      <div
        ref={blurRef}
        className="absolute w-40 h-40 bg-blue-500/30 blur-[60px] rounded-full pointer-events-none will-change-transform z-10"
        style={{ transition: "transform 0.2s linear" }}
      />
    </div>
  );
}

function PromoCard() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-3xl p-6 flex flex-col justify-between overflow-hidden min-h-[200px] group shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3 leading-tight">
          Want your app here?
        </h3>
        <p className="text-blue-100 text-sm font-medium">
          Get featured and reach millions of users daily.
        </p>
      </div>
      <button className="relative z-10 mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg active:scale-95">
        <PlusCircle size={18} />
        Submit App
      </button>
    </div>
  );
}
