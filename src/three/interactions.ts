import * as THREE from "three";

export function setupInteractions(
  camera: THREE.OrthographicCamera,
  scene: THREE.Scene,
  interactiveObjects: THREE.Object3D[],
  container: HTMLElement,
): {
  cleanup: () => void;
} {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let currentHovered: THREE.Object3D | null = null;
  let currentHoveredGroup: THREE.Group | null = null;
  let outlineHelper: THREE.BoxHelper | null = null;

  // Hover detection
  const onPointerMove = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      let targetObj: THREE.Object3D | null = intersects[0].object;
      while (targetObj && !targetObj.userData.interactive) {
        targetObj = targetObj.parent;
      }

      if (targetObj && targetObj.userData.interactive) {
        if (currentHovered !== targetObj) {
          // Clear previous hover first
          clearHover();

          currentHovered = targetObj;
          container.style.cursor = "pointer";

          // 1. Group Scale Up (For project buildings and complex components)
          const parentGroup = targetObj.userData.parentGroup as THREE.Group | undefined;
          if (parentGroup) {
            currentHoveredGroup = parentGroup;
            const originalScale = (parentGroup.userData.originalScale as THREE.Vector3) || new THREE.Vector3(0.9, 0.9, 0.9);
            // Smoothly scale up by 8%
            parentGroup.scale.copy(originalScale).multiplyScalar(1.08);
          }

          // 2. Emissive glow highlight
          if (targetObj instanceof THREE.Mesh && targetObj.material) {
            const mat = targetObj.material as THREE.MeshStandardMaterial;
            if (typeof mat.emissive !== "undefined") {
              // Save original emissive color if not already cached
              if (typeof targetObj.userData.originalEmissive === "undefined") {
                targetObj.userData.originalEmissive = mat.emissive.clone();
              }
              // Warm orange sunset emissive glow
              mat.emissive.setHex(0x44220b);
            }
          }

          // 3. Draw outline helper box
          outlineHelper = new THREE.BoxHelper(
            parentGroup || targetObj,
            new THREE.Color("#ff9a3d"),
          );
          scene.add(outlineHelper);

          // Dispatch hover projection coordinates
          const vector = new THREE.Vector3();
          targetObj.getWorldPosition(vector);
          vector.project(camera);
          const x = (vector.x * 0.5 + 0.5) * rect.width;
          const y = (-(vector.y * 0.5) + 0.5) * rect.height;

          window.dispatchEvent(
            new CustomEvent("3d-hover", {
              detail: {
                hovered: true,
                id: targetObj.userData.id,
                type: targetObj.userData.type,
                title: targetObj.userData.title,
                screenX: x,
                screenY: y,
              },
            }),
          );
        }
      } else {
        clearHover();
      }
    } else {
      clearHover();
    }
  };

  const clearHover = () => {
    if (currentHovered) {
      // Restore mesh emissive color
      if (currentHovered instanceof THREE.Mesh && currentHovered.material) {
        const mat = currentHovered.material as THREE.MeshStandardMaterial;
        if (mat.emissive && typeof currentHovered.userData.originalEmissive !== "undefined") {
          mat.emissive.copy(currentHovered.userData.originalEmissive);
        }
      }
      currentHovered = null;
    }

    if (currentHoveredGroup) {
      // Restore group original scale
      const originalScale = (currentHoveredGroup.userData.originalScale as THREE.Vector3) || new THREE.Vector3(0.9, 0.9, 0.9);
      currentHoveredGroup.scale.copy(originalScale);
      currentHoveredGroup = null;
    }

    container.style.cursor = "default";
    if (outlineHelper) {
      scene.remove(outlineHelper);
      outlineHelper = null;
    }

    window.dispatchEvent(
      new CustomEvent("3d-hover", {
        detail: { hovered: false },
      }),
    );
  };

  // Click handler
  const onPointerDown = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      let targetObj: THREE.Object3D | null = intersects[0].object;
      while (targetObj && !targetObj.userData.interactive) {
        targetObj = targetObj.parent;
      }

      if (targetObj && targetObj.userData.interactive) {
        window.dispatchEvent(
          new CustomEvent("3d-click", {
            detail: {
              id: targetObj.userData.id,
              type: targetObj.userData.type,
              title: targetObj.userData.title,
              description: targetObj.userData.description,
              stack: targetObj.userData.stack || [],
              demoUrl: targetObj.userData.demoUrl,
              githubUrl: targetObj.userData.githubUrl,
              icon: targetObj.userData.icon,
            },
          }),
        );
      }
    }
  };

  // Scroll-wheel zoom logic with bounds (0.5x to 2.5x)
  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const zoomSpeed = 0.05;
    let newZoom = camera.zoom - event.deltaY * zoomSpeed * 0.01;
    newZoom = Math.max(0.5, Math.min(newZoom, 2.5));
    
    camera.zoom = newZoom;
    camera.updateProjectionMatrix();
  };

  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("wheel", onWheel, { passive: false });

  const cleanup = () => {
    container.removeEventListener("pointermove", onPointerMove);
    container.removeEventListener("pointerdown", onPointerDown);
    container.removeEventListener("wheel", onWheel);
    if (outlineHelper) scene.remove(outlineHelper);
  };

  return { cleanup };
}
