import React, { useState } from "react";
import { X, MapPin, Bed, Bath, Maximize2, ShieldCheck, Calendar, Phone, CheckCircle2 } from "lucide-react";
import { Property } from "@/lib/properties";

interface PropertyHotspotModalProps {
  property: Property | null;
  onClose: () => void;
}

export const PropertyHotspotModal: React.FC<PropertyHotspotModalProps> = ({
  property,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "" });

  if (!property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-900/90 shadow-2xl text-slate-100 backdrop-blur-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Key Badge */}
          <div className="relative h-56 md:h-full min-h-[240px]">
            <img
              src={property.image}
              alt={property.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md border border-amber-500/30">
                {property.status} • {property.type}
              </span>
              <h3 className="mt-1 font-display text-xl font-bold text-white drop-shadow">
                {property.name}
              </h3>
              <p className="flex items-center gap-1 text-xs text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                {property.location}
              </p>
            </div>
          </div>

          {/* Details & Action Form */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="text-xl font-bold text-amber-300 font-display">
                {property.price}
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/5 p-3 text-center text-xs">
                <div>
                  <div className="flex items-center justify-center gap-1 text-slate-400">
                    <Maximize2 className="h-3.5 w-3.5" />
                    Area
                  </div>
                  <div className="mt-1 font-semibold text-white">{property.area}</div>
                </div>
                {property.beds > 0 && (
                  <div>
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <Bed className="h-3.5 w-3.5" />
                      Beds
                    </div>
                    <div className="mt-1 font-semibold text-white">{property.beds} BHK</div>
                  </div>
                )}
                {property.baths > 0 && (
                  <div>
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <Bath className="h-3.5 w-3.5" />
                      Baths
                    </div>
                    <div className="mt-1 font-semibold text-white">{property.baths}</div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="mt-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Sky Tower Highlights
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {property.amenities.map((am) => (
                    <span
                      key={am}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-200 border border-amber-500/20"
                    >
                      <ShieldCheck className="h-3 w-3 text-amber-400" />
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Aerial Tour Inquiry Form */}
            <div className="mt-6 border-t border-white/10 pt-4">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-4 text-center text-emerald-400">
                  <CheckCircle2 className="h-10 w-10 mb-2 animate-bounce" />
                  <div className="font-semibold text-sm">Aerial Tour Scheduled!</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Our luxury sky advisor will confirm your private viewing shortly.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="text-xs font-semibold text-amber-200">
                    Book Private Sky Helicopter Viewing
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl bg-slate-950/70 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl bg-slate-950/70 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full rounded-xl bg-slate-950/70 border border-white/10 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-semibold text-slate-950 transition-all hover:from-amber-400 hover:to-amber-500 shadow-lg"
                  >
                    Confirm Private Sky Viewing
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
