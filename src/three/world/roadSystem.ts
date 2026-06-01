import * as THREE from "three";
import { assetLoader } from "../loader";
import { ROAD_ASSETS } from "../assets/roadRegistry";
import { wrapModel, setModelShadow } from "../utils/normalizeModel";
import {
  type AreaId,
  type RoadTileLayout,
  validateRoadTile,
} from "./compositionRules";

// Do not add random road tiles. This portfolio uses curated composition.
export const roadLayouts: Record<AreaId, RoadTileLayout[]> = {
  home: [],
  projects: [
    // Mini business district: one clean main road, one central plaza, short building driveways.
    { type: "straight", position: [-4, 0.08, -10], rotation: Math.PI / 2, scale: 0.68 },
    { type: "straight", position: [-2, 0.08, -10], rotation: Math.PI / 2, scale: 0.68 },
    { type: "intersection", position: [0, 0.08, -10], rotation: 0, scale: 0.68 },
    { type: "straight", position: [2, 0.08, -10], rotation: Math.PI / 2, scale: 0.68 },
    { type: "straight", position: [4, 0.08, -10], rotation: Math.PI / 2, scale: 0.68 },
    { type: "driveway", position: [-3, 0.08, -9], rotation: 0, scale: 0.55 },
    { type: "driveway", position: [0, 0.08, -9], rotation: 0, scale: 0.55 },
    { type: "driveway", position: [3, 0.08, -9], rotation: 0, scale: 0.55 },
    { type: "driveway", position: [-3, 0.08, -11], rotation: Math.PI, scale: 0.55 },
    { type: "driveway", position: [0, 0.08, -11], rotation: Math.PI, scale: 0.55 },
    { type: "driveway", position: [3, 0.08, -11], rotation: Math.PI, scale: 0.55 },
  ],
  skills: [],
  about: [],
  contact: [],
};

// Track instances of road meshes currently active in the scene
const activeRoadTiles: THREE.Object3D[] = [];

/**
 * Snaps a value to a defined grid size.
 */
export function snapToGrid(value: number, spacing = 2): number {
  return Math.round(value / spacing) * spacing;
}

/**
 * Spawns a single modular road tile in the scene.
 */
export async function addRoadTile(
  scene: THREE.Scene,
  type: keyof typeof ROAD_ASSETS,
  x: number,
  y: number,
  z: number,
  rotation: number,
  scale = 0.68,
  interactiveObjects?: THREE.Object3D[]
): Promise<THREE.Object3D> {
  const url = ROAD_ASSETS[type];
  let tileObject: THREE.Object3D;

  try {
    const rawGroup = await assetLoader.loadGLB(url);
    
    // Normalize shadows
    setModelShadow(rawGroup, false, true);

    // Create wrapper to adjust pivots safely
    const wrapped = wrapModel(rawGroup);
    wrapped.position.set(x, y, z);
    wrapped.rotation.y = rotation;

    // Normalizing X and Z dimensions to exactly 2.0 units wide for seamless edge matches
    const box = new THREE.Box3().setFromObject(wrapped);
    const size = new THREE.Vector3();
    box.getSize(size);

    const targetSize = 2.0 * scale;
    const scaleX = size.x > 0 ? targetSize / size.x : 1;
    const scaleZ = size.z > 0 ? targetSize / size.z : 1;

    // Preserve height scale, scale only horizontal dimensions
    wrapped.scale.set(scaleX, 1.0, scaleZ);

    // Fine-tune materials to make asphalt darker and match sunset tone mapper
    wrapped.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        // Make asphalt darker for high visual contrast
        if (mat.name.toLowerCase().includes("asphalt") || mat.name.toLowerCase().includes("road")) {
          mat.color.setHex(0x1a1a1e);
          mat.roughness = 0.85;
          mat.metalness = 0.05;
        }
      }
    });

    scene.add(wrapped);
    tileObject = wrapped;
  } catch (error) {
    console.warn(`Failed to spawn road tile ${type} at (${x}, ${z}). Spawning fallback.`, error);
    
    // Procedural Dark Asphalt fallback plane
    const fallGeo = new THREE.PlaneGeometry(2.0 * scale, 2.0 * scale);
    const fallMat = new THREE.MeshStandardMaterial({
      color: "#1f1f24",
      roughness: 0.9,
      metalness: 0.05
    });
    const fallback = new THREE.Mesh(fallGeo, fallMat);
    fallback.rotation.x = -Math.PI / 2;
    fallback.position.set(x, y + 0.005, z);
    fallback.receiveShadow = true;
    
    scene.add(fallback);
    tileObject = fallback;
  }

  // Push to tracking cache
  activeRoadTiles.push(tileObject);

  // If designated as interactive or part of intersected items
  if (interactiveObjects && tileObject.userData) {
    tileObject.userData.clickable = false; // road clicking does not trigger modals
  }

  return tileObject;
}

/**
 * Builds the complete modular road network from defined data coordinates.
 */
export async function buildRoadNetwork(
  scene: THREE.Scene,
  interactiveObjects?: THREE.Object3D[]
): Promise<void> {
  // Clear any existing active tiles first
  clearRoadNetwork(scene);

  const spawnPromises: Promise<THREE.Object3D>[] = [];

  // Iterate and spawn all area modular tiles
  Object.keys(roadLayouts).forEach((areaKey) => {
    const areaId = areaKey as AreaId;
    let acceptedCount = 0;
    const tiles = roadLayouts[areaId];
    tiles.forEach((tile) => {
      if (!validateRoadTile(areaId, tile, acceptedCount)) return;
      acceptedCount += 1;
      spawnPromises.push(
        addRoadTile(
          scene,
          tile.type as keyof typeof ROAD_ASSETS,
          tile.position[0],
          tile.position[1],
          tile.position[2],
          tile.rotation,
          tile.scale,
          interactiveObjects
        )
      );
    });
  });

  await Promise.all(spawnPromises);
}

/**
 * Cleanly disposes and removes all instantiated road tiles from the scene.
 */
export function clearRoadNetwork(scene: THREE.Scene): void {
  activeRoadTiles.forEach((tile) => {
    scene.remove(tile);
    tile.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  });
  
  // Reset array cache
  activeRoadTiles.length = 0;
}
