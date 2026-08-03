import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { PropertyCard } from "@/components/site/property-card";
import { Reveal } from "@/components/site/motion";
import { properties } from "@/lib/properties";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Luxury Properties for Sale | AS Realtor" },
      {
        name: "description",
        content:
          "Browse verified luxury villas, penthouses, apartments and commercial spaces across twelve Indian cities with AS Realtor.",
      },
      { property: "og:title", content: "Luxury Properties for Sale | AS Realtor" },
      {
        property: "og:description",
        content: "Verified villas, penthouses and commercial addresses across twelve cities.",
      },
      { property: "og:url", content: "/properties" },
    ],
    links: [{ rel: "canonical", href: "/properties" }],
  }),
  component: PropertiesPage,
});

const types = ["All", "Villa", "Penthouse", "Apartment", "Commercial"] as const;
const statuses = ["All", "Ready to Move", "Under Construction", "New Launch"] as const;

function PropertiesPage() {
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");

  const filtered = useMemo(
    () =>
      properties.filter(
        (p) => (type === "All" || p.type === type) && (status === "All" || p.status === status),
      ),
    [type, status],
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="mx-auto max-w-6xl px-6 pt-40 pb-32">
        <Reveal>
          <p className="eyebrow">The Collection</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-tight sm:text-7xl">
            Every listing, <span className="italic text-gold-gradient">verified by hand</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-loose text-muted-foreground">
            Title-checked, site-inspected and priced in writing. Filter by what matters to you.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="glass-panel mt-12 rounded-3xl p-7">
            <div className="space-y-6">
              <FilterRow label="Property Type" options={types} value={type} onChange={setType} />
              <FilterRow label="Possession" options={statuses} value={status} onChange={setStatus} />
            </div>
          </div>
        </Reveal>

        <p className="mt-10 text-[0.65rem] tracking-[0.24em] text-muted-foreground uppercase">
          {filtered.length} {filtered.length === 1 ? "residence" : "residences"} available
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 110}>
              <PropertyCard property={p} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            No residences match this combination. Try widening your filters.
          </p>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="eyebrow mr-2 w-32 shrink-0">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full border px-5 py-2 text-[0.66rem] tracking-[0.18em] uppercase transition-all duration-500",
            value === o
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
