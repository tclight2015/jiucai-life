import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";

const About = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">{t("about.hero")}</h2>
        <p className="text-base font-semibold text-foreground/80">{t("about.tagline")}</p>
        <p className="text-sm font-bold text-red-400 mt-2">{t("about.noRegister")}</p>
      </div>

      {/* ── 主文 ── */}
      {isEn ? (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Stop second-guessing — this isn't another scam.</p>
          <p>The prize pool is fueled by transaction taxes. We're redirecting the capital flow straight back into your wallet.</p>
          <p>Trust the code. This is your ultimate shot at Wealth Redistribution.</p>
          <p>The real world is rigged; here, the smart contract is fair.</p>
          <p>The floor pumps, the rewards stack, and as long as you're holding, you're in the game.</p>
          <p>Don't just watch others moon — be the one they envy.</p>
          <p>The more Degens join the fray, the faster the pot overflows.</p>
          <p>Your mission is simple: Shill, Onboard, and Chill. Then, simply wait for that Telegram ping.</p>
          <p>The selection alert. The transfer confirmation. Check your balance. Feel the rush.</p>
          <p>The market rugged you. We're healing you. Hold to flip your life. Real USDT, sent straight to you. This isn't a roadmap pipe dream; it's an on-chain reality.</p>
          <p>Join "The Degen's Revenge Diary" — it's time to recover your losses.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>不要懷疑，這裡沒有欺詐。</p>
          <p>獎池來自交易稅，讓錢再次回流到你的口袋。</p>
          <p>相信這裡，這是一次財富重分配的機會。現實很無情，這裡很公平。</p>
          <p>幣價會漲、獎金會有、只要持幣就有機會。不用羨慕別人的好運，自己就會是見證。</p>
          <p>越多人加入、參與，獎池累積越快越滿。你唯一要做的就是動起來，推薦更多人加入，接著就是等待。</p>
          <p>等待 Telegram 的入選通知。等待 Telegram 的打幣通知。然後確認帳戶入帳。</p>
          <p>幣圈割你，我們補你。持幣就能翻身，真的 U 打給你。這不只是承諾，更有鏈上紀錄。</p>
          <p>來「韭菜翻身日記」，讓你回血。</p>
        </div>
      )}

      {/* ── 承諾 ── */}
      <div className="rounded-xl border border-primary/40 bg-primary/5 p-5 shadow-sm mb-4">
        <h3 className="text-sm font-bold text-primary mb-4">{t("about.pledgeTitle")}</h3>
        {isEn ? (
          <div className="space-y-4">
            {[
              { icon: "🚫", title: "Zero CEX Ambitions", desc: "Centralized exchanges are slaughterhouses. We refuse to feed you to the wolves." },
              { icon: "♾️", title: "Non-Stop Giveaways", desc: "Draining the prize pool back to the community isn't a goal — it's our sacred vow." },
              { icon: "🔍", title: "On-Chain Absolute Transparency", desc: "Every payout comes with a TX Hash. Don't trust, verify." },
              { icon: "💰", title: "Real Yield, No Ponzi", desc: "The pool scales with volume, not thin air. Every reward has a documented source and a verified destination." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { icon: "🚫", title: "永不上 CEX（中心化交易所）", desc: "CEX 是割你的地方，我們不會把你送進去。" },
              { icon: "♾️", title: "持續送錢", desc: "定期清空獎金池，是韭菜翻身日記的承諾。" },
              { icon: "🔍", title: "鏈上透明", desc: "所有打款都有交易 hash，任何人可自行驗證。" },
              { icon: "💰", title: "獎金池來自交易稅", desc: "不是龐氏，不是空氣，每一筆獎金都有真實來源與去處。" },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 底部 quote ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm text-center">
        <p className="text-sm font-bold text-foreground">
          {isEn ? '"EVERYONE WHO GOT RUGGED IS HERE."' : t("about.quote")}
        </p>
        <p className="text-xs text-primary font-semibold mt-2">{t("about.founder")}</p>
      </div>
    </PageLayout>
  );
};

export default About;
