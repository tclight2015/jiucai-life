import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const upcoming = [
  { date: "2026-04-10", time: "20:00", usdt: 10, jiucai: 200000, qualify: "持幣 500,000 JIUCAI 以上", qualifyEn: "Hold ≥ 500,000 JIUCAI" },
  { date: "2026-04-17", time: "20:00", usdt: 10, jiucai: 200000, qualify: "持幣 500,000 JIUCAI 以上", qualifyEn: "Hold ≥ 500,000 JIUCAI" },
  { date: "2026-04-24", time: "20:00", usdt: 10, jiucai: 200000, qualify: "持幣 500,000 JIUCAI 以上", qualifyEn: "Hold ≥ 500,000 JIUCAI" },
];

const historyDraws = [
  { date: "2026-04-07", winners: 5, totalUsdt: 25, totalJiucai: 500000 },
  { date: "2026-04-04", winners: 3, totalUsdt: 15, totalJiucai: 300000 },
  { date: "2026-04-01", winners: 8, totalUsdt: 40, totalJiucai: 800000 },
  { date: "2026-03-28", winners: 4, totalUsdt: 20, totalJiucai: 400000 },
];

const walletHistory: Record<string, { date: string; prize: string }[]> = {
  "0x1a2b": [
    { date: "2026-04-07", prize: "$5 USDT + 100,000 JIUCAI" },
    { date: "2026-03-28", prize: "$5 USDT + 100,000 JIUCAI" },
  ],
  "0xdead": [
    { date: "2026-04-01", prize: "$5 USDT + 100,000 JIUCAI" },
  ],
};

const flowStepsZh = [
  { time: "前一天晚上", desc: "預告推播，附近三日幣價漲跌幅" },
  { time: "開獎當天 12:00（UTC+8）", desc: "快照 + 推播通知符合資格的人" },
  { time: "18:00 前（UTC+8）", desc: "啟用你的卡牌截止" },
  { time: "20:00（UTC+8）", desc: "開獎" },
  { time: "開獎後", desc: "中獎者收到個人通知" },
];

const flowStepsEn = [
  { time: "The Night Before", desc: "Warm-up notification + Analysis of the past 3 days' price action." },
  { time: "Draw Day @ 12:00 PM (CST, UTC+8)", desc: "Eligibility Snapshot. Qualified holders will receive a notification." },
  { time: "By 6:00 PM (CST, UTC+8)", desc: "Deadline to activate your Boost Cards." },
  { time: "8:00 PM (CST, UTC+8)", desc: "The Big Reveal. The draw goes live." },
  { time: "Post-Draw", desc: "Winners receive personalized notifications immediately." },
];

const Calendar = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const results = walletHistory[searched.slice(0, 6).toLowerCase()] ?? null;

  const flowSteps = isEn ? flowStepsEn : flowStepsZh;

  return (
    <PageLayout>
      {/* ── Intro ── */}
      <div className="mb-4">
        {isEn ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            Plan ahead and stack your cards. You have until 12:00 PM (Noon) on draw days to boost your position.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">{t("calendar.intro")}</p>
        )}
      </div>

      {/* ── 本期開獎資訊 ── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{t("calendar.upcoming")}</h2>
        </div>
        <div className="divide-y divide-border">
          {upcoming.map((row) => (
            <div key={row.date} className="px-5 py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">{row.date} {row.time} (UTC+8)</p>
                <span className="text-sm font-bold text-primary">${row.usdt}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t("calendar.qualify")}：{isEn ? row.qualifyEn : row.qualify}</p>
              <p className="text-xs text-muted-foreground">{row.jiucai.toLocaleString()} JIUCAI</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 開獎流程說明 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t("calendar.flowTitle")}</h2>
        <div className="space-y-3">
          {flowSteps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{i + 1}</span>
              <div>
                <p className="text-xs font-semibold text-primary mb-0.5">{step.time}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 加碼提醒 ── */}
      <div className="rounded-xl border border-amber-600/30 bg-amber-950/20 p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-amber-400 mb-2">{t("calendar.boostTitle")}</h2>
        {isEn ? (
          <div className="space-y-1 text-sm text-amber-400/80">
            <p>• The more you hold, the higher your rank, the bigger your Weighting Multiplier.</p>
            <p>• Any buys made before the 12:00 PM Snapshot on draw days are valid.</p>
            <p>• DO NOT SELL. Selling your bags results in immediate disqualification.</p>
          </div>
        ) : (
          <p className="text-sm text-amber-400/80 leading-relaxed">{t("calendar.boostDesc")}</p>
        )}
      </div>

      {/* ── 歷史開獎紀錄 ── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{t("calendar.history")}</h2>
        </div>
        <div className="divide-y divide-border">
          {historyDraws.map((row) => (
            <div key={row.date} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{row.date}</p>
                <p className="text-xs text-muted-foreground">{t("calendar.winnerCount", { count: row.winners })}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">${row.totalUsdt} USDT</p>
                <p className="text-xs text-muted-foreground">{row.totalJiucai.toLocaleString()} JIUCAI</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 錢包查詢 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t("calendar.walletQuery")}</h2>
        {isEn && <p className="text-xs text-muted-foreground mb-3">Enter any wallet address to view its full winning history and payout status.</p>}
        <div className="flex gap-2">
          <Input
            placeholder={t("calendar.walletPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-mono text-sm"
          />
          <Button onClick={() => setSearched(query)} size="sm">{t("common.query")}</Button>
        </div>
        {searched && (
          <div className="mt-4">
            {results ? (
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <p className="text-sm text-foreground">{r.date}</p>
                    <p className="text-sm font-semibold text-primary">{r.prize}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("calendar.noRecord")}</p>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Calendar;
