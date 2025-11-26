"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  name: string;
  count: number;
  apps: string[];
  icon: string;
  colorTheme: string;
}

export default function CategoryCard({ name, count, apps, icon, colorTheme }: CategoryCardProps) {
  
  const glowColorClass = {
    blue: "from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30",
    purple: "from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30",
    green: "from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30",
    orange: "from-orange-500/20 to-yellow-500/20 group-hover:from-orange-500/30 group-hover:to-yellow-500/30",
  }[colorTheme] || "from-gray-500/20 to-gray-500/20";

  const ringColorClass = {
    blue: "ring-blue-500/30 group-hover:ring-blue-500",
    purple: "ring-purple-500/30 group-hover:ring-purple-500",
    green: "ring-green-500/30 group-hover:ring-green-500",
    orange: "ring-orange-500/30 group-hover:ring-orange-500",
  }[colorTheme] || "ring-gray-500/50";

  const iconBgClass = {
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    green: "bg-green-500/10 text-green-500",
    orange: "bg-orange-500/10 text-orange-500",
  }[colorTheme];

  const displayApps = apps.slice(0, 4);
  const extraCount = apps.length > 4 ? apps.length - 4 : 0;

  return (
    <motion.div
      initial="idle"
      whileHover="hover"
      // Добавил flex и flex-col, чтобы контролировать вертикальное распределение
      className="group relative h-[360px] bg-white dark:bg-[#12141a] border border-gray-200/50 dark:border-white/5 rounded-[2.5rem] p-7 overflow-hidden cursor-pointer flex flex-col shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:hover:shadow-black/80"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${glowColorClass} opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none`} />
      
      {/* HEADER: Заголовок и иконка */}
      <div className="relative z-10 flex justify-between items-start mb-2">
        <div className="flex flex-col gap-4 max-w-[70%]">
           {/* Иконка категории */}
           <div className={`w-fit p-3 rounded-2xl ${iconBgClass} backdrop-blur-md shadow-sm`}>
                <span className="text-3xl">{icon}</span>
           </div>
           
           {/* ИСПРАВЛЕНИЕ: 
              1. min-h-[4rem] или [80px] - резервируем высоту под 2 строки.
              2. line-clamp-2 - обрезаем, если вдруг 3 строки (безопасность).
              3. text-2xl вместо 3xl - чуть компактнее, чтобы влезало лучше.
           */}
           <div className="min-h-[4rem] flex items-center">
             <h3 className="text-2xl md:text-[1.7rem] font-black text-gray-900 dark:text-white leading-tight line-clamp-2">
               {name}
             </h3>
           </div>
        </div>
        
        {/* Бейдж справа */}
        <div className="flex flex-col items-end gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5 group-hover:border-white/20 transition-colors whitespace-nowrap">
               <Sparkles size={12} className={colorTheme === 'blue' ? 'text-blue-400' : 'text-purple-400'} />
               {count}
            </span>
            <motion.div 
                variants={{
                    idle: { opacity: 0, x: -10 },
                    hover: { opacity: 1, x: 0 }
                }}
                className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-gray-900 dark:text-white shadow-md"
            >
                <ChevronRight size={20} />
            </motion.div>
        </div>
      </div>

      {/* ИСПРАВЛЕНИЕ: flex-grow 
         Этот блок займет все свободное место между заголовком и футером.
         Иконки будут всегда визуально по центру свободной зоны.
      */}
      <div className="relative z-10 flex-grow flex items-center justify-center py-2">
        <div className="relative w-full h-24 flex items-center justify-center">
            {displayApps.map((app, i) => {
                const total = displayApps.length + (extraCount > 0 ? 1 : 0);
                const centerIndex = (total - 1) / 2;
                const offset = i - centerIndex;
                
                return (
                    <motion.div
                        key={i}
                        variants={{
                            idle: { 
                                x: offset * 45, 
                                rotate: offset * 8, 
                                scale: 1,
                                zIndex: i
                            },
                            hover: { 
                                x: offset * 70, 
                                rotate: 0,      
                                scale: 1.1,     
                                zIndex: 10,
                                transition: { type: "spring", stiffness: 200, damping: 20 }
                            }
                        }}
                        className={`absolute w-16 h-16 rounded-[1.2rem] border-[3px] border-white dark:border-[#12141a] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl ring-1 ${ringColorClass} flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-300`}
                    >
                        <span className="drop-shadow-sm">{app[0]}</span>
                    </motion.div>
                );
            })}

            {extraCount > 0 && (
                 <motion.div
                    variants={{
                        idle: { 
                            x: (displayApps.length - (displayApps.length + 1 - 1)/2) * 45, 
                            rotate: 15,
                            scale: 0.9,
                            zIndex: 0
                        },
                        hover: { 
                            x: (displayApps.length - (displayApps.length + 1 - 1)/2) * 70, 
                            rotate: 0,
                            scale: 1,
                            zIndex: 10
                        }
                    }}
                    className={`absolute w-14 h-14 rounded-[1rem] border-[3px] border-white dark:border-[#12141a] bg-gray-900 dark:bg-white/10 flex items-center justify-center text-sm font-bold text-white shadow-lg`}
                 >
                    +{extraCount}
                 </motion.div>
            )}
        </div>
      </div>
      
      {/* FOOTER */}
      <div className="relative z-10 mt-auto flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-300 pt-2">
         <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-transparent group-hover:border-gray-400 transition-all">
            Explore Collection
         </span>
      </div>

    </motion.div>
  );
}