import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDailyQuota } from "@/hooks/useDailyQuota";

const tiersZh = [
  { range: "損失 $200 以下", reward: "50,000 JIUCAI", note: "截圖一張" },
  { range: "損失 $200–$1,000", reward: "200,000 JIUCAI", note: "截圖 + 地址核驗" },
  { range: "損失 $1,000 以上", reward: "500,000 JIUCAI", note: "截圖 + 地址 + 審核" },
];
const tiersEn = [
  { range: "Loss < $200", reward: "50,000 JIUCAI", note: "1 screenshot" },
  { range: "Loss $200–$1,000", reward: "200,000 JIUCAI", note: "Screenshot + address verification" },
  { range: "Loss > $1,000", reward: "500,000 JIUCAI", note: "Screenshot + address + review" },
];

const stepsZh = [
  "連結你的 Web3 錢包",
  "上傳虧損截圖（需包含：日期、虧損金額）",
  "系統自動審核",
  "JIUCAI 自動打入你的錢包（約1-2分鐘）",
];
const stepsEn = [
  "Connect Your Web3 Wallet",
  "Upload Loss Proof (Must include: Date, and Loss amount)",
  "Automated Verification (Our system scans your proof instantly)",
  "Receive JIUCAI (Airdropped to your wallet within 1-2 minutes)",
];

const termsZh = [
  "每個錢包地址終身只能索幣一次",
  "領取的 JIUCAI 鎖倉 20 天",
  "鎖倉期間可正常參與所有抽獎活動",
  "20 天後自動解鎖",
  "鎖幣每日有限額，額滿後將依先後順序發放",
];
const termsEn = [
  "One Claim Per Wallet: Only one airdrop per unique address.",
  "20-Day Lock-up: Airdropped JIUCAI is locked for 20 days.",
  "Daily claim limit reached. Your payout will be queued based on time of entry. First come, first served.",
  "Full Utility: You can still participate in all raffles while your tokens are locked.",
  "Auto-Unlock: Tokens unlock automatically after the 20-day period.",
];

const faqZh = [
  { q: "可以用多個錢包索幣嗎？", a: "可以，但每個地址各自計算，分散持倉反而稀釋加權，不建議。" },
  { q: "截圖要求？", a: "需要看得到交易所名稱、日期和虧損金額即可，幣種不限、交易所不限。" },
  { q: "多久會收到？", a: "約1-2分鐘，Base鏈出塊速度快，幾乎即時到帳。" },
];
const faqEn = [
  { q: "Can I claim with multiple wallets?", a: "Yes, but each address is treated individually. Splitting your bags will dilute your weighting multipliers. It's better to stay heavy in one wallet." },
  { q: "Screenshot requirements?", a: "We just need to see the exchange name, date, and the loss amount. Any token, any exchange — if you lost money, you qualify." },
  { q: "When will I receive my tokens?", a: "Usually within 1-2 minutes. We operate on the Base chain, so transactions are lightning-fast and nearly instant." },
];

type Step = "idle" | "uploading" | "reviewing" | "sending" | "done" | "queued";
const stepOrder: Step[] = ["uploading", "reviewing", "sending", "done"];

const Claim = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const [searchParams] = useSearchParams();
  const refWallet = searchParams.get("ref") ?? "";

  const [file, setFile] = useState<File | null>(null);
  const [wallet, setWallet] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOverQuota, estimatedDays, recordClaim } = useDailyQuota();

  const tiers = isEn ? tiersEn : tiersZh;
  const steps = isEn ? stepsEn : stepsZh;
  const terms = isEn ? termsEn : termsZh;
  const faq = isEn ? faqEn : faqZh;

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
      {/* ── Headline ── */}
      <div className="mb-5">
        <h2 className="text-base font-bold text-foreground mb-1">{t("claim.headline")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t("claim.headlineDesc")}</p>
      </div>

      {/* ── Tiers ── */}
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

      {/* ── 索幣流程 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t("claim.stepsTitle")}</h2>
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{i + 1}</span>
              <p className="text-sm text-foreground leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 注意事項 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t("claim.termsTitle")}</h2>
        <div className="space-y-2">
          {terms.map((item, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-primary shrink-0 mt-0.5">•</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {refWallet && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 mb-4 text-xs text-muted-foreground">
          {t("claim.refBanner")}
        </div>
      )}

      {/* ── 提交表單 ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 mb-4">
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

      {/* ── FAQ ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t("claim.faqTitle")}</h2>
        <div className="space-y-4">
          {faq.map((item, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-foreground mb-1">Q：{item.q}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">A：{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Claim;
