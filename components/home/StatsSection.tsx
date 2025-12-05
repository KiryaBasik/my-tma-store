"use client";

import MarketChart from "@/components/MarketChart";
import { TrendingUp, Zap } from "lucide-react";

// Добавляем пропс dict
export default function StatsSection({ dict }: { dict: any }) {
  if (!dict) return null;

  return (
    <section className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-card rounded-[2rem] p-8 border border-border shadow-lg transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground">
            <TrendingUp className="text-blue-500" size={28} />{" "}
            {dict.marketPulse}
          </h3>
          <select className="bg-secondary border border-border rounded-xl text-sm px-4 py-2 text-foreground outline-none cursor-pointer font-medium">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <MarketChart />
      </div>

      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/30 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner font-bold">
            <Zap fill="white" size={28} />
          </div>
          <h3 className="text-5xl font-black mb-2 tracking-tight">1,402</h3>
          <p className="text-blue-100 text-lg font-medium">{dict.newApps}</p>
        </div>
        <button className="relative z-10 w-full mt-10 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition shadow-xl active:scale-95">
          {dict.viewReport}
        </button>
      </div>
    </section>
  );
}
