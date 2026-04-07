import { type LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
}

const ModuleCard = ({ title, icon: Icon, href }: ModuleCardProps) => {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:border-primary/60 hover:shadow-md hover:shadow-primary/10 active:scale-[0.98]"
      onClick={(e) => {
        e.preventDefault();
        if (href !== "#") window.location.href = href;
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        <Icon size={20} />
      </div>
      <span className="text-sm font-semibold text-foreground tracking-wide">
        {title}
      </span>
      <svg
        className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
};

export default ModuleCard;
