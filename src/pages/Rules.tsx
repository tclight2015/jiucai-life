import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";

const rankTable = [
  { rank: "前 5%", rankEn: "Top 5%", multiplier: "5.0x" },
  { rank: "5–10%", rankEn: "5–10%", multiplier: "4.0x" },
  { rank: "10–20%", rankEn: "10–20%", multiplier: "3.2x" },
  { rank: "20–30%", rankEn: "20–30%", multiplier: "2.6x" },
  { rank: "30–40%", rankEn: "30–40%", multiplier: "2.1x" },
  { rank: "40–50%", rankEn: "40–50%", multiplier: "1.7x" },
  { rank: "50–60%", rankEn: "50–60%", multiplier: "1.4x" },
  { rank: "60–70%", rankEn: "60–70%", multiplier: "1.2x" },
  { rank: "70–80%", rankEn: "70–80%", multiplier: "1.1x" },
  { rank: "80–85%", rankEn: "80–85%", multiplier: "1.05x" },
  { rank: "85–90%", rankEn: "85–90%", multiplier: "1.02x" },
  { rank: "90–100%", rankEn: "90–100%", multiplier: "1.0x" },
];

const timeTable = [
  { days: "不到 7 天", daysEn: "< 7 Days", multiplier: "0.5x" },
  { days: "7–30 天", daysEn: "7–30 Days", multiplier: "1.0x" },
  { days: "30–60 天", daysEn: "30–60 Days", multiplier: "1.5x" },
  { days: "超過 60 天", daysEn: "> 60 Days", multiplier: "2.0x" },
];

const cardList = [
  { nameZh: "權重翻倍卡", nameEn: "Weight Boost Card", effectZh: "提升抽中機率", effectEn: "Increases your winning probability" },
  { nameZh: "獎金翻倍卡", nameEn: "Prize Doubler", effectZh: "抽中後獎金倍增", effectEn: "Multiplies your reward if you win" },
  { nameZh: "幸運卡", nameEn: "Lucky Card", effectZh: "額外增加票數", effectEn: "Grants bonus tickets" },
];

const activityModules = [
  { nameZh: "大戶局", nameEn: "Whale War", descZh: "持倉前 50% 參與", descEn: "Top 50% holders only." },
  { nameZh: "最慘局", nameEn: "The Rekkt Relief", descZh: "虧損前 50% 參與，補貼損失最重的人", descEn: "Bottom 50% in PnL (Losses) — we compensate those hit hardest by the market." },
  { nameZh: "小韭菜局", nameEn: "Shrimp Pool", descZh: "持倉後 50% 參與，照顧小散戶", descEn: "Bottom 50% holders only — protecting the small players." },
  { nameZh: "全民普抽", nameEn: "The Grand Raffle", descZh: "所有持倉者參與", descEn: "Open to all holders." },
  { nameZh: "自訂局", nameEn: "Custom Drops", descZh: "特殊活動專用", descEn: "Exclusive special events." },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-4">
    <div className="px-5 py-4 border-b border-border bg-muted/30">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

const Rules = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <PageLayout>
      {/* 紅字標注 */}
      <p className="text-sm font-bold text-red-400 mb-4">{t("rules.noRegister")}</p>

      <Section title={t("rules.formula")}>
        <p className="text-sm text-muted-foreground mb-3">{t("rules.formulaDesc")}</p>
        <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 text-center">
          <p className="font-mono text-xs font-semibold text-primary">{t("rules.formulaExpr")}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{t("rules.formulaNote")}</p>
      </Section>

      <Section title={t("rules.rankTable")}>
        {isEn && <p className="text-xs text-muted-foreground mb-3">The more you hold, the higher your rank, the bigger your edge.</p>}
        <div className="divide-y divide-border">
          {rankTable.map((r) => (
            <div key={r.rank} className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">{isEn ? r.rankEn : r.rank}</span>
              <span className="text-sm font-bold text-primary">{r.multiplier}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("rules.timeTable")}>
        {isEn && <p className="text-xs text-muted-foreground mb-3">Time is money. Holding starts the clock. Selling out resets it to zero; partial sells do not affect your timer.</p>}
        {!isEn && <p className="text-xs text-muted-foreground mb-3">帳戶有幣就持續累積時間，賣光歸零重算，部分賣出不影響計時。</p>}
        <div className="divide-y divide-border">
          {timeTable.map((r) => (
            <div key={r.days} className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">{isEn ? r.daysEn : r.days}</span>
              <span className="text-sm font-bold text-primary">{r.multiplier}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("rules.cards")}>
        <p className="text-sm text-muted-foreground mb-3">{t("rules.cardsDesc")}</p>
        <div className="space-y-2">
          {cardList.map((c) => (
            <div key={c.nameZh} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <p className="text-sm font-semibold text-foreground">{isEn ? c.nameEn : c.nameZh}</p>
              <p className="text-xs text-primary">{isEn ? c.effectEn : c.effectZh}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("rules.examples")}>
        <div className="space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-bold text-foreground mb-2">{isEn ? "The Diamond Hand" : "老韭菜"}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>{isEn ? "Top 20% Holder" : "持幣前 20%"} — 3.2x</p>
              <p>{isEn ? "45 days held" : "持倉 45 天"} — 1.5x</p>
              <p>{isEn ? "Used 2x Weight Boosts (×2 cards)" : "使用 2 張 ×2 權重卡"} — 4x</p>
            </div>
            <div className="mt-2 rounded bg-primary/10 px-3 py-1.5">
              <p className="font-mono text-xs font-semibold text-primary">1 × 3.2 × 1.5 × 4 = 19.2 {isEn ? "tickets" : "票"}</p>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-bold text-foreground mb-2">{isEn ? "The Paper Hand" : "新韭菜"}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>{isEn ? "Bottom 50% Holder" : "持幣後 50%"} — 1.0x</p>
              <p>{isEn ? "3 days held" : "持倉 3 天"} — 0.5x</p>
              <p>{isEn ? "No cards" : "無卡牌"} — 1x</p>
            </div>
            <div className="mt-2 rounded bg-primary/10 px-3 py-1.5">
              <p className="font-mono text-xs font-semibold text-primary">1 × 1.0 × 0.5 × 1 = 0.5 {isEn ? "tickets" : "票"}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground px-1">
            {isEn
              ? "The Gap: ~38x Difference. Long-term holding, climbing the ranks, and stacking cards are your keys to winning."
              : "差距約 38 倍。長期持倉 + 提升排名 + 累積卡牌，三件事缺一不可。"}
          </p>
        </div>
      </Section>

      <Section title={t("rules.activityModules")}>
        {isEn && <p className="text-xs text-muted-foreground mb-3">We launch various modules to ensure every Degen gets a fair shot:</p>}
        {!isEn && <p className="text-xs text-muted-foreground mb-3">不定期規劃各種抽獎模組，照顧各類族群：</p>}
        <div className="space-y-2">
          {activityModules.map((m) => (
            <div key={m.nameZh} className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div>
                <span className="text-sm font-semibold text-foreground">{isEn ? m.nameEn : m.nameZh}</span>
                <span className="text-sm text-muted-foreground">：{isEn ? m.descEn : m.descZh}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("rules.randomness")}>
        <p className="text-sm text-muted-foreground leading-relaxed">{t("rules.randomnessDesc")}</p>
      </Section>

      <div className="rounded-xl border border-amber-600/40 bg-amber-950/30 p-5 shadow-sm mb-4">
        <h2 className="text-sm font-bold text-amber-400 mb-2">{t("rules.doNotSell")}</h2>
        <p className="text-sm text-amber-400/80 leading-relaxed">{t("rules.doNotSellDesc")}</p>
      </div>
    </PageLayout>
  );
};

export default Rules;
