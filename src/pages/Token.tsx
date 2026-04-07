import PageLayout from "@/components/PageLayout";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CONTRACT = "0xJIUCAI000000000000000000000000000000000000";

const allocation = [
  { name: "社群獎勵", value: 40, color: "#f59e0b" },
  { name: "流動池", value: 25, color: "#fbbf24" },
  { name: "創辦人鎖倉", value: 20, color: "#d97706" },
  { name: "開發基金", value: 10, color: "#92400e" },
  { name: "行銷", value: 5, color: "#78350f" },
];

const links = [
  { label: "DEX 交易（Uniswap）", url: "#" },
  { label: "區塊鏈瀏覽器", url: "#" },
  { label: "合約審計報告", url: "#" },
];

const Token = () => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(CONTRACT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <PageLayout>
      {/* Contract */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-xs text-muted-foreground mb-2">合約地址</p>
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs text-foreground flex-1 truncate">{CONTRACT}</p>
          <button
            onClick={copy}
            className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            {copied ? "已複製" : "複製"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm font-semibold text-foreground mb-3">代幣資訊</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: "名稱", value: "JIUCAI Token" },
            { label: "符號", value: "JIUCAI" },
            { label: "總發行量", value: "1,000,000,000" },
            { label: "買入稅", value: "5%" },
            { label: "賣出稅", value: "5%" },
            { label: "流動池鎖定", value: "2 年" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pie chart */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm font-semibold text-foreground mb-4">代幣分配</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={allocation} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {allocation.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
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

      {/* Links */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">相關連結</p>
        </div>
        <div className="divide-y divide-border">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
            >
              <span className="text-sm text-foreground">{l.label}</span>
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
