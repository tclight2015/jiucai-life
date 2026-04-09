import { useTranslation } from "react-i18next";
import type { Lang } from "../i18n";

const PageHeader = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const toggle = () => {
    i18n.changeLanguage(isEn ? "zh-TW" : "en");
  };

  return (
    <div className="relative flex flex-col items-center pt-8 md:pt-12 pb-2">
      {/* Language toggle */}
      <button
        onClick={toggle}
        className="absolute right-0 top-8 flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/60 hover:text-foreground transition-colors"
        aria-label="Switch language"
      >
        🌐 {isEn ? "中文" : "EN"}
      </button>

      <h1 className="hero-title">{t("app.title")}</h1>
      <p className="hero-subtitle">{t("app.subtitle")}</p>
    </div>
  );
};

export default PageHeader;
