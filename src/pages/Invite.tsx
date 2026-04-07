import PageLayout from "@/components/PageLayout";
import { useState } from "react";

// Mock：正式接後端後替換
const mockWallet = "0x1a2b…9f0e";
const APP_URL = import.meta.env.VITE_APP_URL ?? "https://jiucai.life";

const mockInvited = [
  { wallet: "0x9c3d…4a21", date: "2026-04-05", status: "成功", reward: "已得獎資格" },
  { wallet: "0x7e4f…bb12", date: "2026-04-03", status: "成功", reward: "已得獎資格" },
  { wallet: "0x3311…cc00", date: "2026-04-01", status: "待索幣", reward: "—" },
];

const Invite = () => {
  const inviteLink = `${APP_URL}/claim?ref=${mockWallet}`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const successCount = mockInvited.filter((i) => i.status === "成功").length;

  return (
    <PageLayout>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 text-center shadow-sm">
          <p className="text-3xl font-black text-primary">{successCount}</p>
          <p className="text-xs text-muted-foreground mt-1">成功邀請人數</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
          <p className="text-3xl font-black text-foreground">{mockInvited.length}</p>
          <p className="text-xs text-muted-foreground mt-1">邀請總人數</p>
        </div>
      </div>

      {/* Invite link */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-1">你的邀請連結</h2>
        <p className="text-xs text-muted-foreground mb-3">
          朋友透過此連結成功索幣，即視為邀請成功
        </p>
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2.5 mb-3">
          <p className="flex-1 text-xs font-mono text-foreground truncate">{inviteLink}</p>
        </div>
        <button
          onClick={copy}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors active:scale-[0.98]"
        >
          {copied ? "已複製！" : "複製邀請連結"}
        </button>
      </div>

      {/* Rules */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">邀請說明</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          {[
            "朋友點擊你的連結並成功完成索幣，即算邀請成功",
            "邀請成功數量記錄在你的個人資料",
            "未來邀請數量將作為競賽排名或抽獎資格條件",
            "同一朋友只計算一次，重複索幣不累計",
          ].map((text, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-primary font-bold shrink-0">{i + 1}.</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invited list */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">邀請記錄</h2>
        </div>
        {mockInvited.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            還沒有邀請記錄，快分享連結吧！
          </div>
        ) : (
          <div className="divide-y divide-border">
            {mockInvited.map((row, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-foreground">{row.wallet}</p>
                  <p className="text-xs text-muted-foreground">{row.date}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    row.status === "成功"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Invite;
