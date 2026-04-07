import { useNavigate } from "react-router-dom";
import PageHeader from "./PageHeader";

interface PageLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
}

const PageLayout = ({ children, showBack = true }: PageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4">
        <PageHeader />
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
        )}
        {children}
        <div className="h-24" />
      </div>
    </div>
  );
};

export default PageLayout;
