import * as THREE from "three";
import { assetLoader } from "./loader";
import { projects } from "../data/projects";
import { skills } from "../data/skills";
import { buildRoadNetwork } from "./world/roadSystem";

// Texture generators
export function createPolengTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f5f0e6"; // Poleng light
  ctx.fillRect(0, 0, 8, 8);
  ctx.fillRect(8, 8, 8, 8);
  ctx.fillStyle = "#1a1410"; // Poleng dark
  ctx.fillRect(8, 0, 8, 8);
  ctx.fillRect(0, 8, 8, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

export function createSandTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  // Base sand color
  ctx.fillStyle = "#e6d3a3";
  ctx.fillRect(0, 0, 128, 128);

  // Subtle noise
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const opacity = Math.random() * 0.15;
    ctx.fillStyle = `rgba(90, 58, 42, ${opacity})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);
  return texture;
}

// Generate text texture for labels
function createEmojiTexture(emoji: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);
  ctx.font = "36px Outfit, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export async function buildWorld(
  scene: THREE.Scene,
  interactiveObjects: THREE.Object3D[],
): Promise<void> {
  // 1. Procedural ocean plane at the bottom
  const oceanGeo = new THREE.PlaneGeometry(200, 200);
  const oceanMat = new THREE.MeshStandardMaterial({
    color: "#0c152b", // Deep mystical Balinese sea
    roughness: 0.3,
    metalness: 0.7,
    transparent: true,
    opacity: 0.85,
  });
  const ocean = new THREE.Mesh(oceanGeo, oceanMat);
  ocean.position.y = -1.5;
  ocean.rotation.x = -Math.PI / 2;
  ocean.receiveShadow = true;
  scene.add(ocean);

  // 1b. Helper to generate a Balinese raised tropical island
  const createTropicalIsland = (x: number, z: number, radius: number) => {
    const island = new THREE.Group();
    island.position.set(x, -0.2, z);

    // Grassy top cylinder
    const topGeo = new THREE.CylinderGeometry(radius, radius, 0.4, 8);
    const topMat = new THREE.MeshStandardMaterial({
      color: "#4e8c5a", // Bali tropical emerald green grass
      roughness: 0.8,
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.receiveShadow = true;
    topMesh.castShadow = true;
    island.add(topMesh);

    // Rocky sand base cylinder
    const baseGeo = new THREE.CylinderGeometry(
      radius - 0.05,
      radius - 0.4,
      0.8,
      8,
    );
    const baseMat = new THREE.MeshStandardMaterial({
      color: "#a69580", // Sandy stone rock sides
      roughness: 0.9,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.5;
    baseMesh.receiveShadow = true;
    island.add(baseMesh);

    scene.add(island);
  };

  // Instantiate 5 distinct floating islands
  createTropicalIsland(0, 0, 4.8); // Home Island
  createTropicalIsland(0, -10, 5.8); // Projects Island
  createTropicalIsland(-10, 0, 5.2); // Skills Island
  createTropicalIsland(10, 0, 4.8); // About Island
  createTropicalIsland(0, 10, 4.2); // Contact Island

  // 2. Load models
  const [
    treeLarge,
    pathStoneLong,
    pathStoneShort,
    fenceLowLow,
    planter,
    lightSquare,
    lightCurved,
    bldgA,
    bldgB,
    bldgC,
    bldgD,
    bldgE,
    bldgF,
    bldgH,
    bldgT,
  ] = await Promise.all([
    assetLoader.loadGLB("/assets/kenney/models/suburban/tree-large.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/path-stones-long.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/path-stones-short.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/fence-low.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/planter.glb"),
    assetLoader.loadGLB("/assets/kenney/models/roads/light-square.glb"),
    assetLoader.loadGLB("/assets/kenney/models/roads/light-curved.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/building-type-a.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/building-type-b.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/building-type-c.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/building-type-d.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/building-type-e.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/building-type-f.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/building-type-h.glb"),
    assetLoader.loadGLB("/assets/kenney/models/suburban/building-type-t.glb"),
  ]);

  // 3. BACKGROUND SILHOUETTES (Balinese Pura structures)
  const flatMat = new THREE.MeshBasicMaterial({ color: "#2a1f1a" });

  const bgGroup1 = bldgT.clone();
  bgGroup1.traverse((child) => {
    if (child instanceof THREE.Mesh) child.material = flatMat;
  });
  bgGroup1.scale.set(3, 4, 3);
  bgGroup1.position.set(-20, 0, -25);
  scene.add(bgGroup1);

  const bgGroup2 = bldgA.clone();
  bgGroup2.traverse((child) => {
    if (child instanceof THREE.Mesh) child.material = flatMat;
  });
  bgGroup2.scale.set(3, 5, 3);
  bgGroup2.position.set(20, 0, -25);
  scene.add(bgGroup2);

  // 4. INSTANCED MESHES (Coconut trees, road pieces, stone paths)
  // Helper to gather a single geometry/material from a group
  const extractMesh = (g: THREE.Group): THREE.Mesh | null => {
    let m: THREE.Mesh | null = null;
    g.traverse((c) => {
      if (c instanceof THREE.Mesh && !m) m = c;
    });
    return m;
  };

  const treeMesh = extractMesh(treeLarge);
  const stoneMesh = extractMesh(pathStoneShort) || extractMesh(pathStoneLong);

  // Place Instanced Trees
  if (treeMesh) {
    const treeCount = 18;
    const instTrees = new THREE.InstancedMesh(
      treeMesh.geometry,
      treeMesh.material,
      treeCount,
    );
    instTrees.castShadow = true;
    instTrees.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const treePositions = [
      // Hero island surrounding
      { x: -3, z: -2 },
      { x: 3, z: 2 },
      { x: -4, z: 4 },
      { x: 4, z: -4 },
      // Projects island surroundings
      { x: -5, z: -14 },
      { x: 5, z: -14 },
      { x: -5, z: -8 },
      { x: 5, z: -8 },
      // Skills island surroundings
      { x: -14, z: -4 },
      { x: -14, z: 4 },
      { x: -6, z: -4 },
      { x: -6, z: 4 },
      // About island surroundings
      { x: 14, z: -3 },
      { x: 14, z: 3 },
      { x: 7, z: -4 },
      // Contact island surroundings
      { x: -4, z: 14 },
      { x: 4, z: 14 },
      { x: 0, z: 15 },
    ];

    const treeSway = () => {
      const time = performance.now() * 0.0015;
      for (let i = 0; i < treePositions.length; i++) {
        dummy.position.set(treePositions[i].x, 0, treePositions[i].z);
        const scale = 1.0 + (i % 4) * 0.15;
        dummy.scale.set(scale, scale * 1.5, scale);
        dummy.rotation.y = (i * 2.3) % Math.PI;
        // Subtle tropical sway
        dummy.rotation.x = Math.sin(time + i) * 0.03;
        dummy.rotation.z = Math.cos(time + i * 0.7) * 0.02;
        dummy.updateMatrix();
        instTrees.setMatrixAt(i, dummy.matrix);
      }
      instTrees.instanceMatrix.needsUpdate = true;
    };
    instTrees.userData = { tick: treeSway };
    treeSway();
    scene.add(instTrees);
  }

  // 4b. ROAD NETWORK (Data-driven Grid-Snapped Modular Asphalt Road System)
  await buildRoadNetwork(scene, interactiveObjects);

  // Place Instanced Paths (Premium Balinese stone pathway archipelago network)
  if (stoneMesh) {
    const stonePositions = [
      // Home Island: short ceremonial path from gapura toward the avatar/sign.
      { x: 0, z: -1.25, scale: 0.48, rotY: 0 },
      { x: 0, z: -0.55, scale: 0.48, rotY: 0.08 },
      { x: 0, z: 0.15, scale: 0.48, rotY: -0.08 },

      // Skills Island: sparse stepping stones only.
      { x: -11.4, z: -0.9, scale: 0.45, rotY: 0.25 },
      { x: -10.4, z: -0.25, scale: 0.45, rotY: -0.1 },
      { x: -9.5, z: 0.35, scale: 0.45, rotY: 0.15 },
      { x: -8.6, z: 0.95, scale: 0.45, rotY: -0.2 },

      // About Island: one small museum approach.
      { x: 9.25, z: 1.35, scale: 0.48, rotY: Math.PI / 2 },
      { x: 9.6, z: 0.75, scale: 0.48, rotY: Math.PI / 2 },
      { x: 9.85, z: 0.15, scale: 0.48, rotY: Math.PI / 2 },

      // Contact Island: short path into the kiosk.
      { x: -0.95, z: 9.15, scale: 0.45, rotY: 0 },
      { x: -0.35, z: 9.35, scale: 0.45, rotY: -0.08 },
      { x: 0.25, z: 9.6, scale: 0.45, rotY: 0.1 },
    ];

    const instStones = new THREE.InstancedMesh(
      stoneMesh.geometry,
      stoneMesh.material,
      stonePositions.length,
    );
    instStones.castShadow = true;
    instStones.receiveShadow = true;

    const dummy = new THREE.Object3D();
    stonePositions.forEach((pos, idx) => {
      dummy.position.set(pos.x, 0.05, pos.z);
      dummy.rotation.y = pos.rotY;
      dummy.scale.set(pos.scale, 1.0, pos.scale);
      dummy.updateMatrix();
      instStones.setMatrixAt(idx, dummy.matrix);
    });

    scene.add(instStones);
  }

  // 5. HERO ISLAND (0,0)
  // Bali Gapura procedural entrance
  const gapuraGroup = new THREE.Group();
  gapuraGroup.position.set(0, 0, -1.8);
  scene.add(gapuraGroup);

  // Side pillars (Orange-red sandstone)
  const pillarGeo = new THREE.BoxGeometry(0.5, 2.5, 0.5);
  const brickMat = new THREE.MeshStandardMaterial({
    color: "#d94f2a",
    roughness: 0.9,
  });
  const pillarL = new THREE.Mesh(pillarGeo, brickMat);
  pillarL.position.set(-1.1, 1.25, 0);
  pillarL.castShadow = true;
  pillarL.receiveShadow = true;
  gapuraGroup.add(pillarL);

  const pillarR = pillarL.clone();
  pillarR.position.set(1.1, 1.25, 0);
  gapuraGroup.add(pillarR);

  // Accent gold capitals on pillars
  const capGeo = new THREE.BoxGeometry(0.65, 0.2, 0.65);
  const goldMat = new THREE.MeshStandardMaterial({
    color: "#f5c842",
    roughness: 0.3,
    metalness: 0.8,
  });
  const capL = new THREE.Mesh(capGeo, goldMat);
  capL.position.set(-1.1, 2.6, 0);
  gapuraGroup.add(capL);

  const capR = capL.clone();
  capR.position.set(1.1, 2.6, 0);
  gapuraGroup.add(capR);

  // Center Balinese signage board with Poleng texture
  const polengTex = createPolengTexture();
  const boardGeo = new THREE.BoxGeometry(1.6, 0.8, 0.1);
  const boardMat = new THREE.MeshStandardMaterial({ map: polengTex });
  const signBoard = new THREE.Mesh(boardGeo, boardMat);
  signBoard.position.set(0, 2.0, 0);
  signBoard.castShadow = true;
  gapuraGroup.add(signBoard);

  // Hero Pedestal Signpost
  const pedGroup = planter.clone();
  pedGroup.position.set(0, 0, 1.5);
  scene.add(pedGroup);

  const postGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
  const woodMat = new THREE.MeshStandardMaterial({
    color: "#5a3a2a",
    roughness: 0.8,
  });
  const post = new THREE.Mesh(postGeo, woodMat);
  post.position.set(0, 0.6, 0);
  post.castShadow = true;
  pedGroup.add(post);

  const welcomeBoardGeo = new THREE.BoxGeometry(1.4, 0.7, 0.08);
  const welcomeBoard = new THREE.Mesh(welcomeBoardGeo, boardMat);
  welcomeBoard.position.set(0, 1.2, 0);
  welcomeBoard.castShadow = true;
  // Set metadata
  welcomeBoard.userData = {
    interactive: true,
    type: "hero",
    id: "hero-sign",
    title: "Welcome Aboard Brodi!",
    description:
      "Welcome to my Portfolio, one of the most greatest thing i've ever made as Software Engineer for over 9+ years. This is the 3d interaction for my portfolio, you can explore anything here, isn't perfect tbh because its fully coded and its not GUI, made it in three.js and yea, not perfect. But its going to be updated more. Any information that you need is here. ",
  };
  pedGroup.add(welcomeBoard);
  interactiveObjects.push(welcomeBoard);

  // 6. PROJECTS ISLAND (0, -10)
  // Helper to draw pill-shaped 3D floating tags above buildings
  const createPillBadgeSprite = (
    text: string,
    colorHex: string,
  ): THREE.Sprite => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 48;
    const ctx = canvas.getContext("2d")!;

    // Draw smooth rounded pill background
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    // Use standard roundRect compat
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(4, 4, 120, 40, 20);
    } else {
      ctx.rect(4, 4, 120, 40); // simple rect fallback
    }
    ctx.fill();

    // Outer border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Outfit, var(--font-primary)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 64, 24);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMat);
    return sprite;
  };

  const bldgModels = [bldgA, bldgB, bldgC, bldgD, bldgE, bldgF];

  projects.forEach((proj, idx) => {
    const model = bldgModels[idx % bldgModels.length].clone();
    model.position.set(
      proj.islandPosition.x,
      proj.islandPosition.y,
      proj.islandPosition.z,
    );
    model.scale.set(1.45, 1.45, 1.45);

    // Rotate building to face the central modular street at z = -10
    if (proj.islandPosition.z > -10) {
      model.rotation.y = Math.PI; // Face South
    } else {
      model.rotation.y = 0; // Face North
    }

    // Save initial state for hover animations
    model.userData = {
      originalScale: new THREE.Vector3(1.45, 1.45, 1.45),
      projectId: proj.id,
    };

    // Add metadata and parent references to all sub-meshes
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Clone material to avoid modifying shared material instances during hover outline changes
        if (child.material) {
          child.material = (child.material as THREE.Material).clone();
        }
        child.userData = {
          interactive: true,
          type: "project",
          id: proj.id,
          title: proj.title,
          description: proj.description,
          stack: proj.stack,
          features: proj.features,
          demoUrl: proj.demoUrl,
          githubUrl: proj.githubUrl,
          color: proj.color,
          parentGroup: model, // Crucial for whole-building scaling!
        };
        interactiveObjects.push(child);
      }
    });

    // Add floating badge sprite above building roof (y = 2.3)
    const badge = createPillBadgeSprite(proj.shortTitle, proj.color);
    badge.position.set(0, 2.3, 0);
    badge.scale.set(1.4, 0.52, 1);
    model.add(badge);

    // Dynamic bobbing animation for the floating tag
    const startY = badge.position.y;
    const bob = () => {
      const time = performance.now() * 0.0035;
      badge.position.y = startY + Math.sin(time + idx) * 0.08;
    };

    // Bind bob check alongside other sway animations
    model.userData.tick = bob;

    scene.add(model);
  });

  const projectsLights = [
    { x: -4.4, z: -9.15, r: -Math.PI / 2 },
    { x: 4.4, z: -9.15, r: Math.PI / 2 },
    { x: -4.4, z: -10.85, r: -Math.PI / 2 },
    { x: 4.4, z: -10.85, r: Math.PI / 2 },
  ];
  projectsLights.forEach((pos) => {
    const lamp = lightSquare.clone();
    lamp.position.set(pos.x, 0, pos.z);
    lamp.rotation.y = pos.r;
    lamp.scale.set(0.8, 0.8, 0.8);
    scene.add(lamp);
  });

  const projectsSign = new THREE.Group();
  projectsSign.position.set(-4.4, 0, -7.15);
  projectsSign.rotation.y = Math.PI / 5;
  const signPostGeo = new THREE.BoxGeometry(0.12, 0.8, 0.12);
  const signPost = new THREE.Mesh(signPostGeo, woodMat);
  signPost.position.y = 0.4;
  signPost.castShadow = true;
  projectsSign.add(signPost);

  const signCanvas = document.createElement("canvas");
  signCanvas.width = 256;
  signCanvas.height = 96;
  const signCtx = signCanvas.getContext("2d")!;
  signCtx.fillStyle = "#12121a";
  signCtx.fillRect(0, 0, signCanvas.width, signCanvas.height);
  signCtx.strokeStyle = "#ff9a3d";
  signCtx.lineWidth = 6;
  signCtx.strokeRect(6, 6, signCanvas.width - 12, signCanvas.height - 12);
  signCtx.fillStyle = "#ffffff";
  signCtx.font = "bold 28px Outfit, sans-serif";
  signCtx.textAlign = "center";
  signCtx.textBaseline = "middle";
  signCtx.fillText("Projects Area", 128, 48);
  const signTexture = new THREE.CanvasTexture(signCanvas);
  const signMat = new THREE.MeshStandardMaterial({
    map: signTexture,
    roughness: 0.55,
  });
  const signPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.55, 0.08),
    signMat,
  );
  signPanel.position.y = 0.95;
  signPanel.castShadow = true;
  projectsSign.add(signPanel);
  scene.add(projectsSign);

  // 7. SKILLS ISLAND (-10, 0)
  // Generate 8 pedestals with floating emojis corresponding to tech stack
  const emojis: Record<string, string> = {
    laravel: "🐘",
    filament: "⚡",
    threejs: "📐",
    typescript: "🔷",
    javascript: "💛",
    api: "🔌",
    database: "🗄️",
    uiux: "🎨",
    tailwind: "🍃",
  };

  skills.forEach((sk) => {
    const skGroup = new THREE.Group();
    skGroup.position.set(
      sk.islandPosition.x,
      sk.islandPosition.y,
      sk.islandPosition.z,
    );
    scene.add(skGroup);

    // Circular stone pedestal
    const pedCylinderGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.6, 8);
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: "#b8a890",
      roughness: 0.8,
    });
    const cylinder = new THREE.Mesh(pedCylinderGeo, stoneMaterial);
    cylinder.position.y = 0.3;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    skGroup.add(cylinder);

    // Metadata trigger
    cylinder.userData = {
      interactive: true,
      type: "skill",
      id: sk.id,
      title: sk.name,
      description: sk.description,
      icon: sk.icon,
    };
    interactiveObjects.push(cylinder);

    // Floating floating emblem sprite
    const emojiTex = createEmojiTexture(emojis[sk.icon] || "🚀");
    const spriteMat = new THREE.SpriteMaterial({ map: emojiTex });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(0, 1.2, 0);
    sprite.scale.set(0.9, 0.9, 0.9);
    skGroup.add(sprite);

    // Dynamic animation ticker for the floating sprite (registers simple callback)
    const bob = () => {
      const time = performance.now() * 0.003;
      sprite.position.y = 1.2 + Math.sin(time) * 0.08;
    };
    // Bind bob callbacks to custom scene render ticks
    skGroup.userData.tick = bob;
  });

  // Low low fences outlining skills perimeter
  const fencePositions = [
    { x: -14.5, z: -3.5, r: 0 },
    { x: -14.5, z: -1.5, r: 0 },
    { x: -14.5, z: 0.5, r: 0 },
    { x: -14.5, z: 2.5, r: 0 },
    { x: -5.5, z: -3.5, r: 0 },
    { x: -5.5, z: -1.5, r: 0 },
    { x: -5.5, z: 0.5, r: 0 },
    { x: -5.5, z: 2.5, r: 0 },
  ];
  fencePositions.forEach((pos) => {
    const fn = fenceLowLow.clone();
    fn.position.set(pos.x, 0, pos.z);
    fn.rotation.y = pos.r;
    scene.add(fn);
  });

  // 8. ABOUT ISLAND (10, 0)
  // Large Museum structure building
  const museum = bldgT.clone();
  museum.position.set(10, 0, -0.5);
  museum.scale.set(1.75, 1.75, 1.75);
  museum.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.userData = {
        interactive: true,
        type: "about",
        id: "museum-about",
        title: "About Me - Background",
        description:
          "Hi, I am Oggie Sutrisna! I am a full-stack engineer and digital architect based in Bali, Indonesia. With over 9 years of active industry engineering, I build premium backends, responsive server systems, and robust web applications. I balance strict type architectures with beautiful visual detailing.",
      };
      interactiveObjects.push(child);
    }
  });
  scene.add(museum);

  // Decorative planter
  const plant = planter.clone();
  plant.position.set(8.5, 0, 1.5);
  scene.add(plant);

  // 9. CONTACT ISLAND (0, 10)
  // Information contact kiosk using bldgH scaled down and rotated
  const contactKiosk = bldgH.clone();
  contactKiosk.position.set(0, 0, 10);
  contactKiosk.rotation.y = Math.PI;
  contactKiosk.scale.set(1.5, 1.75, 1.5);
  contactKiosk.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.userData = {
        interactive: true,
        type: "contact",
        id: "kiosk-contact",
        title: "Get In Touch",
        description:
          "If you want to collaborate on clean software projects, construct interactive 3D visualizations, or simply discuss system scalability, my digital channels are wide open.",
      };
      interactiveObjects.push(child);
    }
  });
  scene.add(contactKiosk);

  // Beautiful street lights
  const l1 = lightCurved.clone();
  l1.position.set(-1.8, 0, 10);
  l1.rotation.y = -Math.PI / 2;
  scene.add(l1);

  const l2 = lightCurved.clone();
  l2.position.set(1.8, 0, 10);
  l2.rotation.y = Math.PI / 2;
  scene.add(l2);
}
