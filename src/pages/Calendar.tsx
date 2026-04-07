import PageLayout from "@/components/PageLayout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const upcoming = [
  { date: "2026-04-10", time: "20:00", usdt: 10, jiucai: 200000, qualify: "持幣 500,000 JIUCAI 以上" },
  { date: "2026-04-17", time: "20:00", usdt: 10, jiucai: 200000, qualify: "持幣 500,000 JIUCAI 以上" },
  { date: "2026-04-24", time: "20:00", usdt: 10, jiucai: 200000, qualify: "持幣 500,000 JIUCAI 以上" },
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

const Calendar = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");

  const results = walletHistory[searched.slice(0, 6).toLowerCase()] ?? null;

  return (
    <PageLayout>
      {/* Upcoming */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">即將開獎</h2>
        </div>
        <div className="divide-y divide-border">
          {upcoming.map((row) => (
            <div key={row.date} className="px-5 py-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">{row.date} {row.time} (UTC+8)</p>
                <span className="text-sm font-bold text-primary">${row.usdt}</span>
              </div>
              <p className="text-xs text-muted-foreground">{row.qualify}</p>
              <p className="text-xs text-muted-foreground">{row.jiucai.toLocaleString()} JIUCAI</p>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">歷史開獎</h2>
        </div>
        <div className="divide-y divide-border">
          {historyDraws.map((row) => (
            <div key={row.date} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{row.date}</p>
                <p className="text-xs text-muted-foreground">中獎 {row.winners} 人</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">${row.totalUsdt} USDT</p>
                <p className="text-xs text-muted-foreground">{row.totalJiucai.toLocaleString()} JIUCAI</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet query */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3">查詢錢包中獎記錄</h2>
        <div className="flex gap-2">
          <Input
            placeholder="輸入錢包地址 0x..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-mono text-sm"
          />
          <Button onClick={() => setSearched(query)} size="sm">查詢</Button>
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
              <p className="text-sm text-muted-foreground">此地址無中獎記錄</p>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Calendar;
