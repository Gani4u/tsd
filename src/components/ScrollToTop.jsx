import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component ensures that on route change or hash navigation,
 * the window scrolls smoothly to the target section or instantly to the top.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      // Allow DOM to finish rendering before scrolling to anchor
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, search, hash]);

  return null;
}
