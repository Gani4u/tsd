import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, ShoppingBag } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

const LOGO_URL = "https://customer-assets-agu9un31.emergentagent.net/job_tsd-electronics-mvp/artifacts/mg0oqn79_WhatsApp%20Image%202026-07-28%20at%2010.15.58%20PM.jpeg";

export default function Header() {
  const { theme, toggle } = useTheme();
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group" data-testid="logo-link">
          <span className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl overflow-hidden bg-white shadow-glow">
            <img src={LOGO_URL} alt="TSD World" className="h-full w-full object-contain scale-110" />
          </span>
          <span className="font-display font-black text-xl tracking-tight">TSD<span className="text-brand">.</span>World</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {[
            { to: "/", label: "Home" },
            { to: "/shop", label: "Shop" },
            { to: "/shop?featured=1", label: "Featured" },
            { to: "/#contact", label: "Contact" },
          ].map((it) => (
            <NavLink
              key={it.label}
              to={it.to}
              end
              data-testid={`nav-${it.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition ${
                  isActive ? "bg-brand text-white" : "hover:bg-black/5 dark:hover:bg-white/5"
                }`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

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
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center" data-testid="cart-count">
                {count}
              </span>
            )}
          </button>
          <Link to="/admin" className="btn-ghost !py-2 !px-4 text-sm hidden sm:inline-flex" data-testid="admin-link">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
