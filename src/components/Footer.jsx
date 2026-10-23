import React from "react";
import { Link } from "react-router-dom";
import { Mail, ShieldCheck, Truck } from "lucide-react";

const LOGO_URL = "https://customer-assets-agu9un31.emergentagent.net/job_tsd-electronics-mvp/artifacts/mg0oqn79_WhatsApp%20Image%202026-07-28%20at%2010.15.58%20PM.jpeg";

function AmazonLogo({ className = "h-5 w-auto" }) {
  return (
    <svg
      viewBox="0 0 95 30"
      width="82"
      height="24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Amazon"
    >
      <text
        x="0"
        y="19"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="21"
        fill="#111827"
        letterSpacing="-0.8"
      >
        amazon
      </text>
      <path
        d="M10 24 C 30 30, 56 29, 68 22"
        stroke="#FF9900"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M64 19 L71 22.5 L67 26.5 Z"
        fill="#FF9900"
      />
    </svg>
  );
}

function FlipkartLogo({ className = "h-5 w-auto" }) {
  return (
    <svg
      viewBox="0 0 105 30"
      width="90"
      height="24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Flipkart"
    >
      <text
        x="0"
        y="20"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontStyle="italic"
        fontWeight="900"
        fontSize="19"
        fill="#2874F0"
        letterSpacing="-0.5"
      >
        Flipkart
      </text>
      <g transform="translate(76, 2)">
        <rect x="2" y="5" width="18" height="19" rx="3" fill="#FFE11B" />
        <path
          d="M6.5 5 V3 C6.5 1.5 8 0.5 11 0.5 C14 0.5 15.5 1.5 15.5 3 V5"
          stroke="#2874F0"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M7 14 C 9 17.5, 13 17.5, 15 14"
          stroke="#2874F0"
          strokeWidth="1.8"
          fill="none"
        />
      </g>
    </svg>
  );
}

function JioMartLogo({ className = "h-5 w-auto" }) {
  return (
    <svg
      viewBox="0 0 100 30"
      width="85"
      height="24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="JioMart"
    >
      <circle cx="13" cy="15" r="11" fill="#0078AD" />
      <text
        x="13"
        y="19"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="11"
        fill="#FFFFFF"
      >
        Jio
      </text>
      <text
        x="28"
        y="21"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="19"
        fill="#0078AD"
        letterSpacing="-0.5"
      >
        mart
      </text>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-token surface-subtle">
      <div className="container-x py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl overflow-hidden bg-white p-1 border border-token shadow-card">
              <img src={LOGO_URL} alt="TSD World" className="h-full w-full object-contain" />
            </span>
            <span className="font-display font-extrabold text-xl tracking-tight">
              TSD<span className="text-brand">.</span>World
            </span>
          </div>
          <p className="mt-4 muted max-w-md text-sm leading-relaxed">
            Sound. Signal. Style. Engineered audio & personal electronics designed with uncompromising fidelity.
            <br />
            <strong className="text-foreground/80">The World of Trust, Service and Durability.</strong>
          </p>
          <div className="mt-6">
            <div className="label-caps muted mb-2 text-[10px]">Official Retail Platforms</div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href="https://www.amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="platform-amazon"
                className="h-10 px-3.5 sm:px-4 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center hover:border-brand hover:scale-105 transition-all duration-200"
                title="Amazon"
              >
                <AmazonLogo className="h-4 sm:h-5 w-auto" />
              </a>
              <a
                href="https://www.flipkart.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="platform-flipkart"
                className="h-10 px-3.5 sm:px-4 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center hover:border-brand hover:scale-105 transition-all duration-200"
                title="Flipkart"
              >
                <FlipkartLogo className="h-4 sm:h-5 w-auto" />
              </a>
              <a
                href="https://www.jiomart.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="platform-jiomart"
                className="h-10 px-3.5 sm:px-4 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center hover:border-brand hover:scale-105 transition-all duration-200"
                title="JioMart"
              >
                <JioMartLogo className="h-4 sm:h-5 w-auto" />
              </a>
            </div>
          </div>
        </div>

        <div>
          <div className="label-caps muted mb-3 sm:mb-4">Explore Audio</div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/shop" className="muted hover:text-brand transition">TWS Earbuds</Link>
            </li>
            <li>
              <Link to="/shop" className="muted hover:text-brand transition">Wired Earphones</Link>
            </li>
            <li>
              <Link to="/shop" className="muted hover:text-brand transition">Fast Charging Cables</Link>
            </li>
            <li>
              <Link to="/shop" className="muted hover:text-brand transition">Power Adapters</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="label-caps muted mb-3 sm:mb-4">Direct Contact</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5" data-testid="footer-email">
              <Mail size={15} className="text-brand shrink-0" />
              <a href="mailto:support@tsdworld.in" className="muted hover:text-brand transition text-xs sm:text-sm truncate">
                support@tsdworld.in
              </a>
            </li>
            <li className="flex items-center gap-2 text-xs muted">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span>1-Year National Warranty</span>
            </li>
            <li className="flex items-center gap-2 text-xs muted">
              <Truck size={14} className="text-sky-500 shrink-0" />
              <span>Pan-India Express Dispatch</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x py-5 sm:py-6 border-t border-token flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs muted">
        <span>© {new Date().getFullYear()} TSD World™. Engineered in Karnataka, India.</span>
        <span>Sound · Signal · Style</span>
      </div>
    </footer>
  );
}
