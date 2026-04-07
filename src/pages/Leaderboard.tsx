import PageLayout from "@/components/PageLayout";

const board = [
  { rank: 1, wallet: "0x1a2b…9f0e", usdt: 85, jiucai: 1700000, wins: 17 },
  { rank: 2, wallet: "0x9c3d…4a21", usdt: 60, jiucai: 1200000, wins: 12 },
  { rank: 3, wallet: "0x7e4f…bb12", usdt: 45, jiucai: 900000, wins: 9 },
  { rank: 4, wallet: "0x3311…cc00", usdt: 30, jiucai: 600000, wins: 6 },
  { rank: 5, wallet: "0xaabb…1234", usdt: 25, jiucai: 500000, wins: 5 },
  { rank: 6, wallet: "0x5566…ff88", usdt: 20, jiucai: 400000, wins: 4 },
  { rank: 7, wallet: "0xccdd…7700", usdt: 15, jiucai: 300000, wins: 3 },
  { rank: 8, wallet: "0x2233…aa55", usdt: 15, jiucai: 300000, wins: 3 },
  { rank: 9, wallet: "0xeeff…3322", usdt: 10, jiucai: 200000, wins: 2 },
  { rank: 10, wallet: "0x8899…1100", usdt: 10, jiucai: 200000, wins: 2 },
];

const medalColor = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-slate-400";
  if (rank === 3) return "text-amber-600";
  return "text-muted-foreground";
};

const rowBg = (rank: number) => {
  if (rank === 1) return "border-yellow-400/40 bg-yellow-400/5";
  if (rank === 2) return "border-slate-400/40 bg-slate-400/5";
  if (rank === 3) return "border-amber-600/40 bg-amber-600/5";
  return "border-border bg-card";
};

const Leaderboard = () => (
  <PageLayout>
    <p className="text-center text-xs text-muted-foreground mb-4">累計中獎金額排行，狗屎運比拚</p>

    <div className="space-y-2">
      {board.map((row) => (
        <div key={row.rank} className={`rounded-xl border p-4 shadow-sm ${rowBg(row.rank)}`}>
          <div className="flex items-center gap-3">
            {/* Rank */}
            <div className={`w-8 text-center text-lg font-black ${medalColor(row.rank)}`}>
              {row.rank <= 3 ? ["🥇", "🥈", "🥉"][row.rank - 1] : `#${row.rank}`}
            </div>
            {/* Wallet */}
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm font-semibold text-foreground truncate">{row.wallet}</p>
              <p className="text-xs text-muted-foreground">中獎 {row.wins} 次</p>
            </div>
            {/* Prize */}
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-primary">${row.usdt} USDT</p>
              <p className="text-xs text-muted-foreground">{row.jiucai.toLocaleString()} JIUCAI</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </PageLayout>
);

export default Leaderboard;
