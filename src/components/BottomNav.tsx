import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Gift, TrendingUp, MessageSquare, User } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tabs = [
    { href: "/home", icon: Home, label: t("nav.home") },
    { href: "/pool", icon: Gift, label: t("nav.pool") },
    { href: "/recovery", icon: TrendingUp, label: t("nav.recovery") },
    { href: "/chat", icon: MessageSquare, label: t("nav.chat") },
    { href: "/profile", icon: User, label: t("nav.profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active =
            location.pathname === tab.href ||
            (tab.href === "/home" && location.pathname === "/");
          return (
            <button
              key={tab.href}
              onClick={() => navigate(tab.href)}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-1 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" />
              )}
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
