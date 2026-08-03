import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-700",
          scrolled ? "glass-panel shadow-[var(--shadow-lift)]" : "border border-transparent",
        )}
      >
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-[0.24em] text-gold-gradient">AS</span>
          <span className="text-[0.62rem] tracking-[0.4em] text-muted-foreground uppercase">
            Realtor
          </span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeProps={{ className: "text-primary" }}
                className="relative text-[0.72rem] tracking-[0.22em] text-muted-foreground uppercase transition-colors duration-300 hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="tel:+919000000000"
            className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-[0.68rem] tracking-[0.2em] uppercase transition-colors duration-300 hover:border-primary hover:text-primary sm:inline-flex"
          >
            <Phone className="size-3.5" />
            Call
          </a>
          <Link
            to="/contact"
            className="hidden rounded-full bg-primary px-5 py-2 text-[0.68rem] tracking-[0.2em] text-primary-foreground uppercase transition-opacity duration-300 hover:opacity-90 sm:block"
          >
            Book Consultation
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-border p-2 md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-panel animate-lux-rise mx-auto mt-2 max-w-6xl rounded-3xl p-6 md:hidden">
          <ul className="space-y-4">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block text-sm tracking-[0.22em] uppercase"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-primary px-5 py-3 text-center text-[0.7rem] tracking-[0.2em] text-primary-foreground uppercase"
              >
                Book Consultation
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
