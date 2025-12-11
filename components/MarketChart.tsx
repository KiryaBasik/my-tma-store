"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

export default function MarketChart({ data }: { data: any[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Заглушка на случай пустоты
  const safeData =
    data && data.length > 0
      ? data
      : Array.from({ length: 7 }).map((_, i) => ({ name: "", apps: 0 }));

  // Вычисляем максимум, чтобы график не был плоским
  const maxApps = Math.max(...safeData.map((d) => d.apps));
  // Если максимум 0 (нет данных), ставим 5 для красоты оси
  const yDomainMax = maxApps > 0 ? "auto" : 5;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData}>
          <defs>
            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke={isDark ? "#555" : "#94a3b8"}
            tick={{ fill: isDark ? "#9ca3af" : "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            stroke={isDark ? "#555" : "#94a3b8"}
            tick={{ fill: isDark ? "#9ca3af" : "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[0, yDomainMax]} // <--- ВАЖНО: Фиксируем диапазон
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              border: isDark ? "1px solid #374151" : "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              color: isDark ? "#fff" : "#0f172a",
            }}
            itemStyle={{ color: isDark ? "#fff" : "#0f172a" }}
          />
          <Area
            type="monotone"
            dataKey="apps"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorApps)"
            animationDuration={1500} // Плавная анимация при появлении
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
