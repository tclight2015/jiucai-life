import CoinPile from "@/components/CoinPile";
import { useLang } from "@/contexts/LangContext";
import WalkingPerson from "@/components/WalkingPerson";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePoolData } from "@/hooks/usePoolData";

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

const content = {
  zh: {
    title: "韭菜翻身日記",
    subtitle: "被割過的人，都在這裡",
    manifesto: "韭菜宣言",
    connectWallet: "連結錢包",
    poolLabel: "目前累計獎金",
    claimNote: "索幣請先連結錢包",
  },
  en: {
    title: "THE DEGEN'S REVENGE DIARY",
    subtitle: "Reclaiming What Was Rugged. We're Paying You Back.",
    manifesto: "The Jiucai Manifesto",
    connectWallet: "Connect Wallet",
    poolLabel: "Total Prize Pool",
    claimNote: "Connect wallet to claim",
  },
};

const Index = () => {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const { usdt, jiucai } = usePoolData();
  const c = content[lang];

  const handleConnectWallet = () => {
    // TODO: 接入錢包連接流程
    console.log("Connect wallet clicked");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, hsl(var(--gold-light)), transparent 70%)' }} />
        <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, hsl(var(--gold)), transparent 70%)' }} />
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      <div className="h-px bg-border" />

      {/* Language toggle */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button
          onClick={() => setLang("zh")}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            lang === "zh"
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          中文
        </button>
        <button
          onClick={() => setLang("en")}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            lang === "en"
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          EN
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center pt-16 md:pt-20 relative z-10 px-6 text-center">
        {lang === "zh" ? (
          <h1 className="hero-title">{c.title}</h1>
        ) : (
          <h1 className="font-black text-3xl md:text-4xl tracking-wide leading-tight">
            {c.title}
          </h1>
        )}
        {lang === "en" ? (
          <p className="mt-2 font-bold text-base md:text-lg text-center leading-snug">
            Reclaiming What Was Rugged.<br />We're Paying You Back.
          </p>
        ) : (
          <p className="hero-subtitle text-muted-foreground mt-2">{c.subtitle}</p>
        )}
      </div>

      {/* Coin pile */}
      <div className="flex justify-center mt-4 md:mt-8 relative z-10">
        <CoinPile amountU={usdt} amountJiucai={jiucai} poolLabel={c.poolLabel} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col items-center mt-5 relative z-10">
        <div className="flex justify-center gap-3">
          <Button variant="outline" className="rounded-full px-6" onClick={() => navigate('/about')}>
            {c.manifesto}
          </Button>
          <Button className="rounded-full px-6" onClick={handleConnectWallet}>
            {c.connectWallet}
          </Button>
        </div>
        <p className="text-muted-foreground mt-2" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
          {c.claimNote}
        </p>
      </div>

      {/* Walking people */}
      {people.map((p, i) => (
        <WalkingPerson key={i} {...p} />
      ))}
    </div>
  );
};

export default Index;
