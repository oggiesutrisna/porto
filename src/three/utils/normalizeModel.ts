import * as THREE from "three";

/**
 * Computes the bounding box of the object and shifts its child meshes
 * so that the geometry is perfectly centered relative to the object's pivot.
 */
export function centerModel(object: THREE.Object3D): void {
  const box = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  box.getCenter(center);
  
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Offset mesh geometry to center it locally
      child.position.sub(center);
    }
  });
}

/**
 * Wraps the given object inside a new THREE.Group, centering the object's
 * bounding box at the wrapper's local coordinate system (0, 0, 0).
 */
export function wrapModel(object: THREE.Object3D): THREE.Group {
  const wrapper = new THREE.Group();
  const box = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  box.getCenter(center);
  
  // Shift original object coordinates so its center sits at wrapper's (0, 0, 0)
  object.position.set(-center.x, -center.y, -center.z);
  wrapper.add(object);
  
  return wrapper;
}

/**
 * Scales the object uniformly so its largest bounding dimension matches the target size.
 */
export function scaleModelToUnit(object: THREE.Object3D, targetSize: number): void {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0) {
    const scaleFactor = targetSize / maxDim;
    object.scale.multiplyScalar(scaleFactor);
  }
}

/**
 * Configures shadow behavior recursively across all meshes inside an object.
 */
export function setModelShadow(
  object: THREE.Object3D,
  castShadow: boolean,
  receiveShadow: boolean
): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;
      
      // Also clone material to make it isolated for hover highlights
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map(m => m.clone());
        } else {
          child.material = child.material.clone();
        }
      }
    }
  });
}

/**
 * Clones a cached GLTF scene to prevent side effects when spawning multiple copies.
 */
export function cloneGLTFScene(gltfScene: THREE.Group): THREE.Group {
  return gltfScene.clone(true);
}
