import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import NewsShareButton from "@/components/NewsShareButton"; // <--- ИМПОРТ

// --- ФУНКЦИИ ЗАГРУЗКИ ---

async function getNewsItem(id: string, lang: string) {
  try {
    const res = await fetch(
      `http://localhost:8000/api/news/${id}/?lang=${lang}`,
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

async function getLatestNews(lang: string) {
  try {
    const res = await fetch(`http://localhost:8000/api/news/?lang=${lang}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

// --- СТРАНИЦА ---

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;
  const news = await getNewsItem(id, lang);
  if (!news) return { title: "News not found" };
  const cleanDesc = news.content.replace(/<[^>]*>?/gm, "").slice(0, 150);
  return { title: news.title, description: cleanDesc };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;

  const [post, allNews] = await Promise.all([
    getNewsItem(id, lang),
    getLatestNews(lang),
  ]);

  if (!post) notFound();

  const relatedNews = Array.isArray(allNews)
    ? allNews.filter((n: any) => n.id !== post.id).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen pb-20">
      {/* Прогресс-бар */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50 origin-left scale-x-0 animate-scroll-progress" />

      {/* Навигация назад */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 mb-8 pt-6">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-foreground transition-colors py-2 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5"
        >
          <ArrowLeft size={18} />
          {lang === "ru" ? "На главную" : "Back to Home"}
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ЛЕВАЯ КОЛОНКА: Контент */}
        <div className="lg:col-span-8 min-w-0">
          {/* Заголовок и мета */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Tag size={12} /> {post.category || "News"}
              </span>
              <span className="text-sm text-gray-400 flex items-center gap-1.5">
                <Calendar size={14} /> {post.date}
              </span>
              <span className="text-sm text-gray-400 flex items-center gap-1.5">
                <Clock size={14} /> 5 min read
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6 break-words">
              {post.title}
            </h1>
          </div>

          {/* Обложка */}
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl mb-10 bg-gray-200 dark:bg-gray-800">
            {post.image ? (
              <Image
                src={
                  post.image.startsWith("http")
                    ? post.image
                    : `http://localhost:8000${post.image}`
                }
                alt={post.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* ТЕКСТ СТАТЬИ */}
          <article
            className="prose dark:prose-invert prose-lg max-w-none w-full break-words overflow-hidden
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-a:text-blue-500 hover:prose-a:text-blue-400 
            prose-img:rounded-2xl prose-img:shadow-lg
            prose-p:leading-relaxed prose-li:marker:text-blue-500"
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Кнопки шеринга (ИСПРАВЛЕНО) */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
            <span className="font-bold text-gray-900 dark:text-white">
              {lang === "ru" ? "Понравилось? Поделись:" : "Share this article:"}
            </span>
            <div className="flex gap-2">
              {/* Используем клиентский компонент */}
              <NewsShareButton
                title={post.title}
                text={lang === "ru" ? "Поделиться" : "Share"}
              />
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Сайдбар */}
        <div className="lg:col-span-4 relative min-w-0">
          <div className="sticky top-24 space-y-8">
            {/* Блок "Читать также" */}
            <div className="bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                {lang === "ru" ? "Читайте также" : "Read Also"}
              </h3>

              <div className="flex flex-col gap-6">
                {relatedNews.length > 0 ? (
                  relatedNews.map((item: any) => (
                    <Link
                      href={`/${lang}/news/${item.id}`}
                      key={item.id}
                      className="group flex gap-4 items-start"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {item.image && (
                          <Image
                            src={
                              item.image.startsWith("http")
                                ? item.image
                                : `http://localhost:8000${item.image}`
                            }
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition duration-500"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-blue-500 transition-colors break-words">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-2">
                          {item.date}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No other news yet.</p>
                )}
              </div>
            </div>

            {/* Промо блок (ИСПРАВЛЕНО: ССЫЛКА НА ТГ) */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-lg group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="text-2xl font-bold mb-2 relative z-10">
                Add your Bot?
              </h3>
              <p className="text-indigo-100 text-sm mb-6 relative z-10">
                Get 1M+ views on our platform.
              </p>
              <a
                href="https://t.me/monovitskiyds"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg active:scale-95 relative z-10"
              >
                Submit Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
