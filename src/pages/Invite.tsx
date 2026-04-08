import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

const mockWallet = "0x1a2b…9f0e";
const APP_URL = import.meta.env.VITE_APP_URL ?? "https://jiucai.life";

const mockInvited = [
  { wallet: "0x9c3d…4a21", date: "2026-04-05", status: "success" },
  { wallet: "0x7e4f…bb12", date: "2026-04-03", status: "success" },
  { wallet: "0x3311…cc00", date: "2026-04-01", status: "pending" },
];

const Invite = () => {
  const { t } = useTranslation();
  const inviteLink = `${APP_URL}/claim?ref=${mockWallet}`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const successCount = mockInvited.filter((i) => i.status === "success").length;

  return (
    <PageLayout>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 text-center shadow-sm">
          <p className="text-3xl font-black text-primary">{successCount}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("invite.successCount")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
          <p className="text-3xl font-black text-foreground">{mockInvited.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("invite.totalCount")}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-1">{t("invite.linkTitle")}</h2>
        <p className="text-xs text-muted-foreground mb-3">{t("invite.linkDesc")}</p>
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2.5 mb-3">
          <p className="flex-1 text-xs font-mono text-foreground truncate">{inviteLink}</p>
        </div>
        <button onClick={copy} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors active:scale-[0.98]">
          {copied ? t("invite.copiedBtn") : t("invite.copyBtn")}
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t("invite.rulesTitle")}</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          {(t("invite.rules", { returnObjects: true }) as string[]).map((text, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-primary font-bold shrink-0">{i + 1}.</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{t("invite.recordTitle")}</h2>
        </div>
        {mockInvited.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">{t("invite.noRecord")}</div>
        ) : (
          <div className="divide-y divide-border">
            {mockInvited.map((row, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-foreground">{row.wallet}</p>
                  <p className="text-xs text-muted-foreground">{row.date}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.status === "success" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {row.status === "success" ? t("invite.statusSuccess") : t("invite.statusPending")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Invite;
