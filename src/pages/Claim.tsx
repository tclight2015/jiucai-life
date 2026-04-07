import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const tiers = [
  { range: "損失 $200 以下", reward: "50,000 JIUCAI", note: "截圖一張" },
  { range: "損失 $200–$1,000", reward: "200,000 JIUCAI", note: "截圖 + 地址核驗" },
  { range: "損失 $1,000 以上", reward: "500,000 JIUCAI", note: "截圖 + 地址 + 審核" },
];

type Step = "idle" | "uploading" | "reviewing" | "sending" | "done";

const stepLabels: Record<Step, string> = {
  idle: "",
  uploading: "上傳中…",
  reviewing: "審核中…",
  sending: "打幣中…",
  done: "完成！JIUCAI 已到帳",
};

const stepOrder: Step[] = ["uploading", "reviewing", "sending", "done"];

const Claim = () => {
  const [searchParams] = useSearchParams();
  const refWallet = searchParams.get("ref") ?? "";  // 邀請人錢包地址

  const [file, setFile] = useState<File | null>(null);
  const [wallet, setWallet] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => setFile(f);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = () => {
    if (!file || !wallet) return;
    // TODO: 提交時將 refWallet 一併送後端記錄邀請關係
    // payload: { wallet, refWallet, file }
    console.log("[Claim] ref:", refWallet || "direct");
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
      {/* Tier table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">索幣分級</h2>
        </div>
        <div className="divide-y divide-border">
          {tiers.map((t) => (
            <div key={t.range} className="px-5 py-3">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-medium text-foreground">{t.range}</p>
                <p className="text-sm font-bold text-primary">{t.reward}</p>
              </div>
              <p className="text-xs text-muted-foreground">{t.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral banner */}
      {refWallet && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 mb-4 text-xs text-muted-foreground">
          🎉 你透過朋友邀請連結來到這裡，索幣成功後將自動記錄邀請關係
        </div>
      )}

      {/* Upload form */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-foreground">提交申請</h2>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer py-10 transition-colors ${
            dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/60 hover:bg-muted/40"
          }`}
        >
          <svg className="mb-2 h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {file ? (
            <p className="text-sm font-medium text-primary">{file.name}</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">拖放截圖至此，或點擊選擇</p>
              <p className="text-xs text-muted-foreground mt-1">支援 JPG / PNG</p>
            </>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        {/* Wallet input */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">收幣錢包地址</label>
          <Input
            placeholder="0x..."
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        {/* Submit */}
        {step === "idle" ? (
          <Button
            className="w-full"
            disabled={!file || !wallet}
            onClick={handleSubmit}
          >
            提交申請
          </Button>
        ) : (
          <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-4">
            {/* Progress steps */}
            <div className="flex items-center justify-between mb-3">
              {stepOrder.map((s, i) => (
                <div key={s} className="flex flex-1 items-center">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${
                    stepOrder.indexOf(step) >= i ? "bg-primary" : "bg-muted"
                  }`} />
                  {i < stepOrder.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 ${
                      stepOrder.indexOf(step) > i ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
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
