import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import { usePoolData } from "@/hooks/usePoolData";
import {
  Gift, Hand, Star, BookOpen, Skull, Coins, Users,
  ScrollText, TrendingUp, MessageSquare, ChevronRight,
  LogOut, User,
} from "lucide-react";

const NEXT_DRAW = new Date("2026-04-10T20:00:00+08:00");

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const timer = setInterval(() => setRemaining(target.getTime() - Date.now()), 1000);
    return () => clearInterval(timer);
  }, [target]);
  const total = Math.max(0, remaining);
  return {
    d: Math.floor(total / 86400000),
    h: Math.floor((total % 86400000) / 3600000),
    m: Math.floor((total % 3600000) / 60000),
    s: Math.floor((total % 60000) / 1000),
  };
}

function truncateWallet(addr: string) {
  if (addr.length <= 13) return addr;
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

const modules = [
  { key: "claim",       icon: Hand,          href: "/claim" },
  { key: "calendar",    icon: Star,          href: "/calendar" },
  { key: "rules",       icon: BookOpen,      href: "/rules" },
  { key: "leaderboard", icon: Skull,         href: "/leaderboard" },
  { key: "trade",       icon: Coins,         href: "/token" },
  { key: "invite",      icon: Users,         href: "/invite" },
  { key: "about",       icon: ScrollText,    href: "/about" },
  { key: "recovery",    icon: TrendingUp,    href: "/recovery" },
  { key: "chat",        icon: MessageSquare, href: "/chat" },
] as const;

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { usdt, jiucai } = usePoolData();
  const { d, h, m, s } = useCountdown(NEXT_DRAW);
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("jiucai-wallet");
    if (!stored) {
      navigate("/", { replace: true });
    } else {
      setWallet(stored);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jiucai-wallet");
    navigate("/", { replace: true });
  };

  if (!wallet) return null;

  const countdown = [
    { v: d, l: t("pool.units.d") },
    { v: h, l: t("pool.units.h") },
    { v: m, l: t("pool.units.m") },
    { v: s, l: t("pool.units.s") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4">
        <PageHeader />

        {/* Wallet bar */}
        <div className="flex items-center justify-between mb-5 -mt-1">
          <p className="font-mono text-xs text-muted-foreground">{truncateWallet(wallet)}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={12} />
            {t("landing.disconnect")}
          </button>
        </div>

        {/* ── Pool expanded card ─────────────────────────── */}
        <div className="rounded-xl border border-amber-600/40 bg-amber-950/40 p-5 shadow-sm mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift size={15} className="text-amber-400" />
              <span className="text-sm font-semibold text-amber-300">{t("pool.title")}</span>
            </div>
            <button
              onClick={() => navigate("/pool")}
              className="flex items-center gap-0.5 text-xs text-amber-500/70 hover:text-amber-400 transition-colors"
            >
              {t("home.detail")}
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-3">
            <span className="text-xl font-bold text-amber-200">{usdt.toLocaleString()} USDT</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xl font-bold text-amber-200">{jiucai.toLocaleString()} JIUCAI</span>
          </div>
          <p className="text-xs text-amber-400/60 mb-1.5">{t("pool.countdown")}</p>
          <div className="flex gap-4">
            {countdown.map((u) => (
              <div key={u.l} className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold tabular-nums text-amber-200">
                  {String(u.v).padStart(2, "0")}
                </span>
                <span className="text-xs text-amber-400/60">{u.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Profile expanded card ─────────────────────── */}
        <div className="rounded-xl border border-blue-600/30 bg-blue-950/30 p-5 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User size={15} className="text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">{t("profile.holdings")}</span>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-0.5 text-xs text-blue-500/70 hover:text-blue-400 transition-colors"
            >
              {t("home.detail")}
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t("profile.balance")}</p>
              <p className="text-sm font-semibold text-blue-200">5,000,000 JIUCAI</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t("profile.rank")}</p>
              <p className="text-sm font-semibold text-blue-200">#42 · 3.2x</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t("profile.holdDays")}</p>
              <p className="text-sm font-semibold text-blue-200">45 {t("common.days")} · 1.5x</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t("profile.wallet")}</p>
              <p className="text-xs font-mono text-blue-300 truncate">{truncateWallet(wallet)}</p>
            </div>
          </div>
        </div>

        {/* ── Module list ───────────────────────────────── */}
        <div className="space-y-2 pb-28">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.key}
                onClick={() => navigate(mod.href)}
                className="w-full group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-primary/10 hover:border-primary/60 active:scale-[0.98] text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-foreground tracking-wide">
                  {t(`modules.${mod.key}`)}
                </span>
                <ChevronRight size={16} className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
