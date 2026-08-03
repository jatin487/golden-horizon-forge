import * as THREE from "three";

export type CameraKeyframe = {
  progress: number; // 0.0 to 1.0
  camPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  fov: number;
  sunPos: THREE.Vector3;
  sunColor: string;
  cloudOpacity: number;
  nightFactor: number; // 0.0 Day -> 1.0 Night
  chapterTitle: string;
  subtitle: string;
};

export const CITY_CHAPTERS: CameraKeyframe[] = [
  {
    progress: 0.0, // Chapter I: Morning Sky Arrival
    camPos: new THREE.Vector3(40, 160, 240),
    targetPos: new THREE.Vector3(-30, 35, 0),
    fov: 45,
    sunPos: new THREE.Vector3(120, 220, 140),
    sunColor: "#fff0d6",
    cloudOpacity: 0.75,
    nightFactor: 0.0, // Full Dawn/Morning
    chapterTitle: "AS REALTOR — WATERFRONT SKY CITY",
    subtitle: "Suspended luxury addresses built over crystalline waters",
  },
  {
    progress: 0.25, // Chapter II: Golden Hour Skyscrapers & Sway Physics
    camPos: new THREE.Vector3(85, 85, 120),
    targetPos: new THREE.Vector3(-20, 50, 0),
    fov: 38,
    sunPos: new THREE.Vector3(160, 120, 60),
    sunColor: "#ffaa44",
    cloudOpacity: 0.35,
    nightFactor: 0.25, // Golden Hour Sunset
    chapterTitle: "WIND PHYSICS & PBR GLASS FACADES",
    subtitle: "Aerodynamic swaying towers with GLSL Fresnel reflections",
  },
  {
    progress: 0.5, // Chapter III: Sunset Marina & GLSL Water Canvas
    camPos: new THREE.Vector3(-90, 45, 85),
    targetPos: new THREE.Vector3(20, 15, -15),
    fov: 48,
    sunPos: new THREE.Vector3(-140, 60, -90),
    sunColor: "#ff7733",
    cloudOpacity: 0.2,
    nightFactor: 0.55, // Sunset / Dusk
    chapterTitle: "MARINA CANALS & GLOWING SKYWAYS",
    subtitle: "Yachts cruising along water canals beneath illuminated bridges",
  },
  {
    progress: 0.75, // Chapter IV: Blue Hour Penthouses & Infinity Pools
    camPos: new THREE.Vector3(60, 55, -85),
    targetPos: new THREE.Vector3(-15, 40, 15),
    fov: 42,
    sunPos: new THREE.Vector3(-180, 10, -150),
    sunColor: "#4477ff",
    cloudOpacity: 0.3,
    nightFactor: 0.85, // Blue Hour
    chapterTitle: "BLUE HOUR PENTHOUSES & INFINITY POOLS",
    subtitle: "Illuminated rooftops, fire pits, and glowing horizon vistas",
  },
  {
    progress: 1.0, // Chapter V: Night Metropolis & Interactive Showcase
    camPos: new THREE.Vector3(30, 140, 210),
    targetPos: new THREE.Vector3(-20, 40, 0),
    fov: 46,
    sunPos: new THREE.Vector3(60, 190, 140),
    sunColor: "#ffffff",
    cloudOpacity: 0.45,
    nightFactor: 1.0, // Full Night Metropolis
    chapterTitle: "EXPLORE NIGHT SKY TOWERS",
    subtitle: "Select a sky tower or book your private aerial helicopter viewing",
  },
];

export function getCameraStateAtProgress(progress: number) {
  const p = Math.max(0, Math.min(1, progress));

  let prev = CITY_CHAPTERS[0];
  let next = CITY_CHAPTERS[CITY_CHAPTERS.length - 1];

  for (let i = 0; i < CITY_CHAPTERS.length - 1; i++) {
    if (p >= CITY_CHAPTERS[i].progress && p <= CITY_CHAPTERS[i + 1].progress) {
      prev = CITY_CHAPTERS[i];
      next = CITY_CHAPTERS[i + 1];
      break;
    }
  }

  const range = next.progress - prev.progress || 1;
  const factor = (p - prev.progress) / range;

  // Smooth step ease-in-out curve
  const easeFactor = factor * factor * (3 - 2 * factor);

  const camPos = new THREE.Vector3().lerpVectors(prev.camPos, next.camPos, easeFactor);
  const targetPos = new THREE.Vector3().lerpVectors(prev.targetPos, next.targetPos, easeFactor);
  const sunPos = new THREE.Vector3().lerpVectors(prev.sunPos, next.sunPos, easeFactor);
  const fov = THREE.MathUtils.lerp(prev.fov, next.fov, easeFactor);
  const cloudOpacity = THREE.MathUtils.lerp(prev.cloudOpacity, next.cloudOpacity, easeFactor);
  const nightFactor = THREE.MathUtils.lerp(prev.nightFactor, next.nightFactor, easeFactor);

  const sunColor = new THREE.Color(prev.sunColor).lerp(new THREE.Color(next.sunColor), easeFactor);

  return {
    camPos,
    targetPos,
    sunPos,
    sunColor,
    fov,
    cloudOpacity,
    nightFactor,
    currentChapter: prev,
    nextChapter: next,
    transitionFactor: easeFactor,
  };
}
