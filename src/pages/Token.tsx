import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CONTRACT = "0xJIUCAI000000000000000000000000000000000000";

const allocation = [
  { nameZh: "社群獎勵", nameEn: "Community Rewards", value: 40, color: "#f59e0b" },
  { nameZh: "流動池", nameEn: "Liquidity Pool", value: 25, color: "#fbbf24" },
  { nameZh: "創辦人鎖倉", nameEn: "Founder Lock", value: 20, color: "#d97706" },
  { nameZh: "開發基金", nameEn: "Dev Fund", value: 10, color: "#92400e" },
  { nameZh: "行銷", nameEn: "Marketing", value: 5, color: "#78350f" },
];

const links = [
  { labelZh: "DEX 交易（Uniswap）", labelEn: "DEX Trade (Uniswap)", url: "#" },
  { labelZh: "區塊鏈瀏覽器（Basescan）", labelEn: "Block Explorer (Basescan)", url: "#" },
];

// 合約安全連結（填入實際網址後生效）
const BASESCAN_URL = "#"; // TODO: 填入 https://basescan.org/address/0x…#code
const TOKENSNIFFER_URL = "#"; // TODO: 填入 https://tokensniffer.com/token/…
const UNCX_LOCK_URL = "#"; // TODO: 填入 Uncx 鎖倉記錄頁面

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

  const tokenFields = [
    { label: t("token.fields.name"), value: "JIUCAI Token" },
    { label: t("token.fields.symbol"), value: "JIUCAI" },
    { label: t("token.fields.supply"), value: "1,000,000,000" },
    { label: t("token.fields.buyTax"), value: "5%" },
    { label: t("token.fields.sellTax"), value: "5%" },
    { label: t("token.fields.lpLock"), value: t("token.lpLockSection.duration") },
  ];

  return (
    <PageLayout>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-xs text-muted-foreground mb-2">{t("token.contract")}</p>
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs text-foreground flex-1 truncate">{CONTRACT}</p>
          <button
            onClick={copy}
            className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            {copied ? t("common.copied") : t("common.copy")}
          </button>
        </div>
      </div>

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
            <div key={a.nameZh} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: a.color }} />
              <span className="text-xs text-foreground">{isEn ? a.nameEn : a.nameZh}</span>
              <span className="text-xs text-primary font-semibold ml-auto">{a.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 合約安全 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm font-semibold text-foreground mb-4">{t("token.security.title")}</p>

        {/* Basescan */}
        <div className="mb-4 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-foreground">{t("token.security.basescan")}</p>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              ✓ {t("token.security.verified")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{t("token.security.basescanDesc")}</p>
          <a
            href={BASESCAN_URL}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            {t("token.security.viewReport")}
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Tokensniffer */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-foreground">{t("token.security.tokensniffer")}</p>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{t("token.security.tokensnifferDesc")}</p>
          <a
            href={TOKENSNIFFER_URL}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            {t("token.security.viewReport")}
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── 流動池鎖定 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">{t("token.lpLockSection.title")}</p>
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            🔒 {t("token.lpLockSection.duration")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-1">
          {t("token.lpLockSection.provider")}
        </p>
        <p className="text-xs text-muted-foreground mb-3">{t("token.lpLockSection.desc")}</p>
        <a
          href={UNCX_LOCK_URL}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          {t("token.lpLockSection.viewLock")}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* ── 相關連結 ── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">{t("token.links")}</p>
        </div>
        <div className="divide-y divide-border">
          {links.map((l) => (
            <a key={l.labelZh} href={l.url} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
              <span className="text-sm text-foreground">{isEn ? l.labelEn : l.labelZh}</span>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Token;
