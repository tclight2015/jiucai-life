import PageLayout from "@/components/PageLayout";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const mockProfile = {
  wallet: "0x1a2b...9f0e",
  jiucai: 5000000,
  locked: 5000000,
  unlockDays: 14,
  rank: 42,
  totalHolders: 312,
  rankMultiplier: "3.2x",
  holdDays: 45,
  timeMultiplier: "1.5x",
  totalPrizeUsdt: 12,
  totalPrizeJiucai: 250000,
  referrals: 3,
};

const mockCards = [
  { id: 1, type: "權重翻倍卡", qty: 2, enabled: true, desc: "抽中機率 ×2" },
  { id: 2, type: "獎金翻倍卡", qty: 1, enabled: false, desc: "中獎金額 ×2" },
  { id: 3, type: "幸運卡", qty: 3, enabled: true, desc: "基礎票數 +50" },
];

const Profile = () => {
  const [cards, setCards] = useState(mockCards);

  const toggle = (id: number) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const p = mockProfile;

  return (
    <PageLayout>
      {/* Wallet */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-xs text-muted-foreground mb-1">已連結錢包</p>
        <p className="font-mono text-sm font-semibold text-foreground">{p.wallet}</p>
      </div>

      {/* Holdings */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm text-muted-foreground mb-3">持倉狀況</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">持幣總量</p>
            <p className="font-semibold text-foreground">{p.jiucai.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">JIUCAI</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">鎖倉中</p>
            <p className="font-semibold text-amber-500">{p.locked.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">解鎖剩 {p.unlockDays} 天</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">持幣排名</p>
            <p className="font-semibold text-primary">#{p.rank}</p>
            <p className="text-xs text-muted-foreground">共 {p.totalHolders} 人 · {p.rankMultiplier}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">持倉天數</p>
            <p className="font-semibold text-foreground">{p.holdDays} 天</p>
            <p className="text-xs text-muted-foreground">時間加權 {p.timeMultiplier}</p>
          </div>
        </div>
      </div>

      {/* Prize stats */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm text-muted-foreground mb-3">中獎紀錄</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">累計獲得 USDT</p>
            <p className="font-semibold text-primary">${p.totalPrizeUsdt}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">累計獲得 JIUCAI</p>
            <p className="font-semibold text-foreground">{p.totalPrizeJiucai.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">邀請人數</p>
            <p className="font-semibold text-foreground">{p.referrals} 人</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">持有卡牌</h2>
          <p className="text-xs text-muted-foreground mt-0.5">開啟後下次抽獎自動生效</p>
        </div>
        <div className="divide-y divide-border">
          {cards.map((card) => (
            <div key={card.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{card.type} ×{card.qty}</p>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </div>
              <Switch
                checked={card.enabled}
                onCheckedChange={() => toggle(card.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
