import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Facebook } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[var(--charcoal)]/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-14 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl tracking-[0.24em] text-gold-gradient">AS</span>
              <span className="text-[0.62rem] tracking-[0.4em] text-muted-foreground uppercase">
                Realtor
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your Dream. Our Pride. Curating India's most considered addresses for families,
              investors and enterprises.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social profile"
                  className="rounded-full border border-border p-2.5 transition-colors duration-300 hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="eyebrow">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/properties" className="hover:text-foreground">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">Services</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>Luxury Villas</li>
              <li>Commercial Leasing</li>
              <li>Investment Advisory</li>
              <li>NRI Services</li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">Private Office</h3>
            <address className="mt-5 space-y-3 text-sm not-italic text-muted-foreground">
              <p>Level 12, The Estate House, Golf Course Road, Gurugram 122002</p>
              <p>
                <a href="tel:+919000000000" className="hover:text-foreground">
                  +91 90000 00000
                </a>
              </p>
              <p>
                <a href="mailto:hello@asrealtor.com" className="hover:text-foreground">
                  hello@asrealtor.com
                </a>
              </p>
              <p>Mon – Sat · 9:30 AM – 8:00 PM</p>
            </address>
          </div>
        </div>

        <div className="hairline mt-16" />
        <div className="mt-6 flex flex-col gap-3 text-xs tracking-widest text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AS Realtor. All rights reserved.</p>
          <p>Privacy Policy · Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
