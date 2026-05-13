import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

const App: React.FC = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const defaultTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    document.documentElement.setAttribute("data-theme", defaultTheme);
    localStorage.setItem("theme", defaultTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = localStorage.getItem("theme") || (e.matches ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    };
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className={`min-h-screen flex flex-col font-sans ltr`}>
        <Routes>
          {/* Home page */}
          <Route index element={<Home />} />

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;