import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

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
    <footer className="mt-14 sm:mt-24 border-t border-token">
      <div className="container-x py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl overflow-hidden bg-white">
              <img src={LOGO_URL} alt="TSD World" className="h-full w-full object-contain scale-110" />
            </span>
            <span className="font-display font-black text-xl">TSD<span className="text-brand">.</span>World</span>
          </div>
          <p className="mt-4 muted max-w-md text-sm leading-relaxed">
            Sound. Signal. Style. Premium audio & personal tech engineered in India — for the ones who move loud and live louder.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <a
              href="https://www.amazon.in"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="platform-amazon"
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center hover:border-brand/60 hover:shadow-md hover:scale-105 transition-all duration-200"
              title="Amazon"
            >
              <AmazonLogo className="h-4 sm:h-5 w-auto" />
            </a>
            <a
              href="https://www.flipkart.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="platform-flipkart"
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center hover:border-brand/60 hover:shadow-md hover:scale-105 transition-all duration-200"
              title="Flipkart"
            >
              <FlipkartLogo className="h-4 sm:h-5 w-auto" />
            </a>
            <a
              href="https://www.jiomart.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="platform-jiomart"
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center hover:border-brand/60 hover:shadow-md hover:scale-105 transition-all duration-200"
              title="JioMart"
            >
              <JioMartLogo className="h-4 sm:h-5 w-auto" />
            </a>
          </div>
        </div>

        <div>
          <div className="label-caps muted mb-3 sm:mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            <li className="muted hover:text-brand transition cursor-pointer">Earbuds</li>
            <li className="muted hover:text-brand transition cursor-pointer">Headphones</li>
            <li className="muted hover:text-brand transition cursor-pointer">Speakers</li>
            <li className="muted hover:text-brand transition cursor-pointer">Smartwatches</li>
          </ul>
        </div>

        <div>
          <div className="label-caps muted mb-3 sm:mb-4">Contact</div>
          <ul className="space-y-2.5 sm:space-y-3 text-sm">
            <li className="flex items-start gap-2.5" data-testid="footer-address">
              <MapPin size={14} className="text-brand mt-1 shrink-0" />
              <span className="muted leading-relaxed text-xs sm:text-sm">
                Near Huded Mahalaxmi temple,<br />Ilkal, Karnataka 587125
              </span>
            </li>
            <li className="flex items-center gap-2.5" data-testid="footer-email">
              <Mail size={14} className="text-brand shrink-0" />
              <a href="mailto:info@tsdworld.in" className="muted hover:text-brand transition text-xs sm:text-sm truncate">info@tsdworld.in</a>
            </li>
            <li className="flex items-center gap-2.5" data-testid="footer-phone">
              <Phone size={14} className="text-brand shrink-0" />
              <a href="tel:+918660145698" className="muted hover:text-brand transition text-xs sm:text-sm truncate">+91 8660145698</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x py-5 sm:py-6 border-t border-token flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs muted">
        <span>© {new Date().getFullYear()} TSD World™. Made in India.</span>
        <span className="font-mono">v0.1 · MVP</span>
      </div>
    </footer>
  );
}
