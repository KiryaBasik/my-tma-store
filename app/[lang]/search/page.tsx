import Link from "next/link";
import { ArrowLeft, Download, Star } from "lucide-react";

// Функция поиска
async function searchApps(query: string, lang: string) {
  if (!query) return [];
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/search/?q=${encodeURIComponent(
        query
      )}&lang=${lang}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q: string }>;
}) {
  const { lang } = await params;
  const { q } = await searchParams;

  const results = await searchApps(q, lang);

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="flex flex-col gap-6 mb-8 px-4">
        <Link
          href={`/${lang}/categories`}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to Categories
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search results for: <span className="text-blue-500">"{q}"</span>
          </h1>
          <p className="text-gray-500">Found {results.length} apps</p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Nothing found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {results.map((app: any) => (
            <div
              key={app.id}
              className="group bg-card border border-border rounded-[2rem] p-5 hover:border-blue-500/30 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary">
                  {app.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={app.icon}
                      alt={app.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-gray-400">
                      {app.title[0]}
                    </div>
                  )}
                </div>
                <a
                  href={app.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-foreground text-background px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                >
                  Open <Download size={14} />
                </a>
              </div>

              <div>
                <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-blue-500 transition-colors">
                  {app.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {app.short_description || app.description}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={12} fill="currentColor" /> {app.rating}
                </span>
                <span>{app.users_count_str || "N/A"} users</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
