// components/ParallaxBackground.tsx
"use client";

import { motion } from "framer-motion";
import { Bot, Zap, Star, Hexagon, Ghost } from "lucide-react";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  Icon: any;
  top: number;
  left: number;
  speed: number;
  size: number;
};

export default function ParallaxBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const icons = [Bot, Zap, Star, Hexagon, Ghost];

    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      Icon: icons[i % icons.length],
      left: Math.floor(Math.random() * 100),
      top: Math.floor(Math.random() * 100),
      speed: (i % 5) + 1,
      size: 24 + Math.random() * 40,
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ИСПРАВЛЕНИЕ ТУТ: используем bg-background вместо #0f1115
  if (!isMounted) return <div className="fixed inset-0 bg-background -z-10" />;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
      {particles.map((particle) => {
        const { Icon } = particle;

        return (
          <motion.div
            key={particle.id}
            // Цвета иконок:
            // text-slate-300 (серый) для светлой темы (на белом фоне)
            // dark:text-slate-700 (темно-серый) для темной темы (на черном фоне)
            className="absolute text-slate-300 dark:text-slate-700"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              x: mousePosition.x * particle.speed * 0.02,
              y: mousePosition.y * particle.speed * 0.02,
            }}
            transition={{ type: "spring", damping: 50, stiffness: 400 }}
          >
            <Icon size={particle.size} />
          </motion.div>
        );
      })}
      {/* Градиент правильный, берет цвета из переменных темы */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
}
