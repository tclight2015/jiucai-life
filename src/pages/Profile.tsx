import { useTranslation } from "react-i18next";
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
  referralSuccess: 2,
};

const mockCards = [
  { id: 1, type: "權重翻倍卡", qty: 2, enabled: true, desc: "抽中機率 ×2" },
  { id: 2, type: "獎金翻倍卡", qty: 1, enabled: false, desc: "中獎金額 ×2" },
  { id: 3, type: "幸運卡", qty: 3, enabled: true, desc: "基礎票數 +50" },
];

const Profile = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState(mockCards);
  const p = mockProfile;
  const toggle = (id: number) => setCards((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));

  return (
    <PageLayout>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-xs text-muted-foreground mb-1">{t("profile.wallet")}</p>
        <p className="font-mono text-sm font-semibold text-foreground">{p.wallet}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm text-muted-foreground mb-3">{t("profile.holdings")}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.balance")}</p>
            <p className="font-semibold text-foreground">{p.jiucai.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">JIUCAI</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.locked")}</p>
            <p className="font-semibold text-amber-500">{p.locked.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{t("profile.unlockLeft", { days: p.unlockDays })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.rank")}</p>
            <p className="font-semibold text-primary">#{p.rank}</p>
            <p className="text-xs text-muted-foreground">/ {p.totalHolders} · {p.rankMultiplier}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.holdDays")}</p>
            <p className="font-semibold text-foreground">{p.holdDays} {t("common.days")}</p>
            <p className="text-xs text-muted-foreground">{t("profile.timeWeight")} {p.timeMultiplier}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <p className="text-sm text-muted-foreground mb-3">{t("profile.prizeRecord")}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.totalUsdt")}</p>
            <p className="font-semibold text-primary">${p.totalPrizeUsdt}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.totalJiucai")}</p>
            <p className="font-semibold text-foreground">{p.totalPrizeJiucai.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("profile.successInvite")}</p>
            <p className="font-semibold text-primary">{p.referralSuccess} {t("common.people")}</p>
            <p className="text-xs text-muted-foreground">{t("profile.totalInvite", { count: p.referrals })}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{t("profile.cards")}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{t("profile.cardsHint")}</p>
        </div>
        <div className="divide-y divide-border">
          {cards.map((card) => (
            <div key={card.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{card.type} ×{card.qty}</p>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </div>
              <Switch checked={card.enabled} onCheckedChange={() => toggle(card.id)} />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
