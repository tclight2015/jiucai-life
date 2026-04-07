import PageLayout from "@/components/PageLayout";

const rankTable = [
  { rank: "第 1 名", multiplier: "10x" },
  { rank: "第 2 名", multiplier: "9x" },
  { rank: "第 3 名", multiplier: "8x" },
  { rank: "第 4–5 名", multiplier: "7x" },
  { rank: "第 6–10 名", multiplier: "6x" },
  { rank: "第 11–20 名", multiplier: "5x" },
  { rank: "第 21–50 名", multiplier: "4x" },
  { rank: "第 51–100 名", multiplier: "3x" },
  { rank: "第 101–150 名", multiplier: "2.5x" },
  { rank: "第 151–200 名", multiplier: "2x" },
  { rank: "第 201–300 名", multiplier: "1.5x" },
  { rank: "其餘持幣者", multiplier: "1x" },
];

const timeTable = [
  { days: "1–7 天", multiplier: "1x" },
  { days: "8–30 天", multiplier: "1.2x" },
  { days: "31–90 天", multiplier: "1.5x" },
  { days: "91–180 天", multiplier: "2x" },
  { days: "181+ 天", multiplier: "3x" },
];

const examples = [
  {
    label: "A（大戶老手）",
    rank: "第 3 名（8x）",
    time: "120 天（2x）",
    card: "×2 卡已開啟（2x）",
    base: 100,
    total: "100 × 8 × 2 × 2 = 3200 票",
  },
  {
    label: "B（中等持幣）",
    rank: "第 50 名（4x）",
    time: "30 天（1.2x）",
    card: "無卡牌（1x）",
    base: 100,
    total: "100 × 4 × 1.2 × 1 = 480 票",
  },
  {
    label: "C（新進小戶）",
    rank: "第 300 名（1x）",
    time: "3 天（1x）",
    card: "無卡牌（1x）",
    base: 100,
    total: "100 × 1 × 1 × 1 = 100 票",
  },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-4">
    <div className="px-5 py-4 border-b border-border bg-muted/30">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

const Rules = () => (
  <PageLayout>
    {/* Formula */}
    <Section title="權重公式">
      <p className="text-sm text-muted-foreground mb-3">每位持幣者的抽獎票數由以下公式決定：</p>
      <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 text-center">
        <p className="font-mono text-sm font-semibold text-primary">
          票數 = 基礎票數 × 排名加權 × 時間加權 × 卡牌加權
        </p>
      </div>
      <p className="text-xs text-muted-foreground mt-3">基礎票數固定為 100 票。最終票數愈多，抽中機率愈高。</p>
    </Section>

    {/* Rank table */}
    <Section title="持幣排名加權（共 12 級）">
      <div className="divide-y divide-border">
        {rankTable.map((r) => (
          <div key={r.rank} className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">{r.rank}</span>
            <span className="text-sm font-bold text-primary">{r.multiplier}</span>
          </div>
        ))}
      </div>
    </Section>

    {/* Time table */}
    <Section title="持倉時間加權">
      <div className="divide-y divide-border">
        {timeTable.map((r) => (
          <div key={r.days} className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">{r.days}</span>
            <span className="text-sm font-bold text-primary">{r.multiplier}</span>
          </div>
        ))}
      </div>
    </Section>

    {/* Cards */}
    <Section title="卡牌加權">
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>持有特殊卡牌可進一步放大票數，開啟後下次抽獎自動生效。</p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {[
            { name: "權重翻倍卡", effect: "票數 ×2" },
            { name: "獎金翻倍卡", effect: "中獎金額 ×2" },
            { name: "幸運卡", effect: "基礎票數 +50" },
            { name: "連續中獎卡", effect: "連中不扣資格" },
          ].map((c) => (
            <div key={c.name} className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold text-foreground">{c.name}</p>
              <p className="text-xs text-primary mt-0.5">{c.effect}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>

    {/* Examples */}
    <Section title="計算範例">
      <div className="space-y-4">
        {examples.map((ex) => (
          <div key={ex.label} className="rounded-lg border border-border p-4">
            <p className="text-sm font-bold text-foreground mb-2">{ex.label}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>排名：{ex.rank}</p>
              <p>持倉：{ex.time}</p>
              <p>卡牌：{ex.card}</p>
            </div>
            <div className="mt-2 rounded bg-primary/10 px-3 py-1.5">
              <p className="font-mono text-xs font-semibold text-primary">{ex.total}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>

    {/* Modules */}
    <Section title="五大功能模組">
      <div className="space-y-3 text-sm text-muted-foreground">
        {[
          { name: "抽獎名單", desc: "每週定期抽獎，依票數加權隨機抽取中獎者" },
          { name: "回血牆", desc: "中獎者分享截圖，見證真實回血故事" },
          { name: "吐槽區", desc: "自由發言，說出被割的心聲" },
          { name: "索幣區", desc: "上傳截圖申請 JIUCAI，審核後直接打幣" },
          { name: "排行榜", desc: "累計中獎金額排名，狗屎運比拚" },
        ].map((m) => (
          <div key={m.name} className="flex gap-3">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary mt-2" />
            <div>
              <span className="font-semibold text-foreground">{m.name}</span>
              <span className="text-muted-foreground">：{m.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  </PageLayout>
);

export default Rules;
