import CategoriesHero from "@/components/categories/CategoriesHero";
import CategorySection from "@/components/categories/CategorySection";
// Иконки можно мапить, но пока используем эмодзи с бэкенда

// Функция получения данных
async function getCategories() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/categories/", {
      cache: "no-store", // Чтобы видеть свежие данные при обновлении
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col gap-20 pb-20">
      <CategoriesHero />

      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          Loading categories or database is empty...
        </div>
      ) : (
        categories.map((cat: any) => (
          <CategorySection
            key={cat.id}
            id={cat.slug}
            title={cat.name}
            description={cat.description}
            // Эмодзи с бэка используем как иконку
            icon={<span className="text-2xl">{cat.icon_emoji}</span>}
            // Формируем градиент на основе темы
            color={
              cat.color_theme === 'blue' ? "from-blue-500 to-cyan-400" :
              cat.color_theme === 'purple' ? "from-purple-500 to-pink-500" :
              cat.color_theme === 'green' ? "from-green-400 to-emerald-600" :
              "from-orange-400 to-yellow-500"
            }
            bgGlow={
              cat.color_theme === 'blue' ? "bg-blue-500/20" :
              cat.color_theme === 'purple' ? "bg-purple-500/20" :
              cat.color_theme === 'green' ? "bg-green-500/20" :
              "bg-orange-500/20"
            }
            subcategories={cat.subcategories.map((sub: any) => ({
              name: sub.name,
              count: sub.count,
              apps: sub.apps, // Бэк возвращает массив названий ["Notcoin", ...]
              icon: sub.icon_emoji || "📁",
              colorTheme: cat.color_theme,
              // Добавляем slug, чтобы ссылка в карточке знала куда вести (нужно будет обновить CategoryCard)
              slug: sub.slug 
            }))}
          />
        ))
      )}
    </div>
  );
}