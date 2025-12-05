"use client";

import Link from "next/link";
import { Send, Hexagon, Plus, QrCode, Smartphone } from "lucide-react";

// Принимаем словарь как пропс
export default function Footer({ dict }: { dict: any }) {
  // Если словарь еще не загрузился (на всякий случай), не рендерим или возвращаем null
  if (!dict) return null;

  return (
    <footer className="relative z-10 border-t border-border bg-background transition-colors duration-300 pt-16 pb-8">
      <div className="w-full mx-auto px-5 md:px-[100px] xl:px-[240px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                F
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                FindMini
              </span>
            </div>

            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {dict.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-sm font-bold border border-border transition active:scale-95">
                <Plus size={16} /> {dict.addApp}
              </button>
              <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-transparent hover:bg-secondary text-gray-500 hover:text-foreground text-sm font-bold border border-border transition active:scale-95">
                {dict.addBusiness}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="font-bold text-foreground">{dict.extras}</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
              {dict.extrasLinks.map((link: string, i: number) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="font-bold text-foreground">{dict.forBusiness}</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
              {dict.businessLinks.map((item: string, i: number) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-[#151921] border border-border p-6 group">
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <QrCode size={48} className="text-gray-900" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {dict.scan}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {dict.appTitle}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 relative z-10">
                {dict.scanDesc}
              </p>

              <button className="relative z-10 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-blue-500/20">
                {dict.openTg}
              </button>

              <div className="absolute -bottom-12 -right-6 text-gray-200 dark:text-gray-800 opacity-50 rotate-12 group-hover:rotate-6 group-hover:-translate-y-2 transition-transform duration-500">
                <Smartphone size={140} strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; 2025 FindMini Clone. {dict.rights}</p>
          <div className="flex gap-6">
            {dict.bottomLinks.map((link: string, i: number) => (
              <Link
                key={i}
                href="#"
                className="hover:text-foreground transition"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
