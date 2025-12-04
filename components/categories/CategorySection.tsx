import CategoryCard from "./CategoryCard";

interface SubCategory {
  name: string;
  count: number;
  apps: any[]; // Было string[], меняем на any[], так как скоро там будут объекты с картинками
  icon: string;
  colorTheme?: string;
  slug: string; // <--- ДОБАВИЛИ ОБЯЗАТЕЛЬНОЕ ПОЛЕ
}

interface CategorySectionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGlow: string;
  subcategories: SubCategory[];
}

export default function CategorySection({
  id,
  title,
  description,
  icon,
  color,
  bgGlow,
  subcategories,
}: CategorySectionProps) {
  return (
    <section className="relative w-full">
      <div
        className={`absolute left-0 top-20 w-full h-[500px] ${bgGlow} blur-[150px] opacity-20 -z-10 pointer-events-none`}
      />

      <div className="flex items-end gap-4 mb-8 border-b border-gray-200 dark:border-white/5 pb-4 px-2">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-none mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2">
        {subcategories.map((sub) => (
          <CategoryCard
            key={sub.name}
            name={sub.name}
            count={sub.count}
            apps={sub.apps}
            icon={sub.icon}
            colorTheme={sub.colorTheme || "blue"}
            slug={sub.slug} // <--- ВОТ ЭТО МЫ ЗАБЫЛИ ПЕРЕДАТЬ
          />
        ))}
      </div>
    </section>
  );
}
