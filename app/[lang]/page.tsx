import HeroSection from "@/components/home/HeroSection";
import TopLists from "@/components/home/TopLists";
import StatsSection from "@/components/home/StatsSection";
import TrendingGrid from "@/components/home/TrendingGrid";
import NewsSection from "@/components/home/NewsSection";
import { getDictionary } from "../dictionaries";

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`http://155.212.219.98/api/${endpoint}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return endpoint.includes("stats") ? { total: 0, chart: [] } : [];
    }

    const data = await res.json();

    if (data && data.results && Array.isArray(data.results)) {
      return data.results;
    }
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

  const [heroApps, topApps, weeklyApps, newsData, statsData, dict] =
    await Promise.all([
      fetchAPI(`hero/?lang=${lang}`),
      fetchAPI(`apps/?lang=${lang}`),
      fetchAPI(`weekly/?lang=${lang}`),
      fetchAPI(`news/?lang=${lang}`),
      fetchAPI(`stats/`),
      getDictionary(lang),
    ]);

  return (
    <div className="relative">
      {/* 1. HERO БЛОК (STICKY) 
          Он "прилипает" к верху и остается на месте, пока его не перекроют.
          z-0 - чтобы быть на нижнем слое.
      */}
      <div className="sticky top-0 z-0 min-h-[95vh] flex flex-col justify-center pt-20 pb-10">
        <HeroSection apps={heroApps} dict={dict} lang={lang} />
      </div>

      {/* 2. ОСТАЛЬНОЙ КОНТЕНТ (ШТОРКА)
          relative z-10 - слой выше Hero.
          bg-background - непрозрачный фон, чтобы закрыть Hero.
          rounded-t-[3rem] - закругление сверху для красивого стыка.
          shadow - тень, чтобы отделить слои.
      */}
      <div className="relative z-10 bg-background rounded-t-[3rem] border-t border-gray-200 dark:border-white/5 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
        <div className="space-y-24 py-20">
          <TopLists initialApps={topApps} dict={dict} />
          <StatsSection dict={dict} stats={statsData} />
          <TrendingGrid initialApps={weeklyApps} dict={dict} />
          <NewsSection news={newsData} dict={dict} />
        </div>
      </div>
    </div>
  );
}
