import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

const LOGO_URL = "https://customer-assets-agu9un31.emergentagent.net/job_tsd-electronics-mvp/artifacts/mg0oqn79_WhatsApp%20Image%202026-07-28%20at%2010.15.58%20PM.jpeg";

export default function Header() {
  const { theme, toggle } = useTheme();
  const { count, setOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Precise Active States so no two tabs get highlighted simultaneously
  const isHomeActive =
    location.pathname === "/" &&
    (!location.hash || location.hash === "" || location.hash === "#") &&
    location.search !== "?featured=1";

  const isShopActive =
    location.pathname === "/shop" &&
    location.search !== "?featured=1";

  const isFeaturedActive =
    (location.pathname === "/" && location.hash === "#featured") ||
    location.search.includes("featured=1");

  const isContactActive =
    location.hash === "#contact";

  const navItems = [
    {
      id: "home",
      label: "Home",
      to: "/",
      isActive: isHomeActive,
      onClick: (e) => {
        setMobileMenuOpen(false);
        if (location.pathname === "/" && (!location.hash || location.hash === "")) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
    },
    {
      id: "shop",
      label: "Shop",
      to: "/shop",
      isActive: isShopActive,
      onClick: () => setMobileMenuOpen(false),
    },
    {
      id: "featured",
      label: "Featured",
      to: "/#featured",
      isActive: isFeaturedActive,
      onClick: (e) => {
        setMobileMenuOpen(false);
        if (location.pathname === "/") {
          e.preventDefault();
          const elem = document.getElementById("featured");
          if (elem) elem.scrollIntoView({ behavior: "smooth" });
          else navigate("/#featured");
        }
      },
    },
    {
      id: "contact",
      label: "Contact",
      to: "/#contact",
      isActive: isContactActive,
      onClick: (e) => {
        setMobileMenuOpen(false);
        if (location.pathname === "/") {
          e.preventDefault();
          const elem = document.getElementById("contact");
          if (elem) elem.scrollIntoView({ behavior: "smooth" });
          else navigate("/#contact");
        }
      },
    },
  ];

  return (
    <header className="sticky top-0 z-40 glass-header transition-colors duration-200">
      <div className="container-x flex items-center justify-between h-16 sm:h-18">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group shrink-0"
          data-testid="logo-link"
          onClick={() => {
            setMobileMenuOpen(false);
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl overflow-hidden bg-white p-1 shadow-card border border-token">
            <img src={LOGO_URL} alt="TSD World" className="h-full w-full object-contain" />
          </span>
          <span className="font-display font-extrabold text-xl tracking-tight flex items-center">
            <span>TSD</span>
            <span className="text-brand">.</span>
            <span className="font-semibold text-foreground/90">World</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm p-1 rounded-full surface border border-token">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              onClick={item.onClick}
              data-testid={`nav-${item.id}`}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm ${
                item.isActive
                  ? "bg-brand text-brand-fg shadow-glow font-bold"
                  : "hover:bg-black/5 dark:hover:bg-white/5 text-current muted hover:text-current"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            aria-label="Toggle theme"
            data-testid="theme-toggle-btn"
            onClick={toggle}
            className="h-10 w-10 rounded-full border border-token surface flex items-center justify-center transition-all duration-200 hover:border-brand/50 hover:text-brand"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-700" />}
          </button>

          <button
            aria-label="Open cart"
            data-testid="cart-open-btn"
            onClick={() => setOpen(true)}
            className="relative h-10 w-10 rounded-full border border-token surface flex items-center justify-center transition-all duration-200 hover:border-brand/50 hover:text-brand"
          >
            <ShoppingBag size={17} />
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-brand text-brand-fg text-[10px] font-extrabold flex items-center justify-center shadow-glow animate-pulse-glow"
                data-testid="cart-count"
              >
                {count}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden h-10 w-10 rounded-full border border-token surface flex items-center justify-center transition hover:border-brand/50"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-token surface animate-fade-up">
          <div className="container-x py-3 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                onClick={item.onClick}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition ${
                  item.isActive
                    ? "bg-brand text-brand-fg shadow-glow font-bold"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <span>{item.label}</span>
                <ArrowRight size={16} className="opacity-70" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
