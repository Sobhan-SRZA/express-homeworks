import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TermOfServices from "./pages/TermOfServices";
import Application from "./pages/Application";

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
        <main className="grow custom-container mx-auto px-4 py-8 flex flex-col justify-center text-center">
          <Routes>
            {/* Home page */}
            <Route index element={<Home />} />

            {/* Tos */}
            <Route path="/tos" element={<TermOfServices />} />

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer component for bottom navigation and information */}
        {/* <Footer /> */}

      </div>
    </BrowserRouter>
  );
};

// Export the App component as the default export.
export default App;

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */