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

const Recovery = () => {
  const { t } = useTranslation();
  return (
    <PageLayout>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary">26</p>
          <p className="text-xs text-muted-foreground mt-1">{t("recovery.helped")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary">$125</p>
          <p className="text-xs text-muted-foreground mt-1">{t("recovery.totalReturned")}</p>
        </div>
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
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Recovery;
