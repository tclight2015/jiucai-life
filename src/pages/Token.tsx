import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CONTRACT = "0xJIUCAI000000000000000000000000000000000000";

const allocationZh = [
  { name: "索幣區（社群）", value: 40, color: "#f59e0b" },
  { name: "流動池", value: 20, color: "#fbbf24" },
  { name: "創辦人", value: 25, color: "#d97706" },
  { name: "生態基金", value: 10, color: "#92400e" },
  { name: "樂透獎池", value: 5, color: "#78350f" },
];
const allocationEn = [
  { name: "Claim Area (Community Airdrop)", value: 40, color: "#f59e0b" },
  { name: "Liquidity Pool", value: 20, color: "#fbbf24" },
  { name: "Founder", value: 25, color: "#d97706" },
  { name: "Ecosystem Fund", value: 10, color: "#92400e" },
  { name: "Raffle Prize Pool", value: 5, color: "#78350f" },
];

const links = [
  { labelZh: "Uniswap", labelEn: "Uniswap", url: "#" },
  { labelZh: "DEX Screener", labelEn: "DEX Screener", url: "#" },
  { labelZh: "Basescan 合約", labelEn: "Basescan Contract", url: "#" },
];

const BASESCAN_URL = "#";
const TOKENSNIFFER_URL = "#";
const UNCX_LOCK_URL = "#";

const Token = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(CONTRACT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const allocation = isEn ? allocationEn : allocationZh;

  const tokenFields = isEn ? [
    { label: t("token.fields.name"), value: "The Degen's Revenge Diary" },
    { label: t("token.fields.symbol"), value: "$JIUCAI" },
    { label: t("token.fields.chain"), value: "Base" },
    { label: t("token.fields.supply"), value: "10,000,000,000" },
    { label: t("token.fields.buyTax"), value: "3%" },
    { label: t("token.fields.sellTax"), value: "3%" },
  ] : [
    { label: t("token.fields.name"), value: "韭菜翻身日記" },
    { label: t("token.fields.symbol"), value: "$JIUCAI" },
    { label: t("token.fields.chain"), value: "Base" },
    { label: t("token.fields.supply"), value: "100億顆" },
    { label: t("token.fields.buyTax"), value: "3%" },
    { label: t("token.fields.sellTax"), value: "3%" },
  ];

  return (
    <PageLayout>
      {/* ── 合約地址 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-xs text-muted-foreground mb-2">{t("token.contract")}</p>
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs text-foreground flex-1 truncate">{CONTRACT}</p>
          <button onClick={copy} className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
            {copied ? t("common.copied") : t("common.copy")}
          </button>
        </div>
      </div>

      {/* ── 基本資訊 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm font-semibold text-foreground mb-3">{t("token.info")}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {tokenFields.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 交易稅 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm font-semibold text-foreground mb-2">{t("token.taxTitle")}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{t("token.taxDesc")}</p>
      </div>

      {/* ── 發行分配 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm font-semibold text-foreground mb-4">{t("token.allocation")}</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={allocation} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {allocation.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`]}
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {allocation.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: a.color }} />
              <span className="text-xs text-foreground">{a.name}</span>
              <span className="text-xs text-primary font-semibold ml-auto">{a.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 鎖倉規則 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm font-semibold text-foreground mb-3">{t("token.vesting")}</p>
        {isEn ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Airdrop Claims: Locked for 20 days. Eligible for all raffles during the lock-up period.</p>
            <p>• Founder: Unlocked. Reserved for supporting the prize pool, claim airdrops, and operational costs.</p>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• 索幣領取：鎖倉 20 天，期間可正常參與抽獎</p>
            <p>• 創辦人：不鎖倉，用於支援獎池及索幣等營運支出</p>
          </div>
        )}
      </div>

      {/* ── 合約安全 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm font-semibold text-foreground mb-4">{t("token.security.title")}</p>

        <div className="mb-4 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-foreground">{t("token.security.basescan")}</p>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              ✓ {t("token.security.verified")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{t("token.security.basescanDesc")}</p>
          <a href={BASESCAN_URL} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            {t("token.security.viewReport")}
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-1">{t("token.security.tokensniffer")}</p>
          <p className="text-xs text-muted-foreground mb-2">{t("token.security.tokensnifferDesc")}</p>
          <a href={TOKENSNIFFER_URL} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            {t("token.security.viewReport")}
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>

      {/* ── 流動池鎖定 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">{t("token.lpLockSection.title")}</p>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            🔒 {t("token.lpLockSection.provider")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{t("token.lpLockSection.duration")}</p>
        <p className="text-xs text-muted-foreground mb-3">{t("token.lpLockSection.desc")}</p>
        <a href={UNCX_LOCK_URL} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          {t("token.lpLockSection.viewLock")}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>

      {/* ── 相關連結 ── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">{t("token.links")}</p>
        </div>
        <div className="divide-y divide-border">
          {links.map((l) => (
            <a key={l.labelZh} href={l.url} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
              <span className="text-sm text-foreground">{isEn ? l.labelEn : l.labelZh}</span>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          ))}
        </div>
      </div>

      {/* ── 特別聲明 ── */}
      <div className="rounded-xl border border-red-600/30 bg-red-950/20 p-5 shadow-sm">
        <h2 className="text-sm font-bold text-red-400 mb-2">{t("token.declaration")}</h2>
        <p className="text-sm text-red-400/80 whitespace-pre-line leading-relaxed">{t("token.declarationDesc")}</p>
      </div>
    </PageLayout>
  );
};

export default Token;
