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
}

export const SkyCityCanvas: React.FC<SkyCityCanvasProps> = ({
  scrollProgress,
  onSelectProperty,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  // Mouse Parallax coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Scene, Camera, Renderer Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#09101f", 0.0018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2200);
    camera.position.set(40, 160, 240);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Lighting System ---
    const ambientLight = new THREE.AmbientLight("#a0c4ff", 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#ffe8c4", 1.8);
    dirLight.position.set(120, 220, 140);
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight("#6495ed", "#1b2a47", 0.8);
    scene.add(hemiLight);

    // --- 3. Dynamic Day-to-Night Sky Dome ---
    const skyUniforms = THREE.UniformsUtils.clone(DayNightSkyShader.uniforms);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: skyUniforms,
      vertexShader: DayNightSkyShader.vertexShader,
      fragmentShader: DayNightSkyShader.fragmentShader,
    });
    const skyGeo = new THREE.SphereGeometry(1000, 32, 32);
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // --- 4. GLSL Water Surface (Waterfront Marina Canals) ---
    const waterUniforms = THREE.UniformsUtils.clone(WaterGLSLShader.uniforms);
    const waterMat = new THREE.ShaderMaterial({
      uniforms: waterUniforms,
      vertexShader: WaterGLSLShader.vertexShader,
      fragmentShader: WaterGLSLShader.fragmentShader,
      transparent: true,
    });

    const waterGeo = new THREE.PlaneGeometry(1200, 1200, 128, 128);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -18, 0);
    scene.add(waterMesh);

    // --- 5. City Platform Base & Marina Quay Structure ---
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const baseMat = new THREE.MeshStandardMaterial({
      color: "#0f172a",
      roughness: 0.25,
      metalness: 0.85,
    });

    const promenadeMat = new THREE.MeshStandardMaterial({
      color: "#1e293b",
      roughness: 0.4,
      metalness: 0.5,
    });

    // Main Floating City Quay Platform
    const mainPlatformGeo = new THREE.CylinderGeometry(130, 105, 20, 8);
    const mainPlatform = new THREE.Mesh(mainPlatformGeo, baseMat);
    mainPlatform.position.set(0, -10, 0);
    cityGroup.add(mainPlatform);

    // Waterfront Promenade Deck
    const promenadeGeo = new THREE.RingGeometry(130, 142, 64);
    promenadeGeo.rotateX(Math.PI / 2);
    const promenade = new THREE.Mesh(promenadeGeo, promenadeMat);
    promenade.position.set(0, 0.1, 0);
    cityGroup.add(promenade);

    // Palm Tree Boulevards
    const palmMatTrunk = new THREE.MeshStandardMaterial({ color: "#78350f" });
    const palmMatLeaves = new THREE.MeshStandardMaterial({ color: "#15803d", roughness: 0.3 });

    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const radius = 136;
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;

      const palmGroup = new THREE.Group();
      palmGroup.position.set(px, 0, pz);

      const trunkGeo = new THREE.CylinderGeometry(0.5, 0.8, 8, 8);
      trunkGeo.translate(0, 4, 0);
      const trunk = new THREE.Mesh(trunkGeo, palmMatTrunk);
      palmGroup.add(trunk);

      for (let l = 0; l < 5; l++) {
        const leafGeo = new THREE.ConeGeometry(1.8, 6, 4);
        leafGeo.rotateX(Math.PI / 3);
        leafGeo.rotateY((l / 5) * Math.PI * 2);
        leafGeo.translate(0, 8, 0);
        const leaf = new THREE.Mesh(leafGeo, palmMatLeaves);
        palmGroup.add(leaf);
      }

      cityGroup.add(palmGroup);
    }

    // --- 6. Swaying Glass Skyscrapers & PBR GLSL Shaders ---
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
      { property: properties[0], x: 0, z: 0, w: 24, d: 24, h: 140 }, // Aurelia Residences (Center Pinnacle)
      { property: properties[1], x: -55, z: -40, w: 18, d: 18, h: 100 }, // Vantara Hill Villas
      { property: properties[2], x: 60, z: -35, w: 22, d: 22, h: 115 }, // Meridian Business Tower
      { property: properties[3], x: -50, z: 50, w: 18, d: 18, h: 85 }, // Monarch Collection
      { property: properties[4], x: 55, z: 55, w: 20, d: 20, h: 95 }, // Solaire Cliff Estate
      { property: properties[5], x: 0, z: -70, w: 16, d: 16, h: 80 }, // North Quay
    ];

    towerConfigs.forEach((cfg) => {
      const towerGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d, 1, 30, 1);
      towerGeo.translate(0, cfg.h / 2, 0);

      const towerMesh = new THREE.Mesh(towerGeo, glassMaterial);
      towerMesh.position.set(cfg.x, 0, cfg.z);
      cityGroup.add(towerMesh);

      // Gold Architectural Crown Spire
      const spireGeo = new THREE.ConeGeometry(cfg.w * 0.45, 28, 4);
      spireGeo.translate(0, cfg.h + 14, 0);
      const spireMat = new THREE.MeshStandardMaterial({
        color: "#fbbf24",
        metalness: 0.95,
        roughness: 0.1,
      });
      const spireMesh = new THREE.Mesh(spireGeo, spireMat);
      spireMesh.position.set(cfg.x, 0, cfg.z);
      cityGroup.add(spireMesh);

      // Rooftop Infinity Pool (with blue water shader)
      const poolGeo = new THREE.BoxGeometry(cfg.w * 0.6, 1.5, cfg.d * 0.6);
      const poolMat = new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        metalness: 0.9,
        roughness: 0.1,
        emissive: "#0284c7",
        emissiveIntensity: 0.5,
      });
      const poolMesh = new THREE.Mesh(poolGeo, poolMat);
      poolMesh.position.set(cfg.x, cfg.h - 1, cfg.z);
      cityGroup.add(poolMesh);

      // Interactive Glowing Beacon
      const beaconGeo = new THREE.SphereGeometry(2.5, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: "#fbbf24" });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(cfg.x, cfg.h + 29, cfg.z);
      cityGroup.add(beaconMesh);

      towerInteractiveMeshes.push({ mesh: towerMesh, property: cfg.property });
    });

    // Decorative Surrounding Towers
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 75 + (i % 3) * 16;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;
      const th = 45 + (i % 7) * 14;
      const tw = 12 + (i % 4) * 3;

      const decGeo = new THREE.BoxGeometry(tw, th, tw, 1, 15, 1);
      decGeo.translate(0, th / 2, 0);
      const decMesh = new THREE.Mesh(decGeo, glassMaterial);
      decMesh.position.set(tx, 0, tz);
      cityGroup.add(decMesh);
    }

    // --- 7. Elevated Glowing Skyways & Traffic Arteries ---
    const trafficUniforms = THREE.UniformsUtils.clone(TrafficShader.uniforms);
    const trafficMaterial = new THREE.ShaderMaterial({
      uniforms: trafficUniforms,
      vertexShader: TrafficShader.vertexShader,
      fragmentShader: TrafficShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    [95, 140].forEach((radius, idx) => {
      const roadGeo = new THREE.RingGeometry(radius - 2.5, radius + 2.5, 64);
      roadGeo.rotateX(Math.PI / 2);
      const roadMesh = new THREE.Mesh(roadGeo, trafficMaterial);
      roadMesh.position.set(0, 8 + idx * 12, 0);
      cityGroup.add(roadMesh);
    });

    // --- 8. Animated Luxury Yachts & Helicopter ---
    const yachts: THREE.Group[] = [];
    const yachtMatBody = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.1 });
    const yachtMatDeck = new THREE.MeshStandardMaterial({ color: "#b45309", roughness: 0.5 });
    const yachtMatGlow = new THREE.MeshBasicMaterial({ color: "#fbbf24" });

    for (let y = 0; y < 4; y++) {
      const yachtGroup = new THREE.Group();

      const hullGeo = new THREE.ConeGeometry(3, 16, 4);
      hullGeo.rotateX(Math.PI / 2);
      hullGeo.scale(1, 0.4, 1);
      const hull = new THREE.Mesh(hullGeo, yachtMatBody);
      yachtGroup.add(hull);

      const deckGeo = new THREE.BoxGeometry(3.5, 2.5, 7);
      deckGeo.translate(0, 1.5, -1);
      const deck = new THREE.Mesh(deckGeo, yachtMatDeck);
      yachtGroup.add(deck);

      const cabinGlowGeo = new THREE.SphereGeometry(1.2, 8, 8);
      cabinGlowGeo.translate(0, 3, -1);
      const cabinGlow = new THREE.Mesh(cabinGlowGeo, yachtMatGlow);
      yachtGroup.add(cabinGlow);

      const radius = 175 + y * 25;
      const angle = (y / 4) * Math.PI * 2;
      yachtGroup.position.set(Math.cos(angle) * radius, -17, Math.sin(angle) * radius);

      cityGroup.add(yachtGroup);
      yachts.push(yachtGroup);
    }

    // Skyline Helicopter
    const heliGroup = new THREE.Group();
    const heliBodyGeo = new THREE.SphereGeometry(3, 16, 16);
    heliBodyGeo.scale(1.8, 1, 1);
    const heliBodyMat = new THREE.MeshStandardMaterial({ color: "#0284c7", metalness: 0.8 });
    const heliBody = new THREE.Mesh(heliBodyGeo, heliBodyMat);
    heliGroup.add(heliBody);

    const heliRotorGeo = new THREE.BoxGeometry(16, 0.2, 0.8);
    heliRotorGeo.translate(0, 3.5, 0);
    const heliRotorMat = new THREE.MeshBasicMaterial({ color: "#e2e8f0" });
    const heliRotor = new THREE.Mesh(heliRotorGeo, heliRotorMat);
    heliGroup.add(heliRotor);

    const heliBeaconGeo = new THREE.SphereGeometry(0.8, 8, 8);
    heliBeaconGeo.translate(0, -2, 0);
    const heliBeaconMat = new THREE.MeshBasicMaterial({ color: "#ef4444" });
    const heliBeacon = new THREE.Mesh(heliBeaconGeo, heliBeaconMat);
    heliGroup.add(heliBeacon);

    heliGroup.position.set(0, 150, 0);
    scene.add(heliGroup);

    // --- 9. Volumetric Cloud Layer ---
    const cloudUniforms = THREE.UniformsUtils.clone(CloudShadowShader.uniforms);
    const cloudMaterial = new THREE.ShaderMaterial({
      uniforms: cloudUniforms,
      vertexShader: CloudShadowShader.vertexShader,
      fragmentShader: CloudShadowShader.fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const cloudPlaneGeo = new THREE.PlaneGeometry(900, 900);
    cloudPlaneGeo.rotateX(-Math.PI / 2);
    const cloudDeckLower = new THREE.Mesh(cloudPlaneGeo, cloudMaterial);
    cloudDeckLower.position.set(0, -40, 0);
    scene.add(cloudDeckLower);

    // --- 10. Mouse Parallax & Interactive Pointer Events ---
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseRef.current.targetX = nx * 15;
      mouseRef.current.targetY = ny * 10;

      // Pass mouse coordinates to Water GLSL shader for ripples
      waterUniforms.uMouse.value.set(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    };

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mousePos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

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

    window.addEventListener("mousemove", handleMouseMove);
    const domEl = renderer.domElement;
    domEl.addEventListener("pointerdown", handlePointerDown);

    // --- 11. Window Resize Listener ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- 12. Main 60fps Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Update Mouse Parallax smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Update Shader Uniforms
      glassUniforms.uTime.value = elapsedTime;
      waterUniforms.uTime.value = elapsedTime;
      trafficUniforms.uTime.value = elapsedTime;
      cloudUniforms.uTime.value = elapsedTime;

      // Rotate city platform slowly
      cityGroup.rotation.y = elapsedTime * 0.015;

      // Animate Luxury Yachts cruising along water canals
      yachts.forEach((yacht, idx) => {
        const speed = 0.08 + idx * 0.02;
        const radius = 175 + idx * 25;
        const angle = elapsedTime * speed + (idx * Math.PI) / 2;
        yacht.position.x = Math.cos(angle) * radius;
        yacht.position.z = Math.sin(angle) * radius;
        yacht.rotation.y = -angle + Math.PI / 2;
      });

      // Animate Skyline Helicopter
      const heliAngle = elapsedTime * 0.25;
      heliGroup.position.x = Math.cos(heliAngle) * 90;
      heliGroup.position.z = Math.sin(heliAngle) * 90;
      heliGroup.rotation.y = -heliAngle;
      heliRotor.rotation.y = elapsedTime * 18.0;

      // Update Camera Position & Target with Scroll Keyframes + Mouse Parallax
      const cameraState = getCameraStateAtProgress(scrollRef.current);
      const parallaxCamPos = cameraState.camPos.clone();
      parallaxCamPos.x += mouseRef.current.x;
      parallaxCamPos.y += mouseRef.current.y;

      camera.position.lerp(parallaxCamPos, 0.08);
      camera.lookAt(cameraState.targetPos);
      camera.fov = THREE.MathUtils.lerp(camera.fov, cameraState.fov, 0.08);
      camera.updateProjectionMatrix();

      // Update Day-to-Night Uniforms & Directional Light
      dirLight.position.copy(cameraState.sunPos);
      dirLight.color.copy(cameraState.sunColor);

      glassUniforms.uSunDirection.value.copy(cameraState.sunPos).normalize();
      glassUniforms.uSunColor.value.copy(cameraState.sunColor);
      glassUniforms.uNightFactor.value = cameraState.nightFactor;

      waterUniforms.uSunDirection.value.copy(cameraState.sunPos).normalize();
      waterUniforms.uSunColor.value.copy(cameraState.sunColor);
      waterUniforms.uNightFactor.value = cameraState.nightFactor;

      skyUniforms.uSunPos.value.copy(cameraState.sunPos);
      skyUniforms.uNightFactor.value = cameraState.nightFactor;

      trafficUniforms.uNightFactor.value = cameraState.nightFactor;
      cloudUniforms.uDensity.value = cameraState.cloudOpacity;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      domEl.removeEventListener("pointerdown", handlePointerDown);
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
