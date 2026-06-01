import * as THREE from "three";

/**
 * Check if the browser supports WebGL context.
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Perform target updates based on mobile state or hardware tier.
 */
export function optimizePerformance(
  renderer: THREE.WebGLRenderer,
  directionalLight: THREE.DirectionalLight,
): void {
  const isMobile =
    window.matchMedia("(max-width: 768px)").matches ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  if (isMobile) {
    // Drop shadow mapping on low performance mobile viewports
    renderer.shadowMap.enabled = false;
    directionalLight.castShadow = false;

    // Pin pixel ratio strictly to 1.0
    renderer.setPixelRatio(1.0);
  } else {
    // High capabilities desktop
    renderer.shadowMap.enabled = true;
    directionalLight.castShadow = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }
}
