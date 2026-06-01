import * as THREE from "three";

export function createIsometricCamera(
  container: HTMLElement,
): THREE.OrthographicCamera {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Orthographic frustum boundaries
  const aspect = width / height;
  const frustumSize = 8;

  const camera = new THREE.OrthographicCamera(
    -frustumSize * aspect,
    frustumSize * aspect,
    frustumSize,
    -frustumSize,
    0.1,
    1000,
  );

  // Isometric starting perspective
  camera.position.set(8, 8, 8);
  camera.lookAt(0, 0, 0);

  return camera;
}

export function updateCameraSize(
  camera: THREE.OrthographicCamera,
  width: number,
  height: number,
  frustumSize = 8,
): void {
  const aspect = width / height;
  camera.left = -frustumSize * aspect;
  camera.right = frustumSize * aspect;
  camera.top = frustumSize;
  camera.bottom = -frustumSize;
  camera.updateProjectionMatrix();
}
