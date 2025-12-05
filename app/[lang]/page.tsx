import HeroSection from "@/components/home/HeroSection";
import TopLists from "@/components/home/TopLists";
import StatsSection from "@/components/home/StatsSection";
import TrendingGrid from "@/components/home/TrendingGrid";
import NewsSection from "@/components/home/NewsSection";

// ИСПРАВЛЕНИЕ 1: Правильный путь (один уровень вверх, так как файл в папке app)
import { getDictionary } from "../dictionaries";

// --- Функция загрузки Hero ---
async function getHeroApps() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/hero/", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function getTopApps() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/apps/", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function getWeeklyApps() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/weekly/", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // 2. Загружаем данные И словарь параллельно
  const [heroApps, topApps, weeklyApps, dict] = await Promise.all([
    getHeroApps(),
    getTopApps(),
    getWeeklyApps(),
    getDictionary(lang), // Получаем переводы для текущего языка
  ]);

  return (
    <div className="space-y-16">
      {/* HeroSection берет тексты из базы данных, ему dict обычно не нужен */}
      <HeroSection apps={heroApps} />

      {/* ИСПРАВЛЕНИЕ 2: Передаем dict во все компоненты, которые ругались */}
      <TopLists initialApps={topApps} dict={dict} />

      <StatsSection dict={dict} />

      <TrendingGrid initialApps={weeklyApps} dict={dict} />

      <NewsSection dict={dict} />
    </div>
  );
}
