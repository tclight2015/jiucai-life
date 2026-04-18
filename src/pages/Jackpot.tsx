import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-yellow-400 font-bold text-lg tracking-wide"
        >
          🌿 韭菜翻身日記
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
        >
          ← 返回首頁
        </Button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="text-5xl">🎰</div>
          <h1 className="text-3xl font-bold text-yellow-400">韭菜樂透</h1>
          <p className="text-white/60 text-sm">
            對標 Powerball · 持幣自動累積號碼 · 完全公正透明
          </p>
        </div>

        {/* Coming soon banner */}
        <div className="rounded-2xl border border-yellow-400/40 bg-yellow-400/5 p-5 text-center space-y-2">
          <div className="text-yellow-400 font-bold text-lg">⏳ 預計上線：{LAUNCH_ESTIMATE}</div>
          <p className="text-white/70 text-sm leading-relaxed">
            韭菜樂透將於平台穩定運行後正式啟動。
            屆時每位持幣會員將自動獲得號碼券，
            每週累積一張，持幣越久號碼越多，中獎機率越高。
          </p>
          <p className="text-white/40 text-xs">
            獎金視屆時獎池狀況決定，保留調整機制。
          </p>
        </div>

        {/* How it works */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white/90 border-b border-white/10 pb-2">
            🎯 怎麼玩
          </h2>
          <div className="space-y-3 text-sm text-white/75 leading-relaxed">
            <div className="flex gap-3">
              <span className="text-yellow-400 font-bold shrink-0">1.</span>
              <span>持有 $JIUCAI 即自動加入，無需另外報名。每週系統自動發一組5個號碼（1–69）給每位持幣會員。</span>
            </div>
            <div className="flex gap-3">
              <span className="text-yellow-400 font-bold shrink-0">2.</span>
              <span>每週六（美東時間）Powerball 開獎後，系統自動抓取本期5顆主球號碼，與所有會員累積的號碼券逐一比對。</span>
            </div>
            <div className="flex gap-3">
              <span className="text-yellow-400 font-bold shrink-0">3.</span>
              <span>對中 <span className="text-yellow-400 font-bold">3顆以上</span>即獲獎，Telegram 自動通知並打幣。</span>
            </div>
            <div className="flex gap-3">
              <span className="text-yellow-400 font-bold shrink-0">4.</span>
              <span>號碼不消失，年底（12月31日）統一清空，元旦重新開始。持幣越久，手上號碼張數越多。</span>
            </div>
          </div>
        </section>

        {/* Probability table */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white/90 border-b border-white/10 pb-2">
            📈 中獎機率隨週數增加
          </h2>
          <div className="rounded-xl overflow-hidden border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-white/50 text-xs uppercase">
                  <th className="px-4 py-3 text-left">持幣週數</th>
                  <th className="px-4 py-3 text-center">累積號碼張數</th>
                  <th className="px-4 py-3 text-right">中獎機率</th>
                </tr>
              </thead>
              <tbody>
                {PROB_TABLE.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-white/5 ${
                      i === PROB_TABLE.length - 1
                        ? "bg-yellow-400/10 text-yellow-300 font-bold"
                        : "text-white/75"
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
          <p className="text-white/40 text-xs text-center">
            持幣滿一整年，每週對獎機率接近 9%。越早加入優勢越大。
          </p>
        </section>

        {/* Sample ticket */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white/90 border-b border-white/10 pb-2">
            🃏 號碼樣式
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/3 p-5 space-y-4">
            <div className="flex items-center justify-between text-sm text-white/50">
              <span>🎰 韭菜樂透 — 第 18 週</span>
              <span>累積 18 張</span>
            </div>
            <div className="space-y-2">
              {[
                [7, 14, 23, 38, 45],
                [3, 19, 31, 44, 62],
                [11, 22, 33, 44, 55],
              ].map((nums, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-white/30 text-xs w-6">#{i + 1}</span>
                  <div className="flex gap-2">
                    {nums.map((n) => (
                      <span
                        key={n}
                        className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/40
                                   text-yellow-300 text-xs font-bold flex items-center justify-center"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-white/30 text-xs pl-9">… 還有 15 組</p>
            </div>
            <p className="text-white/40 text-xs">
              上線後可在個人資料區查看所有累積號碼
            </p>
          </div>
        </section>

        {/* Prize */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white/90 border-b border-white/10 pb-2">
            💰 獎金說明
          </h2>
          <div className="text-sm text-white/75 space-y-2 leading-relaxed">
            <p>獎金金額視屆時獎池狀況決定，平台保留調整機制，不預先承諾固定數字。</p>
            <p>不定時額外加碼（年終加碼、里程碑加碼），加碼時提前公告。</p>
            <p className="text-yellow-400/80">中獎後系統自動打幣到錢包，Telegram 同步通知，鏈上可查。</p>
          </div>
        </section>

        {/* Why transparent */}
        <section className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-3">
          <h3 className="font-bold text-white/90">🔒 為什麼說完全公正？</h3>
          <div className="text-sm text-white/65 space-y-2 leading-relaxed">
            <p>韭菜樂透不自行開獎，直接沿用美國 Powerball 官方結果。</p>
            <p>Powerball 每週六開獎，公開透明，任何人都能在官網查驗。我們只是對號入座，沒有任何操縱空間。</p>
            <a
              href={POWERBALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-yellow-400 hover:underline"
            >
              → Powerball 官方開獎紀錄 ↗
            </a>
          </div>
        </section>

        {/* Sell warning */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-white/60 text-center">
          ⚠️ 賣光 $JIUCAI 後，樂透券<span className="text-white/90 font-bold">停止發放新券</span>，但已累積的號碼保留。
          買回來後立即恢復每週發號。
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 pt-4">
          <p className="text-white/50 text-sm">上線前，先持幣等開張</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8"
          >
            回首頁連結錢包
          </Button>
        </div>

        {/* Footer nav */}
        <div className="border-t border-white/10 pt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            ← 返回首頁
          </button>
        </div>

      </div>
    </div>
  );
}
