/**
 * 所有子頁面共用的頂部 header
 * 顯示「韭菜翻身日記」品牌名、語言切換、返回首頁按鈕
 */
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";

interface PageHeaderProps {
  /** 頁面標題（顯示在品牌名下方的小字） */
  pageTitle?: string;
}

export default function PageHeader({ pageTitle }: PageHeaderProps) {
  const navigate = useNavigate();
  const { lang, setLang } = useLang();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-start leading-tight group"
        >
          <span className="font-black text-base tracking-wide text-foreground group-hover:text-primary transition-colors">
            韭菜翻身日記
          </span>
          {pageTitle && (
            <span className="text-xs text-muted-foreground">{pageTitle}</span>
          )}
        </button>

        {/* Right side: lang toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang("zh")}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              lang === "zh"
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            中文
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              lang === "en"
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
