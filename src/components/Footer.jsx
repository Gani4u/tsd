import React from "react";
import { Instagram, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react";

const LOGO_URL = "https://customer-assets-agu9un31.emergentagent.net/job_tsd-electronics-mvp/artifacts/mg0oqn79_WhatsApp%20Image%202026-07-28%20at%2010.15.58%20PM.jpeg";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-token">
      <div className="container-x py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl overflow-hidden bg-white">
              <img src={LOGO_URL} alt="TSD World" className="h-full w-full object-contain scale-110" />
            </span>
            <span className="font-display font-black text-xl">TSD<span className="text-brand">.</span>World</span>
          </div>
          <p className="mt-4 muted max-w-md">
            Sound. Signal. Style. Premium audio & personal tech engineered in India — for the ones who move loud and live louder.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" data-testid="social-instagram" className="h-10 w-10 rounded-full border border-token flex items-center justify-center hover:border-brand hover:text-brand transition"><Instagram size={16} /></a>
            <a href="#" data-testid="social-twitter" className="h-10 w-10 rounded-full border border-token flex items-center justify-center hover:border-brand hover:text-brand transition"><Twitter size={16} /></a>
            <a href="#" data-testid="social-youtube" className="h-10 w-10 rounded-full border border-token flex items-center justify-center hover:border-brand hover:text-brand transition"><Youtube size={16} /></a>
          </div>
        </div>

        <div>
          <div className="label-caps muted mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            <li>Earbuds</li>
            <li>Headphones</li>
            <li>Speakers</li>
            <li>Smartwatches</li>
          </ul>
        </div>

        <div>
          <div className="label-caps muted mb-4">Contact</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5" data-testid="footer-address">
              <MapPin size={14} className="text-brand mt-0.5 shrink-0" />
              <span className="muted leading-relaxed">
                Near Huded Mahalaxmi temple,<br />Ilkal, Karnataka 587125
              </span>
            </li>
            <li className="flex items-center gap-2.5" data-testid="footer-email">
              <Mail size={14} className="text-brand shrink-0" />
              <a href="mailto:info@tsdworld.in" className="muted hover:text-brand transition">info@tsdworld.in</a>
            </li>
            <li className="flex items-center gap-2.5" data-testid="footer-phone">
              <Phone size={14} className="text-brand shrink-0" />
              <a href="tel:+918660145698" className="muted hover:text-brand transition">+91 8660145698</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x py-6 border-t border-token flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs muted">
        <span>© {new Date().getFullYear()} TSD World™. Made in India.</span>
        <span className="font-mono">v0.1 · MVP</span>
      </div>
    </footer>
  );
}
