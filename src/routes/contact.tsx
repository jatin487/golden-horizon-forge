import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/motion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AS Realtor | Book a Private Consultation" },
      {
        name: "description",
        content:
          "Speak with an AS Realtor advisor. Book a site visit, request a callback or send a WhatsApp enquiry — response within one business hour.",
      },
      { property: "og:title", content: "Contact AS Realtor" },
      {
        property: "og:description",
        content: "Book a private consultation or site visit with an AS Realtor advisor.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const details = [
  { icon: Phone, label: "Call", value: "+91 90000 00000", href: "tel:+919000000000" },
  { icon: MessageCircle, label: "WhatsApp", value: "Message an advisor", href: "https://wa.me/919000000000" },
  { icon: Mail, label: "Email", value: "hello@asrealtor.com", href: "mailto:hello@asrealtor.com" },
  { icon: MapPin, label: "Private Office", value: "Level 12, The Estate House, Golf Course Road, Gurugram" },
  { icon: Clock, label: "Hours", value: "Mon – Sat · 9:30 AM – 8:00 PM" },
];

function ContactPage() {
  const [sending, setSending] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Toaster />

      <main className="mx-auto max-w-6xl px-6 pt-40 pb-32">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-tight sm:text-7xl">
            Begin with a <span className="italic text-gold-gradient">conversation</span>
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="space-y-px overflow-hidden rounded-3xl border border-border bg-border">
              {details.map((d) => {
                const Inner = (
                  <div className="flex items-start gap-5 bg-card p-7 transition-colors duration-500 hover:bg-accent">
                    <d.icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.2} />
                    <div>
                      <p className="eyebrow">{d.label}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{d.value}</p>
                    </div>
                  </div>
                );
                return d.href ? (
                  <a key={d.label} href={d.href} className="block">
                    {Inner}
                  </a>
                ) : (
                  <div key={d.label}>{Inner}</div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSending(true);
                setTimeout(() => {
                  setSending(false);
                  (e.target as HTMLFormElement).reset();
                  toast.success("Enquiry received", {
                    description: "An advisor will reach out within one business hour.",
                  });
                }, 700);
              }}
              className="glass-panel rounded-3xl p-9"
            >
              <h2 className="font-display text-3xl">Book a consultation</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Share a few details and we'll shortlist options before we call.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" name="name" placeholder="Your name" required />
                <Field label="Phone" name="phone" type="tel" placeholder="+91" required />
                <Field label="Email" name="email" type="email" placeholder="you@email.com" />
                <Field label="Preferred city" name="city" placeholder="Gurugram" />
              </div>

              <div className="mt-5">
                <label className="eyebrow" htmlFor="message">
                  Requirement
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Budget, configuration, possession timeline…"
                  className="mt-3 w-full rounded-2xl border border-input bg-background/40 px-4 py-3 text-sm outline-none transition-colors duration-300 placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="mt-8 w-full rounded-full bg-primary px-8 py-4 text-[0.7rem] tracking-[0.24em] text-primary-foreground uppercase transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Sending…" : "Request Callback"}
              </button>
            </form>
          </Reveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="eyebrow" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-3 w-full rounded-full border border-input bg-background/40 px-5 py-3 text-sm outline-none transition-colors duration-300 placeholder:text-muted-foreground focus:border-primary"
      />
    </div>
  );
}
