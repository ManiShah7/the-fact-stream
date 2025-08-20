import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import lightLogo from "@/assets/light-logo.png";
import { useTheme } from "@/providers/ThemeProvider";

const Logo = () => {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (theme === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDarkMode(systemPrefersDark);
      } else {
        setIsDarkMode(theme === "dark");
      }
    };

    updateTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateTheme);

      return () => mediaQuery.removeEventListener("change", updateTheme);
    }
  }, [theme]);

  return isDarkMode ? (
    <img src={logo} alt="Logo" className="w-16 h-16 rounded" />
  ) : (
    <img src={lightLogo} alt="Logo" className="w-16 h-16 rounded" />
  );
};

export default Logo;
