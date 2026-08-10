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
    <header className="sticky top-0 z-40 glass-header">
      <div className="container-x flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          data-testid="logo-link"
          onClick={() => {
            setMobileMenuOpen(false);
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl overflow-hidden bg-white shadow-glow">
            <img src={LOGO_URL} alt="TSD World" className="h-full w-full object-contain scale-110" />
          </span>
          <span className="font-display font-black text-xl tracking-tight">
            TSD<span className="text-brand">.</span>World
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              onClick={item.onClick}
              data-testid={`nav-${item.id}`}
              className={`px-4 py-2 rounded-full transition font-semibold ${
                item.isActive
                  ? "bg-brand text-white shadow-glow"
                  : "hover:bg-black/5 dark:hover:bg-white/5 text-current"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            data-testid="theme-toggle-btn"
            onClick={toggle}
            className="h-10 w-10 rounded-full border border-token flex items-center justify-center transition hover:bg-black/5 dark:hover:bg-white/5"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            aria-label="Open cart"
            data-testid="cart-open-btn"
            onClick={() => setOpen(true)}
            className="relative h-10 w-10 rounded-full border border-token flex items-center justify-center transition hover:bg-black/5 dark:hover:bg-white/5"
          >
            <ShoppingBag size={16} />
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center shadow-glow"
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
            className="md:hidden h-10 w-10 rounded-full border border-token flex items-center justify-center transition hover:bg-black/5 dark:hover:bg-white/5"
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
                    ? "bg-brand text-white shadow-glow"
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
