import React, { useState } from "react";
import {
  Compass,
  Wind,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudFog,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronDown,
  Building2,
  MousePointer,
  RotateCcw,
  ZoomIn,
  Waves,
  Box,
  Flame,
  Boxes,
  Maximize2,
  Minimize2,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Eye,
  Info,
} from "lucide-react";
import { getCameraStateAtProgress, CITY_CHAPTERS } from "./camera-choreography";
import { Property, properties } from "@/lib/properties";

export type WeatherMode = "sunny" | "golden" | "night" | "rain" | "fog";

interface CityHudProps {
  scrollProgress: number;
  onJumpToProgress: (progress: number) => void;
  onSelectProperty: (property: Property) => void;
  weatherMode: WeatherMode;
  onChangeWeatherMode: (mode: WeatherMode) => void;
  isArchitectMode: boolean;
  onToggleArchitectMode: () => void;
  hoveredProperty: Property | null;
  onStartWalkthrough: (property: Property) => void;
}

export const CityHud: React.FC<CityHudProps> = ({
  scrollProgress,
  onJumpToProgress,
  onSelectProperty,
  weatherMode,
  onChangeWeatherMode,
  isArchitectMode,
  onToggleArchitectMode,
  hoveredProperty,
  onStartWalkthrough,
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBannerMinimized, setIsBannerMinimized] = useState(false);

  const state = getCameraStateAtProgress(scrollProgress);
  const currentChapter = state.currentChapter || CITY_CHAPTERS[0];

  const altitude = Math.round(1800 - scrollProgress * 600);
  const windSpeed = (3.8 + Math.sin(scrollProgress * Math.PI * 4) * 0.8).toFixed(1);
  const solarAngle = Math.round(45 + scrollProgress * 35);

  const bulletPoints = [
    "120+ 3D Digital Towers",
    "Physical GLSL Glass Shaders",
    "Exploded Architect Mode",
    "Interactive Camera Fly-To",
    "Real-time Weather Engine",
    "Apple Vision Pro Aesthetics",
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 md:p-6 select-none">
      {/* 1. TOP HEADER: Real Estate Banner + Weather Engine + Architect Mode Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Top Left: Digital Twin Title Banner */}
        <div className="pointer-events-auto max-w-md rounded-2xl border border-white/10 bg-slate-950/80 p-3.5 md:p-4 backdrop-blur-2xl shadow-2xl transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                AS Realtor • Digital Twin City
              </span>
            </div>
            <button
              onClick={() => setIsBannerMinimized(!isBannerMinimized)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isBannerMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
            </button>
          </div>

          {!isBannerMinimized && (
            <>
              <h2 className="mt-1 font-display text-base md:text-lg font-bold tracking-tight text-white uppercase">
                FUTURE DIGITAL TWIN CITY SHOWCASE
              </h2>
              <p className="mt-0.5 text-xs text-slate-300 font-sans leading-relaxed">
                Real-time explorable luxury smart city twin. Inspired by Dubai Marina, NEOM & Apple Vision Pro.
              </p>

              <ul className="mt-2.5 grid grid-cols-2 gap-1 border-t border-white/10 pt-2">
                {bulletPoints.map((point) => (
                  <li key={point} className="flex items-center gap-1.5 text-[10.5px] text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Top Center: Weather Selector + Architect Mode Button */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 self-center md:self-auto">
          {/* Architect Mode Toggle Button */}
          <button
            onClick={onToggleArchitectMode}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-2xl shadow-2xl border ${
              isArchitectMode
                ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-cyan-500/30 scale-105"
                : "border-cyan-500/40 bg-slate-950/80 text-cyan-300 hover:bg-cyan-500/20"
            }`}
          >
            <Boxes className={`h-4 w-4 ${isArchitectMode ? "animate-spin" : ""}`} />
            <span>ARCHITECT MODE</span>
            {isArchitectMode && <span className="h-2 w-2 rounded-full bg-slate-950 animate-ping" />}
          </button>

          {/* Interactive Weather Engine Pill */}
          <div className="flex items-center rounded-full border border-white/15 bg-slate-950/85 p-1 backdrop-blur-2xl shadow-2xl">
            <button
              onClick={() => onChangeWeatherMode("sunny")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                weatherMode === "sunny" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300 hover:text-white"
              }`}
              title="Sunny Horizon"
            >
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden sm:inline">SUNNY</span>
            </button>

            <button
              onClick={() => onChangeWeatherMode("golden")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                weatherMode === "golden" ? "bg-orange-500 text-white shadow-md" : "text-slate-300 hover:text-white"
              }`}
              title="Golden Hour Sunset"
            >
              <Flame className="h-3.5 w-3.5 text-orange-300" />
              <span className="hidden sm:inline">GOLDEN</span>
            </button>

            <button
              onClick={() => onChangeWeatherMode("night")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                weatherMode === "night" ? "bg-indigo-600 text-white shadow-md" : "text-slate-300 hover:text-white"
              }`}
              title="Metropolis Night"
            >
              <Moon className="h-3.5 w-3.5 text-indigo-300" />
              <span className="hidden sm:inline">NIGHT</span>
            </button>

            <button
              onClick={() => onChangeWeatherMode("rain")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                weatherMode === "rain" ? "bg-cyan-600 text-white shadow-md" : "text-slate-300 hover:text-white"
              }`}
              title="Coastal Rain"
            >
              <CloudRain className="h-3.5 w-3.5 text-cyan-300" />
              <span className="hidden sm:inline">RAIN</span>
            </button>

            <button
              onClick={() => onChangeWeatherMode("fog")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                weatherMode === "fog" ? "bg-slate-700 text-white shadow-md" : "text-slate-300 hover:text-white"
              }`}
              title="High Atmosphere Fog"
            >
              <CloudFog className="h-3.5 w-3.5 text-slate-300" />
              <span className="hidden sm:inline">FOG</span>
            </button>
          </div>
        </div>

        {/* Top Right: Audio & Flight Dropdown */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-slate-200 transition-all hover:bg-slate-900/80 hover:text-amber-300 backdrop-blur-xl"
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-slate-950/70 px-4 py-2.5 text-xs font-medium tracking-wide text-amber-200 backdrop-blur-xl hover:border-amber-400"
            >
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden lg:inline">{currentChapter.chapterTitle}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-2xl">
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
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. CENTER HOVER HOLOGRAM INFO CARD (Digital Twin Real-Time Hologram) */}
      {hoveredProperty && (
        <div className="pointer-events-auto self-center max-w-sm rounded-2xl border border-amber-500/40 bg-slate-950/90 p-4 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in duration-300 border-amber-400/50">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-[10px] uppercase text-emerald-400 tracking-widest font-semibold">
                Digital Twin • Live Node
              </span>
            </div>
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] text-amber-300">
              {hoveredProperty.type}
            </span>
          </div>

          <h3 className="mt-2 font-display text-lg font-bold text-white">{hoveredProperty.name}</h3>
          <p className="text-xs text-slate-300">{hoveredProperty.location}</p>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-2.5 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price Starting</span>
              <span className="font-semibold text-amber-300">{hoveredProperty.price}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Delivery</span>
              <span className="font-semibold text-white">Q4 2026</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Available Units</span>
              <span className="font-semibold text-emerald-400">14 Residences</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Projected ROI</span>
              <span className="font-semibold text-cyan-300">12.8% p.a.</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onSelectProperty(hoveredProperty)}
              className="flex-1 rounded-xl bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-all shadow-lg"
            >
              Inspect Model
            </button>
            <button
              onClick={() => onStartWalkthrough(hoveredProperty)}
              className="flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Walkthrough</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. BOTTOM FOOTER: Controls HUD & Feature Badges */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-3">
        {/* Left: Controls Instructions */}
        <div className="pointer-events-auto flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-2xl shadow-2xl min-w-[200px]">
          <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-white/10 text-amber-400">
              <RotateCcw className="h-3.5 w-3.5" />
            </div>
            <span>Drag to Rotate Drone View</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-white/10 text-cyan-400">
              <ZoomIn className="h-3.5 w-3.5" />
            </div>
            <span>Scroll to Zoom Camera</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-white/10 text-amber-300">
              <MousePointer className="h-3.5 w-3.5" />
            </div>
            <span>Hover Tower for Hologram / Click for Fly-To</span>
          </div>
        </div>

        {/* Right: Feature Badges */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-medium">HDR Lighting</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
            <Cloud className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-medium">Weather Engine</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
            <Waves className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-medium">GLSL Water</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
            <Boxes className="h-3.5 w-3.5 text-cyan-300" />
            <span className="font-medium">Exploded Architect</span>
          </div>
        </div>
      </div>
    </div>
  );
};
