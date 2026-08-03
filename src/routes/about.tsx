import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal, Counter } from "@/components/site/motion";
import interior from "@/assets/interior.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AS Realtor | Luxury Real Estate Advisory" },
      {
        name: "description",
        content:
          "Eighteen years advising families, investors and enterprises on premium property across twelve Indian cities. Your Dream. Our Pride.",
      },
      { property: "og:title", content: "About AS Realtor" },
      {
        property: "og:description",
        content: "Eighteen years of transparent, advisory-led luxury real estate.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const timeline = [
  { year: "2008", title: "The first key", copy: "AS Realtor opens a single-desk office in Gurugram with three residential mandates." },
  { year: "2013", title: "Advisory practice", copy: "In-house legal and valuation desks established after the hundredth closing." },
  { year: "2017", title: "Commercial arm", copy: "Grade A office leasing launched with anchor mandates in Mumbai and Pune." },
  { year: "2021", title: "NRI division", copy: "Remote acquisition and asset management for clients across nine countries." },
  { year: "2026", title: "Twelve cities", copy: "1,240+ homes handed over, and a referral rate we're quietly proud of." },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-40 pb-20">
          <Reveal>
            <p className="eyebrow">About AS Realtor</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.05] sm:text-7xl">
              We advise first. <span className="italic text-gold-gradient">Selling follows.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-loose text-muted-foreground">
              AS Realtor was founded on a simple discomfort — that buying the most significant
              asset of your life often felt like being pushed. We built the opposite: a practice
              where diligence is shown before price, where every number is written down, and
              where the relationship outlives the transaction.
            </p>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border">
              <img
                src={interior}
                alt="Luxury interior representing AS Realtor's portfolio standard"
                loading="lazy"
                width={1400}
                height={1000}
                className="size-full object-cover"
              />
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-28">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { v: 1240, s: "+", l: "Homes handed over" },
              { v: 12, s: "", l: "Cities served" },
              { v: 18, s: "", l: "Years in practice" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 120}>
                <div className="glass-panel rounded-3xl p-10 text-center">
                  <p className="font-display text-5xl text-gold-gradient">
                    <Counter to={s.v} suffix={s.s} />
                  </p>
                  <p className="mt-3 text-[0.62rem] tracking-[0.22em] text-muted-foreground uppercase">
                    {s.l}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-[var(--charcoal)]/40">
          <div className="mx-auto max-w-6xl px-6 py-32">
            <Reveal>
              <p className="eyebrow">Our Story</p>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">
                Eighteen years, <span className="italic text-gold-gradient">one standard</span>
              </h2>
            </Reveal>

            <ol className="mt-16 space-y-px overflow-hidden rounded-3xl border border-border bg-border">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={i * 90}>
                  <li className="grid gap-6 bg-card p-10 transition-colors duration-700 hover:bg-accent sm:grid-cols-[140px_1fr]">
                    <span className="font-display text-3xl text-gold-gradient">{t.year}</span>
                    <div>
                      <h3 className="font-display text-2xl">{t.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.copy}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
