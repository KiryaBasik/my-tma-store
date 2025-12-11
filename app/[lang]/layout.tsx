import ParallaxBackground from "@/components/ParallaxBackground";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header"; // Импортируем новый Header
import NextTopLoader from "nextjs-toploader";
import { getDictionary } from "@/app/dictionaries";

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
  const dict = await getDictionary(lang);

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

          {/* Используем новый компонент Header */}
          <Header lang={lang} dict={dict.navigation} />

          <main className="relative z-10 pt-28 w-full mx-auto px-5 md:px-[100px] xl:px-[240px] pb-20 flex-grow">
            {children}
          </main>

          <Footer
            footerDict={dict.footer}
            navDict={dict.navigation}
            lang={lang}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
