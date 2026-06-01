import * as THREE from "three";
import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";

export interface LoadingStatus {
  loaded: number;
  total: number;
  percent: number;
}

export type ProgressCallback = (status: LoadingStatus) => void;

class AssetLoader {
  private loader = new GLTFLoader();
  private cache = new Map<string, THREE.Group>();
  private pendingCount = 0;
  private progressTracker = new Map<
    string,
    { loaded: number; total: number }
  >();
  private onProgressCallbacks = new Set<ProgressCallback>();

  public registerOnProgress(callback: ProgressCallback): () => void {
    this.onProgressCallbacks.add(callback);
    return () => this.onProgressCallbacks.delete(callback);
  }

  private triggerProgress(): void {
    let loadedSum = 0;
    let totalSum = 0;

    this.progressTracker.forEach((val) => {
      loadedSum += val.loaded;
      totalSum += val.total;
    });

    const percent = totalSum > 0 ? Math.round((loadedSum / totalSum) * 100) : 0;

    this.onProgressCallbacks.forEach((cb) =>
      cb({
        loaded: loadedSum,
        total: totalSum,
        percent: Math.min(percent, 100),
      }),
    );
  }

  /**
   * Load GLB model from path with caching and mock fail-safes.
   */
  public async loadGLB(path: string): Promise<THREE.Group> {
    if (this.cache.has(path)) {
      return this.cache.get(path)!.clone();
    }

    this.pendingCount++;
    this.progressTracker.set(path, { loaded: 0, total: 100000 }); // Estimate sizes initially
    this.triggerProgress();

    try {
      const gltf = await new Promise<GLTF>((resolve, reject) => {
        this.loader.load(
          path,
          (data) => resolve(data),
          (xhr) => {
            if (xhr.total > 0) {
              this.progressTracker.set(path, {
                loaded: xhr.loaded,
                total: xhr.total,
              });
            } else {
              this.progressTracker.set(path, {
                loaded: xhr.loaded,
                total: xhr.loaded * 2 || 100000,
              });
            }
            this.triggerProgress();
          },
          (error) => reject(error),
        );
      });

      // Cache and return
      const scene = gltf.scene;

      // Configure shadow settings recursively on loaded meshes
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Standard linear mapping colors matching Kenney expectations
          if (child.material) {
            child.material.roughness = 0.8;
            child.material.metalness = 0.1;
          }
        }
      });

      this.cache.set(path, scene);
      this.pendingCount--;
      this.progressTracker.delete(path);
      this.triggerProgress();

      return scene.clone();
    } catch (err) {
      console.error(
        `Failed to load asset: ${path}. Creating standard robust fallback mesh.`,
        err,
      );

      // Build fallback colored cube
      const fallbackGroup = new THREE.Group();
      const geom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const mat = new THREE.MeshStandardMaterial({
        color: "#d94f2a",
        roughness: 0.7,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      fallbackGroup.add(mesh);

      this.cache.set(path, fallbackGroup);
      this.pendingCount--;
      this.progressTracker.delete(path);
      this.triggerProgress();

      return fallbackGroup.clone();
    }
  }
}

export const assetLoader = new AssetLoader();
export default assetLoader;
