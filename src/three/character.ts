import * as THREE from "three";

export class PlayableCharacter {
  public mesh: THREE.Group;
  private velocity = new THREE.Vector3();
  private speed = 4.5;
  private isMoving = false;
  
  // Input tracking
  private keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  // Jumping state
  private isJumping = false;
  private jumpTime = 0;

  // Body parts for animation (extracted from GLTF model)
  private leftLeg: THREE.Object3D | null = null;
  private rightLeg: THREE.Object3D | null = null;
  private leftArm: THREE.Object3D | null = null;
  private rightArm: THREE.Object3D | null = null;
  private head: THREE.Object3D | null = null;

  constructor(model: THREE.Group) {
    this.mesh = new THREE.Group();
    
    // Add the cloned GLTF model
    const characterModel = model.clone();
    this.mesh.add(characterModel);
    
    // Configure shadows and extract parts dynamically
    this.extractBodyParts(characterModel);
    
    // Setup inputs
    this.setupControls();
  }

  private extractBodyParts(model: THREE.Group) {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      
      const name = child.name.toLowerCase();
      // Case-insensitive substring matching to support any Kenney GLB node structures
      if (name.includes("leg") && name.includes("left")) {
        this.leftLeg = child;
      } else if (name.includes("leg") && name.includes("right")) {
        this.rightLeg = child;
      } else if (name.includes("arm") && name.includes("left")) {
        this.leftArm = child;
      } else if (name.includes("arm") && name.includes("right")) {
        this.rightArm = child;
      } else if (name.includes("head")) {
        this.head = child;
      }
    });

    // Fallback search if names are slightly different (e.g. LeftLeg, RightArm, etc.)
    if (!this.leftLeg) {
      model.traverse((child) => {
        const name = child.name.toLowerCase();
        if (name.includes("left") && name.includes("leg")) this.leftLeg = child;
        if (name.includes("right") && name.includes("leg")) this.rightLeg = child;
        if (name.includes("left") && name.includes("arm")) this.leftArm = child;
        if (name.includes("right") && name.includes("arm")) this.rightArm = child;
      });
    }

    // Scale character nicely for the isometric scene size (around 0.8 units high)
    this.mesh.scale.set(0.48, 0.48, 0.48);
  }

  private setupControls() {
    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      if (k in this.keys || e.key in this.keys) {
        this.keys[k as keyof typeof this.keys] = true;
        this.keys[e.key as keyof typeof this.keys] = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      const k = e.key.toLowerCase();
      if (k in this.keys || e.key in this.keys) {
        this.keys[k as keyof typeof this.keys] = false;
        this.keys[e.key as keyof typeof this.keys] = false;
      }
    });
  }

  /**
   * Triggers the jump Easter Egg
   */
  public jump() {
    if (this.isJumping) return;
    this.isJumping = true;
    this.jumpTime = 0;
  }

  /**
   * Character frame tick update loop
   */
  public update(deltaTime: number, camera: THREE.OrthographicCamera | null) {
    this.velocity.set(0, 0, 0);

    // Handle WASD / Arrows velocity mapping
    if (this.keys.w || this.keys.ArrowUp) this.velocity.z = -1;
    if (this.keys.s || this.keys.ArrowDown) this.velocity.z = 1;
    if (this.keys.a || this.keys.ArrowLeft) this.velocity.x = -1;
    if (this.keys.d || this.keys.ArrowRight) this.velocity.x = 1;

    this.isMoving = this.velocity.lengthSq() > 0;

    if (this.isMoving) {
      // Normalize velocity vector
      this.velocity.normalize();
      
      // Calculate smooth movement vector
      const moveStep = this.velocity.clone().multiplyScalar(this.speed * deltaTime);
      
      // Apply movement step
      this.mesh.position.add(moveStep);

      // Boundaries collision check (Keep player on islands and prevent falling into void)
      const maxDist = 18; // Limit island borders
      this.mesh.position.x = Math.max(-maxDist, Math.min(maxDist, this.mesh.position.x));
      this.mesh.position.z = Math.max(-maxDist, Math.min(maxDist, this.mesh.position.z));

      // Smoothly rotate character to face movement direction (only if not jumping)
      if (!this.isJumping) {
        const targetAngle = Math.atan2(this.velocity.x, this.velocity.z);
        
        // Interpolate angle for smooth turns
        const currentAngle = this.mesh.rotation.y;
        let diff = targetAngle - currentAngle;
        
        // Normalize angle difference to [-PI, PI]
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        this.mesh.rotation.y += diff * 15 * deltaTime;
      }

      // Animate walking limbs bobbing
      const time = performance.now() * 0.012;
      
      // Swinging legs
      if (this.leftLeg) this.leftLeg.rotation.x = Math.sin(time) * 0.6;
      if (this.rightLeg) this.rightLeg.rotation.x = -Math.sin(time) * 0.6;

      // Swinging arms (opposite to legs)
      if (this.leftArm) this.leftArm.rotation.x = -Math.sin(time) * 0.4;
      if (this.rightArm) this.rightArm.rotation.x = Math.sin(time) * 0.4;

      // Bob torso up and down slightly
      if (!this.isJumping) {
        this.mesh.position.y = Math.abs(Math.sin(time * 2)) * 0.04;
      }
      
      // Tilt head forward slightly when running
      if (this.head) this.head.rotation.x = 0.08 + Math.sin(time) * 0.02;

      // Camera follow logic (keeps character in close-up focus)
      if (camera) {
        const targetCamX = this.mesh.position.x + 8;
        const targetCamY = this.mesh.position.y + 8;
        const targetCamZ = this.mesh.position.z + 8;

        // Smooth camera follow interpolation
        camera.position.x += (targetCamX - camera.position.x) * 4 * deltaTime;
        camera.position.y += (targetCamY - camera.position.y) * 4 * deltaTime;
        camera.position.z += (targetCamZ - camera.position.z) * 4 * deltaTime;

        // Force lookAt on character
        camera.lookAt(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
      }
    } else {
      // Return limbs to idle poses
      const step = 10 * deltaTime;
      if (this.leftLeg) this.leftLeg.rotation.x += (0 - this.leftLeg.rotation.x) * step;
      if (this.rightLeg) this.rightLeg.rotation.x += (0 - this.rightLeg.rotation.x) * step;
      if (this.leftArm) this.leftArm.rotation.x += (0 - this.leftArm.rotation.x) * step;
      if (this.rightArm) this.rightArm.rotation.x += (0 - this.rightArm.rotation.x) * step;
      if (!this.isJumping) {
        this.mesh.position.y += (0 - this.mesh.position.y) * step;
      }
      if (this.head) this.head.rotation.x += (0 - this.head.rotation.x) * step;
    }

    // Handle active jumping easter egg physics
    if (this.isJumping) {
      this.jumpTime += deltaTime * 5.5; // Jump speed factor
      const jumpHeight = Math.sin(this.jumpTime) * 1.3;
      
      // Perform a full 360-degree spin!
      this.mesh.rotation.y += deltaTime * 14;

      if (this.jumpTime >= Math.PI) {
        this.isJumping = false;
        this.mesh.position.y = 0;
      } else {
        this.mesh.position.y = jumpHeight;
      }
    }
  }

  /**
   * Directly teleports character to coordinate
   */
  public teleport(x: number, z: number) {
    this.mesh.position.set(x, 0, z);
    this.velocity.set(0, 0, 0);
    this.isMoving = false;
  }
}
