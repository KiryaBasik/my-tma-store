import CategoriesHero from "@/components/categories/CategoriesHero";
import CategorySection from "@/components/categories/CategorySection";
import { Gamepad2, Wallet, Users } from "lucide-react";

// Обновленные данные с параметром colorTheme
const CATEGORIES_DATA = [
  {
    id: "crypto",
    title: "Crypto & Web3",
    description: "Wallets, DeFi, Exchanges and mining tools.",
    icon: <Wallet className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-400",
    bgGlow: "bg-blue-500/20",
    subcategories: [
      {
        name: "Wallets",
        count: 250,
        apps: ["Tonkeeper", "MyTonWallet", "Wallet", "Bitget"],
        icon: "👛",
        colorTheme: "blue",
      },
      {
        name: "DeFi & Staking",
        count: 317,
        apps: ["Ston.fi", "DeDust", "Storm", "Eva"],
        icon: "💸",
        colorTheme: "blue",
      },
      {
        name: "Exchanges (DEX/CEX)",
        count: 240,
        apps: ["Bybit", "OKX", "BingX", "MexC"],
        icon: "📊",
        colorTheme: "blue",
      },
      {
        name: "Airdrops",
        count: 754,
        apps: ["Blum", "Hot", "Major", "Dogs"],
        icon: "🪂",
        colorTheme: "blue",
      },
      {
        name: "Prediction Markets",
        count: 75,
        apps: ["Hedge", "Bet", "Oracle"],
        icon: "🔮",
        colorTheme: "blue",
      },
    ],
  },
  {
    id: "games",
    title: "Games & Entertainment",
    description: "Play-to-earn, RPG, clickers and time killers.",
    icon: <Gamepad2 className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    bgGlow: "bg-purple-500/20",
    subcategories: [
      {
        name: "Tap-to-Earn",
        count: 1682,
        apps: ["Notcoin", "Hamster", "Yescoin", "TapSwap"],
        icon: "👆",
        colorTheme: "purple",
      },
      {
        name: "RPG & Strategy",
        count: 352,
        apps: ["Heroes", "Clash", "Dota", "X-Empire"],
        icon: "⚔️",
        colorTheme: "purple",
      },
      {
        name: "Arcade & Action",
        count: 386,
        apps: ["Durger", "Run", "Jump"],
        icon: "🕹️",
        colorTheme: "purple",
      },
      {
        name: "Farming Games",
        count: 554,
        apps: ["Farm", "Corn", "Wheat"],
        icon: "🚜",
        colorTheme: "purple",
      },
      {
        name: "Puzzles",
        count: 404,
        apps: ["2048", "Sudoku", "Tetris"],
        icon: "🧩",
        colorTheme: "purple",
      },
    ],
  },
  {
    id: "social",
    title: "Social & Utilities",
    description: "Dating, communities, tools and productivity.",
    icon: <Users className="w-6 h-6" />,
    color: "from-green-400 to-emerald-600",
    bgGlow: "bg-green-500/20",
    subcategories: [
      {
        name: "Dating & Meetups",
        count: 120,
        apps: ["Tinder", "Love", "Date"],
        icon: "❤️",
        colorTheme: "green",
      },
      {
        name: "VPN & Proxy",
        count: 85,
        apps: ["Hide", "Proxy", "Secure"],
        icon: "🛡️",
        colorTheme: "green",
      },
      {
        name: "Education",
        count: 210,
        apps: ["Duolingo", "Learn", "Speak"],
        icon: "📚",
        colorTheme: "green",
      },
    ],
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col gap-20 pb-20">
      <CategoriesHero />

      {CATEGORIES_DATA.map((section) => (
        <CategorySection key={section.id} {...section} />
      ))}

      {/* Footer Banner */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900 px-8 py-16 text-center mt-10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <h2 className="text-3xl font-bold text-white">
            Can't find your category?
          </h2>
          <p className="text-blue-100 max-w-lg">
            We are constantly updating our catalog. If you have an app that
            doesn't fit, let us know.
          </p>
          <button className="px-8 py-3 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition shadow-xl hover:scale-105 active:scale-95">
            Suggest Category
          </button>
        </div>
      </div>
    </div>
  );
}