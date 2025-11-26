"use client";

import Link from "next/link";
import { Send, Hexagon, Plus, QrCode, Smartphone } from "lucide-react";

export default function Footer() {
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
              Discover curated selection of the best{" "}
              <span className="inline-flex items-center gap-1 text-blue-500 font-medium">
                <Send size={14} /> Telegram
              </span>{" "}
              &{" "}
              <span className="inline-flex items-center gap-1 text-cyan-500 font-medium">
                <Hexagon size={14} /> TON
              </span>{" "}
              Mini Apps & Bots.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-sm font-bold border border-border transition active:scale-95">
                <Plus size={16} /> Add your app
              </button>
              <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-transparent hover:bg-secondary text-gray-500 hover:text-foreground text-sm font-bold border border-border transition active:scale-95">
                Add business (Free)
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="font-bold text-foreground">Extras</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-500 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors" />
                  FindMini X (Twitter)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-500 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors" />
                  Publications
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-500 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors" />
                  Top Mini Apps
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-green-500 font-medium hover:brightness-110 transition"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Communities for PRO
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="font-bold text-foreground">For Business</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
              {[
                "Traffic sales & exchange",
                "Ads network",
                "Development",
                "Analytics and tools",
              ].map((item) => (
                <li key={item}>
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
                    Scan to Open
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    FindMini App
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 relative z-10">
                Experience the full power of our catalog directly inside
                Telegram.
              </p>

              <button className="relative z-10 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-blue-500/20">
                Open in Telegram
              </button>

              <div className="absolute -bottom-12 -right-6 text-gray-200 dark:text-gray-800 opacity-50 rotate-12 group-hover:rotate-6 group-hover:-translate-y-2 transition-transform duration-500">
                <Smartphone size={140} strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>&copy; 2025 FindMini Clone. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground transition">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
