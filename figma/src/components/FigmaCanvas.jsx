import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, MousePointer, Hand } from 'lucide-react';
import { useFigma } from '../context/FigmaContext';

export default function FigmaCanvas() {
  const {
    currentPage,
    selectedId,
    setSelectedId,
    selectedElement,
    updateSelected,
    deleteSelected,
    duplicateSelected,
    zoom,
    setZoom,
    pan,
    setPan,
    activeTool,
    setActiveTool,
    activeTab,
  } = useFigma();

  const canvasRef = useRef(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Element Dragging
  const [draggingElementId, setDraggingElementId] = useState(null);
  const [elementDragStart, setElementDragStart] = useState({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });

  // Handle Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        duplicateSelected();
      } else if (e.key === 'v' || e.key === 'V') {
        setActiveTool('select');
      } else if (e.key === 'h' || e.key === 'H') {
        setActiveTool('hand');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelected, duplicateSelected, setActiveTool]);

  // Handle Canvas Pan Mouse Events
  const handleMouseDown = (e) => {
    if (activeTool === 'hand' || e.button === 1 || e.spaceKey) {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingCanvas) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (draggingElementId) {
      const dx = (e.clientX - elementDragStart.mouseX) / zoom;
      const dy = (e.clientY - elementDragStart.mouseY) / zoom;
      updateSelected('x', Math.round(elementDragStart.elemX + dx));
      updateSelected('y', Math.round(elementDragStart.elemY + dy));
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggingElementId(null);
  };

  // Zoom with Wheel
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
      setZoom((prev) => Math.min(2.5, Math.max(0.2, prev * zoomFactor)));
    } else {
      setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  // Render Element on Canvas
  const renderElement = (el, isRoot = true) => {
    const isSelected = selectedId === el.id;
    const isFrame = el.type === 'frame';

    const style = {
      position: isRoot ? 'absolute' : 'relative',
      left: isRoot ? `${el.x}px` : undefined,
      top: isRoot ? `${el.y}px` : undefined,
      width: el.width ? `${el.width}px` : 'auto',
      height: el.height ? `${el.height}px` : 'auto',
      backgroundColor: el.fill || 'transparent',
      borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
      border: el.stroke ? `${el.strokeWidth || 1}px solid ${el.stroke}` : undefined,
      boxShadow: el.dropShadow ? `${el.dropShadow.x}px ${el.dropShadow.y}px ${el.dropShadow.blur}px ${el.dropShadow.color}` : undefined,
      display: el.autoLayout?.enabled ? 'flex' : 'block',
      flexDirection: el.autoLayout?.direction === 'row' ? 'row' : 'column',
      gap: el.autoLayout?.gap ? `${el.autoLayout.gap}px` : undefined,
      padding: el.autoLayout?.padding ? `${el.autoLayout.padding}px` : undefined,
      alignItems: el.autoLayout?.align || 'stretch',
      justifyContent: el.autoLayout?.justify || 'start',
      cursor: activeTool === 'hand' ? 'grab' : 'pointer',
    };

    return (
      <div
        key={el.id}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(el.id);
        }}
        onMouseDown={(e) => {
          if (activeTool !== 'hand' && isRoot) {
            e.stopPropagation();
            setSelectedId(el.id);
            setDraggingElementId(el.id);
            setElementDragStart({
              mouseX: e.clientX,
              mouseY: e.clientY,
              elemX: el.x || 0,
              elemY: el.y || 0,
            });
          }
        }}
        style={style}
        className={`group transition-shadow select-none relative ${
          isSelected ? 'ring-2 ring-[#0d99ff] ring-offset-2 ring-offset-[#1e1e1e]' : 'hover:ring-1 hover:ring-[#0d99ff]/50'
        }`}
      >
        {/* Frame Label (Figma Style) */}
        {isFrame && (
          <div className="absolute -top-6 left-0 text-[11px] font-semibold text-gray-400 group-hover:text-white transition flex items-center space-x-1">
            <span>{el.name}</span>
            {el.prototypeTarget && (
              <span className="text-[9px] bg-blue-600/30 text-blue-400 px-1 rounded">🔗 Flow</span>
            )}
          </div>
        )}

        {/* Text Content */}
        {el.type === 'text' && (
          <div
            style={{
              fontSize: `${el.fontSize || 16}px`,
              fontWeight: el.fontWeight || 'normal',
              color: el.fill || '#ffffff',
              textAlign: el.textAlign || 'left',
              lineHeight: el.lineHeight || 1.3,
              whiteSpace: 'pre-line',
            }}
          >
            {el.text}
          </div>
        )}

        {/* Master Component Label ❖ */}
        {el.type === 'component' && (
          <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs select-none">
            {el.text || el.name}
          </div>
        )}

        {/* Nested Children */}
        {el.children && el.children.map((child) => renderElement(child, false))}

        {/* Selection Handles (Figma Style Corner Dots) */}
        {isSelected && (
          <>
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#0d99ff] rounded-sm pointer-events-none" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#0d99ff] rounded-sm pointer-events-none" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#0d99ff] rounded-sm pointer-events-none" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#0d99ff] rounded-sm pointer-events-none" />
            {/* Dimensions tooltip */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0d99ff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none">
              {el.width || 0} × {el.height || 0}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={() => setSelectedId(null)}
      className="flex-1 h-full figma-canvas-grid relative overflow-hidden select-none cursor-default"
      style={{ cursor: activeTool === 'hand' ? (isDraggingCanvas ? 'grabbing' : 'grab') : 'default' }}
    >
      {/* Transformed Canvas Container */}
      <div
        className="w-full h-full absolute top-0 left-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Prototype Connection Noodles (SVG Lines connecting frames) */}
        <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none z-0">
          {activeTab === 'prototype' && (
            <path
              d="M 455 420 C 485 420, 490 420, 520 420"
              stroke="#0d99ff"
              strokeWidth="3"
              strokeDasharray="6 4"
              fill="none"
              markerEnd="url(#arrow)"
            />
          )}
        </svg>

        {/* Elements */}
        {currentPage.elements.map((el) => renderElement(el, true))}
      </div>

      {/* Floating Zoom & Pan Controls (Bottom Left) */}
      <div className="absolute bottom-4 left-4 bg-[#2c2c2c] border border-[#383838] rounded-lg px-2.5 py-1.5 shadow-xl flex items-center space-x-2 text-xs text-gray-300 z-20">
        <button
          onClick={() => setZoom((prev) => Math.max(0.2, prev - 0.1))}
          className="p-1 hover:bg-white/10 rounded text-gray-300"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="font-bold w-12 text-center text-white">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.1))}
          className="p-1 hover:bg-white/10 rounded text-gray-300"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { setZoom(0.85); setPan({ x: 40, y: 30 }); }}
          className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
          title="Reset to 100%"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
