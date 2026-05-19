import { useEffect, useState } from "react";
import "../styles/Navbar.css";

const AnimatedThemeToggler = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("eventhive_theme") || "light",
  );
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("eventhive_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <button
      className={`animated-theme-toggler global-theme-toggle ${isDark ? "dark" : ""}`}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
    >
      <span className="theme-icon-wrap" aria-hidden="true">
        <svg className="theme-icon sun-icon" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5M12 19.5V22M4.93 4.93 6.7 6.7M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07 6.7 17.3M17.3 6.7l1.77-1.77" />
        </svg>
        <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="none">
          <path d="M20.2 15.1A8.6 8.6 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z" />
          <path d="M16.8 4.2h.01M19.2 7.4h.01" />
        </svg>
      </span>
    </button>
  );
};

export default AnimatedThemeToggler;
