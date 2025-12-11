import HeroSection from "@/components/home/HeroSection";
import TopLists from "@/components/home/TopLists";
import StatsSection from "@/components/home/StatsSection";
import TrendingGrid from "@/components/home/TrendingGrid";
import NewsSection from "@/components/home/NewsSection";
import { getDictionary } from "../dictionaries";

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`http://localhost:8000/api/${endpoint}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      // Если ошибка API, возвращаем пустые объекты
      return endpoint.includes("stats") ? { total: 0, chart: [] } : [];
    }

    const data = await res.json();

    if (data && data.results && Array.isArray(data.results)) {
      return data.results;
    }
    // Если это статистика (объект), возвращаем как есть
    if (endpoint.includes("stats")) {
      return data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return endpoint.includes("stats") ? { total: 0, chart: [] } : [];
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Запрашиваем ВСЕ данные (включая новую статистику)
  const [heroApps, topApps, weeklyApps, newsData, statsData, dict] =
    await Promise.all([
      fetchAPI(`hero/?lang=${lang}`),
      fetchAPI(`apps/?lang=${lang}`),
      fetchAPI(`weekly/?lang=${lang}`),
      fetchAPI(`news/?lang=${lang}`),
      fetchAPI(`stats/`), // <--- ЗАПРОС К НОВОМУ API
      getDictionary(lang),
    ]);

  return (
    <div className="space-y-16">
      {/* ИСПРАВЛЕНИЕ ОШИБКИ: Передаем dict и lang */}
      <HeroSection apps={heroApps} dict={dict} lang={lang} />

      <TopLists initialApps={topApps} dict={dict} />

      {/* ПЕРЕДАЕМ statsData В КОМПОНЕНТ */}
      <StatsSection dict={dict} stats={statsData} />

      <TrendingGrid initialApps={weeklyApps} dict={dict} />
      <NewsSection news={newsData} dict={dict} />
    </div>
  );
}
