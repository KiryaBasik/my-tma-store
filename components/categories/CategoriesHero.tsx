import { LayoutGrid } from "lucide-react";
import ExpandableSearch from "./ExpandableSearch"; // Импортируем новый компонент

export default function CategoriesHero() {
  return (
    <div className="relative pt-12 pb-20 w-full">
      <div className="text-center flex flex-col gap-6 max-w-3xl mx-auto px-4">
        <div className="inline-flex self-center items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest mb-2 animate-pulse">
          <LayoutGrid size={16} />
          App Exploratorium
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
          Discover <span className="relative inline-block">
            <span className="absolute -inset-2 bg-gradient-to-r from-blue-600/50 to-purple-600/50 blur-2xl opacity-50 rounded-full"></span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Next-Gen
            </span>
          </span> Apps
        </h1>
        
        <p className="text-xl text-gray-500 dark:text-gray-300/80 max-w-xl mx-auto leading-relaxed">
          Dive into the Telegram Mini Apps ecosystem. Find gems across DeFi, Gaming, and Utilities designed for the new web.
        </p>

        {/* Вставляем новый компонент поиска */}
        <div className="mt-8 z-50 relative">
           <ExpandableSearch />
        </div>
      </div>
    </div>
  );
}