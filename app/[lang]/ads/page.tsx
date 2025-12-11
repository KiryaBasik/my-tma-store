import { getDictionary } from "@/app/dictionaries";
import { Rocket, Zap, BarChart3, Search, Megaphone, Send } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Advertise with Us",
  description: "Promote your Telegram Mini App to millions of users.",
};

export default async function AdsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const ads = dict.adsPage;

  // Иконки для плашек
  const icons = [Megaphone, Zap, BarChart3, Search];
  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-emerald-500 to-green-400",
  ];

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* 1. HERO BLOCK */}
      <section className="relative w-full rounded-[3rem] overflow-hidden bg-[#0d0f14] border border-white/5 min-h-[600px] flex flex-col items-center justify-center text-center px-6 py-20 group">
        {/* Фоновые эффекты */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Контент */}
        <div className="relative z-10 max-w-4xl flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest animate-pulse">
            <Rocket size={16} />
            {ads.hero.badge}
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              {ads.hero.title}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl leading-relaxed">
            {ads.hero.subtitle}
          </p>

          <Link
            href="https://t.me/monovitskiyds"
            target="_blank"
            className="mt-4 bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3"
          >
            {ads.hero.cta} <Zap size={20} className="fill-black" />
          </Link>
        </div>

        {/* Декоративная сетка */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      </section>

      {/* 2. STICKY BENEFITS BLOCK */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Левая колонка (Липкий текст) */}
          <div className="relative">
            <div className="sticky top-32 flex flex-col gap-6">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                {ads.sticky.title}
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
                {ads.sticky.subtitle}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4" />
            </div>
          </div>

          {/* Правая колонка (Плашки скроллятся) */}
          <div className="flex flex-col gap-8">
            {ads.benefits.map((benefit: any, index: number) => {
              const Icon = icons[index % icons.length];
              const gradient = gradients[index % gradients.length];

              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-[#161920] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-blue-900/10"
                >
                  {/* Фоновый градиент при ховере */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    <div className="flex flex-col gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
                      >
                        <Icon size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xs">
                        {benefit.desc}
                      </p>
                    </div>

                    {/* Цифра/Статистика */}
                    <div className="self-start md:self-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 text-center min-w-[140px] group-hover:scale-105 transition-transform duration-300">
                      <div
                        className={`text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br ${gradient}`}
                      >
                        {benefit.stat}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-wider">
                        {benefit.statLabel}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CONTACT BLOCK */}
      <section className="relative rounded-[3rem] bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 p-8 md:p-16 text-center text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/30 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/30 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {ads.contact.title}
          </h2>
          <p className="text-lg md:text-xl text-blue-100/80 font-medium">
            {ads.contact.subtitle}
          </p>

          <Link
            href="https://t.me/monovitskiyds"
            target="_blank"
            className="group relative inline-flex items-center gap-3 bg-white text-blue-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-blue-50 active:scale-95 shadow-xl"
          >
            <span className="relative z-10">{ads.contact.btn}</span>
            <Send
              size={20}
              className="relative z-10 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
