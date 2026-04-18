import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LangContext";
import PageHeader from "@/components/PageHeader";

const zhContent = {
  title: "韭菜宣言",
  tagline: "被別人割的，我們還給你",
  joinNote: "無需報名，持幣即能參加",
  body: [
    "不要懷疑，這裡沒有欺詐",
    "獎池來自交易稅，讓錢再次回流到你的口袋",
    "相信這裡，這是一次財富重分配的機會",
    "現實很無情，這裡很公平",
    "幣價會漲、獎金會有、只要持幣就有機會",
    "不用羨慕別人的好運，自己就會是見證",
    "越多人加入、參與，獎池累積越快越滿",
    "你唯一要做的就是動起來，推薦更多人加入，接著就是等待",
    "等待 Telegram 的入選通知",
    "等待 Telegram 的打幣通知",
    "然後確認帳戶入帳",
  ],
  redLine: "幣價會漲、獎金會有、只要持幣就有機會",
  closing: [
    { bold: true, text: "幣圈割你，我們補你" },
    { bold: false, text: "持幣就能翻身，真的 U 打給你" },
    { bold: false, text: "這不只是承諾，更有鏈上紀錄" },
    { bold: false, text: "來「韭菜翻身日記」，讓你回血" },
  ],
  promisesTitle: "我們的承諾",
  promises: [
    { title: "永不上 CEX（中心化交易所）", desc: "CEX 是割你的地方，我們不會把你送進去。" },
    { title: "持續送錢", desc: "定期清空獎金池，是韭菜翻身日記的承諾。" },
    { title: "鏈上透明", desc: "所有打款都有交易 hash，任何人可自行驗證。" },
    { title: "獎金池來自交易稅", desc: "不是龐氏，不是空氣，每一筆獎金都有真實來源與去處。" },
  ],
};

const enContent = {
  title: "THE DEGEN'S REVENGE DIARY",
  tagline: "Reclaiming What Was Rugged. We're Paying You Back.",
  joinNote: "No Whitelist. No Bullshit. Just Hold to Earn.",
  body: [
    "Stop second-guessing—this isn't another scam.",
    "The prize pool is fueled by transaction taxes. We're redirecting the capital flow straight back into your wallet.",
    "Trust the code. This is your ultimate shot at Wealth Redistribution.",
    "The real world is rigged; here, the smart contract is fair.",
    "The floor pumps, the rewards stack, and as long as you're holding, you're in the game.",
    "Don't just watch others moon—be the one they envy.",
    "The more Degens join the fray, the faster the pot overflows.",
    "Your mission is simple: Shill, Onboard, and Chill. Then, simply wait for that Telegram ping.",
    "The selection alert. The transfer confirmation. Check your balance. Feel the rush.",
    "The market rugged you. We're healing you. Hold to flip your life. Real USDT, sent straight to you. This isn't a roadmap pipe dream; it's an on-chain reality.",
    'Join "The Degen\'s Revenge Diary"—it\'s time to recover your losses.',
  ],
  redLine: "The floor pumps, the rewards stack, and as long as you're holding, you're in the game.",
  closing: [
    { bold: true, text: "The market rugged you. We're healing you." },
    { bold: false, text: "Hold to flip your life. Real USDT, sent straight to you." },
    { bold: false, text: "This isn't a roadmap pipe dream; it's an on-chain reality." },
    { bold: false, text: 'Join "The Degen\'s Revenge Diary"—it\'s time to recover your losses.' },
  ],
  promisesTitle: "Our Manifesto",
  promises: [
    { title: "Zero CEX Ambitions", desc: "Centralized exchanges are slaughterhouses. We refuse to feed you to the wolves." },
    { title: "Non-Stop Giveaways", desc: "Draining the prize pool back to the community isn't a goal—it's our sacred vow." },
    { title: "On-Chain Absolute Transparency", desc: "Every payout comes with a TX Hash. Don't trust, verify." },
    { title: "Real Yield, No Ponzi", desc: "The pool scales with volume, not thin air. Every reward has a documented source and a verified destination." },
  ],
};

const About = () => {
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const c = lang === "zh" ? zhContent : enContent;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader pageTitle="韭菜宣言" />
      <div className="px-6 py-10 max-w-2xl mx-auto">

      {/* Hero */}
      <h1 className="text-4xl font-bold mb-4">{c.title}</h1>
      {lang === "en" ? (
        <p className="text-2xl font-semibold text-foreground mb-2">
          Reclaiming What Was Rugged.<br />We're Paying You Back.
        </p>
      ) : (
        <p className="text-2xl font-semibold text-foreground mb-2">{c.tagline}</p>
      )}
      <p className="text-red-500 font-semibold mb-8">{c.joinNote}</p>

      {/* Body */}
      <div className="mb-10 text-muted-foreground">
        {c.body.map((line) => (
          <p
            key={line}
            className={`mb-1 ${line === c.redLine ? "text-red-500 font-semibold" : ""}`}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Closing */}
      <div className="mb-10">
        {c.closing.map(({ bold, text }) => (
          <p key={text} className={`mb-1 ${bold ? "text-xl font-semibold" : "text-muted-foreground"}`}>
            {text}
          </p>
        ))}
      </div>

      <hr className="border-border mb-10" />

      {/* Promises */}
      <h2 className="text-2xl font-bold mb-6">{c.promisesTitle}</h2>
      <div className="space-y-5">
        {c.promises.map(({ title, desc }) => (
          <div key={title}>
            <p className="font-semibold">{title}</p>
            <p className="text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {lang === "en" && (
        <p className="text-2xl font-bold mt-10">"EVERYONE WHO GOT RUGGED IS HERE."</p>
      )}

      {/* Bottom nav — 所有頁面統一 */}
      <div className="mt-16 border-t border-border pt-6 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-full"
          onClick={() => navigate("/")}
        >
          {lang === "zh" ? "回分頁列表" : "Back to Menu"}
        </Button>
        <Button
          className="flex-1 rounded-full"
          onClick={() => navigate("/")}
        >
          {lang === "zh" ? "連結錢包" : "Connect Wallet"}
        </Button>
      </div>
      </div>
    </div>
  );
};

export default About;
