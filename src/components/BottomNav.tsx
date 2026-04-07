import { useLocation, useNavigate } from "react-router-dom";
import { Home, Gift, TrendingUp, MessageSquare, User } from "lucide-react";

const tabs = [
  { href: "/", icon: Home, label: "首頁" },
  { href: "/pool", icon: Gift, label: "獎池" },
  { href: "/recovery", icon: TrendingUp, label: "回血" },
  { href: "/chat", icon: MessageSquare, label: "吐槽" },
  { href: "/profile", icon: User, label: "我的" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname === tab.href;
          return (
            <button
              key={tab.href}
              onClick={() => navigate(tab.href)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${active ? "text-primary" : ""}`}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
