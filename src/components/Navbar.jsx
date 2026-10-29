import React from 'react';
import { 
  Crown, 
  RotateCcw, 
  RotateCw, 
  Maximize2, 
  Download, 
  Sparkles,
  Palette,
  CheckCircle2
} from 'lucide-react';
import { useDesign } from '../context/DesignContext';

export default function Navbar() {
  const {
    projectName,
    setProjectName,
    canvasSize,
    undo,
    redo,
    canUndo,
    canRedo,
    isPro,
    setShowProModal,
    setShowResizeModal,
    setShowExportModal,
  } = useDesign();

  return (
    <header className="h-14 bg-gradient-to-r from-[#00c4cc] via-[#7d2ae8] to-[#8c30f5] text-white flex items-center justify-between px-4 shadow-md select-none shrink-0 z-30">
      {/* Left: Brand & Magic Resize */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 font-black tracking-tight text-xl cursor-pointer">
          <Palette className="w-6 h-6 text-yellow-300" />
          <span className="bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            CanvaPro
          </span>
          <span className="text-[10px] bg-yellow-400 text-purple-950 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
            Studio
          </span>
        </div>

        <div className="h-5 w-px bg-white/20 mx-1" />

        {/* Magic Resize Button (Pro Feature) */}
        <button
          onClick={() => setShowResizeModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-sm transition-all duration-200 border border-white/10"
        >
          <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          <span>Magic Switch</span>
          <span className="text-[10px] text-white/70 font-normal">({canvasSize.width}x{canvasSize.height})</span>
        </button>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-1 pl-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded-lg hover:bg-white/15 transition ${!canUndo ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded-lg hover:bg-white/15 transition ${!canRedo ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Editable Project Name */}
      <div className="flex items-center justify-center max-w-sm">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent hover:bg-white/10 focus:bg-white/20 text-center font-medium text-sm text-white px-3 py-1 rounded-md outline-none border border-transparent focus:border-white/30 transition truncate"
          title="Click to rename design"
        />
      </div>

      {/* Right: Pro Badge & Export Button */}
      <div className="flex items-center space-x-3">
        {/* Pro Status */}
        {isPro ? (
          <button
            onClick={() => setShowProModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-yellow-400 text-purple-950 text-xs font-bold shadow-sm hover:brightness-105 transition"
          >
            <Crown className="w-3.5 h-3.5 fill-purple-950" />
            <span>PRO ACTIVE</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
          </button>
        ) : (
          <button
            onClick={() => setShowProModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-950 text-xs font-bold shadow-md hover:scale-105 transition"
          >
            <Crown className="w-3.5 h-3.5 fill-purple-950" />
            <span>Upgrade to Pro</span>
          </button>
        )}

        {/* Download / Export Button */}
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-white text-purple-900 font-bold text-xs hover:bg-white/95 shadow-lg hover:shadow-xl transition transform active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Export Design</span>
        </button>
      </div>
    </header>
  );
}
