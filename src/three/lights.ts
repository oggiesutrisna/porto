import * as THREE from "three";

export function setupLights(scene: THREE.Scene): {
  directionalLight: THREE.DirectionalLight;
  hemisphereLight: THREE.HemisphereLight;
  ambientLight: THREE.AmbientLight;
} {
  // 1. Warm sunset Hemisphere light (Sky: pastel orange, Ground: warm brown)
  const hemisphereLight = new THREE.HemisphereLight("#ffb88c", "#5a3a2a", 0.6);
  scene.add(hemisphereLight);

  // 2. High intensity warm sunset Directional light
  const directionalLight = new THREE.DirectionalLight("#ff9a3d", 1.2);
  directionalLight.position.set(10, 15, 5); // низкий угол заката
  directionalLight.castShadow = true;

  // Configure high quality soft shadow mapping
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  // Smooth shadows using bias
  directionalLight.shadow.bias = -0.0005;
  directionalLight.shadow.normalBias = 0.02;

  // Adjust shadow camera bounds to fit the 5-island setup (covers roughly 30x30 unit grid)
  const d = 25;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;

  scene.add(directionalLight);

  // 3. Gentle ambient fill light to prevent black shadows
  const ambientLight = new THREE.AmbientLight("#ffcc99", 0.2);
  scene.add(ambientLight);

  return { directionalLight, hemisphereLight, ambientLight };
}
