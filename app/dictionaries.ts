import "server-only";

const dictionaries = {
  en: {
    navigation: {
      home: "Home",
      categories: "Categories",
      ads: "Ads & Promo",
      submit: "+ Submit",
    },
    hero: {
      featured: "Featured #1",
      welcome: "Welcome",
      launch: "Launch App",
      more: "More Details",
      trending: "Trending",
      category: "Category",
      users: "Users",
      rating: "Rating",
    },
    topApps: {
      title: "Top Apps of the Day",
      viewAll: "View All",
      users: "users",
      // Новые ключи для промо-карточки
      promoTitle: "Want your app here?",
      promoDesc: "Get featured and reach millions of users daily.",
      promoBtn: "Contact Us",
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
    // Секция страницы отдельного приложения
    appPage: {
      back: "Back",
      open: "Open App",
      share: "Share",
      ratingSub: "Based on affiliate data",
      users: "Users",
      languages: "Languages",
      verified: "Verified",
      yes: "Yes",
      no: "No",
      about: "About this App",
      popularity: "Popularity",
      activity: "Last 7 days activity",
      na: "N/A",
    },
    categories: {
      heroTitle: "Discover Next-Gen Apps",
      heroSubtitle:
        "Dive into the Telegram Mini Apps ecosystem. Find gems across DeFi, Gaming, and Utilities designed for the new web.",
      badge: "App Exploratorium",
      searchPlaceholder: "Search apps...",
      empty: "No categories found.",
    },
    adsPage: {
      hero: {
        badge: "Boost Your Growth",
        title: "Dominate the TMA Market",
        subtitle:
          "Get your app featured in front of millions of active users. The most effective way to skyrocket your traffic.",
        cta: "Start Campaign",
      },
      sticky: {
        title: "Why advertise with us?",
        subtitle:
          "We provide not just traffic, but engaged users ready to use your product.",
      },
      benefits: [
        {
          title: "Homepage Hero",
          desc: "Your app in the main spotlight. 100% visibility for every visitor.",
          stat: "500k+",
          statLabel: "Daily Impressions",
        },
        {
          title: "Targeted Category",
          desc: "Be the #1 choice in your specific niche (DeFi, Games, Tools).",
          stat: "15%",
          statLabel: "Higher Conversion",
        },
        {
          title: "Social Blast",
          desc: "Mentions in our Telegram channel and Twitter community.",
          stat: "1M+",
          statLabel: "Audience Reach",
        },
        {
          title: "Search Priority",
          desc: "Always appear first when users search for keywords.",
          stat: "TOP 1",
          statLabel: "Search Rank",
        },
      ],
      contact: {
        title: "Ready to scale?",
        subtitle: "Contact me via Telegram to discuss custom packages.",
        btn: "Contact",
      },
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
  },

  // --- RUSSIAN ---
  ru: {
    navigation: {
      home: "Главная",
      categories: "Категории",
      ads: "Реклама",
      submit: "+ Добавить",
    },
    hero: {
      featured: "Рекомендуем #1",
      welcome: "Добро пожаловать",
      launch: "Запустить",
      more: "Подробнее",
      trending: "В тренде",
      category: "Категория",
      users: "Польз.",
      rating: "Рейтинг",
    },
    topApps: {
      title: "Топ приложений дня",
      viewAll: "Смотреть все",
      users: "польз.",
      // Перевод промо-блока
      promoTitle: "Хотите попасть сюда?",
      promoDesc: "Получите фичеринг и охватите миллионы пользователей.",
      promoBtn: "Связаться с нами",
    },
    stats: {
      marketPulse: "Рост рынка",
      totalApps: "Всего приложений и ботов",
      submitTitle: "Разработчик или Фаундер?",
      submitDesc:
        "Добавьте свое приложение в каталог, чтобы получить трафик и пользователей.",
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
    // Перевод страницы приложения
    appPage: {
      back: "Назад",
      open: "Открыть",
      share: "Поделиться",
      ratingSub: "На основе данных",
      users: "Пользователи",
      languages: "Языки",
      verified: "Верифицировано",
      yes: "Да",
      no: "Нет",
      about: "О приложении",
      popularity: "Популярность",
      activity: "Активность за 7 дней",
      na: "Нет данных",
    },
    categories: {
      heroTitle: "Откройте приложения нового поколения",
      heroSubtitle:
        "Погрузитесь в экосистему Telegram Mini Apps. Находите жемчужины в DeFi, Играх и Утилитах для нового веба.",
      badge: "Исследователь приложений",
      searchPlaceholder: "Поиск приложений...",
      empty: "Категории не найдены.",
    },
    adsPage: {
      hero: {
        badge: "Ускорь свой рост",
        title: "Доминируй на рынке TMA",
        subtitle:
          "Покажи свой проект миллионам активных пользователей. Самый эффективный способ взвинтить трафик.",
        cta: "Запустить кампанию",
      },
      sticky: {
        title: "Почему мы?",
        subtitle:
          "Мы даем не просто клики, а вовлеченную аудиторию, готовую использовать ваш продукт.",
      },
      benefits: [
        {
          title: "Hero Баннер",
          desc: "Ваше приложение на главном экране. 100% видимость для каждого посетителя.",
          stat: "500k+",
          statLabel: "Показов в сутки",
        },
        {
          title: "Лидер категории",
          desc: "Станьте выбором №1 в своей нише (DeFi, Игры, Утилиты).",
          stat: "15%",
          statLabel: "Рост конверсии",
        },
        {
          title: "Социальный взрыв",
          desc: "Упоминания в нашем Telegram канале и сообществе в Twitter.",
          stat: "1M+",
          statLabel: "Охват аудитории",
        },
        {
          title: "Поиск в топе",
          desc: "Всегда появляйтесь первыми, когда пользователи ищут ключевые слова.",
          stat: "ТОП 1",
          statLabel: "В поиске",
        },
      ],
      contact: {
        title: "Готовы масштабироваться?",
        subtitle:
          "Свяжитесь со мной в Telegram для обсуждения индивидуальных условий.",
        btn: "Написать мне",
      },
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
