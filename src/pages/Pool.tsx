import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { usePoolData } from "@/hooks/usePoolData";

const NEXT_DRAW = new Date("2026-04-10T20:00:00+08:00");

const history = [
  { date: "2026-04-07", winners: 5, usdt: 25, jiucai: 500000 },
  { date: "2026-04-04", winners: 3, usdt: 15, jiucai: 300000 },
  { date: "2026-04-01", winners: 8, usdt: 40, jiucai: 800000 },
  { date: "2026-03-28", winners: 4, usdt: 20, jiucai: 400000 },
  { date: "2026-03-25", winners: 6, usdt: 30, jiucai: 600000 },
];

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setRemaining(target.getTime() - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  const total = Math.max(0, remaining);
  const d = Math.floor(total / 86400000);
  const h = Math.floor((total % 86400000) / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return { d, h, m, s };
}

const Pool = () => {
  const { usdt, jiucai } = usePoolData();
  const { d, h, m, s } = useCountdown(NEXT_DRAW);

  return (
    <PageLayout>
      {/* Pool amounts */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm text-muted-foreground mb-3">當前獎池</p>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="coin-amount">
            <span className="coin-number">{usdt.toLocaleString()}</span>
            <span className="coin-unit ml-1">USDT</span>
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="coin-amount">
            <span className="coin-number">{jiucai.toLocaleString()}</span>
            <span className="coin-unit ml-1">JIUCAI</span>
          </span>
        </div>
      </div>

      {/* Countdown */}
      <div className="rounded-xl border border-primary/40 bg-primary/5 p-5 shadow-sm mb-6">
        <p className="text-sm text-muted-foreground mb-3">下次開獎倒數</p>
        <div className="flex justify-center gap-4">
          {[{ v: d, l: "天" }, { v: h, l: "時" }, { v: m, l: "分" }, { v: s, l: "秒" }].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center">
              <span className="font-mono text-3xl font-bold text-primary w-12 text-center">
                {String(v).padStart(2, "0")}
              </span>
              <span className="text-xs text-muted-foreground mt-1">{l}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">
          2026/04/10 20:00 (UTC+8)
        </p>
      </div>

      {/* History */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">歷史開獎記錄</h2>
        </div>
        <div className="divide-y divide-border">
          {history.map((row) => (
            <div key={row.date} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{row.date}</p>
                <p className="text-xs text-muted-foreground">{row.winners} 位中獎</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">${row.usdt} USDT</p>
                <p className="text-xs text-muted-foreground">{row.jiucai.toLocaleString()} JIUCAI</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Pool;
