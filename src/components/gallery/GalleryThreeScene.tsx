"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { ARTWORKS, Artwork } from "@/data/artworks";
import { ChevronLeft, ChevronRight, ArrowRight, MoveLeft } from "lucide-react";
import gsap from "gsap";

interface GalleryThreeSceneProps {
  onArtworkHover?: (artwork: Artwork | null) => void;
}

// Parametric corridor curved wall geometry generator
function createCorridorWallGeometry(
  radius: number,
  height: number,
  startAngle: number,
  totalAngle: number,
  segments: number,
  facingInward: boolean
) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const frac = i / segments;
    const angle = startAngle + frac * totalAngle;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);

    // bottom vertex
    positions.push(x, 0, z);
    uvs.push(frac * 10, 0);

    // top vertex
    positions.push(x, height, z);
    uvs.push(frac * 10, 1);
  }

  for (let i = 0; i < segments; i++) {
    const b0 = i * 2;
    const t0 = i * 2 + 1;
    const b1 = (i + 1) * 2;
    const t1 = (i + 1) * 2 + 1;

    if (facingInward) {
      indices.push(b0, t1, t0);
      indices.push(b0, b1, t1);
    } else {
      indices.push(b0, t0, t1);
      indices.push(b0, t1, b1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Parametric corridor floor/ceiling geometry generator
function createCorridorFloorCeilingGeometry(
  rInner: number,
  rOuter: number,
  y: number,
  startAngle: number,
  totalAngle: number,
  segments: number,
  facingUp: boolean
) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const frac = i / segments;
    const angle = startAngle + frac * totalAngle;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // inner vertex
    positions.push(rInner * cosA, y, rInner * sinA);
    uvs.push(frac * 10, 0);

    // outer vertex
    positions.push(rOuter * cosA, y, rOuter * sinA);
    uvs.push(frac * 10, 1);
  }

  for (let i = 0; i < segments; i++) {
    const in0 = i * 2;
    const out0 = i * 2 + 1;
    const in1 = (i + 1) * 2;
    const out1 = (i + 1) * 2 + 1;

    if (facingUp) {
      indices.push(in0, out1, out0);
      indices.push(in0, in1, out1);
    } else {
      indices.push(in0, out0, out1);
      indices.push(in0, out1, in1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Parametric corridor radial cap (end/start wall) connecting inner & outer radius
function createRadialCapGeometry(
  rInner: number,
  rOuter: number,
  height: number,
  angle: number,
  facingForward: boolean
) {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const inX = rInner * cosA;
  const inZ = rInner * sinA;
  const outX = rOuter * cosA;
  const outZ = rOuter * sinA;

  const positions = [
    inX, 0, inZ, // 0: in-bottom
    inX, height, inZ, // 1: in-top
    outX, height, outZ, // 2: out-top
    outX, 0, outZ, // 3: out-bottom
  ];

  const uvs = [0, 0, 0, 1, 1, 1, 1, 0];
  let indices: number[];
  if (facingForward) {
    // Normal in forward tangent direction (-sinA, 0, cosA)
    indices = [0, 3, 2, 0, 2, 1];
  } else {
    // Normal in backward tangent direction (sinA, 0, -cosA)
    indices = [0, 1, 2, 0, 2, 3];
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export const GalleryThreeScene: React.FC<GalleryThreeSceneProps> = ({
  onArtworkHover,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mode: 'WALK' (Corridor walk-round) or 'FRONT' (Facing a painting square-on)
  const [viewMode, setViewMode] = useState<"WALK" | "FRONT">("WALK");
  const [activeArtwork, setActiveArtwork] = useState<Artwork>(ARTWORKS[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  // Keep a ref mirror of activeIndex so the render loop never causes a re-render
  const activeIndexRef = useRef(0);
  // Ref for activeArtwork so render loop can read it without stale closure
  const activeArtworkRef = useRef<Artwork>(ARTWORKS[0]);

  // Corridor progress (0 to 1)
  const progressRef = useRef(0.06);
  const targetProgressRef = useRef(0.06);
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastPointerYRef = useRef(0);
  // dragVelocity is normalised (pixels/ms) — keep it small
  const dragVelocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const hasDraggedRef = useRef(false);
  // Track whether all textures have finished loading
  const texturesReadyRef = useRef(false);

  // Mouse parallax
  const mousePosRef = useRef({ x: 0, y: 0 });
  const mouseLagRef = useRef({ x: 0, y: 0 });

  // Camera animation refs
  const isAnimatingCamRef = useRef(false);
  const currentLookAtRef = useRef(new THREE.Vector3(0, 2.5, 0));
  const viewModeRef = useRef<"WALK" | "FRONT">("WALK");

  // Three.js Scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const interactiveObjectsRef = useRef<THREE.Object3D[]>([]);
  const hoveredArtworkRef = useRef<Artwork | null>(null);
  const plaqueMeshesRef = useRef<THREE.Mesh[]>([]);

  // Dimensions & Path Constants
  const RADIUS_CENTER = 22;
  const RADIUS_LEFT = 17.5; // inner curved wall
  const RADIUS_RIGHT = 26.5; // outer curved wall
  const WALL_HEIGHT = 7.5;
  const EYE_HEIGHT = 2.4;

  const START_ANGLE = 0.05;
  const END_ANGLE = 1.95;
  const TOTAL_ANGLE = END_ANGLE - START_ANGLE;

  // Staggered artwork placements on Left and Right Walls
  const artworkPlacements = [
    { artwork: ARTWORKS[0], wall: "left", t: 0.05 },
    { artwork: ARTWORKS[1], wall: "right", t: 0.13 },
    { artwork: ARTWORKS[2], wall: "left", t: 0.22 },
    { artwork: ARTWORKS[3], wall: "right", t: 0.31 },
    { artwork: ARTWORKS[4], wall: "left", t: 0.40 },
    { artwork: ARTWORKS[5], wall: "right", t: 0.49 },
    { artwork: ARTWORKS[6], wall: "left", t: 0.58 },
    { artwork: ARTWORKS[7], wall: "right", t: 0.67 },
    { artwork: ARTWORKS[8], wall: "left", t: 0.76 },
    { artwork: ARTWORKS[9], wall: "right", t: 0.84 },
    { artwork: ARTWORKS[10], wall: "left", t: 0.92 },
    { artwork: ARTWORKS[11], wall: "right", t: 0.99 },
  ];

  // Helper to calculate front view camera position and target
  // Distance D = 5.7 gives exact ~55% height framing as in Reference Image 2!
  const getFrontViewCoordinates = useCallback((idx: number) => {
    const item = artworkPlacements[idx];
    const angle = START_ANGLE + item.t * TOTAL_ANGLE;
    const r = item.wall === "left" ? RADIUS_LEFT + 0.14 : RADIUS_RIGHT - 0.14;

    const artX = r * Math.cos(angle);
    const artZ = r * Math.sin(angle);
    const artY = 3.25;

    const normal = item.wall === "left"
      ? new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
      : new THREE.Vector3(-Math.cos(angle), 0, -Math.sin(angle));

    // Stand 5.7 units away: comfortable museum viewing distance with generous breathing room
    const VIEW_DIST = 5.7;
    const camX = artX + normal.x * VIEW_DIST;
    const camZ = artZ + normal.z * VIEW_DIST;
    const camY = 2.85; // slightly lower than artwork center to leave bottom space for typography

    return {
      camPos: new THREE.Vector3(camX, camY, camZ),
      lookTarget: new THREE.Vector3(artX, artY - 0.15, artZ),
      artwork: item.artwork,
      progressT: item.t,
    };
  }, []);

  // Smooth, Slow, Cinematic Camera Transition to Front View (1.8s power3.inOut)
  const transitionToFrontView = useCallback((idx: number) => {
    if (!cameraRef.current) return;
    const targetCoords = getFrontViewCoordinates(idx);

    isAnimatingCamRef.current = true;
    viewModeRef.current = "FRONT";
    setViewMode("FRONT");
    activeIndexRef.current = idx;
    setActiveIndex(idx);
    setActiveArtwork(targetCoords.artwork);
    activeArtworkRef.current = targetCoords.artwork;
    
    // Synchronize both progress markers directly to this artwork
    targetProgressRef.current = targetCoords.progressT;
    progressRef.current = targetCoords.progressT;
    dragVelocityRef.current = 0;
    isDraggingRef.current = false;
    hasDraggedRef.current = false;

    // Fade out 3D wall plaques during front view to avoid text conflict
    plaqueMeshesRef.current.forEach((m) => {
      m.visible = false;
    });

    const cam = cameraRef.current;
    const startPos = cam.position.clone();
    const startLook = currentLookAtRef.current.clone();

    const animObj = { t: 0 };
    gsap.killTweensOf(animObj);

    gsap.to(animObj, {
      t: 1,
      duration: 1.8,
      ease: "power3.inOut",
      onUpdate: () => {
        cam.position.lerpVectors(startPos, targetCoords.camPos, animObj.t);
        currentLookAtRef.current.lerpVectors(startLook, targetCoords.lookTarget, animObj.t);
        cam.lookAt(currentLookAtRef.current);
      },
      onComplete: () => {
        isAnimatingCamRef.current = false;
        targetProgressRef.current = targetCoords.progressT;
        progressRef.current = targetCoords.progressT;
        dragVelocityRef.current = 0;
      },
    });
  }, [getFrontViewCoordinates]);

  // Smooth, Slow, Cinematic Return to Walk-Round Corridor View (1.5s power3.inOut)
  // LOCKS exactly at the current artwork — AUTO-SCROLL TO THE END IS COMPLETELY OFF
  const returnToWalkView = useCallback(() => {
    if (!cameraRef.current) return;

    isAnimatingCamRef.current = true;
    viewModeRef.current = "WALK";
    setViewMode("WALK");

    // Restore 3D wall plaques
    plaqueMeshesRef.current.forEach((m) => {
      m.visible = true;
    });

    const cam = cameraRef.current;
    const startPos = cam.position.clone();
    const startLook = currentLookAtRef.current.clone();

    // Lock progress to the exact position of the current artwork so it stays strictly stationary
    const currentIdx = activeIndexRef.current;
    const currentT = artworkPlacements[currentIdx]?.t ?? progressRef.current;

    progressRef.current = currentT;
    targetProgressRef.current = currentT;
    dragVelocityRef.current = 0;
    isDraggingRef.current = false;
    hasDraggedRef.current = false;

    const angle = START_ANGLE + currentT * TOTAL_ANGLE;
    const endPos = new THREE.Vector3(
      RADIUS_CENTER * Math.cos(angle),
      EYE_HEIGHT,
      RADIUS_CENTER * Math.sin(angle)
    );

    const forwardAngle = angle + 0.22;
    const endLook = new THREE.Vector3(
      RADIUS_CENTER * Math.cos(forwardAngle),
      EYE_HEIGHT,
      RADIUS_CENTER * Math.sin(forwardAngle)
    );

    const animObj = { t: 0 };
    gsap.killTweensOf(animObj);

    gsap.to(animObj, {
      t: 1,
      duration: 1.5,
      ease: "power3.inOut",
      onUpdate: () => {
        cam.position.lerpVectors(startPos, endPos, animObj.t);
        currentLookAtRef.current.lerpVectors(startLook, endLook, animObj.t);
        cam.lookAt(currentLookAtRef.current);
      },
      onComplete: () => {
        isAnimatingCamRef.current = false;
        // Keep camera completely still in front of this artwork with zero drift or auto-scroll
        progressRef.current = currentT;
        targetProgressRef.current = currentT;
        dragVelocityRef.current = 0;
        isDraggingRef.current = false;
        hasDraggedRef.current = false;
      },
    });
  }, []);

  // Helper: create museum wall vinyl lettering texture (transparent background)
  const createWallLetteringTexture = (artist: string, location: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#333333";
    ctx.font = "500 28px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(artist, 256, 65);

    ctx.fillStyle = "#777777";
    ctx.font = "400 20px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(location.toUpperCase(), 256, 115);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#FFFFFF");
    scene.fog = new THREE.FogExp2(0xFFFFFF, 0.014);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      80
    );
    cameraRef.current = camera;

    const initAngle = START_ANGLE + progressRef.current * TOTAL_ANGLE;
    camera.position.set(
      RADIUS_CENTER * Math.cos(initAngle),
      EYE_HEIGHT,
      RADIUS_CENTER * Math.sin(initAngle)
    );
    const forwardInit = initAngle + 0.22;
    currentLookAtRef.current.set(
      RADIUS_CENTER * Math.cos(forwardInit),
      EYE_HEIGHT,
      RADIUS_CENTER * Math.sin(forwardInit)
    );
    camera.lookAt(currentLookAtRef.current);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    containerRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xEBE8E1, 0.85);
    scene.add(hemiLight);

    const lightAngles = [-0.1, 0.3, 0.7, 1.1, 1.5, 1.9, 2.2];
    lightAngles.forEach((ang) => {
      const lx = RADIUS_CENTER * Math.cos(ang);
      const lz = RADIUS_CENTER * Math.sin(ang);
      const pLight = new THREE.PointLight(0xFFFAF0, 1.1, 16, 1.5);
      pLight.position.set(lx, WALL_HEIGHT - 0.4, lz);
      scene.add(pLight);
    });

    // 5. Materials
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xF3F1EC,
      roughness: 0.92,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // 100% PURE SEAMLESS WHITE GALLERY FLOOR ALL THE WAY TO THE END
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.28,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    // 6. Seamless Parametric Curved Corridor (Inner Wall, Outer Wall, Floor, Ceiling & Radial Caps)
    // Both walls, floor, ceiling, and radial end wall share identical mathematical vertex bounds
    // guaranteeing ZERO gap, seamless lighting, and 100% airtight museum geometry.
    const corridorStart = -0.30;
    const corridorEnd = END_ANGLE + 0.35; // 1.95 + 0.35 = 2.30 radians
    const corridorSpan = corridorEnd - corridorStart;

    // LEFT CURVED WALL (Inner wall at RADIUS_LEFT, facing outward towards corridor)
    const leftWallGeo = createCorridorWallGeometry(
      RADIUS_LEFT,
      WALL_HEIGHT,
      corridorStart,
      corridorSpan,
      128,
      false
    );
    const leftWallMesh = new THREE.Mesh(leftWallGeo, wallMaterial);
    scene.add(leftWallMesh);

    // RIGHT CURVED WALL (Outer wall at RADIUS_RIGHT, facing inward towards corridor)
    const rightWallGeo = createCorridorWallGeometry(
      RADIUS_RIGHT,
      WALL_HEIGHT,
      corridorStart,
      corridorSpan,
      128,
      true
    );
    const rightWallMesh = new THREE.Mesh(rightWallGeo, wallMaterial);
    scene.add(rightWallMesh);

    // CURVED GALLERY FLOOR (Seamlessly extending under walls and all the way to the end)
    const floorGeo = createCorridorFloorCeilingGeometry(
      RADIUS_LEFT - 0.5,
      RADIUS_RIGHT + 0.5,
      0,
      corridorStart - 0.15,
      corridorSpan + 0.3,
      128,
      true
    );
    const floorMesh = new THREE.Mesh(floorGeo, floorMaterial);
    scene.add(floorMesh);

    // BASE CONTINUOUS GROUND PLANE (Guarantees entire floor is 100% white all the way to infinity)
    const groundGeo = new THREE.PlaneGeometry(300, 300);
    const groundMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.01;
    scene.add(groundMesh);

    // CURVED CEILING (Seamlessly spanning between RADIUS_LEFT and RADIUS_RIGHT)
    const ceilingGeo = createCorridorFloorCeilingGeometry(
      RADIUS_LEFT,
      RADIUS_RIGHT,
      WALL_HEIGHT,
      corridorStart,
      corridorSpan,
      128,
      false
    );
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMaterial);
    scene.add(ceilingMesh);

    // END WALL CLOSING CORRIDOR (Same Grey Wall Color, Airtight Connection)
    const endWallGeo = createRadialCapGeometry(
      RADIUS_LEFT,
      RADIUS_RIGHT,
      WALL_HEIGHT,
      corridorEnd,
      false
    );
    const endWallMesh = new THREE.Mesh(endWallGeo, wallMaterial);
    scene.add(endWallMesh);

    // START WALL CLOSING THE BEGINNING OF CORRIDOR
    const startWallGeo = createRadialCapGeometry(
      RADIUS_LEFT,
      RADIUS_RIGHT,
      WALL_HEIGHT,
      corridorStart,
      true
    );
    const startWallMesh = new THREE.Mesh(startWallGeo, wallMaterial);
    scene.add(startWallMesh);

    // FORMA / 01 Logo in Exact Center of End Wall
    // Use a LoadingManager so we know when ALL textures are ready → no blink
    const loadingManager = new THREE.LoadingManager();
    texturesReadyRef.current = false;
    loadingManager.onLoad = () => {
      texturesReadyRef.current = true;
    };

    const textureLoader = new THREE.TextureLoader(loadingManager);
    const logoTexture = textureLoader.load("/images/logo.png");
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.minFilter = THREE.LinearFilter;
    const endLogoMat = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      roughness: 0.8,
      metalness: 0.05,
    });
    const endLogoGeo = new THREE.PlaneGeometry(4.5, 1.5);
    const endLogoMesh = new THREE.Mesh(endLogoGeo, endLogoMat);

    const endX = RADIUS_CENTER * Math.cos(corridorEnd);
    const endZ = RADIUS_CENTER * Math.sin(corridorEnd);
    const inwardEndNormal = new THREE.Vector3(Math.sin(corridorEnd), 0, -Math.cos(corridorEnd));

    endLogoMesh.position.set(
      endX + inwardEndNormal.x * 0.03,
      3.25,
      endZ + inwardEndNormal.z * 0.03
    );
    endLogoMesh.lookAt(
      endLogoMesh.position.x + inwardEndNormal.x * 5,
      3.25,
      endLogoMesh.position.z + inwardEndNormal.z * 5
    );
    scene.add(endLogoMesh);

    // 7. Mount Artworks with Generous Hit Boxes for Smooth Interaction
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.5,
    });
    const matboardMaterial = new THREE.MeshStandardMaterial({
      color: 0xFAF9F5,
      roughness: 0.8,
    });

    interactiveObjectsRef.current = [];
    plaqueMeshesRef.current = [];

    artworkPlacements.forEach(({ artwork, wall, t }, idx) => {
      const angle = START_ANGLE + t * TOTAL_ANGLE;
      const r = wall === "left" ? RADIUS_LEFT + 0.12 : RADIUS_RIGHT - 0.12;

      const group = new THREE.Group();
      const posX = r * Math.cos(angle);
      const posZ = r * Math.sin(angle);
      const posY = 3.25;

      group.position.set(posX, posY, posZ);

      const outwardNormal = new THREE.Vector2(Math.cos(angle), Math.sin(angle));
      const lookTarget = wall === "left"
        ? new THREE.Vector3(posX + outwardNormal.x * 5, posY, posZ + outwardNormal.y * 5)
        : new THREE.Vector3(posX - outwardNormal.x * 5, posY, posZ - outwardNormal.y * 5);

      group.lookAt(lookTarget);

      // Card Dimensions (3:4 ratio)
      const cardW = 2.1;
      const cardH = 2.8;

      // Frame Box
      const frameGeo = new THREE.BoxGeometry(cardW + 0.16, cardH + 0.16, 0.06);
      const frameMesh = new THREE.Mesh(frameGeo, frameMaterial);
      group.add(frameMesh);

      // Matboard
      const matGeo = new THREE.PlaneGeometry(cardW + 0.06, cardH + 0.06);
      const matMesh = new THREE.Mesh(matGeo, matboardMaterial);
      matMesh.position.z = 0.032;
      group.add(matMesh);

      // Canvas with Artwork Texture — use anisotropy for crisp look at angles
      const canvasTexture = textureLoader.load(artwork.image);
      canvasTexture.colorSpace = THREE.SRGBColorSpace;
      canvasTexture.minFilter = THREE.LinearMipmapLinearFilter;
      canvasTexture.magFilter = THREE.LinearFilter;
      canvasTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      canvasTexture.generateMipmaps = true;

      const canvasMaterial = new THREE.MeshStandardMaterial({
        map: canvasTexture,
        roughness: 0.7,
        metalness: 0.0,
      });

      const canvasGeo = new THREE.PlaneGeometry(cardW, cardH);
      const canvasMesh = new THREE.Mesh(canvasGeo, canvasMaterial);
      canvasMesh.position.z = 0.035;
      group.add(canvasMesh);

      // Minimalist Wall Vinyl Lettering Under Artwork (Walk Mode)
      const vinylTex = createWallLetteringTexture(artwork.artist, artwork.location);
      if (vinylTex) {
        const vinylMat = new THREE.MeshBasicMaterial({
          map: vinylTex,
          transparent: true,
          opacity: 0.85,
        });
        const vinylGeo = new THREE.PlaneGeometry(1.6, 0.5);
        const vinylMesh = new THREE.Mesh(vinylGeo, vinylMat);
        vinylMesh.position.set(0, -cardH / 2 - 0.45, 0.02);
        group.add(vinylMesh);
        plaqueMeshesRef.current.push(vinylMesh);
      }

      // EXPANDED HIT AREA: Enables clicking on and around the painting
      const hitGeo = new THREE.PlaneGeometry(cardW + 2.8, cardH + 2.8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.z = 0.04;
      group.add(hitMesh);

      const clickData = { artwork, index: idx, group };
      hitMesh.userData = clickData;
      canvasMesh.userData = clickData;

      scene.add(group);
      interactiveObjectsRef.current.push(hitMesh);
    });

    // 8. Resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 9. Pointer Move & Drag Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-10, -10);

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mousePosRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePosRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (isDraggingRef.current) {
        // While animating or in front view, do not scroll the corridor
        if (isAnimatingCamRef.current || viewModeRef.current === "FRONT") {
          return;
        }

        const deltaX = e.clientX - lastPointerXRef.current;
        const deltaY = e.clientY - lastPointerYRef.current;
        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
          hasDraggedRef.current = true;
        }

        const now = performance.now();
        const dt = Math.max(1, now - lastTimeRef.current);
        dragVelocityRef.current = deltaX / dt;
        lastPointerXRef.current = e.clientX;
        lastPointerYRef.current = e.clientY;
        lastTimeRef.current = now;

        targetProgressRef.current = Math.max(
          0.02,
          Math.min(0.98, targetProgressRef.current - deltaX * 0.0016)
        );
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || isAnimatingCamRef.current) return;
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      lastPointerXRef.current = e.clientX;
      lastPointerYRef.current = e.clientY;
      lastTimeRef.current = performance.now();
      dragVelocityRef.current = 0;
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (viewModeRef.current === "WALK" && !isAnimatingCamRef.current) {
        // Gentle inertia: cap velocity and use a small multiplier
        const rawInertia = -dragVelocityRef.current * 0.045;
        // clamp so a fast flick never overshoots more than ~0.12 of the full track
        const clampedInertia = Math.max(-0.12, Math.min(0.12, rawInertia));
        targetProgressRef.current = Math.max(
          0.02,
          Math.min(0.98, targetProgressRef.current + clampedInertia)
        );
      }
      dragVelocityRef.current = 0;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (viewModeRef.current === "FRONT" || isAnimatingCamRef.current) {
        return;
      }

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      targetProgressRef.current = Math.max(
        0.02,
        Math.min(0.98, targetProgressRef.current + delta * 0.00042)
      );
    };

    // CLICK HANDLER: Clicking on or around painting triggers slow smooth front view!
    const onClick = (e: MouseEvent) => {
      if (hasDraggedRef.current) return;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const data = hit.userData;
        if (data && typeof data.index === "number") {
          if (viewModeRef.current === "WALK") {
            // SLOWLY & SMOOTHLY GLIDE TO FRONT VIEW (Image 2)
            transitionToFrontView(data.index);
          } else {
            // Already in FRONT view: clicking painting navigates to detail page
            router.push(`/artwork/${data.artwork.slug}`);
          }
          return;
        }
      }

      if (viewModeRef.current === "FRONT") {
        returnToWalkView();
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointermove", onPointerMove);
    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("wheel", onWheel, { passive: false });
    domEl.addEventListener("click", onClick);

    // 10. Animation Loop
    let animId: number;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);

      mouseLagRef.current.x += (mousePosRef.current.x - mouseLagRef.current.x) * 0.05;
      mouseLagRef.current.y += (mousePosRef.current.y - mouseLagRef.current.y) * 0.05;

      if (!isAnimatingCamRef.current) {
        if (viewModeRef.current === "WALK") {
          // Silky smooth lerp — 0.055 gives butter-smooth easing without lag
          const diff = targetProgressRef.current - progressRef.current;
          if (Math.abs(diff) > 0.00005) {
            progressRef.current += diff * 0.055;
          } else {
            progressRef.current = targetProgressRef.current;
          }

          const angle = START_ANGLE + progressRef.current * TOTAL_ANGLE;
          const camX = RADIUS_CENTER * Math.cos(angle);
          const camZ = RADIUS_CENTER * Math.sin(angle);
          const camY = EYE_HEIGHT + mouseLagRef.current.y * 0.12;

          camera.position.set(camX, camY, camZ);

          const forwardAngle = angle + 0.22;
          const targetLookX = RADIUS_CENTER * Math.cos(forwardAngle) + mouseLagRef.current.x * 0.35;
          const targetLookZ = RADIUS_CENTER * Math.sin(forwardAngle);

          currentLookAtRef.current.set(targetLookX, camY + mouseLagRef.current.y * -0.15, targetLookZ);
          camera.lookAt(currentLookAtRef.current);

          // Find closest artwork — ONLY update React state when it actually changes
          // using ref comparison so we never trigger a re-render from inside the loop
          let closestIdx = 0;
          let minDistance = 9999;
          artworkPlacements.forEach((p, idx) => {
            const d = Math.abs(p.t - progressRef.current);
            if (d < minDistance) {
              minDistance = d;
              closestIdx = idx;
            }
          });

          if (closestIdx !== activeIndexRef.current) {
            activeIndexRef.current = closestIdx;
            // Batch the state update — React will coalesce it, no Three.js teardown
            setActiveIndex(closestIdx);
            setActiveArtwork(ARTWORKS[closestIdx]);
          }
        } else {
          // Subtle Front View Parallax — use activeIndexRef, never stale activeIndex
          const targetCoords = getFrontViewCoordinates(activeIndexRef.current);
          camera.position.x = targetCoords.camPos.x + mouseLagRef.current.x * 0.12;
          camera.position.y = targetCoords.camPos.y + mouseLagRef.current.y * 0.08;
          camera.position.z = targetCoords.camPos.z + mouseLagRef.current.x * -0.12;
          camera.lookAt(targetCoords.lookTarget);
        }

        // Raycasting for pointer hover
        if (!isDraggingRef.current) {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, false);

          if (intersects.length > 0) {
            const hit = intersects[0].object;
            const artwork = hit.userData.artwork as Artwork;
            if (hoveredArtworkRef.current !== artwork) {
              hoveredArtworkRef.current = artwork;
              if (onArtworkHover) onArtworkHover(artwork);
              document.body.style.cursor = "pointer";
            }
          } else {
            if (hoveredArtworkRef.current) {
              hoveredArtworkRef.current = null;
              if (onArtworkHover) onArtworkHover(null);
              document.body.style.cursor = "default";
            }
          }
        }
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      domEl.removeEventListener("pointermove", onPointerMove);
      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      domEl.removeEventListener("wheel", onWheel);
      domEl.removeEventListener("click", onClick);
      document.body.style.cursor = "default";

      if (renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  // The scene is built once and never torn down just because activeIndex changes —
  // that was the root cause of the blinking/flickering during scroll.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionToFrontView, returnToWalkView, getFrontViewCoordinates, onArtworkHover]);

  // Stepping controls
  const handlePrev = () => {
    if (viewMode === "FRONT") {
      const prevIdx = (activeIndexRef.current - 1 + artworkPlacements.length) % artworkPlacements.length;
      transitionToFrontView(prevIdx);
    } else {
      targetProgressRef.current = Math.max(0.02, targetProgressRef.current - 0.085);
    }
  };

  const handleNext = () => {
    if (viewMode === "FRONT") {
      const nextIdx = (activeIndexRef.current + 1) % artworkPlacements.length;
      transitionToFrontView(nextIdx);
    } else {
      targetProgressRef.current = Math.min(0.98, targetProgressRef.current + 0.085);
    }
  };

  return (
    <div className="relative w-full h-full select-none">
      {/* Three.js Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* When in FRONT VIEW: Back to Corridor Pill */}
      {viewMode === "FRONT" && (
        <div className="absolute top-24 left-6 md:left-12 z-30 animate-in fade-in slide-in-from-top-2 duration-400">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              returnToWalkView();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-300 text-neutral-800 text-[10px] font-semibold tracking-wider uppercase hover:bg-black hover:text-white hover:border-black transition-all shadow-xs pointer-events-auto"
          >
            <MoveLeft size={13} />
            <span>WALK ROUND CORRIDOR</span>
          </button>
        </div>
      )}

      {/* FRONT VIEW CLEAN TYPOGRAPHY OVERLAY (Exact Re-creation of Reference Image 2) */}
      {viewMode === "FRONT" && (
        <div className="absolute inset-x-0 bottom-0 pointer-events-none pb-7 md:pb-9 flex flex-col justify-end items-center z-20 animate-in fade-in duration-500">
          {/* 1. Artist & Region label positioned directly under the artwork card */}
          <div className="mb-4 text-center font-sans">
            <span className="text-sm md:text-base font-normal tracking-wide text-neutral-800 block">
              {activeArtwork.artist}
            </span>
            <span className="text-[10px] md:text-[11px] font-normal uppercase tracking-widest text-neutral-500 block mt-0.5">
              {activeArtwork.location}
            </span>
          </div>

          {/* 2. Bottom Center: Large Title & ENTER THE COLLECTION link */}
          <div className="text-center pointer-events-auto">
            <button
              onClick={() => router.push(`/artwork/${activeArtwork.slug}`)}
              className="group inline-flex flex-col items-center cursor-pointer"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold uppercase tracking-wider text-neutral-900 group-hover:text-gallery-accent transition-colors">
                {activeArtwork.title}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-neutral-600 group-hover:text-black transition-colors font-medium">
                <span>ENTER THE COLLECTION</span>
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* WALK VIEW MINIMAL BOTTOM BAR */}
      {viewMode === "WALK" && (
        <div className="absolute inset-x-0 bottom-0 pointer-events-none px-6 md:px-12 pb-6 md:pb-8 flex justify-center items-end z-20">
          {/* Center: Subtle active title */}
          <div className="pointer-events-auto text-center mx-auto transition-opacity duration-300 opacity-90 hover:opacity-100">
            <button
              onClick={() => transitionToFrontView(activeIndex)}
              className="group flex flex-col items-center"
            >
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-neutral-900 group-hover:text-gallery-accent transition-colors">
                {activeArtwork.title}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5 group-hover:text-neutral-800 transition-colors">
                <span>{activeArtwork.artist}</span>
                <span className="mx-1">•</span>
                <span className="underline underline-offset-4">CLICK TO VIEW FRONT</span>
                <ArrowRight size={10} className="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
