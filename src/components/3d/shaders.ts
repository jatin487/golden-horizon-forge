import * as THREE from "three";

/**
 * Glass Facade Shader with Wind Sway, Fresnel Reflections, Sun Specular, Window Grid & Night Illumination
 */
export const GlassFacadeShader = {
  uniforms: {
    uTime: { value: 0 },
    uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3).normalize() },
    uSunColor: { value: new THREE.Color("#ffe8c4") },
    uSkyColor: { value: new THREE.Color("#1e3a8a") },
    uCloudColor: { value: new THREE.Color("#e0eaf5") },
    uGlassColor: { value: new THREE.Color("#0b1329") },
    uSwayAmount: { value: 1.0 },
    uFresnelPower: { value: 2.5 },
    uNightFactor: { value: 0.0 }, // 0.0 Day -> 1.0 Night
    uHovered: { value: 0.0 }, // 1.0 when hovered
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uSwayAmount;
    
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying float vSwayFactor;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Height-based wind sway physics
      float heightFactor = max(0.0, pos.y);
      float swayX = sin(uTime * 1.4 + pos.y * 0.1) * (heightFactor * 0.006) * uSwayAmount;
      float swayZ = cos(uTime * 1.1 + pos.y * 0.08) * (heightFactor * 0.004) * uSwayAmount;
      pos.x += swayX;
      pos.z += swayZ;
      vSwayFactor = length(vec2(swayX, swayZ));

      vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPosition.xyz;

      vec4 mvPosition = viewMatrix * worldPosition;
      vViewPosition = -mvPosition.xyz;

      vNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform vec3 uSkyColor;
    uniform vec3 uCloudColor;
    uniform vec3 uGlassColor;
    uniform float uFresnelPower;
    uniform float uNightFactor;
    uniform float uHovered;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying float vSwayFactor;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel reflection factor
      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), uFresnelPower);

      // Sun specular highlight
      vec3 reflectDir = reflect(-uSunDirection, normal);
      float spec = pow(max(0.0, dot(viewDir, reflectDir)), 48.0);
      vec3 specular = uSunColor * spec * (1.2 * (1.0 - uNightFactor * 0.8));

      // Sky environmental reflection gradient
      float skyGradient = clamp(normal.y * 0.5 + 0.5, 0.0, 1.0);
      vec3 dayEnv = mix(uCloudColor, uSkyColor, skyGradient);
      vec3 nightEnv = mix(vec3(0.02, 0.05, 0.12), vec3(0.05, 0.1, 0.22), skyGradient);
      vec3 envReflect = mix(dayEnv, nightEnv, uNightFactor);

      // Window grid pattern illumination
      vec2 windowUv = fract(vUv * vec2(14.0, 45.0));
      float windowBorder = step(0.12, windowUv.x) * step(0.12, 1.0 - windowUv.x) *
                           step(0.15, windowUv.y) * step(0.15, 1.0 - windowUv.y);
      
      // Window illumination pattern
      float windowId = floor(vUv.x * 14.0) + floor(vUv.y * 45.0) * 14.0;
      float windowThreshold = mix(0.45, 0.15, uNightFactor);
      float windowOn = step(windowThreshold, sin(windowId * 13.578));

      vec3 windowColorDay = vec3(0.95, 0.85, 0.6) * 0.45;
      vec3 windowColorNight = vec3(1.0, 0.88, 0.5) * 1.8;
      vec3 windowGlow = mix(windowColorDay, windowColorNight, uNightFactor) * windowOn * windowBorder;

      // Base glass color + Fresnel + Specular + Window interior
      vec3 baseGlass = mix(uGlassColor, vec3(0.02, 0.05, 0.1), uNightFactor);
      vec3 finalColor = mix(baseGlass, envReflect, fresnel * 0.65 + 0.15);
      finalColor += specular;
      finalColor += windowGlow;

      // Hover Holographic Highlight Aura
      if (uHovered > 0.5) {
        finalColor += vec3(0.98, 0.75, 0.18) * (fresnel * 1.5 + 0.4);
      }

      gl_FragColor = vec4(finalColor, 0.92);
    }
  `,
};

/**
 * Exploded Architect Blueprint Grid Shader
 */
export const ArchitectBlueprintShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorGrid: { value: new THREE.Color("#38bdf8") },
    uColorCore: { value: new THREE.Color("#fbbf24") },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorGrid;
    uniform vec3 uColorCore;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
      float line = min(grid.x, grid.y);
      float gridPattern = 1.0 - min(line, 1.0);

      float edge = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      vec3 col = mix(uColorGrid, uColorCore, sin(vPosition.y * 0.1 + uTime * 2.0) * 0.5 + 0.5);
      col *= (gridPattern * 1.5 + edge * 2.0 + 0.3);

      gl_FragColor = vec4(col, 0.85);
    }
  `,
};

/**
 * GLSL Water Surface Shader with Wave Displacement, Fresnel Refractions, Specular Sparkles & Mouse Ripples
 */
export const WaterGLSLShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3).normalize() },
    uSunColor: { value: new THREE.Color("#ffe8c4") },
    uNightFactor: { value: 0.0 },
    uWeather: { value: 0 }, // 0: sunny, 1: rain, 2: fog
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform int uWeather;
    
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWave;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Compound Sine Waves
      float w1 = sin(pos.x * 0.05 + uTime * 1.5) * 0.8;
      float w2 = cos(pos.z * 0.04 + uTime * 1.2) * 0.7;
      float w3 = sin((pos.x + pos.z) * 0.08 + uTime * 2.0) * 0.4;
      
      // Mouse interaction ripples
      vec2 mouseWorld = (uMouse - 0.5) * 300.0;
      float distToMouse = length(pos.xz - mouseWorld);
      float mouseRipple = sin(distToMouse * 0.1 - uTime * 4.0) * exp(-distToMouse * 0.015) * 1.2;

      // Rain drop ripples
      float rainRipple = 0.0;
      if (uWeather == 1) {
        float r1 = sin(pos.x * 0.8 + uTime * 8.0) * cos(pos.z * 0.8 + uTime * 8.0) * 0.3;
        rainRipple = r1;
      }

      pos.y += w1 + w2 + w3 + mouseRipple + rainRipple;
      vWave = pos.y;

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPos.xyz;

      vec3 n = vec3(
        -cos(pos.x * 0.05 + uTime * 1.5) * 0.04,
        1.0,
        -sin(pos.z * 0.04 + uTime * 1.2) * 0.03
      );
      vNormal = normalize(mat3(modelMatrix) * n);

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform float uNightFactor;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vWave;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vNormal);

      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);

      vec3 waterDeepDay = vec3(0.02, 0.12, 0.24);
      vec3 waterShallowDay = vec3(0.05, 0.35, 0.45);
      vec3 waterDeepNight = vec3(0.01, 0.03, 0.08);
      vec3 waterShallowNight = vec3(0.02, 0.08, 0.18);

      vec3 waterDeep = mix(waterDeepDay, waterDeepNight, uNightFactor);
      vec3 waterShallow = mix(waterShallowDay, waterShallowNight, uNightFactor);

      vec3 baseWater = mix(waterDeep, waterShallow, smoothstep(-1.0, 1.0, vWave));

      vec3 reflectDir = reflect(-uSunDirection, normal);
      float spec = pow(max(0.0, dot(viewDir, reflectDir)), 64.0);
      vec3 specular = uSunColor * spec * (2.0 * (1.0 - uNightFactor * 0.85));

      vec3 skyReflectDay = vec3(0.3, 0.55, 0.85);
      vec3 skyReflectNight = vec3(0.05, 0.1, 0.25);
      vec3 skyReflect = mix(skyReflectDay, skyReflectNight, uNightFactor);

      vec3 finalWater = mix(baseWater, skyReflect, fresnel * 0.7);
      finalWater += specular;

      float foam = smoothstep(1.0, 1.8, vWave);
      finalWater += vec3(0.8, 0.95, 1.0) * foam * 0.4;

      gl_FragColor = vec4(finalWater, 0.92);
    }
  `,
};

/**
 * Dynamic Day-to-Night Sky Dome Shader
 */
export const DayNightSkyShader = {
  uniforms: {
    uSunPos: { value: new THREE.Vector3(100, 200, 120) },
    uNightFactor: { value: 0.0 },
  },
  vertexShader: /* glsl */ `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uSunPos;
    uniform float uNightFactor;
    varying vec3 vWorldPosition;

    float hash(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    }

    void main() {
      vec3 nPos = normalize(vWorldPosition);
      float h = nPos.y;

      vec3 dayTop = vec3(0.05, 0.15, 0.35);
      vec3 dayBottom = vec3(0.15, 0.35, 0.65);
      vec3 dayHorizon = vec3(0.9, 0.6, 0.35);
      vec3 daySky = mix(dayBottom, dayTop, max(0.0, h));
      daySky = mix(dayHorizon, daySky, smoothstep(-0.1, 0.4, h));

      vec3 nightTop = vec3(0.01, 0.02, 0.06);
      vec3 nightBottom = vec3(0.03, 0.06, 0.14);
      vec3 nightHorizon = vec3(0.08, 0.12, 0.25);
      vec3 nightSky = mix(nightBottom, nightTop, max(0.0, h));
      nightSky = mix(nightHorizon, nightSky, smoothstep(-0.1, 0.4, h));

      float starVal = step(0.994, hash(floor(nPos * 400.0)));
      vec3 stars = vec3(starVal) * uNightFactor * step(0.05, h);

      vec3 finalSky = mix(daySky, nightSky, uNightFactor) + stars;

      vec3 sunDir = normalize(uSunPos);
      float sunDot = max(0.0, dot(nPos, sunDir));
      vec3 sunGlow = vec3(1.0, 0.85, 0.5) * pow(sunDot, 64.0) * (2.0 * (1.0 - uNightFactor));
      vec3 moonGlow = vec3(0.7, 0.85, 1.0) * pow(max(0.0, dot(nPos, -sunDir)), 128.0) * uNightFactor * 1.5;

      finalSky += sunGlow + moonGlow;

      gl_FragColor = vec4(finalSky, 1.0);
    }
  `,
};

/**
 * Glowing Animated Traffic Shader for Skyways & Bridges
 */
export const TrafficShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorHeadlights: { value: new THREE.Color("#ffdd88") },
    uColorTaillights: { value: new THREE.Color("#ff2255") },
    uSpeed: { value: 1.2 },
    uNightFactor: { value: 0.0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorHeadlights;
    uniform vec3 uColorTaillights;
    uniform float uSpeed;
    uniform float uNightFactor;

    varying vec2 vUv;

    void main() {
      float flow1 = fract(vUv.x * 8.0 - uTime * uSpeed);
      float flow2 = fract(vUv.x * 8.0 + uTime * (uSpeed * 0.75));

      float streak1 = smoothstep(0.6, 1.0, flow1);
      float streak2 = smoothstep(0.6, 1.0, flow2);

      float lane1 = step(0.5, vUv.y);
      float lane2 = 1.0 - lane1;

      float intensity = mix(2.0, 3.5, uNightFactor);
      vec3 color = uColorHeadlights * streak1 * lane1 * intensity + uColorTaillights * streak2 * lane2 * intensity;

      float centerGlow = 1.0 - abs(vUv.y - 0.5) * 2.0;
      color += vec3(0.2, 0.5, 0.9) * pow(centerGlow, 3.0) * (0.6 + uNightFactor * 0.5);

      gl_FragColor = vec4(color, clamp(length(color), 0.1, 1.0));
    }
  `,
};

/**
 * Drifting Cloud Layer Shader
 */
export const CloudShadowShader = {
  uniforms: {
    uTime: { value: 0 },
    uCloudColor: { value: new THREE.Color("#ffffff") },
    uShadowColor: { value: new THREE.Color("#0c1524") },
    uDensity: { value: 0.8 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uCloudColor;
    uniform vec3 uShadowColor;
    uniform float uDensity;

    varying vec2 vUv;
    varying vec3 vWorldPosition;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 cloudUv = vWorldPosition.xz * 0.015 + vec2(uTime * 0.015, uTime * 0.008);
      float n = fbm(cloudUv);

      float alpha = smoothstep(0.35, 0.75, n) * uDensity;
      vec3 cloudCol = mix(uCloudColor, vec3(0.9, 0.95, 1.0), n);

      gl_FragColor = vec4(cloudCol, alpha * 0.7);
    }
  `,
};
