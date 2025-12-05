"use client";

import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Gambling Ads in TMA via RichAds: Budget, Figures, Outcome",
    excerpt:
      "How to effectively launch gambling campaigns in Telegram Mini Apps and get maximum ROI.",
    category: "Marketing",
    date: "Nov 24, 2025",
    readTime: "5 min read",
    image: "/news-1.jpg",
    color: "from-red-500 to-orange-500",
  },
  {
    id: 2,
    title: "5 Ad Formats for Telegram Mini Apps You Need to Know",
    excerpt:
      "Explore the most converting ad formats available for TMA developers in 2025.",
    category: "Guide",
    date: "Nov 22, 2025",
    readTime: "3 min read",
    image: "/news-2.jpg",
    color: "from-blue-500 to-cyan-500",
  },
];

export default function NewsSection({ dict }: { dict: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!dict) return null;

  return (
    <section className="relative py-8">
      {/* Заголовок и кнопки навигации */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {dict.title}
            <span className="flex w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {dict.subtitle}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition active:scale-95"
            aria-label="Previous slide"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition active:scale-95"
            aria-label="Next slide"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Контейнер карусели */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 snap-x snap-mandatory scrollbar-hide -mx-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {NEWS_ITEMS.map((item) => (
          <article
            key={item.id}
            className="group relative flex-none w-[85vw] sm:w-[45vw] lg:w-[calc(33.333%-16px)] snap-center"
          >
            <div className="flex flex-col h-full bg-white dark:bg-[#12141a] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`}
                />
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 transition-transform duration-700 group-hover:scale-105">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400/20">
                    <ExternalLink size={64} />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-lg bg-white/90 dark:bg-black/60 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white border border-white/20 shadow-lg">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-500" /> {item.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-500" />{" "}
                    {item.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                  {item.excerpt}
                </p>

                <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  {dict.read} <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
