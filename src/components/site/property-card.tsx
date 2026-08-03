import { BedDouble, Bath, Maximize, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Property } from "@/lib/properties";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="lift-card group overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={`${property.name} in ${property.location}`}
          loading="lazy"
          width={1200}
          height={900}
          className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[var(--gradient-veil)] opacity-80" />
        <span className="glass-panel absolute top-4 left-4 rounded-full px-3 py-1.5 text-[0.6rem] tracking-[0.2em] uppercase">
          {property.status}
        </span>
        <span className="absolute bottom-4 left-5 font-display text-2xl text-gold-gradient">
          {property.price}
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-display text-2xl">{property.name}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-3.5 text-primary" />
          {property.location}
        </p>

        <div className="mt-5 flex flex-wrap gap-5 text-xs tracking-wider text-muted-foreground uppercase">
          {property.beds > 0 && (
            <span className="flex items-center gap-2">
              <BedDouble className="size-4 text-primary" />
              {property.beds} Beds
            </span>
          )}
          <span className="flex items-center gap-2">
            <Bath className="size-4 text-primary" />
            {property.baths} Baths
          </span>
          <span className="flex items-center gap-2">
            <Maximize className="size-4 text-primary" />
            {property.area}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {property.amenities.map((a) => (
            <span
              key={a}
              className="rounded-full border border-border px-3 py-1 text-[0.65rem] tracking-wider text-muted-foreground uppercase"
            >
              {a}
            </span>
          ))}
        </div>

        <div className="mt-7 flex items-center gap-3">
          <Link
            to="/contact"
            className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-[0.68rem] tracking-[0.2em] text-primary-foreground uppercase transition-opacity duration-300 hover:opacity-90"
          >
            Book Visit
          </Link>
          <Link
            to="/contact"
            className="flex-1 rounded-full border border-border px-4 py-2.5 text-center text-[0.68rem] tracking-[0.2em] uppercase transition-colors duration-300 hover:border-primary hover:text-primary"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
