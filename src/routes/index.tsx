import React, { useState } from "react";
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
  Sparkles,
  Wind,
  Sun,
  Eye,
  Layers,
  ChevronDown,
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
import { properties, Property } from "@/lib/properties";
import { SkyCityCanvas } from "@/components/3d/sky-city-canvas";
import { CityHud } from "@/components/3d/city-hud";
import { PropertyHotspotModal } from "@/components/3d/property-hotspot-modal";
import { LenisProvider } from "@/components/site/lenis-provider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AS Realtor — Floating Luxury Sky City Addresses" },
      {
        name: "description",
        content:
          "Experience floating luxury sky cities suspended in clouds. Swaying wind physics, GLSL glass facades, glowing skyway arteries, and curated penthouse addresses.",
      },
      { property: "og:title", content: "AS Realtor — Floating Sky City Addresses" },
      {
        property: "og:description",
        content:
          "Enter a floating luxury city suspended in the clouds. Aerodynamic swaying towers, GLSL reflections, glowing skyways, and verified sky addresses.",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { value: 1240, suffix: "+", label: "Sky Residences Sold" },
  { value: 86, suffix: "", label: "Architectural Towers" },
  { value: 3400, suffix: "+", label: "Sky City Residents" },
  { value: 18, suffix: "", label: "Years in Luxury Real Estate" },
  { value: 12, suffix: "", label: "Floating Platforms" },
  { value: 4.9, suffix: "/5", label: "Resident Satisfaction", decimals: 1 },
];

const techFeatures = [
  {
    icon: Wind,
    title: "Aerodynamic Sway Physics",
    desc: "Towers calculate micro-sway vectors dynamically using height-dependent wave equations.",
  },
  {
    icon: Sparkles,
    title: "GLSL Glass Facades",
    desc: "Custom vertex & fragment shaders project Fresnel environmental sky reflections & sunlight specular highlights.",
  },
  {
    icon: Layers,
    title: "Glowing Traffic Arteries",
    desc: "Continuous light-stream shaders flow across elevated transit rings connecting floating sky sectors.",
  },
  {
    icon: Sun,
    title: "Dynamic Solar Atmosphere",
    desc: "Real-time sky scattering & sun trajectory adjust color warmth as the camera sweeps through the clouds.",
  },
];

const testimonials = [
  {
    quote:
      "Stepping onto the floating sky terrace at Aurelia felt like entering the future. The light-filled glass and serene cloud views are unmatched.",
    name: "Vikramaditya & Sanjana Singhania",
    role: "Penthouse Owners, Aurelia Residences",
  },
  {
    quote:
      "AS Realtor handled our acquisition with absolute military precision. From physical diligence to aerial handover, zero friction.",
    name: "Dr. Ananya Roy",
    role: "Investor, Meridian Business Tower",
  },
];

export function Index() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [dayNightMode, setDayNightMode] = useState<"day" | "night" | "auto">("day");

  return (
    <LenisProvider>
      {({ scrollProgress, scrollToProgress }) => (
        <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
          {/* 1. Fullscreen WebGL 3D Sky City Canvas */}
          <SkyCityCanvas
            scrollProgress={scrollProgress}
            dayNightMode={dayNightMode}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
          />

          {/* 2. Futuristic Real Estate HUD & Controls */}
          <CityHud
            scrollProgress={scrollProgress}
            onJumpToProgress={scrollToProgress}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            dayNightMode={dayNightMode}
            onChangeDayNightMode={setDayNightMode}
          />

          {/* 3. Floating Navigation Desk */}
          <header className="fixed top-0 left-0 right-0 z-30 pointer-events-auto">
            <SiteNav />
          </header>

          {/* 4. Scrollable Multi-Chapter Content Track (Drives Camera Choreography) */}
          <main className="relative z-20 pointer-events-none">
            {/* --- CHAPTER I: CLOUD ARRIVAL (Scroll 0% - 20%) --- */}
            <section className="relative min-h-screen flex flex-col justify-end pb-24 px-6 md:px-16">
              <div className="max-w-3xl pointer-events-auto bg-slate-950/60 p-8 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  AS REALTOR SKY CITY • EDITION III
                </div>
                <h1 className="mt-4 font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
                  Floating Sky Cities Suspended in the Clouds
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-300 font-sans">
                  Step into an architectural masterpiece where swaying glass towers, glowing traffic arteries, and cloud-bound penthouses redefine ultra-luxury living.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => scrollToProgress(0.25)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl transition-all hover:scale-105"
                  >
                    <Eye className="h-4 w-4" />
                    Begin Aerial Tour
                  </button>
                  <button
                    onClick={() => scrollToProgress(1.0)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10"
                  >
                    View Sky Residences
                  </button>
                </div>
              </div>
            </section>

            {/* --- CHAPTER II: WIND PHYSICS & GLASS SHADERS (Scroll 20% - 45%) --- */}
            <section className="relative min-h-screen flex items-center px-6 md:px-16 py-20">
              <div className="max-w-2xl pointer-events-auto bg-slate-950/75 p-8 md:p-12 rounded-3xl border border-amber-500/20 backdrop-blur-2xl shadow-2xl">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                  CHAPTER II • PRECISION ENGINEERING
                </span>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
                  Swaying Wind Physics & GLSL Glass Facades
                </h2>
                <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed">
                  Each sky tower responds organically to high-altitude winds. Custom GLSL shaders render Fresnel sky reflections, metallic sheen, and sun specular flares that adapt dynamically as the camera moves.
                </p>

                {/* Tech Feature Grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {techFeatures.map((feat) => {
                    const Icon = feat.icon;
                    return (
                      <div
                        key={feat.title}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                      >
                        <Icon className="h-5 w-5 text-amber-400" />
                        <div className="mt-2 font-semibold text-sm text-white">{feat.title}</div>
                        <div className="mt-1 text-xs text-slate-400">{feat.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* --- CHAPTER III: GLOWING SKYWAYS & TRAFFIC (Scroll 45% - 70%) --- */}
            <section className="relative min-h-screen flex items-center justify-end px-6 md:px-16 py-20">
              <div className="max-w-2xl pointer-events-auto bg-slate-950/75 p-8 md:p-12 rounded-3xl border border-cyan-500/20 backdrop-blur-2xl shadow-2xl">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  CHAPTER III • SKYWAY INFRASTRUCTURE
                </span>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
                  Glowing Elevated Transit Rings & Skyways
                </h2>
                <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed">
                  Interconnected glowing traffic arteries circulate light streams between residential sectors, commercial sky towers, and private floating helipads.
                </p>

                {/* Stats Counter Bar */}
                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                  {stats.slice(0, 3).map((st) => (
                    <div key={st.label} className="text-center">
                      <div className="font-display text-2xl md:text-3xl font-bold text-amber-300">
                        <Counter value={st.value} suffix={st.suffix} />
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400 font-sans">{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- CHAPTER IV: SUNSET TERRACES & GOLDEN HOUR (Scroll 70% - 85%) --- */}
            <section className="relative min-h-screen flex items-center px-6 md:px-16 py-20">
              <div className="max-w-2xl pointer-events-auto bg-slate-950/80 p-8 md:p-12 rounded-3xl border border-amber-500/30 backdrop-blur-2xl shadow-2xl">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                  CHAPTER IV • SUN-DRENCHED SKY ESTATES
                </span>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
                  Golden Hour Penthouses & Private Sky Pools
                </h2>
                <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed">
                  Watch the sunlight transform from golden hour rays into glowing evening twilight. Every penthouse features floor-to-ceiling glass, private infinity pools, and panoramic horizon vistas.
                </p>

                {/* Testimonial Quote */}
                <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <Quote className="h-6 w-6 text-amber-400/60" />
                  <p className="mt-2 italic text-sm text-amber-100">{testimonials[0].quote}</p>
                  <div className="mt-3 text-xs font-semibold text-amber-300">
                    — {testimonials[0].name}
                  </div>
                  <div className="text-[11px] text-slate-400">{testimonials[0].role}</div>
                </div>
              </div>
            </section>

            {/* --- CHAPTER V: INTERACTIVE SKY TOWER SHOWCASE & CATALOG (Scroll 85% - 100%) --- */}
            <section className="relative min-h-screen py-24 px-6 md:px-16 bg-gradient-to-b from-transparent via-slate-950/90 to-slate-950">
              <div className="max-w-6xl mx-auto pointer-events-auto">
                <div className="text-center max-w-2xl mx-auto">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                    CHAPTER V • SKY RESIDENCES CATALOG
                  </span>
                  <h2 className="mt-2 font-display text-3xl md:text-5xl font-bold text-white">
                    Explore Curated Sky City Towers
                  </h2>
                  <p className="mt-3 text-slate-300 text-sm md:text-base">
                    Click any 3D tower on the canvas above or select from our verified portfolio below to inspect floorplans, amenities, and book a private aerial tour.
                  </p>
                </div>

                {/* Property Card Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((prop) => (
                    <div
                      key={prop.slug}
                      onClick={() => setSelectedProperty(prop)}
                      className="cursor-pointer transition-transform hover:-translate-y-2"
                    >
                      <PropertyCard property={prop} />
                    </div>
                  ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto rounded-3xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl">
                  <h3 className="font-display text-2xl font-bold text-amber-200 text-center">
                    Frequently Asked Questions
                  </h3>
                  <Accordion type="single" collapsible className="mt-6">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm font-semibold text-slate-200">
                        How does wind physics sway affect tower stability?
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-slate-400">
                        Our sky towers utilize aerodynamic tuned mass damper systems. The sway is engineered to absorb wind currents seamlessly while providing complete structural comfort.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm font-semibold text-slate-200">
                        How are private aerial helicopter viewings arranged?
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-slate-400">
                        Select any property card or 3D pin, click "Book Private Sky Viewing", and our sky concierge will dispatch an executive transport for your tour.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              {/* Site Footer */}
              <div className="mt-24 pointer-events-auto">
                <SiteFooter />
              </div>
            </section>
          </main>

          {/* 5. Interactive Property Hotspot Modal */}
          <PropertyHotspotModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        </div>
      )}
    </LenisProvider>
  );
}
