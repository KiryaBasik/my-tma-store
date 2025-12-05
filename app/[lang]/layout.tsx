import ParallaxBackground from "@/components/ParallaxBackground";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { getDictionary } from "@/app/dictionaries"; // <--- ИМПОРТ СЛОВАРЯ

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata = {
  title: "FindMini Clone",
  description: "Best Telegram Mini Apps",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang); // <--- ПОЛУЧАЕМ СЛОВАРЬ

  const NAV_ITEMS = [
    { name: dict.navigation.categories, href: "/categories" },
    { name: dict.navigation.marketplace, href: "#" },
    { name: dict.navigation.ads, href: "#" },
    { name: dict.navigation.sensor, href: "#" },
  ];

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-blue-500/30 transition-colors duration-300 flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NextTopLoader
            color="#3b82f6"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
          />

          <ParallaxBackground />

          <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-300">
            <div className="w-full mx-auto px-5 md:px-[100px] xl:px-[240px] h-20 flex items-center justify-between">
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

              <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
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
                  {dict.navigation.submit}
                </button>
              </div>
            </div>
          </header>

          <main className="relative z-10 pt-28 w-full mx-auto px-5 md:px-[100px] xl:px-[240px] pb-20 flex-grow">
            {children}
          </main>

          {/* Передаем словарь в футер */}
          <Footer dict={dict.footer} />
        </ThemeProvider>
      </body>
    </html>
  );
}
