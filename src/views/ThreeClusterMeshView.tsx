import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ViewMode, AppTheme } from '../types';

interface ThreeClusterMeshViewProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  currentTheme?: AppTheme;
}

interface NodeData {
  id: string;
  name: string;
  role: string;
  status: 'critical' | 'healthy' | 'busy' | 'idle';
  cpu: string;
  ram: string;
  queue: string;
  p95: string;
  position: [number, number, number];
}

const NODES_DATA: NodeData[] = [
  {
    id: 'core-gateway',
    name: 'Pipeline ML Shield Hub',
    role: 'Central Telemetry Ingestion & XGBoost v2.4 Gate',
    status: 'healthy',
    cpu: '18%',
    ram: '4.2GB / 16GB',
    queue: '2 jobs queued',
    p95: '34ms',
    position: [0, 0, 0],
  },
  {
    id: 'api-gateway-runner',
    name: 'Runner: api-gateway #4192',
    role: 'Stage 05 Integration Harness (Matrix Pod 02)',
    status: 'critical',
    cpu: '89%',
    ram: '7.8GB / 8GB',
    queue: 'Halted (84% Risk)',
    p95: '120ms (Socket Timeout)',
    position: [-6, 0, -2],
  },
  {
    id: 'data-pipeline-runner',
    name: 'Runner: data-pipeline #4189',
    role: 'Spark Distributed Batch Sharding (4 Workers)',
    status: 'busy',
    cpu: '64%',
    ram: '11.2GB / 16GB',
    queue: 'Running Stage 4/5',
    p95: '48ms',
    position: [6, 0, -2],
  },
  {
    id: 'frontend-portal-runner',
    name: 'Runner: frontend-portal #4185',
    role: 'Vite / ESBuild Ephemeral Container',
    status: 'healthy',
    cpu: '24%',
    ram: '2.1GB / 8GB',
    queue: 'Building (Stage 3)',
    p95: '18ms',
    position: [-3.5, 0, 5],
  },
  {
    id: 'backend-services-runner',
    name: 'Runner: microservices-backend #4180',
    role: 'Go / Node Dependency Lockfile Validator',
    status: 'busy',
    cpu: '41%',
    ram: '3.6GB / 8GB',
    queue: 'AST Parser Active',
    p95: '29ms',
    position: [3.5, 0, 5],
  },
];

// Helper to generate procedural dial/circuit texture without external URLs
function createProceduralServerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Dark metallic background
    ctx.fillStyle = '#111724';
    ctx.fillRect(0, 0, 512, 512);

    // Circuit grid lines
    ctx.strokeStyle = '#253248';
    ctx.lineWidth = 2;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Bus lines
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(64, 128);
    ctx.lineTo(256, 128);
    ctx.lineTo(320, 192);
    ctx.lineTo(448, 192);
    ctx.stroke();

    // Secondary bus
    ctx.strokeStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(64, 384);
    ctx.lineTo(192, 384);
    ctx.lineTo(256, 320);
    ctx.lineTo(448, 320);
    ctx.stroke();

    // LED status array points
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#22c55e' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(80 + i * 40, 60, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Procedural contact shadow texture
function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const ThreeClusterMeshView: React.FC<ThreeClusterMeshViewProps> = ({
  onNavigate,
  onShowToast,
  currentTheme = 'aurora',
}) => {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(NODES_DATA[1]);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [explodedFactor, setExplodedFactor] = useState(0); // 0 to 1
  const [packetSpeed, setPacketSpeed] = useState(1);
  const [activePreset, setActivePreset] = useState<'overview' | 'gateway' | 'spark' | 'top'>('overview');

  // Ref to store mutable animation state for zero-GC render loop
  const animStateRef = useRef({
    explodedTarget: 0,
    explodedCurrent: 0,
    cameraTargetPos: new THREE.Vector3(0, 8, 14),
    cameraTargetLookAt: new THREE.Vector3(0, 1, 0),
    cameraCurrentLookAt: new THREE.Vector3(0, 1, 0),
    isInteracting: false,
    speedMultiplier: 1,
    nodesMeshMap: new Map<string, THREE.Group>(),
    explodedParts: [] as { obj: THREE.Object3D; basePos: THREE.Vector3; explodeDir: THREE.Vector3 }[],
  });

  useEffect(() => {
    animStateRef.current.explodedTarget = explodedFactor;
  }, [explodedFactor]);

  useEffect(() => {
    animStateRef.current.speedMultiplier = packetSpeed;
  }, [packetSpeed]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    // 1. Software-WebGL Guard (per Three.js skill)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Determine colors based on active theme
    const themeBg = currentTheme === 'nordic' ? 0xf1f5f9 : currentTheme === 'cyber' ? 0x090a0d : 0x080d16;
    const gridMajor = currentTheme === 'nordic' ? 0x0284c7 : currentTheme === 'cyber' ? 0xf59e0b : 0x38bdf8;
    const gridMinor = currentTheme === 'nordic' ? 0xcbd5e1 : currentTheme === 'cyber' ? 0x242938 : 0x1e2c45;

    // 2. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(themeBg);
    scene.fog = new THREE.FogExp2(themeBg, 0.035);

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 8, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.appendChild(renderer.domElement);

    // 3. Studio Environment Map (RoomEnvironment via PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio Lighting Rig
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(8, 15, 10);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    scene.add(keyLight);

    // Cool Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(0x60a5fa, 0x090e19, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Violet Accent Rim Light
    const rimLight = new THREE.PointLight(0xa855f7, 3.5, 25);
    rimLight.position.set(-8, 6, -6);
    scene.add(rimLight);

    // Cyan Accent Rim Light
    const cyanLight = new THREE.PointLight(0x38bdf8, 3.0, 25);
    cyanLight.position.set(8, 6, 6);
    scene.add(cyanLight);

    // 5. Procedural Textures & Materials
    const serverTex = createProceduralServerTexture();
    const shadowTex = createRadialShadowTexture();

    // Shared Geometries & Materials
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1b2333,
      metalness: 0.85,
      roughness: 0.25,
      map: serverTex,
    });

    const darkBevelMat = new THREE.MeshStandardMaterial({
      color: 0x090e19,
      metalness: 0.95,
      roughness: 0.15,
    });

    const glowBlueMat = new THREE.MeshBasicMaterial({ color: 0x4d8eff });
    const glowVioletMat = new THREE.MeshBasicMaterial({ color: 0xb76dff });
    const glowErrorMat = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
    const glowEmeraldMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });

    // 6. Ground Grid & Contact Floor
    const gridHelper = new THREE.GridHelper(30, 30, gridMajor, gridMinor);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Circular coordinate rings on the ground
    const ringGeo = new THREE.RingGeometry(3.8, 4.0, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: gridMajor,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const coordRing = new THREE.Mesh(ringGeo, ringMat);
    coordRing.rotation.x = -Math.PI / 2;
    coordRing.position.y = 0.01;
    scene.add(coordRing);

    const outerRingGeo = new THREE.RingGeometry(9.8, 10.0, 64);
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.01;
    scene.add(outerRing);

    // 7. Composite 3-12 Part Procedural Models for Server Blades (THREE.Group)
    // Every subject is a group with 5-9 distinct parts:
    // (1) Base plinth, (2) Main chassis body, (3) Beveled front bezel,
    // (4) Heat-sink cooling fins, (5) Interface optical bay,
    // (6) Fiber optic conduit tubes, (7) Status LED array, (8) Contact shadow disc.
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const raycastTargets: THREE.Object3D[] = [];
    const explodedParts: { obj: THREE.Object3D; basePos: THREE.Vector3; explodeDir: THREE.Vector3 }[] = [];

    NODES_DATA.forEach((node) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(node.position[0], 0, node.position[2]);
      nodeGroup.userData = { nodeData: node };

      // Contact shadow disc on ground
      const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = 0.02;
      nodeGroup.add(shadowMesh);

      // Part 1: Plinth pedestal (bottom flush with ground)
      const plinthGeo = new THREE.BoxGeometry(2.0, 0.2, 1.6);
      const plinthMesh = new THREE.Mesh(plinthGeo, darkBevelMat);
      plinthMesh.position.y = 0.1;
      plinthMesh.castShadow = !isSoftwareGl;
      plinthMesh.receiveShadow = !isSoftwareGl;
      nodeGroup.add(plinthMesh);

      // Part 2: Main server blade body
      const isCore = node.id === 'core-gateway';
      const isError = node.status === 'critical';
      const bodyH = isCore ? 3.0 : 2.2;
      const bodyGeo = new THREE.BoxGeometry(1.6, bodyH, 1.2);
      const bodyMesh = new THREE.Mesh(bodyGeo, chassisMat);
      bodyMesh.position.y = 0.2 + bodyH / 2;
      bodyMesh.castShadow = !isSoftwareGl;
      bodyMesh.receiveShadow = !isSoftwareGl;
      nodeGroup.add(bodyMesh);

      // Part 3: Top Cap / Heat Exchanger (Explodable part)
      const capGeo = new THREE.BoxGeometry(1.5, 0.25, 1.1);
      const capMesh = new THREE.Mesh(capGeo, darkBevelMat);
      const capY = 0.2 + bodyH + 0.125;
      capMesh.position.y = capY;
      capMesh.castShadow = !isSoftwareGl;
      nodeGroup.add(capMesh);

      explodedParts.push({
        obj: capMesh,
        basePos: capMesh.position.clone(),
        explodeDir: new THREE.Vector3(0, 1.6, 0),
      });

      // Part 4: Heat-sink fin array (6 vertical thin blades)
      const finGroup = new THREE.Group();
      finGroup.position.set(0, 0.2 + bodyH / 2, 0.62);
      for (let f = -2; f <= 2; f++) {
        const finGeo = new THREE.BoxGeometry(1.4, 0.08, 0.12);
        const finMesh = new THREE.Mesh(finGeo, darkBevelMat);
        finMesh.position.y = f * 0.3;
        finGroup.add(finMesh);
      }
      nodeGroup.add(finGroup);

      explodedParts.push({
        obj: finGroup,
        basePos: finGroup.position.clone(),
        explodeDir: new THREE.Vector3(0, 0, 1.2),
      });

      // Part 5: Optical status glass array
      const statusMat = isError
        ? glowErrorMat
        : isCore
        ? glowVioletMat
        : node.status === 'busy'
        ? glowBlueMat
        : glowEmeraldMat;

      const visorGeo = new THREE.BoxGeometry(1.2, 0.25, 0.05);
      const visorMesh = new THREE.Mesh(visorGeo, statusMat);
      visorMesh.position.set(0, 0.2 + bodyH * 0.75, 0.61);
      nodeGroup.add(visorMesh);

      // Part 6: Glowing Core or Antenna
      if (isCore) {
        const ringCoreGeo = new THREE.TorusGeometry(1.3, 0.06, 16, 48);
        const ringCore = new THREE.Mesh(ringCoreGeo, glowVioletMat);
        ringCore.rotation.x = Math.PI / 2;
        ringCore.position.y = 1.8;
        ringCore.name = 'rotatingRing';
        nodeGroup.add(ringCore);
      } else {
        const pylonGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12);
        const pylonMesh = new THREE.Mesh(pylonGeo, darkBevelMat);
        pylonMesh.position.set(0.6, 0.2 + bodyH + 0.4, 0);
        nodeGroup.add(pylonMesh);

        const beaconGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const beaconMesh = new THREE.Mesh(beaconGeo, statusMat);
        beaconMesh.position.set(0.6, 0.2 + bodyH + 0.8, 0);
        nodeGroup.add(beaconMesh);
      }

      // Invisible raycast target box for clean ergonomics
      const hitBoxGeo = new THREE.BoxGeometry(2.4, bodyH + 1.2, 2.0);
      const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.y = (bodyH + 1.2) / 2;
      hitBox.userData = { nodeData: node, parentGroup: nodeGroup };
      nodeGroup.add(hitBox);
      raycastTargets.push(hitBox);

      nodesGroup.add(nodeGroup);
      animStateRef.current.nodesMeshMap.set(node.id, nodeGroup);
    });

    animStateRef.current.explodedParts = explodedParts;

    // 8. Glowing Telemetry Splines (Cubic Bezier Curves connecting Nodes to Core)
    const curvePoints: THREE.Vector3[][] = [];
    const corePos = new THREE.Vector3(0, 1.8, 0);

    const telemetryPipes: THREE.Mesh[] = [];
    const packetPointsList: { curve: THREE.CatmullRomCurve3; progress: number; speed: number; mesh: THREE.Mesh }[] = [];

    NODES_DATA.slice(1).forEach((node, i) => {
      const nodePos = new THREE.Vector3(node.position[0], 1.5, node.position[2]);
      const midPos = new THREE.Vector3(
        (nodePos.x + corePos.x) / 2,
        2.8 + (i % 2) * 0.6,
        (nodePos.z + corePos.z) / 2
      );

      const curve = new THREE.CatmullRomCurve3([nodePos, midPos, corePos]);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
      const isError = node.status === 'critical';
      const pipeMat = new THREE.MeshBasicMaterial({
        color: isError ? 0xff6b6b : 0x3b82f6,
        transparent: true,
        opacity: 0.45,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, pipeMat);
      scene.add(tubeMesh);
      telemetryPipes.push(tubeMesh);

      // Packet pulse spheres traversing the pipeline
      for (let p = 0; p < 3; p++) {
        const packetGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const packetMat = new THREE.MeshBasicMaterial({
          color: isError ? 0xffb4ab : 0x60a5fa,
        });
        const packetMesh = new THREE.Mesh(packetGeo, packetMat);
        scene.add(packetMesh);

        packetPointsList.push({
          curve,
          progress: (p / 3) + Math.random() * 0.1,
          speed: 0.003 + (i % 2) * 0.001,
          mesh: packetMesh,
        });
      }
    });

    // 9. Interactive Raycasting & Pointer Controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets, false);

      if (intersects.length > 0) {
        const hitData = intersects[0].object.userData.nodeData as NodeData;
        setSelectedNode(hitData);

        // Smooth camera damp target to selected node
        const nPos = hitData.position;
        animStateRef.current.cameraTargetLookAt.set(nPos[0], 1.5, nPos[2]);
        animStateRef.current.cameraTargetPos.set(nPos[0] + 0.5, 4.5, nPos[2] + 7.5);
        onShowToast('Node Selected in 3D', `${hitData.name} (${hitData.role})`, 'info');
      }
    };

    // Manual Orbit Orbit-like drag with right-click or drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0;
    let sphericalPhi = Math.PI / 4;
    let sphericalRadius = 16;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        sphericalTheta -= deltaX * 0.006;
        sphericalPhi = Math.max(0.15, Math.min(Math.PI / 2.1, sphericalPhi - deltaY * 0.006));

        const lookAt = animStateRef.current.cameraTargetLookAt;
        animStateRef.current.cameraTargetPos.set(
          lookAt.x + sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta),
          lookAt.y + sphericalRadius * Math.cos(sphericalPhi),
          lookAt.z + sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta)
        );
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRadius = Math.max(6, Math.min(28, sphericalRadius + e.deltaY * 0.015));
      const lookAt = animStateRef.current.cameraTargetLookAt;
      animStateRef.current.cameraTargetPos.set(
        lookAt.x + sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta),
        lookAt.y + sphericalRadius * Math.cos(sphericalPhi),
        lookAt.z + sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta)
      );
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('click', handlePointerDown);
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // 10. Frame-rate Independent Damped Animation Loop (Lossless 60fps)
    let animationFrameId = 0;
    let lastTime = performance.now();

    const _scratchPos = new THREE.Vector3();

    function renderLoop(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const state = animStateRef.current;

      // Exponential damping on exploded view
      state.explodedCurrent = THREE.MathUtils.damp(
        state.explodedCurrent,
        state.explodedTarget,
        4.0,
        dt
      );

      // Apply exploded offsets to server parts
      for (let i = 0; i < state.explodedParts.length; i++) {
        const item = state.explodedParts[i];
        item.obj.position.copy(item.basePos).addScaledVector(item.explodeDir, state.explodedCurrent);
      }

      // Rotate central ML core torus
      const coreGroup = state.nodesMeshMap.get('core-gateway');
      if (coreGroup) {
        const ring = coreGroup.getObjectByName('rotatingRing');
        if (ring) {
          ring.rotation.z += 0.8 * dt;
        }
      }

      // Animate packet pulses along spline curves
      const speedMult = state.speedMultiplier;
      for (let j = 0; j < packetPointsList.length; j++) {
        const p = packetPointsList[j];
        p.progress = (p.progress + p.speed * speedMult) % 1.0;
        p.curve.getPointAt(p.progress, _scratchPos);
        p.mesh.position.copy(_scratchPos);
      }

      // Exponential damping for smooth camera glide
      camera.position.lerp(state.cameraTargetPos, 1 - Math.exp(-3.5 * dt));
      state.cameraCurrentLookAt.lerp(state.cameraTargetLookAt, 1 - Math.exp(-4.5 * dt));
      camera.lookAt(state.cameraCurrentLookAt);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    animationFrameId = requestAnimationFrame(renderLoop);

    // 11. Handle Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('click', handlePointerDown);
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('wheel', handleWheel);

      renderer.dispose();
      serverTex.dispose();
      shadowTex.dispose();
      chassisMat.dispose();
      darkBevelMat.dispose();
      glowBlueMat.dispose();
      glowVioletMat.dispose();
      glowErrorMat.dispose();
      glowEmeraldMat.dispose();

      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [currentTheme]);

  // Preset camera transitions
  const applyPreset = (preset: 'overview' | 'gateway' | 'spark' | 'top') => {
    setActivePreset(preset);
    const state = animStateRef.current;

    if (preset === 'overview') {
      state.cameraTargetLookAt.set(0, 1, 0);
      state.cameraTargetPos.set(0, 9, 15);
      setSelectedNode(NODES_DATA[0]);
    } else if (preset === 'gateway') {
      const n = NODES_DATA[1];
      state.cameraTargetLookAt.set(n.position[0], 1.5, n.position[2]);
      state.cameraTargetPos.set(n.position[0] - 2, 4.5, n.position[2] + 6);
      setSelectedNode(n);
    } else if (preset === 'spark') {
      const n = NODES_DATA[2];
      state.cameraTargetLookAt.set(n.position[0], 1.5, n.position[2]);
      state.cameraTargetPos.set(n.position[0] + 2, 4.5, n.position[2] + 6);
      setSelectedNode(n);
    } else if (preset === 'top') {
      state.cameraTargetLookAt.set(0, 0, 0);
      state.cameraTargetPos.set(0, 18, 0.1);
    }
    onShowToast('3D Camera Presets', `Switched viewpoint to ${preset.toUpperCase()}.`, 'info');
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden select-none bg-background">
      {/* Three.js WebGL Mount Ref Container (isolated from HUD re-renders) */}
      <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Scene HUD Card */}
      <div className="absolute top-4 left-6 z-20 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
            Interactive 3D Cluster Topology
          </span>
          <span className="font-label-sm text-label-sm bg-surface-container-high px-2 py-0.5 rounded text-secondary border border-secondary/30">
            WebGL 60FPS
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight drop-shadow-md">
          CI/CD Runner Fleet &amp; Telemetry Mesh
        </h1>
        <p className="font-body-sm text-body-sm text-outline max-w-md">
          Procedural spatial digital twin representing active worker pods, AST dependency vectors, and ML failure intercept gates. Click nodes or drag to orbit.
        </p>
      </div>

      {/* Selected Node Telemetry Floating Inspection Card (Top Right) */}
      {selectedNode && (
        <div className="absolute top-4 right-6 z-20 w-80 bg-surface-container/95 border border-outline-variant/60 rounded-xl p-4 shadow-2xl flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
                Inspected Node
              </span>
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                {selectedNode.name}
              </h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold uppercase ${
                selectedNode.status === 'critical'
                  ? 'bg-error-container text-on-error-container animate-pulse'
                  : selectedNode.status === 'busy'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {selectedNode.status}
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {selectedNode.role}
          </p>

          <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/20 font-mono text-label-sm text-label-sm">
            <div>
              <span className="text-outline block text-[10px]">CPU Load</span>
              <span className="text-on-surface font-semibold">{selectedNode.cpu}</span>
            </div>
            <div>
              <span className="text-outline block text-[10px]">Memory Allocated</span>
              <span className="text-on-surface font-semibold">{selectedNode.ram}</span>
            </div>
            <div>
              <span className="text-outline block text-[10px]">Active State</span>
              <span className="text-secondary font-semibold">{selectedNode.queue}</span>
            </div>
            <div>
              <span className="text-outline block text-[10px]">Latency P95</span>
              <span className={selectedNode.status === 'critical' ? 'text-error font-semibold' : 'text-primary font-semibold'}>
                {selectedNode.p95}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onNavigate('pipeline-explorer')}
              className="flex-1 py-1.5 px-3 rounded bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">hub</span>
              <span>Inspect DAG Node</span>
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Unified Bottom Control Dock (Strictly following Three.js Skill Layout Directives) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 w-[92vw] max-w-4xl pointer-events-auto">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
          className="bg-surface-container-high hover:bg-surface-bright text-outline hover:text-on-surface px-3 py-1 rounded-t-lg font-label-sm text-label-sm transition-colors border-t border-x border-outline-variant/40 flex items-center gap-1 shadow-lg"
        >
          <span className="material-symbols-outlined text-[14px]">
            {isControlsCollapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          </span>
          <span>{isControlsCollapsed ? 'Show 3D Controls' : 'Hide 3D Controls (Cinema Mode)'}</span>
        </button>

        {/* Floating Dock Content */}
        {!isControlsCollapsed && (
          <div className="w-full bg-surface-container-high/95 border border-outline-variant/50 rounded-xl shadow-2xl p-3 flex flex-wrap items-center justify-between gap-4">
            {/* Viewport Presets */}
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-label-sm text-outline uppercase font-mono mr-1">
                View:
              </span>
              <button
                onClick={() => applyPreset('overview')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-medium transition-colors ${
                  activePreset === 'overview'
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => applyPreset('gateway')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-medium transition-colors ${
                  activePreset === 'gateway'
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Runner #4192
              </button>
              <button
                onClick={() => applyPreset('spark')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-medium transition-colors ${
                  activePreset === 'spark'
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Spark Cluster
              </button>
              <button
                onClick={() => applyPreset('top')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-medium transition-colors ${
                  activePreset === 'top'
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Ortho Plan
              </button>
            </div>

            {/* Exploded View Slider */}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[18px]">view_in_ar</span>
              <span className="font-label-sm text-label-sm text-outline uppercase font-mono">
                Chassis Explode:
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explodedFactor}
                onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
                className="w-28 accent-primary cursor-pointer h-1.5 bg-surface-container rounded-lg"
              />
              <span className="font-mono text-label-sm text-primary w-8 text-right">
                {Math.round(explodedFactor * 100)}%
              </span>
            </div>

            {/* Telemetry Stream Speed Slider */}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">speed</span>
              <span className="font-label-sm text-label-sm text-outline uppercase font-mono">
                Speed:
              </span>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.2"
                value={packetSpeed}
                onChange={(e) => setPacketSpeed(parseFloat(e.target.value))}
                className="w-24 accent-secondary cursor-pointer h-1.5 bg-surface-container rounded-lg"
              />
              <span className="font-mono text-label-sm text-secondary w-8 text-right">
                {packetSpeed.toFixed(1)}x
              </span>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => {
                applyPreset('overview');
                setExplodedFactor(0);
                setPacketSpeed(1);
                onShowToast('3D Scene Reset', 'Restored default camera and animation parameters.', 'info');
              }}
              className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-bright text-outline hover:text-on-surface font-label-sm text-label-sm transition-colors border border-outline-variant/30 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
