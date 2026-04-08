import CoinPile from "@/components/CoinPile";
import WalkingPerson from "@/components/WalkingPerson";
import PageHeader from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePoolData } from "@/hooks/usePoolData";
import {
  Gift, TrendingUp, MessageSquare, Skull, ArrowLeftRight,
  Hand, Star, User, BookOpen, Coins, Users, ScrollText,
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

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { usdt, jiucai, isLoading } = usePoolData();

  const modules = [
    { key: "lottery",     icon: Gift,            href: "/pool",        highlight: true },
    { key: "recovery",    icon: TrendingUp,       href: "/recovery" },
    { key: "chat",        icon: MessageSquare,    href: "/chat" },
    { key: "leaderboard", icon: Skull,            href: "/leaderboard" },
    { key: "trade",       icon: ArrowLeftRight,   href: "/token" },
    { key: "claim",       icon: Hand,             href: "/claim" },
    { key: "calendar",    icon: Star,             href: "/calendar" },
    { key: "profile",     icon: User,             href: "/profile" },
    { key: "rules",       icon: BookOpen,         href: "/rules" },
    { key: "token",       icon: Coins,            href: "/token" },
    { key: "invite",      icon: Users,            href: "/invite" },
    { key: "about",       icon: ScrollText,       href: "/about" },
  ] as const;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsl(var(--gold-light)), transparent 70%)" }} />
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(var(--gold)), transparent 70%)" }} />
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      <div className="h-px bg-border" />

      {/* Header (includes language toggle) */}
      <div className="max-w-lg mx-auto px-4 relative z-10">
        <PageHeader />
      </div>

      {/* Coin pile */}
      <div className="flex justify-center mt-4 md:mt-8 relative z-10">
        <CoinPile amountU={usdt} amountJiucai={jiucai} isLoading={isLoading} />
      </div>

      {/* Module cards */}
      <div className="relative z-10 max-w-lg mx-auto px-4 mt-6 pb-28 space-y-3">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const highlight = "highlight" in mod && mod.highlight;
          return (
            <button
              key={mod.key}
              onClick={() => navigate(mod.href)}
              className={`w-full group flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-primary/10 active:scale-[0.98] text-left ${
                highlight ? "border-primary bg-primary/5 hover:border-primary" : "border-border hover:border-primary/60"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                highlight ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary group-hover:bg-primary/20"
              }`}>
                <Icon size={20} />
              </div>
              <span className="text-sm font-semibold text-foreground tracking-wide">
                {t(`modules.${mod.key}`)}
              </span>
              <svg className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Walking people */}
      {people.map((p, i) => <WalkingPerson key={i} {...p} />)}
    </div>
  );
};

export default Index;
