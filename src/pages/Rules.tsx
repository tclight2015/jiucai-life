import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";

const rankTable = [
  { rank: "第 1 名", rankEn: "#1", multiplier: "10x" },
  { rank: "第 2 名", rankEn: "#2", multiplier: "9x" },
  { rank: "第 3 名", rankEn: "#3", multiplier: "8x" },
  { rank: "第 4–5 名", rankEn: "#4–5", multiplier: "7x" },
  { rank: "第 6–10 名", rankEn: "#6–10", multiplier: "6x" },
  { rank: "第 11–20 名", rankEn: "#11–20", multiplier: "5x" },
  { rank: "第 21–50 名", rankEn: "#21–50", multiplier: "4x" },
  { rank: "第 51–100 名", rankEn: "#51–100", multiplier: "3x" },
  { rank: "第 101–150 名", rankEn: "#101–150", multiplier: "2.5x" },
  { rank: "第 151–200 名", rankEn: "#151–200", multiplier: "2x" },
  { rank: "第 201–300 名", rankEn: "#201–300", multiplier: "1.5x" },
  { rank: "其餘持幣者", rankEn: "Others", multiplier: "1x" },
];

const timeTable = [
  { days: "1–7 天", daysEn: "1–7 days", multiplier: "1x" },
  { days: "8–30 天", daysEn: "8–30 days", multiplier: "1.2x" },
  { days: "31–90 天", daysEn: "31–90 days", multiplier: "1.5x" },
  { days: "91–180 天", daysEn: "91–180 days", multiplier: "2x" },
  { days: "181+ 天", daysEn: "181+ days", multiplier: "3x" },
];

const examples = [
  { label: "A", rank: "第 3 名（8x）", rankEn: "#3 (8x)", time: "120 天（2x）", timeEn: "120 days (2x)", card: "×2 卡已開啟（2x）", cardEn: "×2 card active (2x)", total: "100 × 8 × 2 × 2 = 3200" },
  { label: "B", rank: "第 50 名（4x）", rankEn: "#50 (4x)", time: "30 天（1.2x）", timeEn: "30 days (1.2x)", card: "無卡牌（1x）", cardEn: "No card (1x)", total: "100 × 4 × 1.2 × 1 = 480" },
  { label: "C", rank: "第 300 名（1x）", rankEn: "#300 (1x)", time: "3 天（1x）", timeEn: "3 days (1x)", card: "無卡牌（1x）", cardEn: "No card (1x)", total: "100 × 1 × 1 × 1 = 100" },
];

const cardList = [
  { nameZh: "權重翻倍卡", nameEn: "Weight ×2 Card", effectZh: "票數 ×2", effectEn: "Tickets ×2" },
  { nameZh: "獎金翻倍卡", nameEn: "Prize ×2 Card", effectZh: "中獎金額 ×2", effectEn: "Prize amount ×2" },
  { nameZh: "幸運卡", nameEn: "Lucky Card", effectZh: "基礎票數 +50", effectEn: "Base tickets +50" },
  { nameZh: "連續中獎卡", nameEn: "Streak Card", effectZh: "連中不扣資格", effectEn: "No eligibility deduct on consecutive wins" },
];

const modulesData = [
  { nameZh: "抽獎名單", nameEn: "Lottery", descZh: "每週定期抽獎，依票數加權隨機抽取中獎者", descEn: "Weekly weighted random draws" },
  { nameZh: "回血牆", nameEn: "Recovery Wall", descZh: "中獎者分享截圖，見證真實回血故事", descEn: "Winners share screenshots of real recoveries" },
  { nameZh: "吐槽區", nameEn: "Vent Board", descZh: "自由發言，說出被割的心聲", descEn: "Free speech — say what you need to say" },
  { nameZh: "索幣區", nameEn: "Claim Zone", descZh: "上傳截圖申請 JIUCAI，審核後直接打幣", descEn: "Upload proof to claim JIUCAI tokens" },
  { nameZh: "排行榜", nameEn: "Leaderboard", descZh: "累計中獎金額排名，狗屎運比拚", descEn: "Ranked by total winnings — pure luck" },
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
      <Section title={t("rules.formula")}>
        <p className="text-sm text-muted-foreground mb-3">{t("rules.formulaDesc")}</p>
        <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 text-center">
          <p className="font-mono text-sm font-semibold text-primary">{t("rules.formulaExpr")}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{t("rules.formulaNote")}</p>
      </Section>

      <Section title={t("rules.rankTable")}>
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
        <div className="grid grid-cols-2 gap-3">
          {cardList.map((c) => (
            <div key={c.nameZh} className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold text-foreground">{isEn ? c.nameEn : c.nameZh}</p>
              <p className="text-xs text-primary mt-0.5">{isEn ? c.effectEn : c.effectZh}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("rules.examples")}>
        <div className="space-y-4">
          {examples.map((ex) => (
            <div key={ex.label} className="rounded-lg border border-border p-4">
              <p className="text-sm font-bold text-foreground mb-2">{ex.label}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>{isEn ? ex.rankEn : ex.rank}</p>
                <p>{isEn ? ex.timeEn : ex.time}</p>
                <p>{isEn ? ex.cardEn : ex.card}</p>
              </div>
              <div className="mt-2 rounded bg-primary/10 px-3 py-1.5">
                <p className="font-mono text-xs font-semibold text-primary">{ex.total} {isEn ? "tickets" : "票"}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("rules.modules")}>
        <div className="space-y-3">
          {modulesData.map((m) => (
            <div key={m.nameZh} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div>
                <span className="text-sm font-semibold text-foreground">{isEn ? m.nameEn : m.nameZh}</span>
                <span className="text-sm text-muted-foreground">：{isEn ? m.descEn : m.descZh}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
};

export default Rules;
