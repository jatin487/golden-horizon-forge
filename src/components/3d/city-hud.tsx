import React, { useState } from "react";
import {
  Compass,
  Wind,
  Sun,
  Moon,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronDown,
  Building2,
  MousePointer,
  RotateCcw,
  ZoomIn,
  Cloud,
  Waves,
  Box,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { getCameraStateAtProgress, CITY_CHAPTERS } from "./camera-choreography";
import { Property, properties } from "@/lib/properties";

interface CityHudProps {
  scrollProgress: number;
  onJumpToProgress: (progress: number) => void;
  onSelectProperty: (property: Property) => void;
  dayNightMode: "day" | "night" | "auto";
  onChangeDayNightMode: (mode: "day" | "night" | "auto") => void;
}

export const CityHud: React.FC<CityHudProps> = ({
  scrollProgress,
  onJumpToProgress,
  onSelectProperty,
  dayNightMode,
  onChangeDayNightMode,
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const state = getCameraStateAtProgress(scrollProgress);
  const currentChapter = state.currentChapter;

  const altitude = Math.round(1800 - scrollProgress * 600);
  const windSpeed = (3.8 + Math.sin(scrollProgress * Math.PI * 4) * 0.8).toFixed(1);
  const solarAngle = Math.round(45 + scrollProgress * 35);

  const bulletPoints = [
    "Full 3D Environment",
    "Realistic Lighting & Shadows",
    "Day / Night Switch",
    "Interactive Camera",
    "Smooth Animations",
    "High Quality Details",
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 md:p-8 select-none">
      {/* 1. TOP BAR: Title Header + Floating Day/Night Pill Switch + Audio/Chapters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Top Left: Premium Real Estate Banner & Bullets */}
        <div className="pointer-events-auto max-w-md rounded-2xl border border-white/10 bg-slate-950/70 p-4 md:p-5 backdrop-blur-2xl shadow-2xl transition-all">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
              Architectural Visualization
            </span>
          </div>
          <h2 className="mt-1 font-display text-lg md:text-xl font-bold tracking-tight text-white uppercase">
            PREMIUM 3D REAL ESTATE ENVIRONMENT
          </h2>
          <p className="mt-1 text-xs text-slate-300 font-sans leading-relaxed">
            Ultra-realistic 3D scene for real estate websites, architectural visualization and interactive experiences.
          </p>

          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 border-t border-white/10 pt-2.5">
            {bulletPoints.map((point) => (
              <li key={point} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Center: DAY / NIGHT Interactive Toggle Switch (Matching Reference Image) */}
        <div className="pointer-events-auto self-center md:self-auto">
          <div className="flex items-center rounded-full border border-white/15 bg-slate-950/80 p-1.5 backdrop-blur-2xl shadow-2xl">
            {/* DAY Button */}
            <button
              onClick={() => onChangeDayNightMode("day")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                dayNightMode === "day"
                  ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 scale-105"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Sun className="h-4 w-4 text-amber-500" />
              <span>DAY</span>
            </button>

            {/* Slider Switch Indicator */}
            <div className="relative mx-1.5 h-6 w-12 rounded-full bg-slate-800/90 p-0.5 transition-colors">
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  dayNightMode === "night"
                    ? "translate-x-6 bg-indigo-200"
                    : dayNightMode === "day"
                    ? "translate-x-0 bg-amber-300"
                    : "translate-x-3 bg-cyan-300"
                }`}
              />
            </div>

            {/* NIGHT Button */}
            <button
              onClick={() => onChangeDayNightMode("night")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                dayNightMode === "night"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Moon className="h-4 w-4 text-indigo-300" />
              <span>NIGHT</span>
            </button>
          </div>
        </div>

        {/* Top Right: Telemetry, Audio & Chapter Quick Selector */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-slate-200 transition-all hover:bg-slate-900/80 hover:text-amber-300 backdrop-blur-xl"
            title={isAudioMuted ? "Unmute Sky Atmosphere" : "Mute Sky Atmosphere"}
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
                  Choreography Timeline
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

      {/* 2. BOTTOM BAR: Interactive Controls HUD (Left) & Feature Badges HUD (Right) */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-4">
        {/* Bottom Left: Interactive Controls Instruction Panel (Matching Reference Image) */}
        <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/75 p-4 backdrop-blur-2xl shadow-2xl min-w-[200px]">
          <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-amber-400">
              <RotateCcw className="h-4 w-4" />
            </div>
            <span>Drag to Rotate</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-cyan-400">
              <ZoomIn className="h-4 w-4" />
            </div>
            <span>Scroll to Zoom</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-amber-300">
              <MousePointer className="h-4 w-4" />
            </div>
            <span>Click on Building for Details</span>
          </div>
        </div>

        {/* Bottom Right: Feature Highlights Badge Strip (Matching Reference Image) */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2.5 rounded-2xl border border-white/10 bg-slate-950/75 p-3.5 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
            <Sun className="h-4 w-4 text-amber-400" />
            <span className="font-medium">Realistic Lighting</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
            <Cloud className="h-4 w-4 text-slate-300" />
            <span className="font-medium">Dynamic Weather</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
            <Waves className="h-4 w-4 text-cyan-400" />
            <span className="font-medium">Water Reflection</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
            <Box className="h-4 w-4 text-amber-300" />
            <span className="font-medium">High Detail</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-slate-200 border border-white/5">
            <Moon className="h-4 w-4 text-indigo-400" />
            <span className="font-medium">Day / Night Cycle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
