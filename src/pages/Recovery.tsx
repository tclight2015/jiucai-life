import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import person1 from "@/assets/person1.png";
import person2 from "@/assets/person2.png";
import person3 from "@/assets/person3.png";
import person4 from "@/assets/person4.png";
import person5 from "@/assets/person5.png";
import person6 from "@/assets/person6.png";
import person7 from "@/assets/person7.png";

const mockWinners = [
  { wallet: "0x1a2b…9f0e", amount: "$15 USDT", jiucai: "300,000 JIUCAI", date: "2026-04-07", img: person1, note: "終於回了一點！感謝🙏" },
  { wallet: "0x9c3d…4a21", amount: "$5 USDT",  jiucai: "100,000 JIUCAI", date: "2026-04-07", img: person2, note: "這個項目有在做事！" },
  { wallet: "0x7e4f…bb12", amount: "$10 USDT", jiucai: "200,000 JIUCAI", date: "2026-04-04", img: person3, note: "希望繼續回血" },
  { wallet: "0x3311…cc00", amount: "$5 USDT",  jiucai: "100,000 JIUCAI", date: "2026-04-04", img: person4, note: "持幣就對了！" },
  { wallet: "0xaabb…1234", amount: "$20 USDT", jiucai: "400,000 JIUCAI", date: "2026-04-01", img: person5, note: "大戶回血中，加油！" },
  { wallet: "0x5566…ff88", amount: "$5 USDT",  jiucai: "100,000 JIUCAI", date: "2026-04-01", img: person6, note: "第一次中，超開心" },
  { wallet: "0xccdd…7700", amount: "$5 USDT",  jiucai: "100,000 JIUCAI", date: "2026-03-28", img: person7, note: "韭菜也能翻身！" },
  { wallet: "0x2233…aa55", amount: "$5 USDT",  jiucai: "100,000 JIUCAI", date: "2026-03-28", img: person1, note: "繼續持幣，繼續中！" },
];

const howStepsZh = [
  "確認你的錢包曾收到韭菜翻身日記的獎金",
  "截圖你的收款紀錄",
  "上傳截圖 + 填入錢包地址",
  "系統自動驗證鏈上紀錄",
  "驗證通過，獲得額外加碼獎勵",
];
const howStepsEn = [
  "Confirm: Ensure your wallet has received a payout from the Revenge Diary.",
  "Capture: Screenshot your receipt/transaction record.",
  "Upload: Submit your screenshot + enter your wallet address.",
  "Verify: Our system automatically scans the on-chain data.",
  "Bonus: Once verified, receive an exclusive bonus reward.",
];

const Recovery = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const howSteps = isEn ? howStepsEn : howStepsZh;

  return (
    <PageLayout>
      {/* ── Title + Desc ── */}
      <div className="mb-5">
        <h2 className="text-base font-bold text-foreground mb-1">{t("recovery.title")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t("recovery.desc")}</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary">26</p>
          <p className="text-xs text-muted-foreground mt-1">{t("recovery.helped")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary">$125</p>
          <p className="text-xs text-muted-foreground mt-1">{t("recovery.totalReturned")}</p>
        </div>
      </div>

      {/* ── 如何上傳 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t("recovery.howTitle")}</h2>
        <div className="space-y-2">
          {howSteps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{i + 1}</span>
              <p className="text-sm text-foreground leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 重要說明 ── */}
      <div className="rounded-xl border border-amber-600/30 bg-amber-950/20 p-5 shadow-sm mb-5">
        <h2 className="text-sm font-semibold text-amber-400 mb-2">{t("recovery.importantTitle")}</h2>
        {isEn ? (
          <div className="space-y-1 text-sm text-amber-400/80">
            <p>• One-Time Bonus: This verification reward is limited to once per wallet — forever.</p>
            <p>• The Spotlight is Yours: This is your "Debut Show." Don't waste your shot.</p>
          </div>
        ) : (
          <div className="space-y-1 text-sm text-amber-400/80">
            <p>• 此加碼獎勵每個錢包地址終身只能領一次</p>
            <p>• 這是你的「出道秀」，把握機會</p>
          </div>
        )}
      </div>

      {/* ── 截圖牆 ── */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground mb-1">{t("recovery.wallTitle")}</h2>
        {isEn ? (
          <p className="text-xs text-muted-foreground">Each card features: Wallet Address · Winning Amount · Winning Date · Degen's Testimonial. Click "Verify Original" to check the TX Hash on-chain.</p>
        ) : (
          <p className="text-xs text-muted-foreground">每張卡片顯示：錢包地址（縮寫）· 中獎金額 · 中獎日期 · 用戶感言。點「查看原圖」可驗證真實性。</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {mockWinners.map((w, i) => (
          <div key={i} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <img src={w.img} alt="" className="w-full h-28 object-cover object-top" />
            <div className="p-3">
              <p className="font-mono text-xs text-muted-foreground mb-1">{w.wallet}</p>
              <p className="text-sm font-bold text-primary">{w.amount}</p>
              <p className="text-xs text-muted-foreground">{w.jiucai}</p>
              {w.note && <p className="text-xs text-foreground/70 mt-1.5 italic">「{w.note}」</p>}
              <p className="text-xs text-muted-foreground/60 mt-1">{w.date}</p>
              <button className="mt-2 text-xs font-semibold text-primary hover:underline">{t("recovery.verifyBtn")}</button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Recovery;
