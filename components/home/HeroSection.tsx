"use client";

import { Rocket, Sparkles, ChevronRight } from "lucide-react";
import Image from "next/image";

// 1. Обновляем интерфейс (заменили icon_url на icon)
interface HeroAppProps {
  id: number;
  title: string;
  version: string;
  description: string;
  icon: string; // Новое имя поля!
  category: string;
  users_count: string;
}

export default function HeroSection({ app }: { app?: HeroAppProps | null }) {
  // Функция для "лечения" ссылки на картинку
  const getIconUrl = (url: string) => {
    if (!url) return null;
    // Если ссылка начинается с http, оставляем как есть. Если нет - добавляем адрес бэкенда
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  const data = app
    ? {
        title: app.title,
        version: app.version || "1.0",
        description: app.description,
        icon: getIconUrl(app.icon), // 2. Используем правильное поле и лечим ссылку
        users: app.users_count,
        isLive: true,
      }
    : {
        title: "NotCoin",
        version: "2.0",
        description:
          "The legend returns. Build your squad, mine tokens, and conquer the leaderboard in the new era of tap-to-earn.",
        icon: null,
        users: "2,450,192",
        isLive: false,
      };

  return (
    <section className="relative mt-6 mb-12 md:mt-10 md:mb-20 w-full max-w-[1400px] mx-auto px-4 perspective-1000">
      <div className="group relative bg-white dark:bg-[#0a0c10] border border-gray-200 dark:border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-16 overflow-visible shadow-2xl dark:shadow-none transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 dark:hover:border-blue-500/30 min-h-auto md:min-h-[550px] flex flex-col justify-center">
        {/* КОРОНА */}
        <div className="absolute -top-[40px] -right-[10px] md:-top-[70px] md:-right-[0px] z-50 w-32 h-32 md:w-64 md:h-64 pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] rotate-[15deg] md:rotate-[25deg] translate-y-2 md:translate-y-6 origin-bottom-right group-hover:rotate-[25deg] md:group-hover:rotate-[40deg] group-hover:scale-105 group-hover:-translate-y-2">
          <div className="relative w-full h-full drop-shadow-2xl">
            <Image
              src="/crown.png"
              alt="Crown"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Фон */}
        <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/5 dark:bg-blue-600/20 blur-[80px] md:blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-purple-600/5 dark:bg-purple-600/10 blur-[60px] md:blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute inset-0 opacity-0 dark:opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 items-center">
          {/* ЛЕВАЯ ЧАСТЬ: ТЕКСТ */}
          <div className="space-y-6 md:space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 backdrop-blur-md">
              <Sparkles
                size={14}
                className="text-blue-600 dark:text-blue-400 animate-pulse"
              />
              <span className="text-[10px] md:text-xs font-bold text-blue-700 dark:text-blue-100 tracking-[0.2em] uppercase">
                {data.isLive ? "Featured Now" : "App of the Week"}
              </span>
            </div>

            <div className="relative">
              <h1 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.95]">
                {data.title}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 ml-2 md:ml-3">
                  {data.version}
                </span>
              </h1>
            </div>

            <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 line-clamp-3">
              {data.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-5 pt-2">
              <button className="relative w-full sm:w-auto overflow-hidden rounded-2xl bg-blue-600 dark:bg-white text-white dark:text-black px-8 md:px-10 py-4 md:py-5 font-bold text-lg group/btn shadow-xl shadow-blue-600/20 dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-95">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Rocket
                    size={20}
                    className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform"
                  />
                  Launch App
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
              </button>

              <button className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 md:px-8 py-4 md:py-5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-bold text-sm uppercase tracking-wider bg-gray-100 dark:bg-white/5 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10">
                More Details
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: 3D ПРЕВЬЮ */}
          <div className="relative w-full aspect-video lg:aspect-square max-h-[300px] md:max-h-[450px] flex items-center justify-center perspective-1000 mt-4 lg:mt-0">
            <div className="relative w-full h-full bg-gray-100 dark:bg-[#13161c] rounded-[2rem] md:rounded-[2.5rem] border border-gray-200 dark:border-white/5 overflow-hidden group-hover:rotate-y-[-5deg] group-hover:rotate-x-[5deg] transition-transform duration-500 shadow-2xl dark:shadow-black/50">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-gray-200/50 dark:to-black/80">
                {/* Круги */}
                <div className="absolute w-[200px] md:w-[350px] h-[200px] md:h-[350px] border border-gray-300 dark:border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-[150px] md:w-[250px] h-[150px] md:h-[250px] border border-gray-300 dark:border-white/5 rounded-full animate-[spin_25s_linear_infinite_reverse] border-dashed" />

                {/* ЛОГОТИП */}
                <div className="z-10 text-center transform group-hover:scale-110 transition-transform duration-500">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-2xl md:rounded-3xl mx-auto mb-4 md:mb-6 flex items-center justify-center shadow-lg shadow-blue-600/30 text-white overflow-hidden relative">
                    {data.icon ? (
                      // Используем обычный img для внешних ссылок
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={data.icon}
                        alt={data.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-black text-2xl md:text-4xl">
                        {data.title[0]}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 dark:text-white/30 font-mono text-xs md:text-sm tracking-[0.3em] font-bold uppercase">
                    {data.title}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>

            {/* Плашка статистики */}
            <div className="absolute -bottom-4 -left-4 md:bottom-8 md:-left-8 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-white/10 px-4 py-3 md:px-6 md:py-4 rounded-2xl flex items-center gap-3 md:gap-4 shadow-xl transform group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500 delay-100 hidden sm:flex">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-ping absolute inset-0 opacity-75" />
                <div className="w-3 h-3 rounded-full bg-green-500 relative" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Active Users
                </p>
                <p className="text-gray-900 dark:text-white font-bold text-base md:text-lg leading-none">
                  {data.users}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </section>
  );
}
