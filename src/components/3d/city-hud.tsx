import React, { useState } from "react";
import {
  Compass,
  Wind,
  Sun,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronDown,
  Building2,
  MapPin,
  Flame,
} from "lucide-react";
import { getCameraStateAtProgress, CITY_CHAPTERS } from "./camera-choreography";
import { Property, properties } from "@/lib/properties";

interface CityHudProps {
  scrollProgress: number;
  onJumpToProgress: (progress: number) => void;
  onSelectProperty: (property: Property) => void;
}

export const CityHud: React.FC<CityHudProps> = ({
  scrollProgress,
  onJumpToProgress,
  onSelectProperty,
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const state = getCameraStateAtProgress(scrollProgress);
  const currentChapter = state.currentChapter;

  const altitude = Math.round(1800 - scrollProgress * 600);
  const windSpeed = (3.8 + Math.sin(scrollProgress * Math.PI * 4) * 0.8).toFixed(1);
  const solarAngle = Math.round(45 + scrollProgress * 35);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-4 md:p-8 select-none">
      {/* Top Bar: Telemetry & Navigation */}
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Telemetry HUD */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2.5 backdrop-blur-xl shadow-2xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-display text-sm font-semibold tracking-wider text-amber-200 uppercase">
              AS Realtor Sky City
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1">
                <Compass className="h-3 w-3 text-amber-400/80" /> {altitude}m Alt
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Wind className="h-3 w-3 text-cyan-400/80" /> {windSpeed} km/h Wind
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Sun className="h-3 w-3 text-orange-400/80" /> {solarAngle}° Sun
              </span>
            </div>
          </div>
        </div>

        {/* Quick Chapter Selector & Sound Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-slate-200 transition-all hover:bg-slate-900/80 hover:text-amber-300 backdrop-blur-xl"
            title={isAudioMuted ? "Unmute Sky Atmosphere" : "Mute Sky Atmosphere"}
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
          </button>

          {/* Chapter Quick Jump Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-slate-950/70 px-4 py-2.5 text-xs font-medium tracking-wide text-amber-200 backdrop-blur-xl hover:border-amber-400"
            >
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">{currentChapter.chapterTitle}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-white/10 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-2xl">
                <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  Flight Choreography Chapters
                </div>
                {CITY_CHAPTERS.map((ch, idx) => (
                  <button
                    key={ch.progress}
                    onClick={() => {
                      onJumpToProgress(ch.progress);
                      setIsMenuOpen(false);
                    }}
                    className={`flex w-full flex-col gap-0.5 rounded-xl px-3 py-2 text-left transition-all ${
                      Math.abs(scrollProgress - ch.progress) < 0.15
                        ? "bg-amber-500/20 text-amber-200 font-semibold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>
                        0{idx + 1}. {ch.chapterTitle}
                      </span>
                      <span className="font-mono text-[10px] opacity-60">
                        {Math.round(ch.progress * 100)}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans opacity-80">
                      {ch.subtitle}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Chapter Title Overlay */}
      <div className="flex flex-col items-center justify-center text-center transition-all duration-700">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-950/40 px-3.5 py-1 text-xs tracking-widest text-amber-300 backdrop-blur-md uppercase">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          Chapter {CITY_CHAPTERS.indexOf(currentChapter) + 1} of 5
        </div>
        <h1 className="mt-2 font-display text-2xl md:text-4xl font-bold tracking-tight text-white drop-shadow-md">
          {currentChapter.chapterTitle}
        </h1>
        <p className="mt-1 max-w-md text-xs md:text-sm font-sans text-slate-300 drop-shadow">
          {currentChapter.subtitle}
        </p>
      </div>

      {/* Bottom Bar: Interactive Sky Towers Quick Access */}
      <div className="flex flex-col items-center gap-3">
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-2 backdrop-blur-xl shadow-2xl">
          <span className="hidden sm:inline px-3 text-xs font-mono text-amber-400/90 uppercase tracking-wider">
            Featured Sky Towers:
          </span>
          {properties.slice(0, 4).map((prop) => (
            <button
              key={prop.slug}
              onClick={() => onSelectProperty(prop)}
              className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition-all hover:border-amber-400/50 hover:bg-amber-500/10 hover:text-amber-200"
            >
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
              <span>{prop.name}</span>
            </button>
          ))}
        </div>

        {/* Scroll Progress Bar */}
        <div className="h-1.5 w-48 rounded-full bg-slate-800/80 overflow-hidden backdrop-blur-md">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
