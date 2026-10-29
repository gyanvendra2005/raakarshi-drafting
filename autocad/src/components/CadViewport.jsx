import React, { useRef, useState, useEffect } from 'react';
import { useCad } from '../context/CadContext';

export default function CadViewport() {
  const {
    entities,
    layers,
    activeTool,
    setActiveTool,
    selectedEntityId,
    setSelectedEntityId,
    gridOn,
    orthoOn,
    osnapOn,
    dynOn,
    zoom,
    setZoom,
    pan,
    setPan,
    cursorPos,
    setCursorPos,
    tempPoint,
    setTempPoint,
    addEntity,
    logCommand,
    currentLayerId,
  } = useCad();

  const containerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Screen coords

  // Convert screen coordinates to CAD world coordinates
  const screenToWorld = (screenX, screenY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    let wx = (screenX - rect.left - pan.x) / zoom;
    let wy = (screenY - rect.top - pan.y) / zoom;

    // If Ortho Mode (F8) is active and we have a start point
    if (orthoOn && tempPoint) {
      const dx = Math.abs(wx - tempPoint.x);
      const dy = Math.abs(wy - tempPoint.y);
      if (dx > dy) {
        wy = tempPoint.y; // Lock horizontal
      } else {
        wx = tempPoint.x; // Lock vertical
      }
    }

    return { x: Math.round(wx), y: Math.round(wy) };
  };

  const handleMouseMove = (e) => {
    const world = screenToWorld(e.clientX, e.clientY);
    setCursorPos(world);
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseDown = (e) => {
    // Middle mouse button or Pan tool
    if (e.button === 1 || activeTool === 'PAN') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (e.button !== 0) return; // Only left click

    const world = screenToWorld(e.clientX, e.clientY);

    // DRAWING LOGIC
    if (activeTool === 'LINE') {
      if (!tempPoint) {
        setTempPoint(world);
        logCommand(`_LINE From point: ${world.x}, ${world.y}`);
      } else {
        addEntity({
          type: 'line',
          x1: tempPoint.x,
          y1: tempPoint.y,
          x2: world.x,
          y2: world.y,
        });
        logCommand(`_LINE To point: ${world.x}, ${world.y}`);
        setTempPoint(world); // Continue polyline
      }
    } else if (activeTool === 'RECT') {
      if (!tempPoint) {
        setTempPoint(world);
        logCommand(`_RECTANG First corner: ${world.x}, ${world.y}`);
      } else {
        const x = Math.min(tempPoint.x, world.x);
        const y = Math.min(tempPoint.y, world.y);
        const width = Math.abs(world.x - tempPoint.x);
        const height = Math.abs(world.y - tempPoint.y);
        addEntity({
          type: 'rect',
          x,
          y,
          width,
          height,
        });
        logCommand(`_RECTANG Second corner: ${world.x}, ${world.y}`);
        setTempPoint(null);
        setActiveTool('SELECT');
      }
    } else if (activeTool === 'CIRCLE') {
      if (!tempPoint) {
        setTempPoint(world);
        logCommand(`_CIRCLE Center point: ${world.x}, ${world.y}`);
      } else {
        const radius = Math.round(
          Math.sqrt((world.x - tempPoint.x) ** 2 + (world.y - tempPoint.y) ** 2)
        );
        addEntity({
          type: 'circle',
          cx: tempPoint.x,
          cy: tempPoint.y,
          r: radius,
        });
        logCommand(`_CIRCLE Radius: ${radius}`);
        setTempPoint(null);
        setActiveTool('SELECT');
      }
    } else if (activeTool === 'DIM') {
      if (!tempPoint) {
        setTempPoint(world);
        logCommand(`_DIMLINEAR First point: ${world.x}, ${world.y}`);
      } else {
        const dist = Math.round(
          Math.sqrt((world.x - tempPoint.x) ** 2 + (world.y - tempPoint.y) ** 2)
        );
        addEntity({
          type: 'dim',
          x1: tempPoint.x,
          y1: tempPoint.y,
          x2: world.x,
          y2: world.y,
          text: `${dist * 10} mm`,
        });
        logCommand(`_DIMLINEAR Dimension created: ${dist * 10} mm`);
        setTempPoint(null);
        setActiveTool('SELECT');
      }
    } else if (activeTool === 'TEXT') {
      const textVal = prompt('Enter text for CAD annotation:', 'ROOM NAME');
      if (textVal) {
        addEntity({
          type: 'text',
          x: world.x,
          y: world.y,
          text: textVal,
          size: 15,
        });
        logCommand(`_TEXT Added "${textVal}" at ${world.x}, ${world.y}`);
      }
      setActiveTool('SELECT');
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom on wheel
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(5.0, Math.max(0.1, prev * zoomFactor)));
  };

  // Helper to get color of layer
  const getEntityColor = (layerId) => {
    const l = layers.find((lay) => lay.id === layerId);
    return l ? l.color : '#ffffff';
  };

  // Distance / Angle for Dynamic Input HUD
  let hudDist = 0;
  let hudAngle = 0;
  if (tempPoint) {
    const dx = cursorPos.x - tempPoint.x;
    const dy = cursorPos.y - tempPoint.y;
    hudDist = Math.round(Math.sqrt(dx * dx + dy * dy) * 10);
    hudAngle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
    if (hudAngle < 0) hudAngle += 360;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="flex-1 bg-[#212121] relative overflow-hidden select-none cad-canvas"
    >
      {/* 1. UCS ICON (User Coordinate System: X=Red, Y=Green) */}
      <div
        className="absolute pointer-events-none z-10"
        style={{
          left: `${pan.x + 40}px`,
          top: `${pan.y + 40}px`,
        }}
      >
        <svg width="60" height="60" className="overflow-visible">
          <line x1="0" y1="0" x2="35" y2="0" stroke="#ef4444" strokeWidth="2" />
          <polygon points="35,-4 43,0 35,4" fill="#ef4444" />
          <text x="46" y="4" fill="#ef4444" fontSize="11" fontWeight="bold">X</text>

          <line x1="0" y1="0" x2="0" y2="-35" stroke="#22c55e" strokeWidth="2" />
          <polygon points="-4,-35 0,-43 4,-35" fill="#22c55e" />
          <text x="-4" y="-46" fill="#22c55e" fontSize="11" fontWeight="bold">Y</text>

          <circle cx="0" cy="0" r="3" fill="#ffffff" />
        </svg>
      </div>

      {/* 2. VIEWCUBE (Top-Right Navigation Cube) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none flex flex-col items-center">
        <div className="w-16 h-16 bg-[#2c2c2c]/90 border border-[#444] rounded shadow-lg flex flex-col items-center justify-between p-1 text-[9px] font-bold text-gray-400">
          <span>N</span>
          <div className="flex items-center justify-between w-full px-1">
            <span>W</span>
            <span className="text-cyan-400 font-extrabold text-[10px]">TOP</span>
            <span>E</span>
          </div>
          <span>S</span>
        </div>
        <span className="text-[9px] text-gray-400 font-mono mt-1">[2D Wireframe]</span>
      </div>

      {/* 3. MAIN CAD SVG CANVAS (Infinite Pan & Zoom) */}
      <svg
        className="w-full h-full absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          {/* Drafting Grid Pattern */}
          {gridOn && (
            <pattern id="cad-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" />
              <path d="M 50 0 L 50 100 M 0 50 L 100 50" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
            </pattern>
          )}
          {/* Wall Hatch Pattern ANSI31 */}
          <pattern id="ansi31" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#ff9900" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Grid Background */}
        {gridOn && (
          <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#cad-grid)" />
        )}

        {/* RENDER CAD ENTITIES */}
        {entities.map((el) => {
          const isSelected = selectedEntityId === el.id;
          const strokeColor = isSelected ? '#00ffff' : getEntityColor(el.layer);
          const strokeWidth = isSelected ? 3 : 1.5;

          if (el.type === 'line') {
            return (
              <line
                key={el.id}
                x1={el.x1}
                y1={el.y1}
                x2={el.x2}
                y2={el.y2}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={isSelected ? '4 2' : undefined}
                onClick={(e) => { e.stopPropagation(); setSelectedEntityId(el.id); }}
              />
            );
          } else if (el.type === 'rect') {
            return (
              <rect
                key={el.id}
                x={el.x}
                y={el.y}
                width={el.width}
                height={el.height}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={isSelected ? '4 2' : undefined}
                onClick={(e) => { e.stopPropagation(); setSelectedEntityId(el.id); }}
              />
            );
          } else if (el.type === 'circle') {
            return (
              <circle
                key={el.id}
                cx={el.cx}
                cy={el.cy}
                r={el.r}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={isSelected ? '4 2' : undefined}
                onClick={(e) => { e.stopPropagation(); setSelectedEntityId(el.id); }}
              />
            );
          } else if (el.type === 'door') {
            // Door leaf + 90-degree swing arc
            return (
              <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedEntityId(el.id); }}>
                {/* Door Leaf */}
                <line x1={el.x} y1={el.y} x2={el.x} y2={el.y + el.width} stroke={strokeColor} strokeWidth={2} />
                {/* Swing Arc */}
                <path
                  d={`M ${el.x + el.width} ${el.y} A ${el.width} ${el.width} 0 0 1 ${el.x} ${el.y + el.width}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              </g>
            );
          } else if (el.type === 'window') {
            return (
              <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedEntityId(el.id); }}>
                <rect x={el.x} y={el.y} width={el.width} height={el.height} fill="#0f2942" stroke={strokeColor} strokeWidth={1.5} />
                <line x1={el.x} y1={el.y + el.height / 2} x2={el.x + el.width} y2={el.y + el.height / 2} stroke="#ffffff" strokeWidth={1} />
              </g>
            );
          } else if (el.type === 'dim') {
            // Dimension Line with architectural tick marks & measurement text
            const mx = (el.x1 + el.x2) / 2;
            const my = (el.y1 + el.y2) / 2;
            return (
              <g key={el.id} onClick={(e) => { e.stopPropagation(); setSelectedEntityId(el.id); }}>
                <line x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke="#ffff00" strokeWidth={1} />
                {/* 45-degree architectural ticks */}
                <line x1={el.x1 - 4} y1={el.y1 - 4} x2={el.x1 + 4} y2={el.y1 + 4} stroke="#ffff00" strokeWidth={1.5} />
                <line x1={el.x2 - 4} y1={el.y2 - 4} x2={el.x2 + 4} y2={el.y2 + 4} stroke="#ffff00" strokeWidth={1.5} />
                <rect x={mx - 34} y={my - 16} width="68" height="15" fill="#212121" />
                <text x={mx} y={my - 4} fill="#ffff00" fontSize="11" fontFamily="Consolas, monospace" fontWeight="bold" textAnchor="middle">
                  {el.text}
                </text>
              </g>
            );
          } else if (el.type === 'text') {
            return (
              <text
                key={el.id}
                x={el.x}
                y={el.y}
                fill={strokeColor}
                fontSize={el.size || 14}
                fontFamily="Segoe UI, sans-serif"
                fontWeight="bold"
                onClick={(e) => { e.stopPropagation(); setSelectedEntityId(el.id); }}
              >
                {el.text.split('\n').map((line, idx) => (
                  <tspan key={idx} x={el.x} dy={idx === 0 ? 0 : 18}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          }
          return null;
        })}

        {/* LIVE RUBBERBAND PREVIEW WHILE DRAWING */}
        {tempPoint && activeTool === 'LINE' && (
          <line
            x1={tempPoint.x}
            y1={tempPoint.y}
            x2={cursorPos.x}
            y2={cursorPos.y}
            stroke="#00ffff"
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
        )}
        {tempPoint && activeTool === 'RECT' && (
          <rect
            x={Math.min(tempPoint.x, cursorPos.x)}
            y={Math.min(tempPoint.y, cursorPos.y)}
            width={Math.abs(cursorPos.x - tempPoint.x)}
            height={Math.abs(cursorPos.y - tempPoint.y)}
            fill="none"
            stroke="#00ffff"
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
        )}
        {tempPoint && activeTool === 'CIRCLE' && (
          <circle
            cx={tempPoint.x}
            cy={tempPoint.y}
            r={Math.sqrt((cursorPos.x - tempPoint.x) ** 2 + (cursorPos.y - tempPoint.y) ** 2)}
            fill="none"
            stroke="#00ffff"
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
        )}
        {tempPoint && activeTool === 'DIM' && (
          <line
            x1={tempPoint.x}
            y1={tempPoint.y}
            x2={cursorPos.x}
            y2={cursorPos.y}
            stroke="#ffff00"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}
      </svg>

      {/* 4. DYNAMIC INPUT HUD (DYN - F12) */}
      {dynOn && tempPoint && (
        <div
          className="absolute pointer-events-none z-30 flex items-center space-x-2 text-[11px] font-mono text-white"
          style={{
            left: `${mousePos.x + 20}px`,
            top: `${mousePos.y + 15}px`,
          }}
        >
          <div className="bg-[#111111]/90 border border-cyan-400 px-2 py-0.5 rounded shadow">
            Length: <span className="text-cyan-400 font-bold">{hudDist} mm</span>
          </div>
          <div className="bg-[#111111]/90 border border-yellow-400 px-2 py-0.5 rounded shadow">
            Angle: <span className="text-yellow-400 font-bold">{hudAngle}°</span>
          </div>
        </div>
      )}
    </div>
  );
}
