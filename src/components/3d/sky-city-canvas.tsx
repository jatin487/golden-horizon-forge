import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  GlassFacadeShader,
  WaterGLSLShader,
  DayNightSkyShader,
  TrafficShader,
  CloudShadowShader,
  ArchitectBlueprintShader,
} from "./shaders";
import { getCameraStateAtProgress } from "./camera-choreography";
import { Property, properties } from "@/lib/properties";
import { WeatherMode } from "./city-hud";

interface SkyCityCanvasProps {
  scrollProgress: number;
  onSelectProperty?: (property: Property) => void;
  onHoverProperty?: (property: Property | null) => void;
  weatherMode?: WeatherMode;
  isArchitectMode?: boolean;
  walkthroughProperty?: Property | null;
}

export const SkyCityCanvas: React.FC<SkyCityCanvasProps> = ({
  scrollProgress,
  onSelectProperty,
  onHoverProperty,
  weatherMode = "sunny",
  isArchitectMode = false,
  walkthroughProperty = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  const weatherRef = useRef(weatherMode);
  weatherRef.current = weatherMode;

  const architectRef = useRef(isArchitectMode);
  architectRef.current = isArchitectMode;

  const walkthroughRef = useRef(walkthroughProperty);
  walkthroughRef.current = walkthroughProperty;

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
    scene.fog = new THREE.FogExp2("#09101f", 0.0012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(40, 140, 260);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05; // Balanced exposure to prevent white blowout
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Balanced Lighting System ---
    const ambientLight = new THREE.AmbientLight("#475569", 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#ffe8c4", 1.2);
    dirLight.position.set(140, 220, 140);
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight("#38bdf8", "#0f172a", 0.6);
    scene.add(hemiLight);

    // --- 3. Dynamic Sky Dome Shader ---
    const skyUniforms = THREE.UniformsUtils.clone(DayNightSkyShader.uniforms);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: skyUniforms,
      vertexShader: DayNightSkyShader.vertexShader,
      fragmentShader: DayNightSkyShader.fragmentShader,
    });
    const skyGeo = new THREE.SphereGeometry(1500, 32, 32);
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // --- 4. Mountain Backdrop & Ocean Horizon ---
    const mountainGroup = new THREE.Group();
    const mtnMat = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.9 });

    for (let m = 0; m < 16; m++) {
      const angle = (m / 16) * Math.PI - Math.PI / 2;
      const radius = 950;
      const mx = Math.cos(angle) * radius;
      const mz = Math.sin(angle) * radius;

      const mtnGeo = new THREE.ConeGeometry(180 + (m % 5) * 30, 280 + (m % 4) * 40, 5);
      mtnGeo.translate(0, 140, 0);
      const mtnMesh = new THREE.Mesh(mtnGeo, mtnMat);
      mtnMesh.position.set(mx, 0, mz);
      mountainGroup.add(mtnMesh);
    }
    scene.add(mountainGroup);

    // --- 5. GLSL Water Surface ---
    const waterUniforms = THREE.UniformsUtils.clone(WaterGLSLShader.uniforms);
    const waterMat = new THREE.ShaderMaterial({
      uniforms: waterUniforms,
      vertexShader: WaterGLSLShader.vertexShader,
      fragmentShader: WaterGLSLShader.fragmentShader,
      transparent: true,
    });

    const waterGeo = new THREE.PlaneGeometry(2000, 2000, 128, 128);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -18, 0);
    scene.add(waterMesh);

    // --- 6. City Platform Base & Marina Quay Structure ---
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const baseMat = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.3, metalness: 0.8 });
    const promenadeMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.4 });

    const mainPlatformGeo = new THREE.CylinderGeometry(160, 130, 22, 12);
    const mainPlatform = new THREE.Mesh(mainPlatformGeo, baseMat);
    mainPlatform.position.set(0, -11, 0);
    cityGroup.add(mainPlatform);

    const promenadeGeo = new THREE.RingGeometry(160, 180, 64);
    promenadeGeo.rotateX(Math.PI / 2);
    const promenade = new THREE.Mesh(promenadeGeo, promenadeMat);
    promenade.position.set(0, 0.15, 0);
    cityGroup.add(promenade);

    // --- 7. Exploded Architect Skyscraper & 120+ Instanced Towers ---
    const glassUniforms = THREE.UniformsUtils.clone(GlassFacadeShader.uniforms);
    const glassMaterial = new THREE.ShaderMaterial({
      uniforms: glassUniforms,
      vertexShader: GlassFacadeShader.vertexShader,
      fragmentShader: GlassFacadeShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const blueprintUniforms = THREE.UniformsUtils.clone(ArchitectBlueprintShader.uniforms);
    const blueprintMat = new THREE.ShaderMaterial({
      uniforms: blueprintUniforms,
      vertexShader: ArchitectBlueprintShader.vertexShader,
      fragmentShader: ArchitectBlueprintShader.fragmentShader,
      transparent: true,
    });

    const towerInteractiveMeshes: { mesh: THREE.Mesh; property: Property }[] = [];

    const towerConfigs = [
      { property: properties[0], x: 0, z: 0, w: 26, d: 26, h: 155 }, // Aurelia Residences
      { property: properties[1], x: -60, z: -45, w: 20, d: 20, h: 110 }, // Vantara Hill Villas
      { property: properties[2], x: 65, z: -40, w: 24, d: 24, h: 125 }, // Meridian Tower
      { property: properties[3], x: -55, z: 55, w: 20, d: 20, h: 95 }, // Monarch Collection
      { property: properties[4], x: 60, z: 60, w: 22, d: 22, h: 105 }, // Solaire Cliff Estate
      { property: properties[5], x: 0, z: -75, w: 18, d: 18, h: 90 }, // North Quay
    ];

    // Exploded Group components for Central Aurelia Tower
    const explodedGroup = new THREE.Group();
    cityGroup.add(explodedGroup);

    // Structural Floors & Glass Slabs for Exploded View
    const floorSlabs: THREE.Mesh[] = [];
    const glassPanels: THREE.Mesh[] = [];

    const coreMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 155, 10), blueprintMat);
    coreMesh.position.set(0, 77.5, 0);
    explodedGroup.add(coreMesh);

    for (let f = 0; f < 10; f++) {
      const slabMesh = new THREE.Mesh(new THREE.BoxGeometry(26, 1.5, 26), baseMat);
      const initialY = f * 15.5 + 5;
      slabMesh.position.set(0, initialY, 0);
      slabMesh.userData = { initialY };
      explodedGroup.add(slabMesh);
      floorSlabs.push(slabMesh);

      const glassGeo = new THREE.BoxGeometry(26.4, 14, 26.4);
      const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
      glassMesh.position.set(0, initialY + 7, 0);
      glassMesh.userData = { initialY: initialY + 7 };
      explodedGroup.add(glassMesh);
      glassPanels.push(glassMesh);

      towerInteractiveMeshes.push({ mesh: glassMesh, property: properties[0] });
    }

    // Remaining Key Towers
    towerConfigs.slice(1).forEach((cfg) => {
      const towerGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d, 1, 35, 1);
      towerGeo.translate(0, cfg.h / 2, 0);

      const towerMesh = new THREE.Mesh(towerGeo, glassMaterial);
      towerMesh.position.set(cfg.x, 0, cfg.z);
      cityGroup.add(towerMesh);

      towerInteractiveMeshes.push({ mesh: towerMesh, property: cfg.property || properties[0] });
    });

    // 120+ Instanced Skyscrapers Grid
    const instancedCount = 120;
    const instancedGeo = new THREE.BoxGeometry(12, 60, 12);
    instancedGeo.translate(0, 30, 0);
    const instancedMesh = new THREE.InstancedMesh(instancedGeo, glassMaterial, instancedCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < instancedCount; i++) {
      const angle = (i / instancedCount) * Math.PI * 2;
      const radius = 90 + (i % 6) * 22;
      const tx = Math.cos(angle) * radius;
      const tz = Math.sin(angle) * radius;
      const scaleY = 0.5 + (i % 8) * 0.25;

      dummy.position.set(tx, 0, tz);
      dummy.scale.set(1, scaleY, 1);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }
    cityGroup.add(instancedMesh);

    // --- 8. Elevated Glowing Skyways & Traffic ---
    const trafficUniforms = THREE.UniformsUtils.clone(TrafficShader.uniforms);
    const trafficMaterial = new THREE.ShaderMaterial({
      uniforms: trafficUniforms,
      vertexShader: TrafficShader.vertexShader,
      fragmentShader: TrafficShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    [115, 165].forEach((radius, idx) => {
      const roadGeo = new THREE.RingGeometry(radius - 3.0, radius + 3.0, 64);
      roadGeo.rotateX(Math.PI / 2);
      const roadMesh = new THREE.Mesh(roadGeo, trafficMaterial);
      roadMesh.position.set(0, 6 + idx * 14, 0);
      cityGroup.add(roadMesh);
    });

    // --- 9. Animated Luxury Yachts & Rain Particles ---
    const yachts: THREE.Group[] = [];
    const yachtMatBody = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.1 });

    for (let y = 0; y < 6; y++) {
      const yachtGroup = new THREE.Group();
      const hull = new THREE.Mesh(new THREE.ConeGeometry(3.5, 18, 4), yachtMatBody);
      hull.rotateX(Math.PI / 2);
      hull.scale.set(1, 0.4, 1);
      yachtGroup.add(hull);

      const radius = 200 + y * 30;
      const angle = (y / 6) * Math.PI * 2;
      yachtGroup.position.set(Math.cos(angle) * radius, -17, Math.sin(angle) * radius);
      cityGroup.add(yachtGroup);
      yachts.push(yachtGroup);
    }

    // --- 10. Interactive Raycaster & Hover Detection ---
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

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

      const rect = renderer.domElement.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mousePos, camera);
      const meshesToTest = towerInteractiveMeshes.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hit = towerInteractiveMeshes.find((item) => item.mesh === intersects[0].object);
        if (hit && onHoverProperty) {
          onHoverProperty(hit.property);
        }
      } else {
        if (onHoverProperty) onHoverProperty(null);
      }

      waterUniforms.uMouse.value.set(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    };

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

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      orbitRef.current.zoom = Math.max(0.5, Math.min(2.0, orbitRef.current.zoom + e.deltaY * 0.001));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    domEl.addEventListener("wheel", handleWheel, { passive: true });

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

    // --- 12. Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentNightFactor = 0.0;
    let explodedFactor = 0.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Weather & Day/Night interpolation
      let targetNight = 0.0;
      if (weatherRef.current === "night") targetNight = 1.0;
      if (weatherRef.current === "golden") targetNight = 0.45;
      if (weatherRef.current === "rain") targetNight = 0.6;
      if (weatherRef.current === "fog") targetNight = 0.5;

      currentNightFactor += (targetNight - currentNightFactor) * 0.05;

      // Exploded Architect Mode interpolation
      const targetExploded = architectRef.current ? 1.0 : 0.0;
      explodedFactor += (targetExploded - explodedFactor) * 0.06;

      // Animate Exploded Floors & Glass Slabs
      floorSlabs.forEach((slab, idx) => {
        const initialY = slab.userData.initialY;
        slab.position.y = initialY + explodedFactor * (idx * 6 + 10);
      });

      glassPanels.forEach((panel, idx) => {
        const initialY = panel.userData.initialY;
        panel.position.y = initialY + explodedFactor * (idx * 6 + 10);
        panel.position.x = explodedFactor * (idx % 2 === 0 ? 12 : -12);
      });

      // Shader Uniforms
      glassUniforms.uTime.value = elapsedTime;
      waterUniforms.uTime.value = elapsedTime;
      trafficUniforms.uTime.value = elapsedTime;
      cloudUniforms.uTime.value = elapsedTime;
      blueprintUniforms.uTime.value = elapsedTime;

      cityGroup.rotation.y = elapsedTime * 0.01 + orbitRef.current.azimuth;

      // Yachts
      yachts.forEach((yacht, idx) => {
        const speed = 0.06 + idx * 0.015;
        const radius = 200 + idx * 30;
        const angle = elapsedTime * speed + (idx * Math.PI) / 3;
        yacht.position.x = Math.cos(angle) * radius;
        yacht.position.z = Math.sin(angle) * radius;
        yacht.rotation.y = -angle + Math.PI / 2;
      });

      // Camera position & target calculation
      let cameraState = getCameraStateAtProgress(scrollRef.current);

      // Walkthrough Mode Camera Fly-To Interior Override
      if (walkthroughRef.current) {
        cameraState = {
          camPos: new THREE.Vector3(0, 45, 12),
          targetPos: new THREE.Vector3(0, 45, 0),
          fov: 65,
          sunPos: new THREE.Vector3(120, 200, 120),
          sunColor: "#ffffff",
          cloudOpacity: 0.2,
          nightFactor: currentNightFactor,
          currentChapter: cameraState.currentChapter,
          nextChapter: cameraState.nextChapter,
          transitionFactor: 1.0,
        };
      }

      const baseCamPos = cameraState.camPos.clone();
      baseCamPos.multiplyScalar(orbitRef.current.zoom);
      baseCamPos.y += orbitRef.current.polar * 80;

      camera.position.lerp(baseCamPos, 0.08);
      camera.lookAt(cameraState.targetPos);
      camera.fov = THREE.MathUtils.lerp(camera.fov, cameraState.fov, 0.08);
      camera.updateProjectionMatrix();

      // Lighting updates
      const activeSunPos = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(140, 220, 140),
        new THREE.Vector3(-140, 180, -140),
        currentNightFactor
      );

      dirLight.position.copy(activeSunPos);
      dirLight.intensity = THREE.MathUtils.lerp(1.4, 0.35, currentNightFactor);

      glassUniforms.uSunDirection.value.copy(activeSunPos).normalize();
      glassUniforms.uNightFactor.value = currentNightFactor;

      waterUniforms.uSunDirection.value.copy(activeSunPos).normalize();
      waterUniforms.uNightFactor.value = currentNightFactor;
      waterUniforms.uWeather.value = weatherRef.current === "rain" ? 1 : 0;

      skyUniforms.uSunPos.value.copy(activeSunPos);
      skyUniforms.uNightFactor.value = currentNightFactor;

      trafficUniforms.uNightFactor.value = currentNightFactor;
      cloudUniforms.uDensity.value = weatherRef.current === "fog" ? 0.95 : 0.45;

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
  }, [onSelectProperty, onHoverProperty]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
    />
  );
};
