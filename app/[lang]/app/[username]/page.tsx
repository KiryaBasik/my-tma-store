import {
  ArrowLeft,
  Download,
  Star,
  Share2,
  ShieldCheck,
  Globe,
  Users,
  Zap,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // Для графика

// Получение данных
async function getApp(username: string, lang: string) {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/app/${username}/?lang=${lang}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// Генерация мета-тегов
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; lang: string }>;
}) {
  const { username, lang } = await params;
  const app = await getApp(username, lang);

  if (!app) return { title: "App Not Found" };

  return {
    title: `${app.title} - Download & Review`,
    description: app.short_description || app.description.slice(0, 150),
  };
}

// --- Компонент Графика (Client Component внутри Server Page) ---
// В Next 13+ лучше выносить клиентские компоненты, но для простоты вставим заглушку данных
const ChartComponent = () => {
  // Фейковые данные для красивого графика "роста"
  const data = [
    { name: "Mon", val: 4000 },
    { name: "Tue", val: 3000 },
    { name: "Wed", val: 5000 },
    { name: "Thu", val: 4500 },
    { name: "Fri", val: 6800 },
    { name: "Sat", val: 8000 },
    { name: "Sun", val: 12000 },
  ];

  return (
    <div className="h-[200px] w-full mt-4">
      {/* Примечание: Recharts требует "use client". 
          Если будет ошибка, вынеси этот блок в отдельный файл AppChart.tsx 
       */}
      <div className="flex items-end gap-2 h-full justify-between px-2 pb-2">
        {data.map((d, i) => (
          <div
            key={i}
            className="w-full bg-blue-500/10 rounded-t-lg relative group h-full flex items-end"
          >
            <div
              style={{ height: `${(d.val / 12000) * 100}%` }}
              className="w-full bg-blue-500 rounded-t-md opacity-50 group-hover:opacity-100 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default async function AppPage({
  params,
}: {
  params: Promise<{ username: string; lang: string }>;
}) {
  const { username, lang } = await params;
  const app = await getApp(username, lang);

  if (!app) notFound();

  // Обработка иконки
  const iconUrl = app.icon
    ? app.icon.startsWith("http")
      ? app.icon
      : `http://127.0.0.1:8000${app.icon}`
    : null;

  return (
    <div className="min-h-screen pb-20">
      {/* Навигация */}
      <div className="mb-8">
        <Link
          href={`/${lang}/categories`}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-foreground transition-colors py-2 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ЛЕВАЯ КОЛОНКА (Основная инфа) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header карточка */}
          <div className="bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">
              {/* Иконка */}
              <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-[2rem] bg-gray-100 dark:bg-gray-800 shadow-lg overflow-hidden border border-gray-200 dark:border-white/10">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={app.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {app.title[0]}
                  </div>
                )}
              </div>

              {/* Текст и кнопки */}
              <div className="flex-grow space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                      {app.category || "App"}
                    </span>
                    {app.is_hero && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-2">
                    {app.title}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {app.username} • Version 1.0.2
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={app.telegram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
                  >
                    Open App <Download size={18} />
                  </a>
                  <button className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white font-bold transition">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Описание */}
          <div className="bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">About this App</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {app.description_en ||
                app.description ||
                "No description provided."}
            </div>

            {/* Теги */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["Telegram", "Mini App", "Bot", "Utility"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-sm font-medium text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Сайдбар) */}
        <div className="space-y-6">
          {/* Рейтинг и Статистика */}
          <div className="bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
            <div className="text-center border-b border-gray-100 dark:border-white/5 pb-6 mb-6">
              <div className="text-6xl font-black text-gray-900 dark:text-white mb-2">
                {app.rating}
              </div>
              <div className="flex justify-center gap-1 text-yellow-400 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={20}
                    fill={s <= Math.round(app.rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400">Based on affiliate data</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500 font-medium">
                  <Users size={18} /> Users
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {app.users_count_str || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500 font-medium">
                  <Globe size={18} /> Language
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  EN, RU
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500 font-medium">
                  <ShieldCheck size={18} /> Verified
                </span>
                <span className="font-bold text-blue-500">Yes</span>
              </div>
            </div>
          </div>

          {/* График популярности */}
          <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold flex items-center gap-2 mb-1">
                <Zap
                  className="text-yellow-400"
                  size={18}
                  fill="currentColor"
                />{" "}
                Popularity
              </h3>
              <p className="text-sm text-gray-400 mb-4">Last 7 days activity</p>
              <ChartComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
