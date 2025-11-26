import ParallaxBackground from "@/components/ParallaxBackground";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata = {
  title: "FindMini Clone",
  description: "Best Telegram Mini Apps",
};

// Меню навигации.
// href должен начинаться со слэша.
const NAV_ITEMS = [
  { name: "Categories", href: "/categories" },
  { name: "Marketplace", href: "#" }, // Пока заглушка
  { name: "Ads", href: "#" }, // Пока заглушка
  { name: "Sensor", href: "#" }, // Пока заглушка
];

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // Получаем текущий язык (например, "ru" или "en")
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-blue-500/30 transition-colors duration-300 flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ParallaxBackground />

          <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-300">
            <div className="w-full mx-auto px-5 md:px-[100px] xl:px-[240px] h-20 flex items-center justify-between">
              {/* Логотип: ведет на главную страницу */}
              <Link
                href={`/${lang}`}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition shadow-lg shadow-blue-500/20">
                  F
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  FindMini
                </span>
              </Link>

              {/* Навигация */}
              <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    // ВАЖНО: Добавляем язык в начало пути
                    href={item.href === "#" ? "#" : `/${lang}${item.href}`}
                    className="hover:text-primary transition relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <LanguageSwitcher currentLang={lang} />
                <ThemeSwitcher />

                <button className="hidden sm:block bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95 ml-2">
                  + Submit
                </button>
              </div>
            </div>
          </header>

          <main className="relative z-10 pt-28 w-full mx-auto px-5 md:px-[100px] xl:px-[240px] pb-20 flex-grow">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
