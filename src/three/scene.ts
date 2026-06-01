import * as THREE from "three";

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();

  // Warm sunset sky color background
  const skyColor = new THREE.Color("#f5d4a0");
  scene.background = skyColor;

  // Sunset fog to fade out distant elements beautifully
  scene.fog = new THREE.Fog(skyColor, 30, 80);

  return scene;
}
