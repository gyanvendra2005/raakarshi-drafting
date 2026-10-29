import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Box, 
  Circle, 
  Layers, 
  Sun, 
  Maximize2, 
  Eye, 
  RotateCw, 
  Compass, 
  Camera, 
  Sliders 
} from 'lucide-react';
import { useCad } from '../context/CadContext';

export default function CadViewport3D() {
  const mountRef = useRef(null);
  const {
    entities,
    visualStyle,
    setVisualStyle,
    cameraPreset,
    setCameraPreset,
    wallHeight3D,
    setWallHeight3D,
    threeDPrimitives,
    showRoof3D,
    setShowRoof3D,
    logCommand,
  } = useCad();

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const reqIdRef = useRef(null);

  // Orbit rotation angles
  const orbitState = useRef({
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
    theta: Math.PI / 4, // 45 deg azimuth
    phi: Math.PI / 3,   // 60 deg elevation
    radius: 1200,
    target: new THREE.Vector3(500, 100, 400),
  });

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(visualStyle === 'wireframe' ? 0x111111 : 0x1e1e1e);
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, visualStyle === 'realistic' ? 0.7 : 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, visualStyle === 'realistic' ? 1.4 : 1.0);
    sunLight.position.set(800, 1400, 600);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 100;
    sunLight.shadow.camera.far = 4000;
    const d = 1000;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // 5. 3D CAD GROUND GRID
    const gridHelper = new THREE.GridHelper(2400, 48, 0x00ffff, 0x444444);
    gridHelper.position.set(500, -2, 400);
    scene.add(gridHelper);

    // 6. BUILD 3D ARCHITECTURAL MODEL FROM 2D PLAN
    reconstruct3DScene(scene);

    // 7. ANIMATION LOOP
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 8. RESIZE LISTENER
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      renderer.dispose();
    };
  }, [visualStyle, entities, threeDPrimitives, showRoof3D, wallHeight3D]);

  // Update camera position from spherical angles (orbit)
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius, target } = orbitState.current;
    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(target);
  };

  // Reconstruct Full 3D Model from 2D Floor Plan
  const reconstruct3DScene = (scene) => {
    // Floor Slab
    const floorGeo = new THREE.BoxGeometry(840, 10, 640);
    const floorMat = visualStyle === 'wireframe'
      ? new THREE.MeshBasicMaterial({ wireframe: true, color: 0x555555 })
      : visualStyle === 'realistic'
      ? new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.35, metalness: 0.05 }) // Hardwood parquet floor
      : new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(500, -5, 400);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Material for Walls based on Visual Style
    const wallMat = visualStyle === 'wireframe'
      ? new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ffff })
      : visualStyle === 'xray'
      ? new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.35, roughness: 0.2 })
      : visualStyle === 'realistic'
      ? new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7, metalness: 0.1 }) // Plastered concrete wall
      : new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4 }); // Shaded

    // Wall Wireframe edge material
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1.5 });

    // Extrude 2D Wall Lines into 3D Wall Solids
    entities.filter(e => e.layer === 'walls' && e.type === 'line').forEach(wall => {
      const dx = wall.x2 - wall.x1;
      const dy = wall.y2 - wall.y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Create 3D wall box: length x wallHeight3D x 16 thickness
      const wallGeo = new THREE.BoxGeometry(length, wallHeight3D, 18);
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      
      const midX = (wall.x1 + wall.x2) / 2;
      const midZ = (wall.y1 + wall.y2) / 2;
      wallMesh.position.set(midX, wallHeight3D / 2, midZ);
      wallMesh.rotation.y = -angle;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      scene.add(wallMesh);

      // Add black edges if shaded with edges
      if (visualStyle === 'shaded') {
        const edges = new THREE.EdgesGeometry(wallGeo);
        const line = new THREE.LineSegments(edges, edgeMat);
        wallMesh.add(line);
      }
    });

    // 3D Glass Windows
    entities.filter(e => e.type === 'window').forEach(win => {
      const winGeo = new THREE.BoxGeometry(win.width, 120, 10);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 5,
      });
      const winMesh = new THREE.Mesh(winGeo, glassMat);
      winMesh.position.set(win.x + win.width / 2, 130, win.y);
      winMesh.castShadow = true;
      scene.add(winMesh);
    });

    // 3D Wooden Doors
    entities.filter(e => e.type === 'door').forEach(door => {
      const doorGeo = new THREE.BoxGeometry(door.width, 210, 8);
      const doorMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.4 });
      const doorMesh = new THREE.Mesh(doorGeo, doorMat);
      doorMesh.position.set(door.x + door.width / 2, 105, door.y);
      doorMesh.castShadow = true;
      scene.add(doorMesh);
    });

    // 3D Furniture Objects
    entities.filter(e => e.layer === 'furniture').forEach(f => {
      if (f.type === 'rect') {
        // Beds / Sofas
        const fGeo = new THREE.BoxGeometry(f.width, 45, f.height);
        const fMat = new THREE.MeshStandardMaterial({
          color: f.id.includes('f3') || f.id.includes('f4') ? 0x6366f1 : 0xec4899,
          roughness: 0.5,
        });
        const fMesh = new THREE.Mesh(fGeo, fMat);
        fMesh.position.set(f.x + f.width / 2, 22.5, f.y + f.height / 2);
        fMesh.castShadow = true;
        fMesh.receiveShadow = true;
        scene.add(fMesh);
      } else if (f.type === 'circle') {
        // Round Dining Table
        const cylGeo = new THREE.CylinderGeometry(f.r, f.r, 40, 24);
        const fMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
        const fMesh = new THREE.Mesh(cylGeo, fMat);
        fMesh.position.set(f.cx, 20, f.cy);
        fMesh.castShadow = true;
        scene.add(fMesh);
      }
    });

    // User Placed 3D Solids (Primitives: BOX, CYLINDER, SPHERE)
    threeDPrimitives.forEach(prim => {
      let geo;
      if (prim.type === 'box') geo = new THREE.BoxGeometry(100, 100, 100);
      else if (prim.type === 'cylinder') geo = new THREE.CylinderGeometry(50, 50, 120, 32);
      else if (prim.type === 'sphere') geo = new THREE.SphereGeometry(60, 32, 32);

      if (geo) {
        const mat = new THREE.MeshStandardMaterial({ color: prim.color || 0x00ffff, roughness: 0.3, metalness: 0.2 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(prim.x, prim.y + 60, prim.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      }
    });

    // Optional 3D Roof Slab
    if (showRoof3D) {
      const roofGeo = new THREE.BoxGeometry(860, 15, 660);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
      const roofMesh = new THREE.Mesh(roofGeo, roofMat);
      roofMesh.position.set(500, wallHeight3D + 7, 400);
      roofMesh.castShadow = true;
      scene.add(roofMesh);
    }
  };

  // Mouse Orbit Drag Listeners
  const handleMouseDown = (e) => {
    orbitState.current.isDragging = true;
    orbitState.current.prevMouse = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!orbitState.current.isDragging) return;
    const dx = e.clientX - orbitState.current.prevMouse.x;
    const dy = e.clientY - orbitState.current.prevMouse.y;

    if (e.buttons === 1) {
      // Rotate Orbit
      orbitState.current.theta -= dx * 0.008;
      orbitState.current.phi = Math.max(0.1, Math.min(Math.PI / 2.05, orbitState.current.phi - dy * 0.008));
    } else if (e.buttons === 2 || e.shiftKey) {
      // Pan
      orbitState.current.target.x -= dx * 0.8;
      orbitState.current.target.z -= dy * 0.8;
    }

    orbitState.current.prevMouse = { x: e.clientX, y: e.clientY };
    updateCameraPosition();
  };

  const handleMouseUp = () => {
    orbitState.current.isDragging = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    orbitState.current.radius = Math.max(200, Math.min(4000, orbitState.current.radius + e.deltaY * 0.8));
    updateCameraPosition();
  };

  // Set Camera Preset (Isometric & Orthogonal views)
  const applyCameraPreset = (preset) => {
    setCameraPreset(preset);
    if (preset === 'SW') {
      orbitState.current.theta = Math.PI / 4;
      orbitState.current.phi = Math.PI / 3;
    } else if (preset === 'SE') {
      orbitState.current.theta = (3 * Math.PI) / 4;
      orbitState.current.phi = Math.PI / 3;
    } else if (preset === 'NE') {
      orbitState.current.theta = (5 * Math.PI) / 4;
      orbitState.current.phi = Math.PI / 3;
    } else if (preset === 'NW') {
      orbitState.current.theta = (7 * Math.PI) / 4;
      orbitState.current.phi = Math.PI / 3;
    } else if (preset === 'TOP') {
      orbitState.current.theta = 0;
      orbitState.current.phi = 0.01;
    } else if (preset === 'FRONT') {
      orbitState.current.theta = 0;
      orbitState.current.phi = Math.PI / 2;
    }
    updateCameraPosition();
    logCommand(`_VIEW Set to ${preset} Isometric.`);
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="flex-1 bg-[#1e1e1e] relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* 3D Viewport Controls (Top Left) */}
      <div className="absolute top-3 left-3 bg-[#111111]/90 border border-[#383838] rounded-xl p-2.5 flex items-center space-x-3 text-xs text-white z-20 shadow-2xl backdrop-blur-sm">
        {/* Visual Style Selector */}
        <div className="flex items-center space-x-1.5">
          <span className="text-gray-400 font-bold text-[10px] uppercase">Style:</span>
          <select
            value={visualStyle}
            onChange={(e) => setVisualStyle(e.target.value)}
            className="bg-[#222] border border-[#444] rounded px-2 py-1 text-cyan-400 font-bold outline-none text-xs"
          >
            <option value="shaded">Shaded with Edges</option>
            <option value="realistic">Realistic PBR</option>
            <option value="wireframe">3D Wireframe</option>
            <option value="xray">X-Ray (Transparent)</option>
          </select>
        </div>

        <div className="h-4 w-px bg-[#444]" />

        {/* Isometric Camera Presets */}
        <div className="flex items-center space-x-1">
          {['SW', 'SE', 'NE', 'NW', 'TOP', 'FRONT'].map((p) => (
            <button
              key={p}
              onClick={() => applyCameraPreset(p)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                cameraPreset === p ? 'bg-cyan-500 text-black' : 'bg-[#252525] hover:bg-[#333] text-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[#444]" />

        {/* Roof Toggle */}
        <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-gray-300">
          <input
            type="checkbox"
            checked={showRoof3D}
            onChange={(e) => setShowRoof3D(e.target.checked)}
            className="rounded accent-cyan-400"
          />
          <span>Roof Slab</span>
        </label>
      </div>

      {/* 3D Orbit Instructions Pill (Bottom Left) */}
      <div className="absolute bottom-4 left-4 bg-black/80 border border-[#333] px-3 py-1.5 rounded-lg text-[11px] text-gray-300 font-mono pointer-events-none flex items-center space-x-3 z-10">
        <span>🖱️ <b>Left Click Drag:</b> 3D Orbit (Rotate)</span>
        <span>•</span>
        <span>🖱️ <b>Right Click Drag:</b> Pan</span>
        <span>•</span>
        <span>📜 <b>Scroll Wheel:</b> Zoom In/Out</span>
      </div>

      {/* Wall Height Slider (Bottom Right) */}
      <div className="absolute bottom-4 right-4 bg-[#111]/90 border border-[#333] px-3 py-2 rounded-xl text-xs text-white z-20 flex items-center space-x-3 shadow-xl">
        <span className="text-gray-400 font-mono text-[11px]">Wall Height:</span>
        <input
          type="range"
          min="100"
          max="500"
          step="10"
          value={wallHeight3D}
          onChange={(e) => setWallHeight3D(parseInt(e.target.value))}
          className="w-24 accent-cyan-400 cursor-pointer"
        />
        <span className="font-mono text-cyan-400 font-bold">{wallHeight3D * 10} mm</span>
      </div>
    </div>
  );
}
