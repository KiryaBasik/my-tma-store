"use client";

import Link from "next/link";
import { Plus, QrCode, Smartphone, Send } from "lucide-react";

// Обновленный интерфейс пропсов
export default function Footer({
  footerDict,
  navDict,
  lang,
}: {
  footerDict: any;
  navDict: any;
  lang: string;
}) {
  if (!footerDict || !navDict) return null;

  // Формируем ссылки для колонки "Дополнительно" на основе навигации
  const extraLinks = [
    { label: navDict.home, href: `/${lang}` },
    { label: navDict.categories, href: `/${lang}/categories` },
    { label: navDict.ads, href: `/${lang}/ads` },
  ];

  const contactLink = "https://t.me/monovitskiyds"; // Твой контакт для всех кнопок

  return (
    <footer className="relative z-10 border-t border-border bg-background transition-colors duration-300 pt-10 pb-8 md:pt-16">
      <div className="w-full mx-auto px-4 md:px-[100px] xl:px-[240px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-10 md:mb-16">
          {/* 1. Лого и Кнопки (Левая часть) */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                F
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                FindMini
              </span>
            </div>

            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base">
              {footerDict.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* КНОПКА 1: Добавить приложение -> ТГ */}
              <a
                href={contactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-sm font-bold border border-border transition active:scale-95"
              >
                <Plus size={16} /> {footerDict.addApp}
              </a>

              {/* КНОПКА 2: Для бизнеса -> ТГ */}
              <a
                href={contactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-transparent hover:bg-secondary text-gray-500 hover:text-foreground text-sm font-bold border border-border transition active:scale-95"
              >
                {footerDict.addBusiness}
              </a>
            </div>
          </div>

          {/* 2. Ссылки (По центру) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-8">
            {/* Дополнительно (Главная, Категории, Реклама) */}
            <div className="flex flex-col gap-4 md:gap-6">
              <h4 className="font-bold text-foreground">{footerDict.extras}</h4>
              <ul className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
                {extraLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="hover:text-blue-500 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Бизнесу (оставляем старые ссылки или меняем на #) */}
            <div className="flex flex-col gap-4 md:gap-6">
              <h4 className="font-bold text-foreground">
                {footerDict.forBusiness}
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
                {footerDict.businessLinks.map((item: string, i: number) => (
                  <li key={i}>
                    <Link
                      href="#"
                      className="hover:text-blue-500 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Промо карточка (Правая часть) */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-[#151921] border border-border p-5 md:p-6 group">
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="bg-white dark:bg-white/10 p-2 rounded-lg shadow-sm backdrop-blur-sm">
                  <QrCode size={40} className="text-gray-900 dark:text-white" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {footerDict.scan}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {footerDict.appTitle}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 relative z-10 pr-2">
                {footerDict.scanDesc}
              </p>

              {/* КНОПКА ОТКРЫТЬ В ТЕЛЕГРАМ */}
              <a
                href={contactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center relative z-10 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {footerDict.openTg}
              </a>

              <div className="absolute -bottom-12 -right-6 text-gray-200 dark:text-white/5 opacity-50 rotate-12 group-hover:rotate-6 group-hover:-translate-y-2 transition-transform duration-500 pointer-events-none">
                <Smartphone size={140} strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Нижняя панель (Копирайт) */}
        <div className="border-t border-border pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 text-center md:text-left">
          <p className="order-2 md:order-1">
            &copy; 2025 FindMini Clone. {footerDict.rights}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 order-1 md:order-2">
            {footerDict.bottomLinks.map((link: string, i: number) => (
              <Link
                key={i}
                href="#"
                className="hover:text-foreground transition"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
