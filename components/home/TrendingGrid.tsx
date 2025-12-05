"use client";

import { useState, useRef, MouseEvent } from "react";
import { ArrowUpRight, Trophy, Download, Star } from "lucide-react";

interface AppData {
  id: number;
  title: string;
  category: string;
  rating: number;
  users_count: string;
  description: string;
  icon: string;
  is_weekly: boolean;
}

// Принимаем dict
export default function WeeklyFeatured({
  initialApps,
  dict,
}: {
  initialApps: AppData[];
  dict: any;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const getIconUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  if (!initialApps || initialApps.length === 0 || !dict) {
    return null;
  }

  const mainApp = initialApps[0];
  const otherApps = initialApps.slice(1, 5);

  return (
    <section className="py-12 px-4">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {dict.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{dict.subtitle}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-full text-sm font-bold">
          <Trophy size={16} />
          <span>{dict.weeklyBadge}</span>
        </div>
      </div>

      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div
          className="pointer-events-none absolute -inset-px transition opacity-500"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
          }}
        />

        {/* БОЛЬШАЯ КАРТОЧКА (#1) */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-[#1a1d24] border border-gray-200 dark:border-white/5 p-8 flex flex-col justify-between min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex flex-col gap-4">
              <span className="w-fit px-3 py-1 rounded-full bg-white dark:bg-white/10 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white border border-gray-200 dark:border-white/5 shadow-sm">
                #1 {dict.editorChoice}
              </span>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                {mainApp.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md line-clamp-3">
                {mainApp.description}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex items-center gap-4">
            <button className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-blue-500/20">
              <Download size={20} />
              {dict.install}
            </button>
            <div className="flex items-center gap-1 text-sm font-bold text-gray-500 dark:text-gray-400">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              {mainApp.rating} {dict.rating}
            </div>
          </div>

          <div className="absolute right-[-20px] bottom-[-20px] md:right-[-40px] md:bottom-[-40px] w-64 h-64 md:w-96 md:h-96 rotate-[-12deg] group-hover:rotate-[-6deg] group-hover:scale-105 transition-all duration-500 ease-out z-0 opacity-90 blur-sm group-hover:blur-0">
            <div className="w-full h-full rounded-[3rem] shadow-2xl overflow-hidden bg-gray-800 flex items-center justify-center">
              {mainApp.icon ? (
                <img
                  src={getIconUrl(mainApp.icon)!}
                  alt={mainApp.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-9xl text-white/20 font-black">
                  {mainApp.title[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* СПИСОК ОСТАЛЬНЫХ */}
        <div className="grid grid-cols-1 gap-4 h-full">
          {otherApps.map((app) => (
            <div
              key={app.id}
              className="relative group bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-white/5 rounded-[1.5rem] p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md group-hover:scale-110 transition-transform bg-gray-800 flex items-center justify-center text-white">
                  {app.icon ? (
                    <img
                      src={getIconUrl(app.icon)!}
                      alt={app.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-xl">{app.title[0]}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-1">
                    {app.title}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{app.category}</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      {app.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <ArrowUpRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
