import * as THREE from "three";

export function createRenderer(container: HTMLElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });

  // Premium styling and shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Tone mapping for vibrant sunset coloring
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // Responsive sizing
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);

  // Pixel ratio management
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const pixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);
  renderer.setPixelRatio(pixelRatio);

  container.appendChild(renderer.domElement);

  return renderer;
}
