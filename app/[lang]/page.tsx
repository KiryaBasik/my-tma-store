import HeroSection from "@/components/home/HeroSection";
import TopLists from "@/components/home/TopLists";
import StatsSection from "@/components/home/StatsSection";
import TrendingGrid from "@/components/home/TrendingGrid";
import NewsSection from "@/components/home/NewsSection";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="space-y-16">
      <HeroSection />
      <TopLists />
      <StatsSection />
      <TrendingGrid />
      <NewsSection />
    </div>
  );
}
