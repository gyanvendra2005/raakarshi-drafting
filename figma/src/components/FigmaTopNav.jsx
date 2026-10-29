import React, { useState } from 'react';
import { 
  MousePointer, 
  Hand, 
  Frame, 
  Square, 
  Circle, 
  Type, 
  Component, 
  Code2, 
  Play, 
  Share2, 
  History, 
  Crown, 
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { useFigma } from '../context/FigmaContext';

export default function FigmaTopNav() {
  const {
    activeTool,
    setActiveTool,
    addFrame,
    addShape,
    addText,
    addComponent,
    isDevMode,
    setIsDevMode,
    startInteractivePrototype,
    setShowVersionHistory,
    setShowProModal,
    isPro,
    currentPage,
  } = useFigma();

  const [showFrameDropdown, setShowFrameDropdown] = useState(false);
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);

  return (
    <header className="h-12 bg-[#2c2c2c] border-b border-[#383838] px-3 flex items-center justify-between text-white text-xs select-none z-30 shrink-0">
      {/* Left: Main Figma Tools */}
      <div className="flex items-center space-x-1">
        {/* Figma Menu Icon */}
        <div className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center cursor-pointer font-black text-sm text-[#0d99ff] mr-1">
          <svg width="18" height="26" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
          </svg>
        </div>

        {/* Move Tool */}
        <button
          onClick={() => setActiveTool('select')}
          className={`p-2 rounded-md hover:bg-white/10 transition ${activeTool === 'select' ? 'bg-[#0d99ff] text-white' : 'text-gray-300'}`}
          title="Move (V)"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        {/* Hand Tool */}
        <button
          onClick={() => setActiveTool('hand')}
          className={`p-2 rounded-md hover:bg-white/10 transition ${activeTool === 'hand' ? 'bg-[#0d99ff] text-white' : 'text-gray-300'}`}
          title="Hand tool (H)"
        >
          <Hand className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-white/20 mx-1" />

        {/* Frame Tool with Presets */}
        <div className="relative">
          <button
            onClick={() => setShowFrameDropdown(!showFrameDropdown)}
            className={`flex items-center space-x-1 px-2 py-1.5 rounded-md hover:bg-white/10 transition ${activeTool === 'frame' ? 'bg-[#0d99ff] text-white' : 'text-gray-300'}`}
            title="Frame Tool (F)"
          >
            <Frame className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showFrameDropdown && (
            <div className="absolute top-10 left-0 bg-[#222222] border border-[#383838] shadow-2xl rounded-lg py-1.5 w-44 z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-500">Device Frames</div>
              <button
                onClick={() => { addFrame('iphone'); setShowFrameDropdown(false); }}
                className="w-full px-3 py-1.5 text-left hover:bg-[#0d99ff] flex items-center justify-between text-xs"
              >
                <span>iPhone 16 Pro</span>
                <span className="text-[10px] text-gray-400">375x680</span>
              </button>
              <button
                onClick={() => { addFrame('desktop'); setShowFrameDropdown(false); }}
                className="w-full px-3 py-1.5 text-left hover:bg-[#0d99ff] flex items-center justify-between text-xs"
              >
                <span>Desktop 1440</span>
                <span className="text-[10px] text-gray-400">900x600</span>
              </button>
              <button
                onClick={() => { addFrame('tablet'); setShowFrameDropdown(false); }}
                className="w-full px-3 py-1.5 text-left hover:bg-[#0d99ff] flex items-center justify-between text-xs"
              >
                <span>iPad Pro 11"</span>
                <span className="text-[10px] text-gray-400">680x500</span>
              </button>
              <button
                onClick={() => { addFrame('card'); setShowFrameDropdown(false); }}
                className="w-full px-3 py-1.5 text-left hover:bg-[#0d99ff] flex items-center justify-between text-xs"
              >
                <span>Auto Layout Card</span>
                <span className="text-[10px] text-gray-400">340x260</span>
              </button>
            </div>
          )}
        </div>

        {/* Shape Tool Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowShapeDropdown(!showShapeDropdown)}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-md hover:bg-white/10 text-gray-300 transition"
            title="Shapes (R)"
          >
            <Square className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showShapeDropdown && (
            <div className="absolute top-10 left-0 bg-[#222222] border border-[#383838] shadow-2xl rounded-lg py-1.5 w-36 z-50">
              <button
                onClick={() => { addShape('rect'); setShowShapeDropdown(false); }}
                className="w-full px-3 py-1.5 text-left hover:bg-[#0d99ff] flex items-center space-x-2 text-xs"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Rectangle</span>
              </button>
              <button
                onClick={() => { addShape('circle'); setShowShapeDropdown(false); }}
                className="w-full px-3 py-1.5 text-left hover:bg-[#0d99ff] flex items-center space-x-2 text-xs"
              >
                <Circle className="w-3.5 h-3.5" />
                <span>Ellipse</span>
              </button>
            </div>
          )}
        </div>

        {/* Text Tool */}
        <button
          onClick={() => addText()}
          className="p-2 rounded-md hover:bg-white/10 text-gray-300 transition"
          title="Text Tool (T)"
        >
          <Type className="w-4 h-4" />
        </button>

        {/* Component Tool (Figma Master Component ❖) */}
        <button
          onClick={() => addComponent()}
          className="p-2 rounded-md hover:bg-white/10 text-purple-400 transition"
          title="Create Master Component (❖)"
        >
          <Component className="w-4 h-4" />
        </button>
      </div>

      {/* Center: File Title & Version History */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-gray-200">Mobile Banking & Design System</span>
        <button
          onClick={() => setShowVersionHistory(true)}
          className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
          title="Version History (Figma Pro)"
        >
          <History className="w-3.5 h-3.5" />
          <span>v2.0 Pro</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Right: Dev Mode, Prototype Play & Pro Badge */}
      <div className="flex items-center space-x-2.5">
        {/* Figma Pro Dev Mode Switch (Signature Feature) */}
        <button
          onClick={() => setIsDevMode(!isDevMode)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition font-bold ${
            isDevMode 
              ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
              : 'border-[#444] hover:border-gray-500 text-gray-400 hover:text-gray-200'
          }`}
          title="Toggle Figma Dev Mode (Pro)"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Dev Mode</span>
          {isDevMode && <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />}
        </button>

        {/* Prototype Play / Simulator Button */}
        <button
          onClick={() => startInteractivePrototype()}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#0d99ff] hover:bg-[#008ae6] text-white font-bold shadow-md transition"
          title="Present Interactive Prototype"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Present</span>
        </button>

        {/* Figma Pro Crown */}
        <button
          onClick={() => setShowProModal(true)}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-bold hover:brightness-110 transition"
        >
          <Crown className="w-3.5 h-3.5 fill-amber-300" />
          <span className="text-[11px]">PRO</span>
        </button>
      </div>
    </header>
  );
}
