import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

interface Message {
  id: number;
  wallet: string;
  text: string;
  time: string;
  official?: boolean;
  replies?: { wallet: string; text: string; time: string; official?: boolean }[];
}

const initial: Message[] = [
  {
    id: 1, wallet: "0x1a2b…9f0e", text: "被割了好慘，損失快 $500，項目方快來還我！", time: "14:32",
    replies: [
      { wallet: "官方", text: "我們看到了，一直在努力回饋社群。", time: "14:35", official: true },
      { wallet: "0x9c3d…4a21", text: "我也一樣，一起加油！", time: "14:40" },
    ],
  },
  {
    id: 2, wallet: "0x7e4f…bb12", text: "什麼時候上大交易所？到時候就回血了！", time: "13:55",
    replies: [{ wallet: "官方", text: "我們永不上 CEX，因為 CEX 就是割你的地方。持幣才是正解。", time: "14:00", official: true }],
  },
  { id: 3, wallet: "0x3311…cc00", text: "持幣就對了！翻身不是夢，繼續 hodl", time: "13:10" },
  {
    id: 4, wallet: "0xaabb…1234", text: "韭菜宣言寫得很感人，有沒有辦法一起參與？", time: "12:48",
    replies: [{ wallet: "官方", text: "歡迎在這裡發聲，你的聲音就是社群的力量。", time: "12:52", official: true }],
  },
  { id: 5, wallet: "0x5566…ff88", text: "索幣功能超棒！已提交截圖，等 JIUCAI 到帳 🙌", time: "11:20" },
];

const rulesZh = [
  "連結錢包即可發言",
  "顯示錢包地址縮寫（例：0x7f3a）",
  "可回覆其他人的留言",
  "官方會不定期回覆置頂",
];
const rulesEn = [
  "Connect to Chat: Simply link your wallet to post.",
  "Anonymous but On-Chain: Displayed as a masked wallet address (e.g., 0x7f3a...).",
  "Join the Thread: Reply to any Degen in the community.",
  "Official Pings: The team will periodically reply and pin key discussions.",
];

const Avatar = ({ wallet, official }: { wallet: string; official?: boolean }) => (
  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${official ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
    {official ? "官" : wallet[2]?.toUpperCase() ?? "?"}
  </div>
);

const Chat = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [{
      id: Date.now(), wallet: "0xYour…addr", text,
      time: new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }),
    }, ...prev]);
    setInput("");
  };

  const chatRules = isEn ? rulesEn : rulesZh;

  return (
    <PageLayout>
      {/* ── Title + Desc ── */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-foreground mb-1">{t("chat.title")}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t("chat.subtitle")}</p>
      </div>

      {/* ── 發言規則 ── */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm mb-5">
        <h3 className="text-xs font-semibold text-foreground mb-2">{t("chat.rulesTitle")}</h3>
        <div className="space-y-1">
          {chatRules.map((r, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-primary shrink-0">•</span>
              <p className="text-xs text-muted-foreground">{r}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-primary mt-3">{t("chat.officialTag")} — {isEn ? "Team replies will be specially tagged and automatically pinned to the top of the thread." : "回覆會特別標示，自動置頂在該討論串。"}</p>
      </div>

      {/* ── 輸入框 ── */}
      <div className="flex gap-2 mb-5">
        <input
          className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder={t("chat.placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          {t("common.send")}
        </button>
      </div>

      {/* ── 訊息串 ── */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`rounded-xl border p-4 shadow-sm ${msg.official ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
            <div className="flex items-start gap-3">
              <Avatar wallet={msg.wallet} official={msg.official} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-xs font-semibold ${msg.official ? "text-primary" : "text-muted-foreground"}`}>
                    {msg.official ? t("chat.officialTag") : msg.wallet}
                  </span>
                  <span className="text-xs text-muted-foreground/60">{msg.time}</span>
                </div>
                <p className="text-sm text-foreground break-words">{msg.text}</p>
              </div>
            </div>
            {msg.replies && msg.replies.length > 0 && (
              <div className="mt-3 ml-11 space-y-2">
                {msg.replies.map((r, i) => (
                  <div key={i} className={`rounded-lg border px-3 py-2 ${r.official ? "border-primary/30 bg-primary/5" : "border-border bg-muted/40"}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-semibold ${r.official ? "text-primary" : "text-muted-foreground"}`}>
                        {r.official ? t("chat.officialTag") : r.wallet}
                      </span>
                      <span className="text-xs text-muted-foreground/60">{r.time}</span>
                    </div>
                    <p className="text-sm text-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Chat;
