"use client";

import MarketChart from "@/components/MarketChart";
import { TrendingUp, Send, Layers } from "lucide-react";

interface StatsProps {
  dict: any;
  stats: {
    total: number;
    chart: any[];
  };
}

export default function StatsSection({ dict, stats }: StatsProps) {
  if (!dict || !stats) return null;

  return (
    <section className="grid lg:grid-cols-3 gap-6 md:gap-8 px-4">
      {/* ЛЕВАЯ ЧАСТЬ: График */}
      <div className="lg:col-span-2 bg-white dark:bg-[#1a1d24] rounded-[2rem] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
              <TrendingUp className="text-blue-500" size={28} />{" "}
              {dict.stats.marketPulse}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Last 7 days activity</p>
          </div>

          {/* Общая статистика (цифра из БД) */}
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/5">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-lg">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-bold">
                {dict.stats.totalApps}
              </div>
              <div className="text-xl font-black text-gray-900 dark:text-white">
                {stats.total}
              </div>
            </div>
          </div>
        </div>

        {/* График с реальными данными */}
        <MarketChart data={stats.chart} />
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Call to Action (Кнопка на твой ТГ) */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/30 flex flex-col justify-between overflow-hidden min-h-[300px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner border border-white/10">
            <Send fill="white" size={24} className="ml-1" />
          </div>
          <h3 className="text-3xl font-black mb-3 tracking-tight leading-tight">
            {dict.stats.submitTitle}
          </h3>
          <p className="text-blue-100 text-base font-medium leading-relaxed opacity-90">
            {dict.stats.submitDesc}
          </p>
        </div>

        {/* --- ССЫЛКА НА ТВОЙ ТЕЛЕГРАМ --- */}
        <a
          href="https://t.me/monovitskiyds"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-full mt-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition shadow-xl active:scale-95 flex items-center justify-center gap-2"
        >
          {dict.stats.submitBtn}
          <Send size={16} />
        </a>
      </div>
    </section>
  );
}
