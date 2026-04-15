import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tabs = [
  { label: "首頁", path: "/" },
  { label: "韭菜宣言", path: "/about" },
];

const PageNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-3 py-10">
      {tabs.map(({ label, path }) => {
        const isActive = location.pathname === path;
        return (
          <Button
            key={path}
            onClick={() => navigate(path)}
            className="rounded-full px-6"
            variant={isActive ? "default" : "outline"}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};

export default PageNav;
