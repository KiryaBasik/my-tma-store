import { ArrowLeft, Star, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getSubCategoryData(slug: string, lang: string) {
  try {
    const res = await fetch(
      `http://localhost:8000/api/subcategory/${slug}/?lang=${lang}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;
  const data = await getSubCategoryData(slug, lang);

  if (!data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <Link
          href={`/${lang}/categories`}
          className="text-blue-500 hover:underline"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="flex flex-col gap-6 mb-12">
        <Link
          href={`/${lang}/categories`}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          {lang === "ru" ? "Назад к категориям" : "Back to Collections"}
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-4xl">{data.icon_emoji || "📁"}</span>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            {data.name}
          </h1>
          <span className="px-3 py-1 rounded-full bg-secondary text-xs font-bold text-gray-500">
            {data.apps.length} apps
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.apps.map((app: any) => (
          <div
            key={app.id}
            className="group relative bg-card border border-border rounded-[2rem] p-5 hover:border-blue-500/30 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col gap-4 overflow-hidden"
          >
            {/* ССЫЛКА НА SINGLE (РАСТЯНУТА, z-10) */}
            <Link
              href={`/app/${app.username.replace("@", "")}`}
              className="absolute inset-0 z-10"
            >
              <span className="sr-only">Open Details</span>
            </Link>

            <div className="flex items-start justify-between relative z-20 pointer-events-none">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary relative">
                {app.icon ? (
                  <Image
                    src={
                      app.icon.startsWith("http")
                        ? app.icon
                        : `http://localhost:8000${app.icon}`
                    }
                    alt={app.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-gray-400">
                    {app.title?.[0]}
                  </div>
                )}
              </div>

              {/* КНОПКА OPEN (z-30, pointer-events-auto) */}
              <a
                href={app.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto bg-foreground text-background px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform z-30"
              >
                Open <Download size={14} />
              </a>
            </div>

            <div className="relative z-0">
              <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-blue-500 transition-colors">
                {app.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {app.short_description || app.description}
              </p>
            </div>

            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs font-medium text-gray-500 relative z-0">
              <span className="flex items-center gap-1 text-yellow-500">
                <Star size={12} fill="currentColor" /> {app.rating}
              </span>
              <span>{app.users_count_str || "N/A users"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
