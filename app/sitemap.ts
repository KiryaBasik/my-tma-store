import { MetadataRoute } from "next";

// Функция для авто-определения домена
function getBaseUrl() {
  // 1. Если мы на Vercel (в продакшене или превью) — используем их переменную
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // 2. Если мы локально — используем localhost
  return "http://localhost:3000";
}

async function getCategories() {
  try {
    const baseUrl = getBaseUrl(); // Используем динамический URL для запроса к API
    // Важно: на сервере (при сборке) нужно обращаться по полному пути
    const res = await fetch(`${baseUrl}/api/categories/`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const categories = await getCategories();

  // Статические страницы
  const routes = ["", "/categories", "/search"].map((route) => ({
    url: `${baseUrl}/en${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // Русские версии статики
  const routesRu = ["", "/categories", "/search"].map((route) => ({
    url: `${baseUrl}/ru${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // Динамические категории
  let categoryRoutes: MetadataRoute.Sitemap = [];

  categories.forEach((cat: any) => {
    cat.subcategories.forEach((sub: any) => {
      // English URL
      categoryRoutes.push({
        url: `${baseUrl}/en/category/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
      // Russian URL
      categoryRoutes.push({
        url: `${baseUrl}/ru/category/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  return [...routes, ...routesRu, ...categoryRoutes];
}
