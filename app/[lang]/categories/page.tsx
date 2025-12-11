import CategoriesHero from "@/components/categories/CategoriesHero";
import CategorySection from "@/components/categories/CategorySection";
import { getDictionary } from "@/app/dictionaries";

// Функция получения данных С ЯЗЫКОМ
async function getCategories(lang: string) {
  try {
    // ИСПРАВЛЕНИЕ: 127.0.0.1 -> localhost
    const res = await fetch(
      `http://155.212.219.98/api/categories/?lang=${lang}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const categories = await getCategories(lang);

  return (
    <div className="min-h-screen flex flex-col gap-20 pb-20">
      <CategoriesHero dict={dict.categories} lang={lang} />

      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          {dict.categories.empty}
        </div>
      ) : (
        categories.map((cat: any) => (
          <CategorySection
            key={cat.id}
            id={cat.slug}
            title={cat.name}
            description={cat.description}
            icon={<span className="text-2xl">{cat.icon_emoji}</span>}
            color={
              cat.color_theme === "blue"
                ? "from-blue-500 to-cyan-400"
                : cat.color_theme === "purple"
                ? "from-purple-500 to-pink-500"
                : cat.color_theme === "green"
                ? "from-green-400 to-emerald-600"
                : "from-orange-400 to-yellow-500"
            }
            bgGlow={
              cat.color_theme === "blue"
                ? "bg-blue-500/20"
                : cat.color_theme === "purple"
                ? "bg-purple-500/20"
                : cat.color_theme === "green"
                ? "bg-green-500/20"
                : "bg-orange-500/20"
            }
            subcategories={cat.subcategories.map((sub: any) => ({
              name: sub.name,
              count: sub.count,
              apps: sub.apps,
              icon: sub.icon_emoji || "📁",
              colorTheme: cat.color_theme,
              slug: sub.slug,
            }))}
          />
        ))
      )}
    </div>
  );
}
