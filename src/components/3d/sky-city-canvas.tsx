import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  GlassFacadeShader,
  WaterGLSLShader,
  DayNightSkyShader,
  TrafficShader,
  CloudShadowShader,
} from "./shaders";
import { getCameraStateAtProgress } from "./camera-choreography";
import { Property, properties } from "@/lib/properties";

interface SkyCityCanvasProps {
  scrollProgress: number;
  onSelectProperty?: (property: Property) => void;
  dayNightMode?: "day" | "night" | "auto";
}

export const SkyCityCanvas: React.FC<SkyCityCanvasProps> = ({
  scrollProgress,
  onSelectProperty,
  dayNightMode = "auto",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  const modeRef = useRef(dayNightMode);
  modeRef.current = dayNightMode;

  // Interactive Orbit & Drag State
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const orbitRef = useRef({ azimuth: 0, polar: 0, zoom: 1.0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Scene, Camera, Renderer Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#09101f", 0.0015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2500);
    camera.position.set(40, 140, 260);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Lighting System ---
    const ambientLight = new THREE.AmbientLight("#a0c4ff", 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#ffe8c4", 2.0);
    dirLight.position.set(140, 220, 140);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight("#6495ed", "#1b2a47", 0.9);
    scene.add(hemiLight);

    // --- 3. Dynamic Day-to-Night Sky Dome Shader ---
    const skyUniforms = THREE.UniformsUtils.clone(DayNightSkyShader.uniforms);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: skyUniforms,
      vertexShader: DayNightSkyShader.vertexShader,
      fragmentShader: DayNightSkyShader.fragmentShader,
    });
    const skyGeo = new THREE.SphereGeometry(1200, 32, 32);
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // --- 4. GLSL Water Surface (Waterfront Coastline & Marina) ---
    const waterUniforms = THREE.UniformsUtils.clone(WaterGLSLShader.uniforms);
    const waterMat = new THREE.ShaderMaterial({
      uniforms: waterUniforms,
      vertexShader: WaterGLSLShader.vertexShader,
      fragmentShader: WaterGLSLShader.fragmentShader,
      transparent: true,
    });

    const waterGeo = new THREE.PlaneGeometry(1600, 1600, 128, 128);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -18, 0);
    scene.add(waterMesh);

    // --- 5. City Platform, Waterfront Quay & Promenade ---
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const baseMat = new THREE.MeshStandardMaterial({
      color: "#0f172a",
      roughness: 0.3,
      metalness: 0.8,
    });

    const promenadeMat = new THREE.MeshStandardMaterial({
      color: "#1e293b",
      roughness: 0.4,
      metalness: 0.4,
    });

    // Main Floating Base Platform
    const mainPlatformGeo = new THREE.CylinderGeometry(150, 120, 22, 12);
    const mainPlatform = new THREE.Mesh(mainPlatformGeo, baseMat);
    mainPlatform.position.set(0, -11, 0);
    cityGroup.add(mainPlatform);

    // Waterfront Coastal Boulevard & Promenade Ring
    const promenadeGeo = new THREE.RingGeometry(150, 168, 64);
    promenadeGeo.rotateX(Math.PI / 2);
    const promenade = new THREE.Mesh(promenadeGeo, promenadeMat);
    promenade.position.set(0, 0.15, 0);
    cityGroup.add(promenade);

    // --- 6. Low-Rise Waterfront Luxury Villas (Matching Reference Image) ---
    const villaMatGlass = new THREE.MeshStandardMaterial({
      color: "#38bdf8",
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85,
    });

    const villaMatWall = new THREE.MeshStandardMaterial({
      color: "#f8fafc",
      roughness: 0.2,
      metalness: 0.1,
    });

    const villaMatDeck = new THREE.MeshStandardMaterial({
      color: "#92400e",
      roughness: 0.6,
    });

    const villaGroup = new THREE.Group();
    cityGroup.add(villaGroup);

    for (let v = 0; v < 8; v++) {
      const angle = (v / 8) * Math.PI * 1.5 - Math.PI * 0.75;
      const radius = 135;
      const vx = Math.cos(angle) * radius;
      const vz = Math.sin(angle) * radius;

      const singleVilla = new THREE.Group();
      singleVilla.position.set(vx, 0, vz);
      singleVilla.rotation.y = -angle + Math.PI / 2;

      // Villa Base Deck
      const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 18), villaMatDeck);
      deckMesh.position.set(0, 0.6, 0);
      singleVilla.add(deckMesh);

      // Villa Main Modern Structure (2 floors)
      const f1 = new THREE.Mesh(new THREE.BoxGeometry(16, 6, 12), villaMatWall);
      f1.position.set(0, 4, 0);
      singleVilla.add(f1);

      const f2 = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 10), villaMatGlass);
      f2.position.set(2, 9.5, -1);
      singleVilla.add(f2);

      // Villa Private Infinity Pool
      const poolMesh = new THREE.Mesh(
        new THREE.BoxGeometry(14, 0.8, 6),
        new THREE.MeshStandardMaterial({
          color: "#0284c7",
          metalness: 0.9,
          roughness: 0.1,
          emissive: "#0369a1",
          emissiveIntensity: 0.6,
        })
      );
      poolMesh.position.set(0, 1.2, 7);
      singleVilla.add(poolMesh);

      villaGroup.add(singleVilla);
    }

    // --- 7. Palm Trees & Coastal Streetlights ---
    const palmMatTrunk = new THREE.MeshStandardMaterial({ color: "#78350f" });
    const palmMatLeaves = new THREE.MeshStandardMaterial({ color: "#15803d", roughness: 0.3 });

    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const radius = 158;
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;

      const palmGroup = new THREE.Group();
      palmGroup.position.set(px, 0, pz);

      const trunkGeo = new THREE.CylinderGeometry(0.5, 0.9, 9, 8);
      trunkGeo.translate(0, 4.5, 0);
      const trunk = new THREE.Mesh(trunkGeo, palmMatTrunk);
      palmGroup.add(trunk);

      for (let l = 0; l < 5; l++) {
        const leafGeo = new THREE.ConeGeometry(2.0, 7, 4);
        leafGeo.rotateX(Math.PI / 3);
        leafGeo.rotateY((l / 5) * Math.PI * 2);
        leafGeo.translate(0, 9, 0);
        const leaf = new THREE.Mesh(leafGeo, palmMatLeaves);
        palmGroup.add(leaf);
      }

      cityGroup.add(palmGroup);
    }

    // --- 8. Swaying Glass Skyscrapers & Shaders ---
    const glassUniforms = THREE.UniformsUtils.clone(GlassFacadeShader.uniforms);
    const glassMaterial = new THREE.ShaderMaterial({
      uniforms: glassUniforms,
      vertexShader: GlassFacadeShader.vertexShader,
      fragmentShader: GlassFacadeShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const towerInteractiveMeshes: { mesh: THREE.Mesh; property: Property }[] = [];

    const towerConfigs = [
      { property: properties[0], x: 0, z: 0, w: 26, d: 26, h: 155 }, // Aurelia Residences (Center Pinnacle)
      { property: properties[1], x: -60, z: -45, w: 20, d: 20, h: 110 }, // Vantara Hill Villas
      { property: properties[2], x: 65, z: -40, w: 24, d: 24, h: 125 }, // Meridian Business Tower
      { property: properties[3], x: -55, z: 55, w: 20, d: 20, h: 95 }, // Monarch Collection
      { property: properties[4], x: 60, z: 60, w: 22, d: 22, h: 105 }, // Solaire Cliff Estate
      { property: properties[5], x: 0, z: -75, w: 18, d: 18, h: 90 }, // North Quay
    ];

    towerConfigs.forEach((cfg) => {
      const towerGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d, 1, 35, 1);
      towerGeo.translate(0, cfg.h / 2, 0);

      const towerMesh = new THREE.Mesh(towerGeo, glassMaterial);
      towerMesh.position.set(cfg.x, 0, cfg.z);
      cityGroup.add(towerMesh);

      // Gold Architectural Crown Spire
      const spireGeo = new THREE.ConeGeometry(cfg.w * 0.45, 30, 4);
      spireGeo.translate(0, cfg.h + 15, 0);
      const spireMat = new THREE.MeshStandardMaterial({
        color: "#fbbf24",
        metalness: 0.95,
        roughness: 0.1,
      });
      const spireMesh = new THREE.Mesh(spireGeo, spireMat);
      spireMesh.position.set(cfg.x, 0, cfg.z);
      cityGroup.add(spireMesh);

      // Rooftop Infinity Pool
      const poolGeo = new THREE.BoxGeometry(cfg.w * 0.65, 1.6, cfg.d * 0.65);
      const poolMat = new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        metalness: 0.9,
        roughness: 0.1,
        emissive: "#0284c7",
        emissiveIntensity: 0.6,
      });
      const poolMesh = new THREE.Mesh(poolGeo, poolMat);
      poolMesh.position.set(cfg.x, cfg.h - 1, cfg.z);
      cityGroup.add(poolMesh);

      towerInteractiveMeshes.push({ mesh: towerMesh, property: cfg.property || properties[0] });
    });

    // Decorative Surrounding Towers
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const radius = 80 + (i % 4) * 18;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;
      const th = 50 + (i % 7) * 16;
      const tw = 14 + (i % 4) * 3;

      const decGeo = new THREE.BoxGeometry(tw, th, tw, 1, 15, 1);
      decGeo.translate(0, th / 2, 0);
      const decMesh = new THREE.Mesh(decGeo, glassMaterial);
      decMesh.position.set(tx, 0, tz);
      cityGroup.add(decMesh);
    }

    // --- 9. Elevated Glowing Skyways & Coastal Arteries ---
    const trafficUniforms = THREE.UniformsUtils.clone(TrafficShader.uniforms);
    const trafficMaterial = new THREE.ShaderMaterial({
      uniforms: trafficUniforms,
      vertexShader: TrafficShader.vertexShader,
      fragmentShader: TrafficShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    [105, 152].forEach((radius, idx) => {
      const roadGeo = new THREE.RingGeometry(radius - 3.0, radius + 3.0, 64);
      roadGeo.rotateX(Math.PI / 2);
      const roadMesh = new THREE.Mesh(roadGeo, trafficMaterial);
      roadMesh.position.set(0, 6 + idx * 14, 0);
      cityGroup.add(roadMesh);
    });

    // --- 10. Animated Luxury Yachts & Helicopter ---
    const yachts: THREE.Group[] = [];
    const yachtMatBody = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.1 });
    const yachtMatDeck = new THREE.MeshStandardMaterial({ color: "#b45309", roughness: 0.5 });
    const yachtMatGlow = new THREE.MeshBasicMaterial({ color: "#fbbf24" });

    for (let y = 0; y < 5; y++) {
      const yachtGroup = new THREE.Group();

      const hullGeo = new THREE.ConeGeometry(3.5, 18, 4);
      hullGeo.rotateX(Math.PI / 2);
      hullGeo.scale(1, 0.4, 1);
      const hull = new THREE.Mesh(hullGeo, yachtMatBody);
      yachtGroup.add(hull);

      const deckGeo = new THREE.BoxGeometry(4, 3, 8);
      deckGeo.translate(0, 1.8, -1);
      const deck = new THREE.Mesh(deckGeo, yachtMatDeck);
      yachtGroup.add(deck);

      const cabinGlowGeo = new THREE.SphereGeometry(1.5, 8, 8);
      cabinGlowGeo.translate(0, 3.5, -1);
      const cabinGlow = new THREE.Mesh(cabinGlowGeo, yachtMatGlow);
      yachtGroup.add(cabinGlow);

      const radius = 190 + y * 28;
      const angle = (y / 5) * Math.PI * 2;
      yachtGroup.position.set(Math.cos(angle) * radius, -17, Math.sin(angle) * radius);

      cityGroup.add(yachtGroup);
      yachts.push(yachtGroup);
    }

    // Skyline Helicopter
    const heliGroup = new THREE.Group();
    const heliBodyGeo = new THREE.SphereGeometry(3.5, 16, 16);
    heliBodyGeo.scale(1.8, 1, 1);
    const heliBodyMat = new THREE.MeshStandardMaterial({ color: "#0284c7", metalness: 0.8 });
    const heliBody = new THREE.Mesh(heliBodyGeo, heliBodyMat);
    heliGroup.add(heliBody);

    const heliRotorGeo = new THREE.BoxGeometry(18, 0.2, 0.9);
    heliRotorGeo.translate(0, 3.8, 0);
    const heliRotorMat = new THREE.MeshBasicMaterial({ color: "#e2e8f0" });
    const heliRotor = new THREE.Mesh(heliRotorGeo, heliRotorMat);
    heliGroup.add(heliRotor);

    heliGroup.position.set(0, 160, 0);
    scene.add(heliGroup);

    // --- 11. Volumetric Cloud Layer ---
    const cloudUniforms = THREE.UniformsUtils.clone(CloudShadowShader.uniforms);
    const cloudMaterial = new THREE.ShaderMaterial({
      uniforms: cloudUniforms,
      vertexShader: CloudShadowShader.vertexShader,
      fragmentShader: CloudShadowShader.fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const cloudPlaneGeo = new THREE.PlaneGeometry(1100, 1100);
    cloudPlaneGeo.rotateX(-Math.PI / 2);
    const cloudDeckLower = new THREE.Mesh(cloudPlaneGeo, cloudMaterial);
    cloudDeckLower.position.set(0, -45, 0);
    scene.add(cloudDeckLower);

    // --- 12. Interactive Controls (Orbit Drag & Click Detection) ---
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
      }

      const rect = renderer.domElement.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mousePos, camera);
      const meshesToTest = towerInteractiveMeshes.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hit = towerInteractiveMeshes.find((item) => item.mesh === intersects[0].object);
        if (hit && onSelectProperty) {
          onSelectProperty(hit.property);
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        dragStartRef.current = { x: e.clientX, y: e.clientY };

        orbitRef.current.azimuth += deltaX * 0.005;
        orbitRef.current.polar = Math.max(
          -Math.PI / 4,
          Math.min(Math.PI / 4, orbitRef.current.polar + deltaY * 0.005)
        );
      }

      waterUniforms.uMouse.value.set(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      orbitRef.current.zoom = Math.max(0.6, Math.min(1.8, orbitRef.current.zoom + e.deltaY * 0.001));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    domEl.addEventListener("wheel", handleWheel, { passive: true });

    // --- 13. Window Resize Listener ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- 14. Main Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentNightFactor = 0.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Compute target night factor based on mode
      const cameraState = getCameraStateAtProgress(scrollRef.current);
      let targetNight = cameraState.nightFactor;
      if (modeRef.current === "day") targetNight = 0.0;
      if (modeRef.current === "night") targetNight = 1.0;

      // Smooth interpolation for Day-to-Night factor transition
      currentNightFactor += (targetNight - currentNightFactor) * 0.06;

      // Update Shader Uniforms
      glassUniforms.uTime.value = elapsedTime;
      waterUniforms.uTime.value = elapsedTime;
      trafficUniforms.uTime.value = elapsedTime;
      cloudUniforms.uTime.value = elapsedTime;

      // Rotate city platform slowly
      cityGroup.rotation.y = elapsedTime * 0.012 + orbitRef.current.azimuth;

      // Animate Luxury Yachts
      yachts.forEach((yacht, idx) => {
        const speed = 0.07 + idx * 0.02;
        const radius = 190 + idx * 28;
        const angle = elapsedTime * speed + (idx * Math.PI) / 2.5;
        yacht.position.x = Math.cos(angle) * radius;
        yacht.position.z = Math.sin(angle) * radius;
        yacht.rotation.y = -angle + Math.PI / 2;
      });

      // Animate Helicopter
      const heliAngle = elapsedTime * 0.22;
      heliGroup.position.x = Math.cos(heliAngle) * 95;
      heliGroup.position.z = Math.sin(heliAngle) * 95;
      heliGroup.rotation.y = -heliAngle;
      heliRotor.rotation.y = elapsedTime * 20.0;

      // Update Camera Position & Target with Orbit & Zoom
      const baseCamPos = cameraState.camPos.clone();
      baseCamPos.multiplyScalar(orbitRef.current.zoom);
      baseCamPos.y += orbitRef.current.polar * 80;

      camera.position.lerp(baseCamPos, 0.08);
      camera.lookAt(cameraState.targetPos);
      camera.fov = THREE.MathUtils.lerp(camera.fov, cameraState.fov, 0.08);
      camera.updateProjectionMatrix();

      // Update Lighting & Sky Uniforms with currentNightFactor
      const daySunPos = new THREE.Vector3(140, 220, 140);
      const nightSunPos = new THREE.Vector3(-140, 180, -140);
      const activeSunPos = new THREE.Vector3().lerpVectors(daySunPos, nightSunPos, currentNightFactor);

      dirLight.position.copy(activeSunPos);
      dirLight.intensity = THREE.MathUtils.lerp(2.2, 0.3, currentNightFactor);

      glassUniforms.uSunDirection.value.copy(activeSunPos).normalize();
      glassUniforms.uNightFactor.value = currentNightFactor;

      waterUniforms.uSunDirection.value.copy(activeSunPos).normalize();
      waterUniforms.uNightFactor.value = currentNightFactor;

      skyUniforms.uSunPos.value.copy(activeSunPos);
      skyUniforms.uNightFactor.value = currentNightFactor;

      trafficUniforms.uNightFactor.value = currentNightFactor;
      cloudUniforms.uDensity.value = THREE.MathUtils.lerp(0.7, 0.35, currentNightFactor);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", handleResize);
      domEl.removeEventListener("pointerdown", handlePointerDown);
      domEl.removeEventListener("wheel", handleWheel);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectProperty]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
    />
  );
};
