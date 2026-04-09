import { useEffect, useState } from "react";
import CoinPile from "@/components/CoinPile";
import WalkingPerson from "@/components/WalkingPerson";
import PageHeader from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePoolData } from "@/hooks/usePoolData";
import { Wallet } from "lucide-react";

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
  const [showInput, setShowInput] = useState(false);
  const [address, setAddress] = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const wallet = localStorage.getItem("jiucai-wallet");
    if (wallet) navigate("/home", { replace: true });
  }, [navigate]);

  const handleConnect = () => {
    if (!address.trim()) return;
    setConnecting(true);
    setTimeout(() => {
      localStorage.setItem("jiucai-wallet", address.trim());
      navigate("/home");
    }, 600);
  };

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

      <div className="max-w-lg mx-auto px-4 relative z-10">
        <PageHeader />
      </div>

      <div className="flex justify-center mt-4 md:mt-8 relative z-10">
        <CoinPile amountU={usdt} amountJiucai={jiucai} isLoading={isLoading} />
      </div>

      {/* Connect wallet CTA */}
      <div className="relative z-10 max-w-lg mx-auto px-4 mt-10 pb-28">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-primary bg-primary/10 px-5 py-5 shadow-sm hover:bg-primary/20 active:scale-[0.98] transition-all duration-200"
          >
            <Wallet size={20} className="text-primary" />
            <span className="text-base font-semibold text-primary">{t("landing.connect")}</span>
          </button>
        ) : (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <p className="text-sm text-muted-foreground">{t("landing.desc")}</p>
            <input
              autoFocus
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("landing.placeholder")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowInput(false); setAddress(""); }}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("common.back")}
              </button>
              <button
                onClick={handleConnect}
                disabled={connecting || !address.trim()}
                className="flex-[2] rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                {connecting ? t("common.loading") : t("landing.connect")}
              </button>
            </div>
          </div>
        )}
      </div>

      {people.map((p, i) => <WalkingPerson key={i} {...p} />)}
    </div>
  );
};

export default Index;
