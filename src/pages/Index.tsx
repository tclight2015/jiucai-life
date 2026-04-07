import CoinPile from "@/components/CoinPile";
import WalkingPerson from "@/components/WalkingPerson";
import { useNavigate } from "react-router-dom";
import { usePoolData } from "@/hooks/usePoolData";
import {
  Gift,
  TrendingUp,
  MessageSquare,
  Skull,
  ArrowLeftRight,
  Hand,
  Star,
  User,
  BookOpen,
  Coins,
  ScrollText,
} from "lucide-react";

import person1 from "@/assets/person1.png";
import person2 from "@/assets/person2.png";
import person3 from "@/assets/person3.png";
import person4 from "@/assets/person4.png";
import person5 from "@/assets/person5.png";
import person6 from "@/assets/person6.png";
import person7 from "@/assets/person7.png";

const people = [
  { src: person1, startX: 20, startY: 500, speed: 0.6 },
  { src: person2, startX: 280, startY: 550, speed: 0.9 },
  { src: person3, startX: 100, startY: 600, speed: 0.7 },
  { src: person4, startX: 200, startY: 480, speed: 0.5 },
  { src: person5, startX: 50, startY: 520, speed: 0.8 },
  { src: person6, startX: 300, startY: 570, speed: 0.65 },
  { src: person7, startX: 150, startY: 540, speed: 0.75 },
];

const modules = [
  { title: "抽獎名單", icon: Gift, href: "/pool", highlight: true },
  { title: "我發誓，回血中", icon: TrendingUp, href: "/recovery" },
  { title: "我要吐槽", icon: MessageSquare, href: "/chat" },
  { title: "邪惡排行榜", icon: Skull, href: "/leaderboard" },
  { title: "買賣韭菜幣", icon: ArrowLeftRight, href: "/token" },
  { title: "我要索幣", icon: Hand, href: "/claim" },
  { title: "最新抽獎活動", icon: Star, href: "/calendar" },
  { title: "個人資訊", icon: User, href: "/profile" },
  { title: "抽獎規則", icon: BookOpen, href: "/rules" },
  { title: "代幣資訊", icon: Coins, href: "/token" },
  { title: "韭菜宣言", icon: ScrollText, href: "/about" },
];

const Index = () => {
  const navigate = useNavigate();
  const { usdt, jiucai } = usePoolData();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, hsl(var(--gold-light)), transparent 70%)' }} />
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, hsl(var(--gold)), transparent 70%)' }} />
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      <div className="h-px bg-border" />

      {/* Header */}
      <div className="flex flex-col items-center pt-8 md:pt-14 relative z-10">
        <h1 className="hero-title">韭菜翻身日記</h1>
        <p className="hero-subtitle">被割過的人，都在這裡</p>
      </div>

      {/* Coin pile */}
      <div className="flex justify-center mt-4 md:mt-8 relative z-10">
        <CoinPile amountU={usdt} amountJiucai={jiucai} />
      </div>

      {/* Module cards */}
      <div className="relative z-10 max-w-lg mx-auto px-4 mt-6 pb-28 space-y-3">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.title}
              onClick={() => navigate(mod.href)}
              className={`w-full group flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-primary/10 active:scale-[0.98] text-left ${
                mod.highlight
                  ? "border-primary bg-primary/5 hover:border-primary"
                  : "border-border hover:border-primary/60"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                mod.highlight
                  ? "bg-primary/20 text-primary"
                  : "bg-primary/10 text-primary group-hover:bg-primary/20"
              }`}>
                <Icon size={20} />
              </div>
              <span className="text-sm font-semibold text-foreground tracking-wide">
                {mod.title}
              </span>
              <svg
                className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Walking people */}
      {people.map((p, i) => (
        <WalkingPerson key={i} {...p} />
      ))}
    </div>
  );
};

export default Index;
