import HeroSection from "@/components/home/HeroSection";
import TopLists from "@/components/home/TopLists";
import StatsSection from "@/components/home/StatsSection";
import TrendingGrid from "@/components/home/TrendingGrid";
import NewsSection from "@/components/home/NewsSection";
import { getDictionary } from "../dictionaries";

// Универсальная функция fetch с защитой от ошибок
async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`http://localhost:8000/api/${endpoint}`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();

    // Обработка пагинации DRF
    if (data && data.results && Array.isArray(data.results)) {
      return data.results;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Запрашиваем ВСЕ данные параллельно
  const [heroApps, topApps, weeklyApps, newsData, dict] = await Promise.all([
    fetchAPI(`hero/?lang=${lang}`),
    fetchAPI(`apps/?lang=${lang}`),
    fetchAPI(`weekly/?lang=${lang}`),
    fetchAPI(`news/?lang=${lang}`), // <--- ЗАГРУЖАЕМ НОВОСТИ
    getDictionary(lang),
  ]);

  return (
    <div className="space-y-16">
      <HeroSection apps={heroApps} />
      <TopLists initialApps={topApps} dict={dict} />
      <StatsSection dict={dict} />
      <TrendingGrid initialApps={weeklyApps} dict={dict} />

      {/* Передаем новости в компонент */}
      <NewsSection news={newsData} dict={dict} />
    </div>
  );
}
