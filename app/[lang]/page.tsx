import HeroSection from "@/components/home/HeroSection";
import TopLists from "@/components/home/TopLists";
import StatsSection from "@/components/home/StatsSection";
import TrendingGrid from "@/components/home/TrendingGrid";
import NewsSection from "@/components/home/NewsSection";

// --- Функция загрузки Hero ---
async function getHeroApp() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/hero/", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// --- Функция загрузки Top Apps ---
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

// --- НОВАЯ Функция загрузки Weekly Apps ---
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

  // Параллельная загрузка всех данных
  const [heroApp, topApps, weeklyApps] = await Promise.all([
    getHeroApp(),
    getTopApps(),
    getWeeklyApps(),
  ]);

  return (
    <div className="space-y-16">
      <HeroSection app={heroApp} />
      <TopLists initialApps={topApps} />
      <StatsSection />
      {/* Передаем данные в TrendingGrid */}
      <TrendingGrid initialApps={weeklyApps} />
      <NewsSection />
    </div>
  );
}
