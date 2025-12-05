import { LayoutGrid } from "lucide-react";
import ExpandableSearch from "./ExpandableSearch";

export default function CategoriesHero({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  return (
    <div className="relative pt-12 pb-20 w-full">
      <div className="text-center flex flex-col gap-6 max-w-3xl mx-auto px-4">
        <div className="inline-flex self-center items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest mb-2 animate-pulse">
          <LayoutGrid size={16} />
          {dict.badge}
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
          {/* Для простоты используем текст из словаря целиком, без сложной верстки градиента для части слов, либо разбиваем в словаре */}
          {dict.heroTitle}
        </h1>

        <p className="text-xl text-gray-500 dark:text-gray-300/80 max-w-xl mx-auto leading-relaxed">
          {dict.heroSubtitle}
        </p>

        {/* Передаем плейсхолдер и язык в поиск */}
        <div className="mt-8 z-50 relative">
          <ExpandableSearch placeholder={dict.searchPlaceholder} lang={lang} />
        </div>
      </div>
    </div>
  );
}
