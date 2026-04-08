import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDailyQuota } from "@/hooks/useDailyQuota";

const tiers = [
  { range: "損失 $200 以下", reward: "50,000 JIUCAI", note: "截圖一張" },
  { range: "損失 $200–$1,000", reward: "200,000 JIUCAI", note: "截圖 + 地址核驗" },
  { range: "損失 $1,000 以上", reward: "500,000 JIUCAI", note: "截圖 + 地址 + 審核" },
];

type Step = "idle" | "uploading" | "reviewing" | "sending" | "done" | "queued";
const stepOrder: Step[] = ["uploading", "reviewing", "sending", "done"];

const Claim = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const refWallet = searchParams.get("ref") ?? "";

  const [file, setFile] = useState<File | null>(null);
  const [wallet, setWallet] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOverQuota, estimatedDays, recordClaim } = useDailyQuota();

  const handleFile = (f: File) => setFile(f);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const stepLabels: Record<Step, string> = {
    idle: "",
    uploading: t("claim.steps.uploading"),
    reviewing: t("claim.steps.reviewing"),
    sending: t("claim.steps.sending"),
    done: t("claim.steps.done"),
    queued: "",
  };

  const handleSubmit = () => {
    if (!file || !wallet) return;
    console.log("[Claim] ref:", refWallet || "direct");
    recordClaim();
    if (isOverQuota) {
      setStep("queued");
      return;
    }
    let idx = 0;
    setStep(stepOrder[idx]);
    const tick = () => {
      idx++;
      if (idx < stepOrder.length) {
        setTimeout(() => { setStep(stepOrder[idx]); tick(); }, idx === stepOrder.length - 1 ? 1200 : 1800);
      }
    };
    setTimeout(tick, 1800);
  };

  return (
    <PageLayout>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{t("claim.tiers")}</h2>
        </div>
        <div className="divide-y divide-border">
          {tiers.map((tier) => (
            <div key={tier.range} className="px-5 py-3">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-medium text-foreground">{tier.range}</p>
                <p className="text-sm font-bold text-primary">{tier.reward}</p>
              </div>
              <p className="text-xs text-muted-foreground">{tier.note}</p>
            </div>
          ))}
        </div>
      </div>

      {refWallet && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 mb-4 text-xs text-muted-foreground">
          {t("claim.refBanner")}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-foreground">{t("claim.form")}</h2>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer py-10 transition-colors ${dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 hover:bg-muted/40"}`}
        >
          <svg className="mb-2 h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {file ? (
            <p className="text-sm font-medium text-primary">{file.name}</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{t("claim.dropzone")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("claim.dropzoneHint")}</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{t("claim.walletLabel")}</label>
          <Input placeholder={t("claim.walletPlaceholder")} value={wallet} onChange={(e) => setWallet(e.target.value)} className="font-mono text-sm" />
        </div>

        {step === "idle" ? (
          <Button className="w-full" disabled={!file || !wallet} onClick={handleSubmit}>
            {t("claim.submitBtn")}
          </Button>
        ) : step === "queued" ? (
          <div className="rounded-lg bg-amber-950/40 border border-amber-600/40 px-4 py-4 text-center space-y-1">
            <p className="text-sm font-semibold text-amber-400">{t("claim.queued")}</p>
            <p className="text-xs text-amber-400/70">{t("claim.queuedDays", { days: estimatedDays })}</p>
          </div>
        ) : (
          <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              {stepOrder.map((s, i) => (
                <div key={s} className="flex flex-1 items-center">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${stepOrder.indexOf(step) >= i ? "bg-primary" : "bg-muted"}`} />
                  {i < stepOrder.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${stepOrder.indexOf(step) > i ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-primary text-center">{stepLabels[step]}</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Claim;
