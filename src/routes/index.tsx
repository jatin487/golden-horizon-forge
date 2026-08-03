import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Handshake,
  FileCheck2,
  Scale,
  UserRoundCheck,
  Clock,
  Quote,
  ArrowUpRight,
  Building2,
  Home,
  Landmark,
  TreePine,
  KeyRound,
  LineChart,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { PropertyCard } from "@/components/site/property-card";
import { Reveal, Counter } from "@/components/site/motion";
import { properties } from "@/lib/properties";
import heroVilla from "@/assets/hero-villa.jpg";
import interior from "@/assets/interior.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AS Realtor — Luxury Real Estate | Your Dream. Our Pride." },
      {
        name: "description",
        content:
          "Discover premium villas, penthouses and commercial addresses with AS Realtor. Transparent deals, verified properties, expert guidance.",
      },
      { property: "og:title", content: "AS Realtor — Luxury Real Estate" },
      {
        property: "og:description",
        content:
          "Premium villas, penthouses and commercial addresses, curated with transparency and expertise.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "AS Realtor",
          slogan: "Your Dream. Our Pride.",
          telephone: "+91 90000 00000",
          email: "hello@asrealtor.com",
          areaServed: ["Gurugram", "Mumbai", "Pune", "Hyderabad", "Chennai"],
        }),
      },
    ],
  }),
  component: Index,
});

const stats = [
  { value: 1240, suffix: "+", label: "Properties Sold" },
  { value: 86, suffix: "", label: "Projects Delivered" },
  { value: 3400, suffix: "+", label: "Happy Clients" },
  { value: 18, suffix: "", label: "Years of Experience" },
  { value: 12, suffix: "", label: "Cities Served" },
  { value: 4.9, suffix: "/5", label: "Client Satisfaction", decimals: 1 },
];

const services = [
  { icon: Home, title: "Luxury Villas & Farmhouses", copy: "Private estates with signature architecture and land parity." },
  { icon: Building2, title: "Residential Apartments", copy: "Curated inventory across India's most sought-after towers." },
  { icon: Landmark, title: "Commercial & Office", copy: "Grade A leasing and outright purchase with yield modelling." },
  { icon: LineChart, title: "Investment Advisory", copy: "ROI forecasting, exit planning and portfolio diversification." },
  { icon: Scale, title: "Legal & Documentation", copy: "Title diligence, registration and end-to-end paperwork." },
  { icon: KeyRound, title: "NRI & Property Management", copy: "Remote acquisition, tenanting and asset upkeep." },
  { icon: TreePine, title: "Plots & Land Banking", copy: "Verified layouts with long horizon appreciation potential." },
  { icon: Handshake, title: "Home Loans & Valuation", copy: "Bank tie-ups, sanction support and fair-market valuation." },
];

const whyUs = [
  { icon: ShieldCheck, title: "Verified Properties", copy: "Every listing is title-checked and physically inspected before it reaches you." },
  { icon: UserRoundCheck, title: "Dedicated Manager", copy: "One relationship manager from first viewing to final handover." },
  { icon: FileCheck2, title: "Fast Documentation", copy: "In-house legal desk closes paperwork in a fraction of the usual time." },
  { icon: Scale, title: "Transparent Deals", copy: "Published pricing, no hidden brokerage, written commitments." },
  { icon: LineChart, title: "Investment Advisory", copy: "Data-backed guidance on yield, appreciation and exit windows." },
  { icon: Clock, title: "24×7 Assistance", copy: "A concierge line that answers, whichever timezone you're calling from." },
];

const testimonials = [
  {
    quote:
      "They understood the brief in one conversation and showed us four homes — we bought the third. Zero pressure, complete clarity on paperwork.",
    name: "Rohan & Meera Kapoor",
    detail: "Villa buyers · Lonavala",
  },
  {
    quote:
      "As an NRI, trust was everything. AS Realtor handled diligence, registration and tenanting while I was in Singapore.",
    name: "Anil Srinivasan",
    detail: "Investor · BKC, Mumbai",
  },
  {
    quote:
      "The yield model they built for our office floor was more thorough than what our consultants produced. Genuinely advisory.",
    name: "Priya Nambiar",
    detail: "Director, Northline Ventures",
  },
];

const faqs = [
  {
    q: "How does the buying process work with AS Realtor?",
    a: "We begin with a private consultation to map your requirement and budget, shortlist three to five verified options, arrange site visits, and then manage negotiation, documentation and registration through our in-house legal desk.",
  },
  {
    q: "Do you assist with home loans?",
    a: "Yes. We work with leading banks and NBFCs, help you compare sanction terms, and coordinate documentation until disbursal.",
  },
  {
    q: "How are properties verified?",
    a: "Each property passes a title search, encumbrance check, approval review and physical site inspection before it is listed with us.",
  },
  {
    q: "What are the typical registration costs and taxes?",
    a: "Stamp duty and registration vary by state, generally between 5% and 8% of consideration value. We share a written cost sheet before you commit.",
  },
  {
    q: "Can you arrange site visits for outstation or NRI clients?",
    a: "We host guided video walkthroughs, share drone footage and documentation packs, and can represent you under authorisation for site inspections.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main>
        {/* HERO */}
        <section className="relative flex min-h-screen items-end overflow-hidden">
          <img
            src={heroVilla}
            alt="Luxury cliffside villa with infinity pool at golden hour"
            width={1920}
            height={1280}
            fetchPriority="high"
            className="animate-slow-zoom absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-[var(--gradient-veil)]" />

          <div className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-40">
            <p className="eyebrow animate-lux-rise">Your Dream. Our Pride.</p>
            <h1 className="animate-lux-rise mt-6 max-w-4xl font-display text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
              Find your dream property
              <span className="block text-gold-gradient italic">with confidence</span>
            </h1>
            <p className="animate-lux-rise mt-8 max-w-xl text-base leading-relaxed text-muted-foreground [animation-delay:200ms]">
              Helping families, investors and businesses discover premium real estate
              opportunities through transparency, expertise and deeply personal service.
            </p>

            <div className="animate-lux-rise mt-10 flex flex-wrap gap-3 [animation-delay:320ms]">
              <Link
                to="/properties"
                className="rounded-full bg-primary px-8 py-3.5 text-[0.7rem] tracking-[0.24em] text-primary-foreground uppercase transition-opacity duration-300 hover:opacity-90"
              >
                Explore Properties
              </Link>
              <Link
                to="/contact"
                className="glass-panel rounded-full px-8 py-3.5 text-[0.7rem] tracking-[0.24em] uppercase transition-colors duration-300 hover:text-primary"
              >
                Book Consultation
              </Link>
              <a
                href="tel:+919000000000"
                className="rounded-full border border-border px-8 py-3.5 text-[0.7rem] tracking-[0.24em] uppercase transition-colors duration-300 hover:border-primary hover:text-primary"
              >
                Call Now
              </a>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="relative z-10 -mt-16 px-6">
          <Reveal className="mx-auto max-w-6xl">
            <div className="glass-panel grid grid-cols-2 gap-y-10 rounded-3xl px-8 py-12 md:grid-cols-3 lg:grid-cols-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-4xl text-gold-gradient">
                    <Counter to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </p>
                  <p className="mt-2 text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* PROPERTIES */}
        <section className="mx-auto max-w-6xl px-6 py-32">
          <Reveal>
            <p className="eyebrow">Signature Portfolio</p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-xl font-display text-4xl leading-tight sm:text-6xl">
                Addresses worth <span className="italic text-gold-gradient">arriving at</span>
              </h2>
              <Link
                to="/properties"
                className="group flex items-center gap-2 text-[0.7rem] tracking-[0.24em] uppercase text-muted-foreground transition-colors hover:text-primary"
              >
                View all listings
                <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ABOUT STRIP */}
        <section className="border-y border-border bg-[var(--charcoal)]/40">
          <div className="mx-auto grid max-w-6xl gap-16 px-6 py-32 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-border">
                <img
                  src={interior}
                  alt="Opulent modern living room with marble and champagne gold accents"
                  loading="lazy"
                  width={1400}
                  height={1000}
                  className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-lux)] hover:scale-105"
                />
              </div>
            </Reveal>
            <Reveal delay={140}>
              <p className="eyebrow">The House of AS Realtor</p>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
                Eighteen years spent earning one word — <span className="italic text-gold-gradient">trust</span>
              </h2>
              <p className="mt-7 text-sm leading-loose text-muted-foreground">
                AS Realtor began with a single conviction: that buying a home should feel like
                being advised, not sold to. Today we represent developers and private owners
                across twelve cities, and we still measure ourselves by the same standard —
                the number of clients who return, and the number who send their families to us.
              </p>
              <dl className="mt-10 grid gap-8 sm:grid-cols-3">
                {[
                  { t: "Mission", d: "Make premium property ownership transparent and effortless." },
                  { t: "Vision", d: "India's most trusted name in luxury real estate advisory." },
                  { t: "Values", d: "Candour, diligence and lifelong client relationships." },
                ].map((v) => (
                  <div key={v.t}>
                    <dt className="eyebrow">{v.t}</dt>
                    <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.d}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* SERVICES */}
        <section className="mx-auto max-w-6xl px-6 py-32">
          <Reveal>
            <p className="eyebrow">Full-Service Advisory</p>
            <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
              Everything between the first viewing and the <span className="italic text-gold-gradient">keys</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 100}>
                <div className="lift-card glass-panel h-full rounded-3xl p-7">
                  <s.icon className="size-6 text-primary" strokeWidth={1.2} />
                  <h3 className="mt-6 font-display text-xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="border-y border-border bg-[var(--charcoal)]/40">
          <div className="mx-auto max-w-6xl px-6 py-32">
            <Reveal>
              <p className="eyebrow">Why Choose Us</p>
              <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
                Six reasons clients stay <span className="italic text-gold-gradient">for decades</span>
              </h2>
            </Reveal>

            <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {whyUs.map((w, i) => (
                <Reveal key={w.title} delay={(i % 3) * 110}>
                  <div className="group h-full bg-card p-10 transition-colors duration-700 hover:bg-accent">
                    <div className="animate-float-soft w-fit rounded-2xl border border-border p-3.5 transition-colors duration-500 group-hover:border-primary">
                      <w.icon className="size-5 text-primary" strokeWidth={1.2} />
                    </div>
                    <h3 className="mt-7 font-display text-2xl">{w.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mx-auto max-w-6xl px-6 py-32">
          <Reveal>
            <p className="eyebrow">Client Voices</p>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">
              Rated <span className="text-gold-gradient">4.9</span> across 3,400+ families
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <figure className="lift-card h-full rounded-3xl border border-border bg-card p-9">
                  <Quote className="size-7 text-primary" strokeWidth={1} />
                  <blockquote className="mt-6 font-display text-xl leading-relaxed italic">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-8">
                    <p className="text-sm">{t.name}</p>
                    <p className="mt-1 text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                      {t.detail}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-[var(--charcoal)]/40">
          <div className="mx-auto grid max-w-6xl gap-16 px-6 py-32 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <p className="eyebrow">Questions</p>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
                Clarity, <span className="italic text-gold-gradient">before</span> commitment
              </h2>
              <p className="mt-6 text-sm leading-loose text-muted-foreground">
                Anything unanswered? Our advisors respond within one business hour.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
                    <AccordionTrigger className="text-left font-display text-xl hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-loose text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-36 text-center">
            <Reveal>
              <p className="eyebrow">Begin</p>
              <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
                Let's find the address that <span className="italic text-gold-gradient">feels like yours</span>
              </h2>
              <div className="mt-12 flex flex-wrap justify-center gap-3">
                <Link
                  to="/contact"
                  className="rounded-full bg-primary px-9 py-4 text-[0.7rem] tracking-[0.24em] text-primary-foreground uppercase transition-opacity duration-300 hover:opacity-90"
                >
                  Book a Consultation
                </Link>
                <a
                  href="https://wa.me/919000000000"
                  className="glass-panel rounded-full px-9 py-4 text-[0.7rem] tracking-[0.24em] uppercase transition-colors duration-300 hover:text-primary"
                >
                  WhatsApp Enquiry
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
