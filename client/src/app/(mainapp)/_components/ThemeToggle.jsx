import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
      onClick={toggleTheme}
      title="Toggle Light / Dark mode"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-slate-600" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
      <span className="hidden md:inline">{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  );
};

export default ThemeToggle;
