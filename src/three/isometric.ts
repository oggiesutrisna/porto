import * as THREE from "three";
import { updateCameraSize } from "./camera";

export type AreaId = "home" | "projects" | "skills" | "about" | "contact";

export interface AreaView {
  id: AreaId;
  position: { x: number; y: number; z: number };
  zoom: number;
}

export const AREA_VIEWS: Record<AreaId, AreaView> = {
  home: { id: "home", position: { x: 0, y: 0, z: 0 }, zoom: 1.0 },
  projects: { id: "projects", position: { x: 0, y: 0, z: -10 }, zoom: 1.1 },
  skills: { id: "skills", position: { x: -10, y: 0, z: 0 }, zoom: 1.2 },
  about: { id: "about", position: { x: 10, y: 0, z: 0 }, zoom: 1.1 },
  contact: { id: "contact", position: { x: 0, y: 0, z: 10 }, zoom: 1.2 },
};

// Global state for camera animation
let animationFrameId: number | null = null;
let currentLookAt = new THREE.Vector3(0, 0, 0);

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function focusArea(
  camera: THREE.OrthographicCamera,
  area: AreaView,
  durationMs = 800,
): Promise<void> {
  return new Promise((resolve) => {
    // Cancel active transitions
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }

    // Reduced motion check
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      const targetPos = new THREE.Vector3(
        area.position.x + 8,
        area.position.y + 8,
        area.position.z + 8,
      );
      camera.position.copy(targetPos);
      currentLookAt.set(area.position.x, area.position.y, area.position.z);
      camera.lookAt(currentLookAt);
      camera.zoom = area.zoom;
      camera.updateProjectionMatrix();
      resolve();
      return;
    }

    const startPos = camera.position.clone();
    const startZoom = camera.zoom;
    const startLookAt = currentLookAt.clone();

    const targetPos = new THREE.Vector3(
      area.position.x + 8,
      area.position.y + 8,
      area.position.z + 8,
    );
    const targetLookAt = new THREE.Vector3(
      area.position.x,
      area.position.y,
      area.position.z,
    );

    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1.0);
      const ease = easeInOutCubic(progress);

      // Interpolate position
      camera.position.lerpVectors(startPos, targetPos, ease);

      // Interpolate target lookAt
      currentLookAt.lerpVectors(startLookAt, targetLookAt, ease);
      camera.lookAt(currentLookAt);

      // Interpolate zoom
      camera.zoom = startZoom + (area.zoom - startZoom) * ease;
      camera.updateProjectionMatrix();

      if (progress < 1.0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = null;
        resolve();
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  });
}

export function zoomTo(
  camera: THREE.OrthographicCamera,
  value: number,
  durationMs = 500,
): Promise<void> {
  return new Promise((resolve) => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }

    const startZoom = camera.zoom;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1.0);
      const ease = easeInOutCubic(progress);

      camera.zoom = startZoom + (value - startZoom) * ease;
      camera.updateProjectionMatrix();

      if (progress < 1.0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = null;
        resolve();
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  });
}

export function resetCamera(
  camera: THREE.OrthographicCamera,
  durationMs = 800,
): Promise<void> {
  return focusArea(camera, AREA_VIEWS.home, durationMs);
}

export function updateOnResize(
  camera: THREE.OrthographicCamera,
  width: number,
  height: number,
): void {
  updateCameraSize(camera, width, height);
}
