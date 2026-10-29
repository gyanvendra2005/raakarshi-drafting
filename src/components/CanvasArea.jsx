import React, { useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { useDesign } from '../context/DesignContext';

export default function CanvasArea() {
  const {
    canvasRef,
    canvasSize,
    zoom,
    setZoom,
    deleteActiveObject,
    duplicateActiveObject,
    undo,
    redo,
    activeObject,
  } = useDesign();

  // Keyboard shortcuts (Delete, Duplicate Ctrl+D, Undo Ctrl+Z, Redo Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is actively typing in a standard input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      // Check if fabric text is being actively edited
      if (activeObject && activeObject.isEditing) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteActiveObject();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        duplicateActiveObject();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeObject, deleteActiveObject, duplicateActiveObject, undo, redo]);

  return (
    <div className="flex-1 bg-[#f3f4f6] relative overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Scrollable / Scaled Canvas Container */}
      <div className="w-full h-full overflow-auto flex items-center justify-center p-12">
        <div
          className="shadow-2xl transition-transform duration-100 ease-out border border-gray-300 rounded-sm bg-white"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Floating Zoom & Canvas Size Indicator (Bottom Right) */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur border border-gray-200 rounded-xl px-3 py-1.5 shadow-lg flex items-center space-x-3 text-xs text-gray-700 z-20">
        <span className="font-semibold text-gray-500">
          {canvasSize.name} ({canvasSize.width} × {canvasSize.height})
        </span>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setZoom((prev) => Math.max(0.15, prev - 0.05))}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-bold w-12 text-center text-purple-700">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(2.0, prev + 0.05))}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(0.45)}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 ml-1"
            title="Fit to Screen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
