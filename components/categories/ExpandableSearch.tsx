"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function ExpandableSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(containerRef, () => setIsExpanded(false));

  const handleClick = () => {
    if (!isExpanded) {
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    // Убрали лишние врапперы, просто контейнер для позиционирования
    <div className="relative h-16 flex items-center justify-center z-50" ref={containerRef}>
      <motion.div
        layout
        onClick={handleClick}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`relative flex items-center overflow-hidden transition-colors ${
          isExpanded
            ? "w-full max-w-xl bg-white dark:bg-[#1a1d24] rounded-2xl border border-blue-500/30 px-1 cursor-text shadow-2xl shadow-blue-900/20"
            : "w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full cursor-pointer hover:scale-105 active:scale-95 border border-white/20 shadow-[0_10px_20px_rgba(37,99,235,0.3)]"
        }`}
      >
        {/* Контейнер иконки: фиксированная ширина, чтобы иконка всегда была по центру этого квадрата */}
        <motion.div 
            layout 
            className={`flex-shrink-0 flex items-center justify-center h-14 ${isExpanded ? "w-12" : "w-full h-full"}`}
        >
           <Search className={`${isExpanded ? "text-blue-500 w-5 h-5" : "text-white w-7 h-7"}`} strokeWidth={2.5} />
        </motion.div>

        {/* Поле ввода */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, transition: { duration: 0.1 } }}
              className="flex-grow flex items-center pr-3"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none w-full text-lg text-gray-900 dark:text-white placeholder:text-gray-400 h-14"
              />
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                  <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}