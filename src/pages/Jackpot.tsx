import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";

const LAUNCH_ESTIMATE = "2026 年第三季";
const POWERBALL_URL = "https://www.powerball.com/winning-numbers";

const PROB_TABLE = [
  { week: 1,  tickets: 1,  pct: "0.17%" },
  { week: 4,  tickets: 4,  pct: "0.69%" },
  { week: 13, tickets: 13, pct: "2.24%" },
  { week: 26, tickets: 26, pct: "4.48%" },
  { week: 52, tickets: 52, pct: "8.97%" },
];

export default function Jackpot() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader pageTitle="韭菜樂透" />

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">

        {/* Hero */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🎰</div>
          <h1 className="text-3xl font-black">韭菜樂透</h1>
        </div>

        {/* Coming soon banner */}
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 text-center space-y-2">
          <div className="font-bold text-lg text-primary">
            ⏳ 預計上線：{LAUNCH_ESTIMATE}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            韭菜樂透將於平台穩定運行後正式啟動。
            屆時每位持幣會員將自動獲得號碼券，每週累積一張，
            持幣越久號碼越多，中獎機率越高。
          </p>
          <p className="text-muted-foreground text-xs">
            獎金視屆時獎池狀況決定，保留調整機制。
          </p>
        </div>

        {/* How it works */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">🎯 怎麼玩</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            {[
              "持有 $JIUCAI 即自動加入，無需另外報名。每週系統自動發一組 5 個號碼（1–69）給每位持幣會員。",
              "每週六（美東時間）Powerball 官方開獎後，系統自動抓取本期 5 顆主球號碼，與所有會員累積的號碼券逐一比對。",
              "對中 3 顆以上即獲獎，Telegram 自動通知並打幣到錢包。",
              "每組號碼對完可保留、累積越多、重複週週對。每年 12 月 31 日統一清空，次年重新開始。持幣越久，手上號碼張數越多。",
            ].map((text, i) => (
              <div key={i} className="flex gap-3">
                <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Probability */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">
            📈 中獎機率隨週數增加
          </h2>
          <div className="rounded-xl overflow-hidden border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted text-muted-foreground text-xs uppercase">
                  <th className="px-4 py-3 text-left">持幣週數</th>
                  <th className="px-4 py-3 text-center">累積號碼張數</th>
                  <th className="px-4 py-3 text-right">每週中獎機率</th>
                </tr>
              </thead>
              <tbody>
                {PROB_TABLE.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-border ${
                      i === PROB_TABLE.length - 1
                        ? "bg-primary/10 font-bold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <td className="px-4 py-3">第 {row.week} 週</td>
                    <td className="px-4 py-3 text-center">{row.tickets} 張</td>
                    <td className="px-4 py-3 text-right">{row.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground text-xs text-center">
            持幣滿一整年，每週中獎機率接近 9%。越早加入優勢越大。
          </p>
        </section>

        {/* Sample ticket */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-border pb-2">🃏 號碼樣式預覽</h2>
          <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>🎰 韭菜樂透 — 第 18 週</span>
              <span>累積 18 張</span>
            </div>
            <div className="space-y-3">
              {[
                [7, 14, 23, 38, 45],
                [3, 19, 31, 44, 62],
                [11, 22, 33, 44, 55],
              ].map((nums, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs w-5">#{i + 1}</span>
                  <div className="flex gap-2">
                    {nums.map((n) => (
                      <span
                        key={n}
                        className="w-8 h-8 rounded-full border-2 border-primary/50 bg-primary/10
                                   text-primary text-xs font-bold flex items-center justify-center"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-muted-foreground text-xs pl-8">… 還有 15 組</p>
            </div>
            <p className="text-muted-foreground text-xs">
              上線後可在個人資料區查看所有累積號碼
            </p>
          </div>
        </section>

        {/* Prize */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold border-b border-border pb-2">💰 獎金說明</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>獎金金額上線後決定，平台保留調整機制。</p>
            <p>不定時額外加碼（年終加碼、里程碑加碼），加碼時提前公告。</p>
            <p className="text-foreground font-medium">
              中獎後系統自動打幣到錢包，Telegram 同步通知，鏈上可查。
            </p>
          </div>
        </section>

        {/* Transparency */}
        <section className="rounded-xl border border-border bg-muted/20 p-5 space-y-3">
          <h3 className="font-bold">🔒 為什麼說完全公正？</h3>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              韭菜樂透不自行開獎，直接沿用美國 Powerball 官方結果。
              Powerball 每週六開獎，公開透明，任何人都能在官網查驗。
              我們只是對號入座，沒有任何操縱空間。
            </p>
            <a
              href={POWERBALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              → Powerball 官方開獎紀錄 ↗
            </a>
          </div>
        </section>

        {/* Sell warning */}
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground text-center">
          ⚠️ 賣光 $JIUCAI 後，樂透券
          <span className="text-foreground font-semibold">停止發放新券</span>，
          但已累積的號碼保留。買回來後立即恢復每週發號。
        </div>

        {/* Bottom nav — 所有頁面統一 */}
        <div className="border-t border-border pt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => navigate("/")}
          >
            回分頁列表
          </Button>
          <Button
            className="flex-1 rounded-full"
            onClick={() => navigate("/")}
          >
            連結錢包
          </Button>
        </div>
      </div>
    </div>
  );
}
