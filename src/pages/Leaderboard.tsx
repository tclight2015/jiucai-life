import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";

const board = [
  { rank: 1, wallet: "0x1a2b…9f0e", usdt: 85 },
  { rank: 2, wallet: "0x9c3d…4a21", usdt: 60 },
  { rank: 3, wallet: "0x7e4f…bb12", usdt: 45 },
  { rank: 4, wallet: "0x3311…cc00", usdt: 30 },
  { rank: 5, wallet: "0xaabb…1234", usdt: 25 },
  { rank: 6, wallet: "0x5566…ff88", usdt: 20 },
  { rank: 7, wallet: "0xccdd…7700", usdt: 15 },
  { rank: 8, wallet: "0x2233…aa55", usdt: 15 },
  { rank: 9, wallet: "0xeeff…3322", usdt: 10 },
  { rank: 10, wallet: "0x8899…1100", usdt: 10 },
];

const rowBg = (rank: number) => {
  if (rank === 1) return "border-yellow-400/40 bg-yellow-400/5";
  if (rank === 2) return "border-slate-400/40 bg-slate-400/5";
  if (rank === 3) return "border-amber-600/40 bg-amber-600/5";
  return "border-border bg-card";
};

const Leaderboard = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  return (
    <PageLayout>
      {/* ── Title + Desc ── */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-foreground mb-1">{t("leaderboard.title")}</h2>
        {isEn ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            No TA needed. No insider connections. Just pure luck and the iron will to HODL.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">{t("leaderboard.subtitle")}</p>
        )}
      </div>

      {/* ── 排行榜 ── */}
      <div className="space-y-2 mb-5">
        {board.map((row) => (
          <div key={row.rank} className={`rounded-xl border p-4 shadow-sm ${rowBg(row.rank)}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 text-center text-lg font-black">
                {row.rank <= 3 ? ["🥇", "🥈", "🥉"][row.rank - 1] : `#${row.rank}`}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm font-semibold text-foreground truncate">{row.wallet}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-primary">${row.usdt} USDT</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 你的排名 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4 text-center">
        <p className="text-sm font-semibold text-foreground mb-1">{t("leaderboard.yourRank")}</p>
        <p className="text-xs text-muted-foreground">{t("leaderboard.yourRankDesc")}</p>
      </div>

      {/* ── 底部提醒 ── */}
      <div className="rounded-xl border border-amber-600/30 bg-amber-950/20 px-5 py-4 shadow-sm">
        {isEn ? (
          <p className="text-sm font-semibold text-amber-400">Hold to stay eligible. If you dump, you're out of the game.</p>
        ) : (
          <p className="text-sm font-semibold text-amber-400">{t("leaderboard.reminder")}</p>
        )}
      </div>
    </PageLayout>
  );
};

export default Leaderboard;
