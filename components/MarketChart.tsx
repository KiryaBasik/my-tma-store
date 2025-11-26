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

const data = [
  { name: "Mon", apps: 4000 },
  { name: "Tue", apps: 3000 },
  { name: "Wed", apps: 5000 },
  { name: "Thu", apps: 2780 },
  { name: "Fri", apps: 6890 },
  { name: "Sat", apps: 8390 },
  { name: "Sun", apps: 10400 },
];

export default function MarketChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke={isDark ? "#555" : "#94a3b8"}
            tick={{ fill: isDark ? "#9ca3af" : "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke={isDark ? "#555" : "#94a3b8"}
            tick={{ fill: isDark ? "#9ca3af" : "#64748b" }}
            axisLine={false}
            tickLine={false}
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
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
