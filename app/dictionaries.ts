import "server-only";

const dictionaries = {
  en: {
    navigation: {
      categories: "Categories",
      marketplace: "Marketplace",
      ads: "Ads",
      sensor: "Sensor",
      submit: "+ Submit",
    },
    hero: {
      featured: "Featured #1",
      welcome: "Welcome",
      launch: "Launch App",
      more: "More Details",
      trending: "Trending", // Новое
      category: "Category", // Новое
      users: "Users", // Новое
      rating: "Rating", // Новое
    },
    topApps: {
      title: "Top Apps of the Day",
      viewAll: "View All",
      users: "users",
    },
    stats: {
      marketPulse: "Market Growth",
      totalApps: "Total Apps & Bots",
      submitTitle: "Developer or Founder?",
      submitDesc: "Submit your app to our catalog to get traffic and users.",
      submitBtn: "Contact & Submit",
    },
    trending: {
      title: "Apps of the Week",
      subtitle: "Curated selection of the best performing apps",
      weeklyBadge: "Weekly Selection",
      editorChoice: "Editor's Choice",
      install: "Install Now",
      rating: "Rating",
    },
    news: {
      title: "Latest Insights",
      subtitle: "Trends, guides, and updates from the TMA world",
      read: "Read Article",
    },
    footer: {
      description:
        "Discover curated selection of the best Telegram & TON Mini Apps & Bots.",
      addApp: "Add your app",
      addBusiness: "Add business (Free)",
      extras: "Extras",
      forBusiness: "For Business",
      scan: "Scan to Open",
      appTitle: "FindMini App",
      scanDesc:
        "Experience the full power of our catalog directly inside Telegram.",
      openTg: "Open in Telegram",
      rights: "All rights reserved.",
      // Списки ссылок
      extrasLinks: [
        "FindMini X (Twitter)",
        "Publications",
        "Top Mini Apps",
        "Communities for PRO",
      ],
      businessLinks: [
        "Traffic sales & exchange",
        "Ads network",
        "Development",
        "Analytics and tools",
      ],
      bottomLinks: ["Privacy Policy", "Terms of Service", "Disclaimer"],
    },
    categories: {
      heroTitle: "Discover Next-Gen Apps",
      heroSubtitle:
        "Dive into the Telegram Mini Apps ecosystem. Find gems across DeFi, Gaming, and Utilities designed for the new web.",
      badge: "App Exploratorium",
      searchPlaceholder: "Search apps...",
      empty: "No categories found.",
    },
  },
  ru: {
    navigation: {
      categories: "Категории",
      marketplace: "Маркет",
      ads: "Реклама",
      sensor: "Сенсор",
      submit: "+ Добавить",
    },
    hero: {
      featured: "Рекомендуем #1",
      welcome: "Добро пожаловать",
      launch: "Запустить",
      more: "Подробнее",
      trending: "В тренде", // Новое
      category: "Категория", // Новое
      users: "Польз.", // Новое
      rating: "Рейтинг", // Новое
    },
    topApps: {
      title: "Топ приложений дня",
      viewAll: "Смотреть все",
      users: "польз.",
    },
    stats: {
      marketPulse: "Рост рынка",
      totalApps: "Всего приложений и ботов",
      submitTitle: "Разработчик или Фаундер?",
      submitDesc: "Добавьте свое приложение в каталог, чтобы получить трафик и пользователей.",
      submitBtn: "Написать и Добавить",
    },
    trending: {
      title: "Приложения недели",
      subtitle: "Отобранные лучшие приложения экосистемы",
      weeklyBadge: "Выбор недели",
      editorChoice: "Выбор редакции",
      install: "Установить",
      rating: "Рейтинг",
    },
    news: {
      title: "Последние новости",
      subtitle: "Тренды, гайды и обновления из мира TMA",
      read: "Читать статью",
    },
    categories: {
      heroTitle: "Откройте приложения нового поколения",
      heroSubtitle:
        "Погрузитесь в экосистему Telegram Mini Apps. Находите жемчужины в DeFi, Играх и Утилитах для нового веба.",
      badge: "Исследователь приложений",
      searchPlaceholder: "Поиск приложений...",
      empty: "Категории не найдены.",
    },
    footer: {
      description: "Откройте для себя лучшие Telegram и TON Mini Apps и боты.",
      addApp: "Добавить приложение",
      addBusiness: "Для бизнеса (Бесплатно)",
      extras: "Дополнительно",
      forBusiness: "Бизнесу",
      scan: "Сканируй",
      appTitle: "Приложение FindMini",
      scanDesc: "Используйте всю мощь нашего каталога прямо внутри Telegram.",
      openTg: "Открыть в Telegram",
      rights: "Все права защищены.",
      extrasLinks: [
        "FindMini X (Twitter)",
        "Публикации",
        "Топ Mini Apps",
        "Сообщества для PRO",
      ],
      businessLinks: [
        "Покупка и обмен трафиком",
        "Рекламная сеть",
        "Разработка",
        "Аналитика и инструменты",
      ],
      bottomLinks: [
        "Политика конфиденциальности",
        "Условия использования",
        "Отказ от ответственности",
      ],
    },
  },
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;
};
