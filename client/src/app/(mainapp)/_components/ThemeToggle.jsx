import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
      <span>{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  );
};

export default ThemeToggle;