import './styles/global.css';
import * as THREE from 'three';
import { createScene } from './three/scene';
import { createRenderer } from './three/renderer';
import { createIsometricCamera } from './three/camera';
import { setupLights } from './three/lights';
import { buildWorld } from './three/world';
import { setupInteractions } from './three/interactions';
import { focusArea, AREA_VIEWS, type AreaId } from './three/isometric';
import { isWebGLSupported, optimizePerformance } from './three/performance';
import { assetLoader } from './three/loader';
import { PlayableCharacter } from './three/character';

import { 
  fetchGitHubUser, 
  fetchRepoReadme, 
  filterRepos, 
  sortRepos, 
  getAllTopics, 
  getAllLanguages 
} from './lib/github';
import type { GitHubRepo } from './types/github';
import { getLanguageColor } from './types/github';
import { formatDate } from './lib/format';

import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configuration
const GITHUB_USERNAME = 'oggiesutrisna';
const EXCLUDED_REPOS = ['crispylogger'];

// Global state
let allRepos: GitHubRepo[] = [];
let currentSearch = '';
let currentTopics: string[] = [];
let currentLanguage: string | null = null;
let currentSort: 'stars' | 'updated' | 'name' = 'updated';
let currentSortDirection: 'asc' | 'desc' = 'desc';

/* ==========================================================================
   1. Theme Management
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.querySelector('.theme-icon-light');
  const moonIcon = document.querySelector('.theme-icon-dark');

  function updateIcons(isLight: boolean) {
    if (isLight) {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    } else {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    }
  }

  // Initial load
  const isLight = document.documentElement.classList.contains('light-mode');
  updateIcons(isLight);

  themeToggle?.addEventListener('click', () => {
    const isNowLight = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('theme', isNowLight ? 'light' : 'dark');
    updateIcons(isNowLight);
  });
}

/* ==========================================================================
   2. Three.js Engine Lifecycle
   ========================================================================== */
async function initThreeEngine() {
  const container = document.getElementById('portfolio-viewport');
  const mount = document.getElementById('canvas-mount');
  const fallback = document.getElementById('webgl-fallback');

  if (!container || !mount) return;

  // WebGL Fallback trigger
  if (!isWebGLSupported()) {
    if (fallback) fallback.classList.remove('hidden');
    container.classList.add('hidden');
    window.dispatchEvent(new CustomEvent('3d-unsupported'));
    return;
  }

  // Bind Asset Loader callbacks to update Loading Screen UI
  const unregisterProgress = assetLoader.registerOnProgress((status) => {
    const bar = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');
    if (bar) bar.style.width = `${status.percent}%`;
    if (text) text.textContent = `${status.percent}%`;

    if (status.percent >= 100) {
      setTimeout(() => {
        const screen = document.getElementById('loading-screen');
        if (screen) {
          screen.classList.add('opacity-0', 'pointer-events-none');
        }
        // Cleanup listener after completion
        unregisterProgress();
      }, 600);
    }
  });

  // Setup Three.js core elements
  const scene = createScene();
  const camera = createIsometricCamera(container);
  const renderer = createRenderer(container);
  const { directionalLight } = setupLights(scene);

  // Hardware optimization configs
  optimizePerformance(renderer, directionalLight);

  // Build world layout
  const interactiveObjects: any[] = [];
  await buildWorld(scene, interactiveObjects);

  // Instantiate Playable Character (Oggie) with official Kenney model
  const playerModel = await assetLoader.loadGLB("/assets/kenney/models/characters/character-a.glb");
  
  // Make avatar meshes interactive for the jump Easter egg click
  playerModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.userData = {
        interactive: true,
        type: "character",
        id: "oggie-avatar",
        title: "Oggie (Developer Avatar)",
        description: "Click to see me do a 360-degree spin-jump! Use W, A, S, D or the Arrow Keys to guide me around the islands.",
      };
      interactiveObjects.push(child);
    }
  });

  const player = new PlayableCharacter(playerModel);
  scene.add(player.mesh);
  player.teleport(0, 0);

  // Proximity Target definition
  interface ProximityTarget {
    id: string;
    type: string;
    title: string;
    description?: string;
    stack?: string[];
    demoUrl?: string;
    githubUrl?: string;
    icon?: string;
    position: THREE.Vector3;
    object: THREE.Object3D;
    collisionBox?: THREE.Box2;
    collisionRadius?: number;
  }

  const getSolidBoundingBox = (object: THREE.Object3D): THREE.Box3 => {
    const box = new THREE.Box3();
    let hasMesh = false;
    object.traverse((child) => {
      // Exclude Sprites, Lines, and Lights to focus purely on the solid building/model meshes
      if (child instanceof THREE.Mesh) {
        if (child.name.includes("helper") || child.name.includes("outline")) return;
        const childBox = new THREE.Box3().setFromObject(child);
        if (!childBox.isEmpty()) {
          if (!hasMesh) {
            box.copy(childBox);
            hasMesh = true;
          } else {
            box.union(childBox);
          }
        }
      }
    });
    return box;
  };

  const proximityTargets: ProximityTarget[] = [];
  const seenTargets = new Set<string>();

  for (const obj of interactiveObjects) {
    const type = obj.userData.type;
    const id = obj.userData.id;
    if (!type || type === "character" || !id) continue;

    const key = `${type}-${id}`;
    if (seenTargets.has(key)) continue;
    seenTargets.add(key);

    const worldPos = new THREE.Vector3();
    if (obj.userData.parentGroup) {
      obj.userData.parentGroup.getWorldPosition(worldPos);
    } else {
      obj.getWorldPosition(worldPos);
    }

    const highlightObj = obj.userData.parentGroup || obj;
    const solidBox3 = getSolidBoundingBox(highlightObj);

    let collisionBox: THREE.Box2 | undefined = undefined;
    let collisionRadius: number | undefined = undefined;

    if (type === "skill") {
      // Pedestals are circular cylinders. A radius of 0.65 is perfect!
      collisionRadius = 0.65;
    } else if (type === "hero") {
      // Welcome board. It's a signpost. Let's make it a circle with radius 0.65
      collisionRadius = 0.65;
    } else {
      // Rectangular buildings (projects, museum, kiosk)
      if (!solidBox3.isEmpty()) {
        collisionBox = new THREE.Box2(
          new THREE.Vector2(solidBox3.min.x, solidBox3.min.z),
          new THREE.Vector2(solidBox3.max.x, solidBox3.max.z)
        );
      }
    }

    proximityTargets.push({
      id,
      type,
      title: obj.userData.title || "",
      description: obj.userData.description,
      stack: obj.userData.stack,
      demoUrl: obj.userData.demoUrl,
      githubUrl: obj.userData.githubUrl,
      icon: obj.userData.icon,
      position: worldPos,
      object: obj,
      collisionBox,
      collisionRadius
    });
  }

  let activeProximityTarget: ProximityTarget | null = null;
  let boxHelper: THREE.Box3Helper | null = null;
  let highlightedTargetId: string | null = null;

  const promptEl = document.getElementById("interaction-prompt");
  const triggerInteraction = () => {
    if (activeProximityTarget) {
      window.dispatchEvent(
        new CustomEvent("3d-click", {
          detail: {
            id: activeProximityTarget.id,
            type: activeProximityTarget.type,
            title: activeProximityTarget.title,
            description: activeProximityTarget.description,
            stack: activeProximityTarget.stack || [],
            demoUrl: activeProximityTarget.demoUrl,
            githubUrl: activeProximityTarget.githubUrl,
            icon: activeProximityTarget.icon,
          },
        }),
      );
    }
  };
  promptEl?.addEventListener("click", triggerInteraction);

  const handleProximityKeydown = (e: KeyboardEvent) => {
    if ((e.key === "e" || e.key === "E") && activeProximityTarget) {
      triggerInteraction();
    }
  };
  window.addEventListener("keydown", handleProximityKeydown);

  // Development Layout Debug Mode (Tahap 14)
  let gridHelper: THREE.GridHelper | null = null;
  let isDebugActive = false;

  const handleDebugToggle = (e: KeyboardEvent) => {
    if (e.key === "`") {
      isDebugActive = !isDebugActive;
      console.log(`[Debug Mode] ${isDebugActive ? "ACTIVE" : "INACTIVE"}`);
      
      if (isDebugActive) {
        gridHelper = new THREE.GridHelper(40, 40, 0xff9a3d, 0x444444);
        gridHelper.position.y = 0.05;
        scene.add(gridHelper);
        
        console.log({
          sceneObjects: scene.children.length,
          cameraPosition: camera.position,
          cameraZoom: camera.zoom
        });
      } else {
        if (gridHelper) {
          scene.remove(gridHelper);
          gridHelper = null;
        }
      }
    }
  };

  const handleDebugClick = (e: Event) => {
    if (isDebugActive) {
      console.log("[Debug Click Coordinate] Payload details:", (e as CustomEvent).detail);
    }
  };

  if (import.meta.env.DEV) {
    window.addEventListener("keydown", handleDebugToggle);
    window.addEventListener("3d-click", handleDebugClick);
  }

  // Setup interaction hooks
  const { cleanup } = setupInteractions(camera, scene, interactiveObjects, container);

  // Dynamic tick animation handlers
  const anims: (() => void)[] = [];
  scene.traverse((node) => {
    if (node.userData && typeof node.userData.tick === 'function') {
      anims.push(node.userData.tick);
    }
  });

  // Ticker loop with stable timer/clock fallback
  const timer = (THREE as any).Timer ? new (THREE as any).Timer() : new THREE.Clock();
  if ((THREE as any).Timer && typeof document !== 'undefined') {
    (timer as any).connect(document);
  }
  let isRunning = true;
  let activeArea: AreaId = 'home';

  // Projected HTML labels setup
  const tempV = new THREE.Vector3();
  const labelAreas = [
    { id: 'home' as AreaId, pos: new THREE.Vector3(0, 1.8, 1.5), homeOnly: true },
    { id: 'projects' as AreaId, pos: new THREE.Vector3(0, 1.8, -10), activeOnly: true },
    { id: 'skills' as AreaId, pos: new THREE.Vector3(-10, 1.8, 0), activeOnly: true },
    { id: 'about' as AreaId, pos: new THREE.Vector3(10, 1.8, 0), activeOnly: false },
    { id: 'contact' as AreaId, pos: new THREE.Vector3(0, 1.8, 10), activeOnly: false }
  ];

  function tick() {
    if (!isRunning) return;
    requestAnimationFrame(tick);

    let deltaTime = 0;
    if ((THREE as any).Timer) {
      timer.update();
      deltaTime = Math.min(timer.getDelta(), 0.1);
    } else {
      deltaTime = Math.min((timer as any).getDelta(), 0.1);
    }

    // Update playable character keys & position, and handle camera follow
    player.update(deltaTime, camera);

    // Resolve solid hitboxes collisions (Circle & AABB sliding resolution)
    const playerRadius = 0.35;
    const playerPos2D = new THREE.Vector2(player.mesh.position.x, player.mesh.position.z);

    for (const target of proximityTargets) {
      if (target.collisionRadius) {
        // Circle collision (pedestals, welcome board)
        const targetPos2D = new THREE.Vector2(target.position.x, target.position.z);
        const dist = playerPos2D.distanceTo(targetPos2D);
        const minDist = target.collisionRadius + playerRadius;
        if (dist < minDist) {
          const pushDir = playerPos2D.clone().sub(targetPos2D);
          if (pushDir.lengthSq() > 0) {
            pushDir.normalize();
            playerPos2D.copy(targetPos2D).add(pushDir.multiplyScalar(minDist));
          } else {
            playerPos2D.x += minDist;
          }
        }
      } else if (target.collisionBox) {
        // Box collision (rectangular buildings)
        const box = target.collisionBox;
        const closestPoint = new THREE.Vector2(
          Math.max(box.min.x, Math.min(playerPos2D.x, box.max.x)),
          Math.max(box.min.y, Math.min(playerPos2D.y, box.max.y))
        );
        const dist = playerPos2D.distanceTo(closestPoint);
        if (dist < playerRadius) {
          const pushDir = playerPos2D.clone().sub(closestPoint);
          if (pushDir.lengthSq() > 0) {
            pushDir.normalize();
            playerPos2D.copy(closestPoint).add(pushDir.multiplyScalar(playerRadius));
          } else {
            const dl = playerPos2D.x - box.min.x;
            const dr = box.max.x - playerPos2D.x;
            const dt = playerPos2D.y - box.min.y;
            const db = box.max.y - playerPos2D.y;
            const minEdge = Math.min(dl, dr, dt, db);
            if (minEdge === dl) playerPos2D.x = box.min.x - playerRadius;
            else if (minEdge === dr) playerPos2D.x = box.max.x + playerRadius;
            else if (minEdge === dt) playerPos2D.y = box.min.y - playerRadius;
            else playerPos2D.y = box.max.y + playerRadius;
          }
        }
      }
    }

    // Apply collision-corrected position back to character
    player.mesh.position.x = playerPos2D.x;
    player.mesh.position.z = playerPos2D.y;

    // Proximity target distance check
    let closestTarget: ProximityTarget | null = null;
    let minDistance = Infinity;
    const interactionRadius = 2.2;

    for (const target of proximityTargets) {
      const dx = player.mesh.position.x - target.position.x;
      const dz = player.mesh.position.z - target.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDistance) {
        minDistance = dist;
        closestTarget = target;
      }
    }

    const interactionPrompt = document.getElementById("interaction-prompt");
    const interactionText = document.getElementById("interaction-text");

    if (closestTarget && minDistance <= interactionRadius) {
      activeProximityTarget = closestTarget;
      
      if (interactionPrompt && interactionText) {
        interactionText.textContent = `Interact with ${closestTarget.title}`;
        interactionPrompt.style.opacity = "1";
        interactionPrompt.style.pointerEvents = "auto";
        interactionPrompt.style.transform = "translateX(-50%) scale(1)";
      }

      if (highlightedTargetId !== closestTarget.id) {
        if (boxHelper) {
          scene.remove(boxHelper);
        }
        const highlightObj = closestTarget.object.userData.parentGroup || closestTarget.object;
        const solidBox = getSolidBoundingBox(highlightObj);
        
        if (!solidBox.isEmpty()) {
          // Add a elegant tiny padding offset so the outline floats just outside the building walls
          solidBox.expandByScalar(0.06);
          boxHelper = new THREE.Box3Helper(solidBox, new THREE.Color("#ff9a3d"));
          scene.add(boxHelper);
        }
        highlightedTargetId = closestTarget.id;
      }
    } else {
      activeProximityTarget = null;
      
      if (interactionPrompt) {
        interactionPrompt.style.opacity = "0";
        interactionPrompt.style.pointerEvents = "none";
        interactionPrompt.style.transform = "translateX(-50%) scale(0.9)";
      }

      if (boxHelper) {
        scene.remove(boxHelper);
        boxHelper = null;
        highlightedTargetId = null;
      }
    }

    // Execute local mesh animations (floating icons bobbing)
    anims.forEach((anim) => anim());

    // Project area HTML labels onto screen
    const rect = container.getBoundingClientRect();
    labelAreas.forEach(area => {
      const el = document.getElementById(`label-${area.id}`);
      if (!el) return;
      const shouldShow =
        (area.homeOnly && activeArea === 'home') ||
        (!area.homeOnly && (!area.activeOnly || activeArea === area.id));

      tempV.copy(area.pos);
      tempV.project(camera);

      // Check if coordinate is within screen frustum boundaries
      const isOffscreen = tempV.x < -1.1 || tempV.x > 1.1 || tempV.y < -1.1 || tempV.y > 1.1;
      if (isOffscreen || !shouldShow) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      } else {
        const x = (tempV.x * 0.5 + 0.5) * rect.width;
        const y = (-(tempV.y * 0.5) + 0.5) * rect.height;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.opacity = '1';
        el.style.pointerEvents = area.id === 'home' ? 'auto' : 'none';
      }
    });

    renderer.render(scene, camera);
  }
  tick();

  // Responsive resize handler
  const handleResize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    
    // Recompute isometric camera frustum coordinates
    const frustumSize = 8;
    const aspect = width / height;
    camera.left = -frustumSize * aspect;
    camera.right = frustumSize * aspect;
    camera.top = frustumSize;
    camera.bottom = -frustumSize;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', handleResize);

  // Listen to navigation pans from AreaNavigation or HeroOverlay
  const handleNavigation = async (e: Event) => {
    const { areaId } = (e as CustomEvent).detail;
    const targetArea = AREA_VIEWS[areaId as AreaId];
    if (targetArea) {
      activeArea = targetArea.id;
      // Teleport character to target island center
      player.teleport(targetArea.position.x, targetArea.position.z);

      // Trigger smooth cubic ease pans
      await focusArea(camera, targetArea, 900);
      
      // Dispatch completed signals
      window.dispatchEvent(new CustomEvent('3d-area-focus', {
        detail: { areaId }
      }));
    }
  };
  window.addEventListener('3d-navigate', handleNavigation);

  // Trigger jump Easter egg on character click
  const handleCharacterClick = (e: Event) => {
    const { type } = (e as CustomEvent).detail;
    if (type === 'character') {
      player.jump();
    }
  };
  window.addEventListener('3d-click', handleCharacterClick);

  // Trigger loading complete manually if no glb assets are tracked
  setTimeout(() => {
    const screen = document.getElementById('loading-screen');
    if (screen && !screen.classList.contains('opacity-0')) {
      screen.classList.add('opacity-0', 'pointer-events-none');
    }
  }, 3500);

  // Return cleanup on shutdown
  return () => {
    isRunning = false;
    cleanup();
    window.removeEventListener("keydown", handleProximityKeydown);
    promptEl?.removeEventListener("click", triggerInteraction);
    if (boxHelper) scene.remove(boxHelper);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('3d-navigate', handleNavigation);
    window.removeEventListener('3d-click', handleCharacterClick);
    
    if (import.meta.env.DEV) {
      window.removeEventListener("keydown", handleDebugToggle);
      window.removeEventListener("3d-click", handleDebugClick);
      if (gridHelper) scene.remove(gridHelper);
    }

    renderer.dispose();
    container.innerHTML = '';
  };
}

/* ==========================================================================
   3. Modals and Canvas Overlay UI
   ========================================================================== */
function initOverlayControllers() {
  // Hero Overlay
  const heroOverlay = document.getElementById('hero-overlay');
  const enterBtn = document.getElementById('enter-3d');

  function dismissHero() {
    if (!heroOverlay) return;
    heroOverlay.classList.add('opacity-0', 'pointer-events-none', 'scale-105');
    window.dispatchEvent(new CustomEvent('3d-navigate', {
      detail: { areaId: 'home' }
    }));
  }

  enterBtn?.addEventListener('click', dismissHero);
  setTimeout(() => {
    if (heroOverlay && !heroOverlay.classList.contains('opacity-0')) {
      dismissHero();
    }
  }, 4000);

  // Navigation Hint popup positioning
  const hint = document.getElementById('nav-hint');
  const hintType = document.getElementById('hint-type');
  const hintTitle = document.getElementById('hint-title');

  const hintLabels: Record<string, string> = {
    project: '💻 Project Building',
    skill: '⚡ Technical Skill',
    contact: '📧 Contact Kiosk',
    about: '🎨 Personal Museum',
    hero: '🏁 Information Board'
  };

  window.addEventListener('3d-hover', ((e: CustomEvent) => {
    const { hovered, type, title, screenX, screenY } = e.detail;
    if (!hint || !hintType || !hintTitle) return;

    if (hovered && type && title) {
      hintType.textContent = hintLabels[type] || 'Interactive';
      hintTitle.textContent = title;
      hint.style.left = `${screenX}px`;
      hint.style.top = `${screenY - 75}px`;
      hint.style.transform = 'translate(-50%, -50%) scale(1.0)';
      hint.style.opacity = '1';
    } else {
      hint.style.opacity = '0';
      hint.style.transform = 'translate(-50%, -50%) scale(0.95)';
    }
  }) as EventListener);

  // Project Modal Dialog listeners
  const projDialog = document.getElementById('project-modal') as HTMLDialogElement;
  const closeProjBtn = document.getElementById('close-proj-modal');
  const projBadge = document.getElementById('proj-badge');
  const projTitle = document.getElementById('proj-title');
  const projDesc = document.getElementById('proj-desc');
  const projStack = document.getElementById('proj-stack');
  const projDemo = document.getElementById('proj-demo') as HTMLAnchorElement;
  const projGithub = document.getElementById('proj-github') as HTMLAnchorElement;
  const projPage = document.getElementById('proj-page') as HTMLButtonElement;

  window.addEventListener('3d-click', ((e: CustomEvent) => {
    const { type, id, title: tVal, description: dVal, stack, demoUrl, githubUrl } = e.detail;
    if (type !== 'project') return;

    if (projTitle) projTitle.textContent = tVal;
    if (projDesc) projDesc.textContent = dVal;
    if (projBadge) projBadge.textContent = stack && stack.length > 0 ? stack[0] : 'Project';

    if (projStack) {
      projStack.innerHTML = (stack as string[]).map(t => `
        <span class="px-2.5 py-1 text-xs bg-white/5 text-gray-300 rounded-full border border-white/10 font-mono">${t}</span>
      `).join('');
    }

    if (projDemo) {
      if (demoUrl) {
        projDemo.style.display = 'inline-flex';
        projDemo.href = demoUrl;
      } else {
        projDemo.style.display = 'none';
      }
    }

    if (projGithub) {
      if (githubUrl) {
        projGithub.style.display = 'inline-flex';
        projGithub.href = githubUrl;
      } else {
        projGithub.style.display = 'none';
      }
    }

    if (projPage) {
      if (id && id !== 'unicare-clinic' && id !== 'gelora') {
        projPage.style.display = 'inline-flex';
        projPage.onclick = () => {
          projDialog.close();
          window.location.hash = `#project/${id}`;
        };
      } else {
        projPage.style.display = 'none';
      }
    }

    projDialog.showModal();
  }) as EventListener);

  closeProjBtn?.addEventListener('click', () => projDialog.close());
  projDialog.addEventListener('click', (e) => {
    const rect = projDialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      projDialog.close();
    }
  });

  // Skill Modal Dialog listeners
  const skillDialog = document.getElementById('skill-modal') as HTMLDialogElement;
  const closeSkillBtn = document.getElementById('close-skill-modal');
  const okSkillBtn = document.getElementById('ok-skill-modal');
  const skillTitle = document.getElementById('skill-title');
  const skillDesc = document.getElementById('skill-desc');
  const skillIcon = document.getElementById('skill-icon-container');

  const skillEmojis: Record<string, string> = {
    laravel: '🐘',
    filament: '⚡',
    threejs: '📐',
    typescript: '🔷',
    javascript: '💛',
    api: '🔌',
    database: '🗄️',
    uiux: '🎨'
  };

  window.addEventListener('3d-click', ((e: CustomEvent) => {
    const { type, title: tVal, description: dVal, icon } = e.detail;
    if (type !== 'skill') return;

    if (skillTitle) skillTitle.textContent = tVal;
    if (skillDesc) skillDesc.textContent = dVal;
    if (skillIcon) skillIcon.textContent = skillEmojis[icon] || '🚀';

    skillDialog.showModal();
  }) as EventListener);

  const closeSkill = () => skillDialog.close();
  closeSkillBtn?.addEventListener('click', closeSkill);
  okSkillBtn?.addEventListener('click', closeSkill);
  skillDialog.addEventListener('click', (e) => {
    const rect = skillDialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      skillDialog.close();
    }
  });

  // Contact Panel Dialog listeners
  const contactDialog = document.getElementById('contact-panel') as HTMLDialogElement;
  const closeContactBtn = document.getElementById('close-contact-panel');
  const okContactBtn = document.getElementById('ok-contact-panel');
  const contactTitle = document.getElementById('contact-title');
  const contactSubtitle = document.getElementById('contact-subtitle');
  const contactDesc = document.getElementById('contact-desc');
  const contactExtra = document.getElementById('contact-extra');

  window.addEventListener('3d-click', ((e: CustomEvent) => {
    const { type, title: tVal, description: dVal } = e.detail;
    if (type !== 'contact' && type !== 'about' && type !== 'hero') return;

    if (contactTitle) contactTitle.textContent = tVal;
    if (contactDesc) contactDesc.textContent = dVal;

    if (type === 'contact') {
      if (contactSubtitle) contactSubtitle.textContent = 'Digital Gateways';
      if (contactExtra) {
        contactExtra.innerHTML = `
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a href="mailto:putuoggie@gmail.com" class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-300 hover:text-white transition-all text-sm font-semibold">
              <span>📧</span> putuoggie@gmail.com
            </a>
            <a href="https://github.com/oggiesutrisna" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-300 hover:text-white transition-all text-sm font-semibold">
              <span>💻</span> GitHub Profile
            </a>
            <a href="https://linkedin.com/in/oggiesutrisna" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-300 hover:text-white transition-all text-sm font-semibold">
              <span>🔗</span> LinkedIn Connect
            </a>
            <a href="/i-putu-oggie-sutrisna-ady_20260227_2116.pdf" download class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-gray-300 hover:text-white transition-all text-sm font-semibold">
              <span>📄</span> Download CV File
            </a>
          </div>
        `;
      }
    } else if (type === 'about') {
      if (contactSubtitle) contactSubtitle.textContent = 'Personal Background';
      if (contactExtra) {
        contactExtra.innerHTML = `
          <div class="flex flex-wrap gap-2 pt-2">
            <span class="px-2.5 py-1 text-xs bg-[#ff9a3d]/10 text-[#ff9a3d] rounded-full border border-[#ff9a3d]/20 font-semibold">9+ Years Exp</span>
            <span class="px-2.5 py-1 text-xs bg-white/5 text-gray-300 rounded-full border border-white/10 font-semibold">Full-Stack Architect</span>
            <span class="px-2.5 py-1 text-xs bg-white/5 text-gray-300 rounded-full border border-white/10 font-semibold">Based in Bali</span>
            <span class="px-2.5 py-1 text-xs bg-white/5 text-gray-300 rounded-full border border-white/10 font-semibold">Enterprise Solutions</span>
          </div>
        `;
      }
    } else {
      if (contactSubtitle) contactSubtitle.textContent = 'Exhibition Board';
      if (contactExtra) {
        contactExtra.innerHTML = `
          <div class="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-400 italic">
            Tip: You can use your keyboard numbers 1-5 to navigate directly between the islands! Press 1 for Home, 2 for Projects, 3 for Skills, 4 for About, and 5 for Contact.
          </div>
        `;
      }
    }

    contactDialog.showModal();
  }) as EventListener);

  const closeContact = () => contactDialog.close();
  closeContactBtn?.addEventListener('click', closeContact);
  okContactBtn?.addEventListener('click', closeContact);
  contactDialog.addEventListener('click', (e) => {
    const rect = contactDialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      contactDialog.close();
    }
  });

  // Area Navigation pill updating
  const navButtons = document.querySelectorAll('.nav-btn');
  const indicator = document.getElementById('nav-indicator');

  function updateIndicator(activeBtn: HTMLElement) {
    if (!indicator) return;
    const rect = activeBtn.getBoundingClientRect();
    const navRect = activeBtn.parentElement!.getBoundingClientRect();
    indicator.style.left = `${rect.left - navRect.left}px`;
    indicator.style.width = `${rect.width}px`;
  }

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const areaId = (btn as HTMLElement).dataset.area;
      if (!areaId) return;

      window.dispatchEvent(new CustomEvent('3d-navigate', {
        detail: { areaId }
      }));

      navButtons.forEach(b => {
        b.classList.remove('text-[#ff9a3d]');
        b.classList.add('text-gray-400');
      });
      btn.classList.remove('text-gray-400');
      btn.classList.add('text-[#ff9a3d]');
      updateIndicator(btn as HTMLElement);
    });
  });

  // Alignment on startup and camera transitions
  window.addEventListener('3d-area-focus', ((e: CustomEvent) => {
    const { areaId } = e.detail;
    const activeBtn = document.querySelector(`[data-area="${areaId}"]`) as HTMLElement;
    if (activeBtn) {
      navButtons.forEach(b => {
        b.classList.remove('text-[#ff9a3d]');
        b.classList.add('text-gray-400');
      });
      activeBtn.classList.remove('text-gray-400');
      activeBtn.classList.add('text-[#ff9a3d]');
      updateIndicator(activeBtn);
    }
  }) as EventListener);

  setTimeout(() => {
    const homeBtn = document.querySelector('[data-area="home"]') as HTMLElement;
    if (homeBtn) updateIndicator(homeBtn);
  }, 1000);

  // Keyboard number keys island navigation
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes((e.target as Element)?.tagName)) return;
    const keys: Record<string, string> = {
      '1': 'home',
      '2': 'projects',
      '3': 'skills',
      '4': 'about',
      '5': 'contact'
    };
    if (keys[e.key]) {
      window.dispatchEvent(new CustomEvent('3d-navigate', {
        detail: { areaId: keys[e.key] }
      }));
    }
  });

  // Fallback flat grid displaying
  const toggleFallbackBtn = document.getElementById('toggle-fallback-list');
  const gridSection = document.getElementById('fallback-grid-section');
  const mainEl = document.getElementById('main-content');

  toggleFallbackBtn?.addEventListener('click', () => {
    if (!gridSection) return;
    if (gridSection.classList.contains('hidden')) {
      gridSection.classList.remove('hidden');
      gridSection.scrollIntoView({ behavior: 'smooth' });
      toggleFallbackBtn.innerHTML = '<span>🏔️</span> 3D Scene';
      if (mainEl) mainEl.style.height = '65vh';
    } else {
      gridSection.classList.add('hidden');
      toggleFallbackBtn.innerHTML = '<span>📂</span> Flat Grid';
      if (mainEl) mainEl.style.height = '100vh';
    }
    window.dispatchEvent(new Event('resize'));
  });

  window.addEventListener('3d-unsupported', () => {
    if (gridSection) gridSection.classList.remove('hidden');
    if (toggleFallbackBtn) toggleFallbackBtn.style.display = 'none';
    if (mainEl) mainEl.style.display = 'none';
  });

  // Reset Camera View button
  const resetCamBtn = document.getElementById('reset-camera-btn');
  resetCamBtn?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('3d-navigate', {
      detail: { areaId: 'home' }
    }));
  });

  // Onboarding Tutorial dialog controls
  const onboarding = document.getElementById('onboarding-overlay');
  const closeOnboardingBtn = document.getElementById('close-onboarding');
  const onboardingDone = localStorage.getItem('onboarding-done');

  if (onboarding && onboardingDone !== 'true') {
    setTimeout(() => {
      onboarding.classList.remove('hidden');
    }, 1800);
  }

  closeOnboardingBtn?.addEventListener('click', () => {
    if (onboarding) {
      onboarding.classList.add('opacity-0');
      setTimeout(() => {
        onboarding.classList.add('hidden');
        localStorage.setItem('onboarding-done', 'true');
      }, 500);
    }
  });

  // Projected welcome label CTA buttons
  const ctaExplore = document.getElementById('cta-explore');
  const ctaContact = document.getElementById('cta-contact');

  ctaExplore?.addEventListener('click', (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('3d-navigate', {
      detail: { areaId: 'projects' }
    }));
  });

  ctaContact?.addEventListener('click', (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('3d-navigate', {
      detail: { areaId: 'contact' }
    }));
  });
}

/* ==========================================================================
   4. Flat Grid Search, Filtering and Sorting
   ========================================================================== */
function renderRepos(repos: GitHubRepo[]) {
  const container = document.getElementById('repo-grid');
  const countEl = document.getElementById('repo-count');
  if (!container) return;

  if (countEl) {
    countEl.textContent = `${repos.length} project${repos.length !== 1 ? 's' : ''}`;
  }

  if (repos.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-400 mb-2">No projects found</h3>
        <p class="text-gray-500">Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }

  container.innerHTML = repos.map((repo) => {
    const isWebsite = repo.homepage || repo.topics.includes('website') || repo.topics.includes('demo');
    const color = getLanguageColor(repo.language);

    return `
      <article 
        class="repo-card group relative bg-dark-bg-card border border-dark-border rounded-xl p-5 hover:border-[#ff9a3d]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#ff9a3d]/10"
        data-repo="${repo.name}"
      >
        <div class="flex items-start justify-between gap-3 mb-3">
          <h3 class="font-display font-semibold text-lg text-white group-hover:text-[#ff9a3d] transition-colors">
            <a 
              href="#project/${repo.name}"
              class="focus:outline-none focus:ring-2 focus:ring-[#ff9a3d] rounded"
              aria-label="View ${repo.name} project details"
            >
              ${repo.name}
            </a>
          </h3>
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>${repo.stargazersCount}</span>
          </div>
        </div>

        <p class="text-gray-400 text-sm mb-4 line-clamp-2">
          ${repo.description || 'No description available'}
        </p>

        ${repo.topics.length > 0 ? `
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${repo.topics.slice(0, 4).map((topic) => `
              <span class="px-2 py-0.5 text-xs bg-[#ff9a3d]/10 text-[#ff9a3d] rounded-full border border-[#ff9a3d]/20">
                ${topic}
              </span>
            `).join('')}
            ${repo.topics.length > 4 ? `<span class="px-2 py-0.5 text-xs text-gray-500">+${repo.topics.length - 4}</span>` : ''}
          </div>
        ` : ''}

        <div class="flex items-center gap-4 text-xs text-gray-500 mb-4">
          ${repo.language ? `
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${color}"></span>
              <span>${repo.language}</span>
            </div>
          ` : ''}
          
          <div class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            <span>${repo.forksCount}</span>
          </div>

          <div class="ml-auto">
            <time datetime="${repo.updatedAt}">${formatDate(repo.updatedAt)}</time>
          </div>
        </div>

        <div class="absolute inset-x-0 bottom-0 p-5 pt-0 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          ${repo.homepage && isWebsite ? `
            <a
              href="${repo.homepage}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ff9a3d] bg-[#ff9a3d]/10 hover:bg-[#ff9a3d]/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Demo"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Demo
            </a>
          ` : ''}
          <a
            href="${repo.url}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-dark-border hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Repo
          </a>
          <a
            href="#project/${repo.name}"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#ff9a3d] to-[#ff6b4a] hover:from-[#ffa34d] hover:to-[#ff7b5a] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff9a3d]"
          >
            Details
          </a>
        </div>
      </article>
    `;
  }).join('');
}

function updateFlatGrid() {
  const filtered = filterRepos(allRepos, currentSearch, currentTopics, currentLanguage);
  const sorted = sortRepos(filtered, currentSort, currentSortDirection);
  renderRepos(sorted);
}

function initFlatGridFilters() {
  const searchInput = document.getElementById('repo-search') as HTMLInputElement;
  const topicsBtn = document.getElementById('topics-filter-btn');
  const topicsDropdown = document.getElementById('topics-dropdown');
  const topicsContainer = document.getElementById('topics-dropdown-container');
  const languageBtn = document.getElementById('language-filter-btn');
  const languageDropdown = document.getElementById('language-dropdown');
  const languageContainer = document.getElementById('language-dropdown-container');
  const clearBtn = document.getElementById('clear-filters');
  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;

  // Search input with debounce
  let searchTimeout: any;
  searchInput?.addEventListener('input', (e) => {
    currentSearch = (e.target as HTMLInputElement).value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(updateFlatGrid, 250);
  });

  // Shortcut for "/" key focusing search input
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as Element)?.tagName)) {
      e.preventDefault();
      searchInput?.focus();
    }
  });

  // Topics and Languages dropdown toggling
  topicsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    topicsDropdown?.classList.toggle('hidden');
    languageDropdown?.classList.add('hidden');
  });

  languageBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    languageDropdown?.classList.toggle('hidden');
    topicsDropdown?.classList.add('hidden');
  });

  document.addEventListener('click', () => {
    topicsDropdown?.classList.add('hidden');
    languageDropdown?.classList.add('hidden');
  });

  topicsDropdown?.addEventListener('click', (e) => e.stopPropagation());
  languageDropdown?.addEventListener('click', (e) => e.stopPropagation());

  // Populate dynamic dropdown elements
  if (topicsContainer) {
    const topics = getAllTopics(allRepos);
    topicsContainer.innerHTML = topics.map(topic => `
      <label class="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
        <input
          type="checkbox"
          name="topics"
          value="${topic}"
          class="w-4 h-4 rounded border-dark-border bg-dark-bg text-[#ff9a3d] focus:ring-[#ff9a3d] focus:ring-offset-0"
        />
        <span class="text-sm text-gray-300">${topic}</span>
      </label>
    `).join('');

    topicsContainer.querySelectorAll('input[name="topics"]').forEach((chk) => {
      chk.addEventListener('change', () => {
        currentTopics = Array.from(topicsContainer.querySelectorAll('input[name="topics"]:checked'))
          .map((el) => (el as HTMLInputElement).value);
        
        const countBadge = document.getElementById('selected-topics-count');
        if (countBadge) {
          if (currentTopics.length > 0) {
            countBadge.classList.remove('hidden');
            countBadge.textContent = String(currentTopics.length);
          } else {
            countBadge.classList.add('hidden');
          }
        }
        updateClearButton();
        updateFlatGrid();
      });
    });
  }

  if (languageContainer) {
    const languages = getAllLanguages(allRepos);
    languageContainer.innerHTML = `
      <label class="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
        <input
          type="radio"
          name="language"
          value=""
          checked
          class="w-4 h-4 border-dark-border bg-dark-bg text-[#ff9a3d] focus:ring-[#ff9a3d]"
        />
        <span class="text-sm text-gray-300">All Languages</span>
      </label>
    ` + languages.map(lang => `
      <label class="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
        <input
          type="radio"
          name="language"
          value="${lang}"
          class="w-4 h-4 border-dark-border bg-dark-bg text-[#ff9a3d] focus:ring-[#ff9a3d]"
        />
        <span class="text-sm text-gray-300">${lang}</span>
      </label>
    `).join('');

    languageContainer.querySelectorAll('input[name="language"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        const val = (e.target as HTMLInputElement).value;
        currentLanguage = val || null;
        
        const filterText = document.getElementById('language-filter-text');
        if (filterText) {
          filterText.textContent = currentLanguage || 'Language';
        }

        const filterBtn = document.getElementById('language-filter-btn');
        if (filterBtn) {
          if (currentLanguage) {
            filterBtn.classList.add('border-[#ff9a3d]', 'text-[#ff9a3d]');
            filterBtn.classList.remove('border-dark-border', 'text-gray-300');
          } else {
            filterBtn.classList.remove('border-[#ff9a3d]', 'text-[#ff9a3d]');
            filterBtn.classList.add('border-dark-border', 'text-gray-300');
          }
        }
        updateClearButton();
        updateFlatGrid();
      });
    });
  }

  function updateClearButton() {
    if (!clearBtn) return;
    if (currentTopics.length > 0 || currentLanguage) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  clearBtn?.addEventListener('click', () => {
    currentTopics = [];
    currentLanguage = null;
    
    topicsContainer?.querySelectorAll('input[name="topics"]').forEach((el) => {
      (el as HTMLInputElement).checked = false;
    });
    
    const allRadio = languageContainer?.querySelector('input[name="language"][value=""]') as HTMLInputElement;
    if (allRadio) allRadio.checked = true;

    const countBadge = document.getElementById('selected-topics-count');
    if (countBadge) countBadge.classList.add('hidden');

    const filterText = document.getElementById('language-filter-text');
    if (filterText) filterText.textContent = 'Language';

    const filterBtn = document.getElementById('language-filter-btn');
    if (filterBtn) {
      filterBtn.classList.remove('border-[#ff9a3d]', 'text-[#ff9a3d]');
      filterBtn.classList.add('border-dark-border', 'text-gray-300');
    }

    clearBtn.classList.add('hidden');
    updateFlatGrid();
  });

  sortSelect?.addEventListener('change', () => {
    const [by, dir] = sortSelect.value.split('-') as [any, any];
    currentSort = by;
    currentSortDirection = dir;
    updateFlatGrid();
  });
}

/* ==========================================================================
   5. SPA Router & Project Detail Page Rendering
   ========================================================================== */
async function loadProjectDetails(projectId: string) {
  const detailView = document.getElementById('project-detail-view');
  const primaryLayout = document.getElementById('primary-layout');
  const loading = document.getElementById('project-detail-loading');
  const content = document.getElementById('project-detail-content');

  if (!detailView || !primaryLayout || !loading || !content) return;

  // 1. Swap layouts
  primaryLayout.style.display = 'none';
  detailView.classList.remove('hidden');
  loading.classList.remove('hidden');
  content.classList.add('hidden');

  // Smooth scroll to top of view
  window.scrollTo({ top: 0, behavior: 'instant' });

  // 2. Lookup project repo
  const repo = allRepos.find((r) => r.name === projectId);
  if (!repo) {
    // If invalid slug, fallback home
    window.location.hash = '';
    return;
  }

  // 3. Update Title & Descriptions
  const titleEl = document.getElementById('detail-title');
  const descEl = document.getElementById('detail-desc');
  if (titleEl) titleEl.textContent = repo.name;
  if (descEl) descEl.textContent = repo.description || 'No description available.';

  // 4. Fill Links
  const linksEl = document.getElementById('detail-links');
  if (linksEl) {
    linksEl.innerHTML = `
      ${repo.homepage ? `
        <a
          href="${repo.homepage}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff9a3d] to-[#ff6b4a] hover:from-[#ffa34d] hover:to-[#ff7b5a] text-white font-semibold rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff9a3d]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          Live Demo
        </a>
      ` : ''}
      <a
        href="${repo.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 bg-dark-border hover:bg-gray-700 text-white rounded-lg text-sm border border-white/5 hover:border-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff9a3d]"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub
      </a>
    `;
  }

  // 5. Fill Repository Core Stats
  const statsEl = document.getElementById('detail-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      ${repo.language ? `
        <div class="flex items-center gap-2 px-3 py-1.5 bg-dark-bg-card rounded-lg border border-dark-border/40">
          <span class="w-3 h-3 rounded-full" style="background-color: ${getLanguageColor(repo.language)}"></span>
          <span class="text-gray-300 text-xs font-semibold">${repo.language}</span>
        </div>
      ` : ''}
      <div class="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg-card rounded-lg border border-dark-border/40 text-gray-300 text-xs font-semibold">
        <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span>${repo.stargazersCount} stars</span>
      </div>
      <div class="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg-card rounded-lg border border-dark-border/40 text-gray-300 text-xs font-semibold">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span>${repo.forksCount} forks</span>
      </div>
      ${repo.license ? `
        <div class="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg-card rounded-lg border border-dark-border/40 text-gray-300 text-xs font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>${repo.license}</span>
        </div>
      ` : ''}
    `;
  }

  // 6. Fill Sub-languages percentage
  const langSect = document.getElementById('detail-languages-section');
  const langCont = document.getElementById('detail-languages');
  if (langSect && langCont) {
    if (repo.languages.length > 0) {
      langSect.classList.remove('hidden');
      langCont.innerHTML = repo.languages.map(l => `
        <div class="flex items-center gap-2 px-3 py-1.5 bg-dark-bg-card border border-dark-border/40 rounded-lg">
          <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${l.color}"></span>
          <span class="text-gray-300 text-xs font-semibold">${l.name}</span>
          <span class="text-gray-500 text-xs">${l.percentage}%</span>
        </div>
      `).join('');
    } else {
      langSect.classList.add('hidden');
    }
  }

  // 7. Fill Topics list
  const topicsEl = document.getElementById('detail-topics');
  if (topicsEl) {
    topicsEl.innerHTML = repo.topics.map(topic => `
      <span class="px-3 py-1 text-sm bg-[#ff9a3d]/10 text-[#ff9a3d] rounded-full border border-[#ff9a3d]/20 font-semibold">
        ${topic}
      </span>
    `).join('');
  }

  // 8. Fetch dynamic README from GitHub
  const readmeEl = document.getElementById('detail-readme');
  if (readmeEl) {
    try {
      const markdown = await fetchRepoReadme(GITHUB_USERNAME, projectId);
      if (markdown) {
        // Parse with marked and purify with client-side DOMPurify
        const dirtyHtml = await marked.parse(markdown);
        const cleanHtml = DOMPurify.sanitize(dirtyHtml);
        readmeEl.innerHTML = cleanHtml;
      } else {
        readmeEl.innerHTML = `
          <div class="text-center py-12 bg-dark-bg-card rounded-xl border border-dark-border">
            <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p class="text-gray-500">No README.md document is available in this repository.</p>
          </div>
        `;
      }
    } catch (err) {
      console.error(err);
      readmeEl.innerHTML = `<p class="text-red-400 font-semibold text-center">Failed to load readme file content.</p>`;
    }
  }

  // 9. Show details layout
  loading.classList.add('hidden');
  content.classList.remove('hidden');
}

function handleSPARouter() {
  const hash = window.location.hash;
  const detailView = document.getElementById('project-detail-view');
  const primaryLayout = document.getElementById('primary-layout');

  if (hash.startsWith('#project/')) {
    const projectId = hash.replace('#project/', '');
    loadProjectDetails(projectId);
  } else if (['#home', '#projects', '#skills', '#about', '#contact'].includes(hash)) {
    // Return to main layout if hidden
    if (detailView) detailView.classList.add('hidden');
    if (primaryLayout) primaryLayout.style.display = 'contents';
    
    const areaId = hash.replace('#', '');
    window.dispatchEvent(new CustomEvent('3d-navigate', {
      detail: { areaId }
    }));
  } else {
    // Return to main layout
    if (detailView) detailView.classList.add('hidden');
    if (primaryLayout) primaryLayout.style.display = 'contents';
    
    // Force canvas update
    window.dispatchEvent(new Event('resize'));
  }
}

function initSPARouter() {
  const backBtn = document.getElementById('back-to-canvas');
  backBtn?.addEventListener('click', () => {
    window.location.hash = '';
  });

  window.addEventListener('hashchange', handleSPARouter);
  
  // Trigger initial check on startup
  handleSPARouter();
}

/* ==========================================================================
   6. Main Data & Orchestrator Bootloader
   ========================================================================== */
async function bootApp() {
  // Setup standard global states
  initTheme();
  initOverlayControllers();
  initSPARouter();

  try {
    // 1. Fetch GitHub data dynamically
    const user = await fetchGitHubUser(GITHUB_USERNAME);
    
    // 2. Exclude designated repositories and order remaining
    let filteredRepos = user.repositories.filter((repo) => !EXCLUDED_REPOS.includes(repo.name));
    const active = filteredRepos.filter(r => !r.isArchived);
    const archived = filteredRepos.filter(r => r.isArchived);
    allRepos = [...active, ...archived];

    // 3. Update Hero avatar badge if available
    const avatarBadge = document.getElementById('hero-avatar-badge');
    const avatarImg = document.getElementById('hero-avatar-img') as HTMLImageElement;
    const heroBio = document.getElementById('hero-bio');

    if (avatarBadge && avatarImg && user.avatarUrl) {
      avatarImg.src = user.avatarUrl;
      avatarImg.alt = `Profile avatar for ${user.login}`;
      avatarBadge.classList.remove('hidden');
      avatarBadge.classList.add('inline-flex');
    }
    
    if (heroBio && user.bio) {
      heroBio.textContent = user.bio;
    }

    // 4. Boot Flat directory grid logic
    initFlatGridFilters();
    updateFlatGrid();

  } catch (err) {
    console.error("Fatal exception during app bootstrap:", err);
    const errPanel = document.getElementById('fallback-error');
    const errText = document.getElementById('fallback-error-text');
    if (errPanel && errText) {
      errPanel.classList.remove('hidden');
      errText.textContent = err instanceof Error ? err.message : 'Unknown exception occurred.';
    }
  }

  // 5. Build and mount Three.js isometric rendering context
  await initThreeEngine();
}

// Kickstart application on window load
window.addEventListener('load', bootApp);
