import React, { useState } from 'react';
import { 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Ruler, 
  Layers, 
  Download, 
  Printer, 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Grid, 
  Box, 
  FileText, 
  Compass, 
  Scissors, 
  Copy, 
  Trash2, 
  Move,
  FolderOpen,
  Save,
  Check
} from 'lucide-react';
import { useCad } from '../context/CadContext';

export default function CadRibbon() {
  const {
    activeTool,
    setActiveTool,
    layers,
    currentLayerId,
    setCurrentLayerId,
    setShowLayerModal,
    setShowBlockModal,
    exportDXF,
    exportPDF,
    zoomExtents,
    undo,
    logCommand,
    projectName,
    setProjectName,
    viewMode,
    setViewMode,
    add3DPrimitive,
  } = useCad();

  const [activeRibbonTab, setActiveRibbonTab] = useState('Home');

  const ribbonTabs = ['Home', 'Insert', 'Annotate', 'Parametric', 'View', 'Manage', 'Output'];

  const handleToolSelect = (toolName, prompt) => {
    setActiveTool(toolName);
    logCommand(`_${toolName} ${prompt}`);
  };

  return (
    <div className="bg-[#2c2c2c] border-b border-[#1c1c1c] text-gray-200 select-none text-xs shrink-0 z-30">
      {/* 1. TOP APPLICATION MENU BAR & QUICK ACCESS */}
      <div className="h-9 bg-[#1e1e1e] border-b border-[#333333] px-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* AutoCAD Big Red 'A' Logo */}
          <div className="w-6 h-6 rounded bg-[#e51c23] flex items-center justify-center font-black text-white text-sm shadow cursor-pointer">
            A
          </div>
          <span className="font-bold text-gray-100 tracking-tight text-xs flex items-center space-x-1.5">
            <span>AutoCAD Pro Enterprise</span>
            <span className="text-[10px] text-gray-400 font-normal">2026</span>
          </span>

          <div className="h-4 w-px bg-[#444] mx-1" />

          {/* Quick Access Toolbar */}
          <div className="flex items-center space-x-1 text-gray-400">
            <button
              onClick={undo}
              className="p-1 hover:bg-white/10 hover:text-white rounded transition"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={zoomExtents}
              className="p-1 hover:bg-white/10 hover:text-white rounded transition"
              title="Zoom Extents (ZE)"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={exportDXF}
              className="p-1 hover:bg-white/10 hover:text-white rounded transition flex items-center space-x-1 text-xs"
              title="Export DXF File"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
            </button>
            <button
              onClick={exportPDF}
              className="p-1 hover:bg-white/10 hover:text-white rounded transition flex items-center space-x-1 text-xs"
              title="Plot / Print PDF"
            >
              <Printer className="w-3.5 h-3.5 text-yellow-400" />
            </button>
          </div>
        </div>

        {/* Center: Drawing Title */}
        <div className="flex items-center">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent text-center font-mono text-gray-300 hover:bg-white/5 focus:bg-white/10 px-2 py-0.5 rounded outline-none text-xs border border-transparent focus:border-[#00ffff]/40"
            title="Drawing Name"
          />
          <span className="text-gray-500 font-mono text-[11px]">.dwg</span>
        </div>

        {/* Right: 2D vs 3D Modeling Switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const next = viewMode === '2D' ? '3D' : '2D';
              setViewMode(next);
              logCommand(`_WORKSPACE Switched to ${next === '3D' ? '3D Modeling' : '2D Drafting'}.`);
            }}
            className={`px-3 py-1 rounded font-bold text-[11px] flex items-center space-x-1.5 transition ${
              viewMode === '3D'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.5)] border border-purple-400'
                : 'bg-cyan-500/20 border border-cyan-500 text-cyan-300 hover:bg-cyan-500/30'
            }`}
          >
            <span>{viewMode === '3D' ? '🧊 3D MODELING ACTIVE' : '📐 2D DRAFTING'}</span>
            <span className="text-[9px] bg-black/40 px-1 py-0.2 rounded font-normal">SWITCH</span>
          </button>
        </div>
      </div>

      {/* 2. RIBBON TAB SELECTOR */}
      <div className="flex items-center px-2 bg-[#252525] border-b border-[#383838] space-x-1 text-[11px]">
        {ribbonTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveRibbonTab(tab)}
            className={`px-3 py-1 font-semibold transition ${
              activeRibbonTab === tab
                ? 'bg-[#333333] text-white border-t-2 border-[#00ffff]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. RIBBON COMMAND PANELS */}
      <div className="h-24 bg-[#2c2c2c] p-2 flex items-stretch space-x-3 overflow-x-auto">
        
        {/* PANEL 1: DRAW */}
        <div className="flex flex-col justify-between border-r border-[#3f3f3f] pr-3">
          <div className="flex items-center space-x-1.5">
            {/* Big Line Button */}
            <button
              onClick={() => handleToolSelect('LINE', 'Specify first point:')}
              className={`p-2 rounded flex flex-col items-center justify-center min-w-[50px] transition ${
                activeTool === 'LINE' ? 'bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]' : 'hover:bg-white/10 text-gray-200'
              }`}
              title="Line (L)"
            >
              <Minus className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Line</span>
            </button>

            {/* Polyline, Circle, Arc, Rectangle Grid */}
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleToolSelect('POLYLINE', 'Specify start point:')}
                className={`p-1 rounded flex items-center space-x-1 ${activeTool === 'POLYLINE' ? 'bg-[#00ffff]/20 text-[#00ffff]' : 'hover:bg-white/10'}`}
                title="Polyline (PL)"
              >
                <Minus className="w-3.5 h-3.5" />
                <span className="text-[10px]">Polyline</span>
              </button>
              <button
                onClick={() => handleToolSelect('CIRCLE', 'Specify center point:')}
                className={`p-1 rounded flex items-center space-x-1 ${activeTool === 'CIRCLE' ? 'bg-[#00ffff]/20 text-[#00ffff]' : 'hover:bg-white/10'}`}
                title="Circle (C)"
              >
                <Circle className="w-3.5 h-3.5" />
                <span className="text-[10px]">Circle</span>
              </button>
              <button
                onClick={() => handleToolSelect('RECT', 'Specify first corner point:')}
                className={`p-1 rounded flex items-center space-x-1 ${activeTool === 'RECT' ? 'bg-[#00ffff]/20 text-[#00ffff]' : 'hover:bg-white/10'}`}
                title="Rectangle (REC)"
              >
                <Square className="w-3.5 h-3.5" />
                <span className="text-[10px]">Rectangle</span>
              </button>
              <button
                onClick={() => handleToolSelect('HATCH', 'Pick internal point for hatch:')}
                className={`p-1 rounded flex items-center space-x-1 ${activeTool === 'HATCH' ? 'bg-[#00ffff]/20 text-[#00ffff]' : 'hover:bg-white/10'}`}
                title="Hatch (H)"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="text-[10px]">Hatch</span>
              </button>
            </div>
          </div>
          <span className="text-[9px] text-gray-500 font-bold uppercase text-center mt-1">Draw</span>
        </div>

        {/* PANEL 2: MODIFY */}
        <div className="flex flex-col justify-between border-r border-[#3f3f3f] pr-3">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => handleToolSelect('MOVE', 'Select objects to move:')}
              className="p-1 rounded hover:bg-white/10 flex items-center space-x-1 text-gray-300"
              title="Move (M)"
            >
              <Move className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px]">Move</span>
            </button>
            <button
              onClick={() => handleToolSelect('COPY', 'Select objects to copy:')}
              className="p-1 rounded hover:bg-white/10 flex items-center space-x-1 text-gray-300"
              title="Copy (CO)"
            >
              <Copy className="w-3.5 h-3.5 text-green-400" />
              <span className="text-[10px]">Copy</span>
            </button>
            <button
              onClick={() => handleToolSelect('TRIM', 'Select cutting edges:')}
              className="p-1 rounded hover:bg-white/10 flex items-center space-x-1 text-gray-300"
              title="Trim (TR)"
            >
              <Scissors className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-[10px]">Trim</span>
            </button>
            <button
              onClick={() => handleToolSelect('OFFSET', 'Specify offset distance:')}
              className="p-1 rounded hover:bg-white/10 flex items-center space-x-1 text-gray-300"
              title="Offset (O)"
            >
              <Box className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px]">Offset</span>
            </button>
            <button
              onClick={() => handleToolSelect('ERASE', 'Select objects to erase:')}
              className="p-1 rounded hover:bg-white/10 flex items-center space-x-1 text-gray-300"
              title="Erase (E)"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[10px]">Erase</span>
            </button>
          </div>
          <span className="text-[9px] text-gray-500 font-bold uppercase text-center mt-1">Modify</span>
        </div>

        {/* PANEL 3: ANNOTATION */}
        <div className="flex flex-col justify-between border-r border-[#3f3f3f] pr-3">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleToolSelect('DIM', 'Specify first extension line origin:')}
              className={`p-1.5 rounded flex items-center space-x-2 transition ${
                activeTool === 'DIM' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500' : 'hover:bg-white/10 text-gray-200'
              }`}
              title="Linear Dimension (DIM)"
            >
              <Ruler className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-semibold">Dimension</span>
            </button>
            <button
              onClick={() => handleToolSelect('TEXT', 'Specify start point of text:')}
              className={`p-1.5 rounded flex items-center space-x-2 transition ${
                activeTool === 'TEXT' ? 'bg-white/20 text-white border border-white' : 'hover:bg-white/10 text-gray-200'
              }`}
              title="Multiline Text (MTEXT)"
            >
              <Type className="w-4 h-4 text-white" />
              <span className="text-[10px] font-semibold">Text (MTEXT)</span>
            </button>
          </div>
          <span className="text-[9px] text-gray-500 font-bold uppercase text-center mt-1">Annotation</span>
        </div>

        {/* PANEL 4: LAYERS */}
        <div className="flex flex-col justify-between border-r border-[#3f3f3f] pr-3">
          <div className="flex items-center space-x-2">
            {/* Layer Properties Manager Button */}
            <button
              onClick={() => setShowLayerModal(true)}
              className="p-2 bg-[#222] hover:bg-[#383838] border border-[#444] rounded flex flex-col items-center justify-center min-w-[70px] text-gray-200 transition"
              title="Layer Properties Manager (LA)"
            >
              <Layers className="w-5 h-5 text-cyan-400 mb-0.5" />
              <span className="text-[10px] font-bold">Layer Props</span>
            </button>

            {/* Current Layer Dropdown */}
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-gray-400">Current Layer:</span>
              <select
                value={currentLayerId}
                onChange={(e) => setCurrentLayerId(e.target.value)}
                className="bg-[#1e1e1e] border border-[#444] rounded px-2 py-1 text-white text-xs outline-none font-mono"
              >
                {layers.map((l) => (
                  <option key={l.id} value={l.id}>
                    ■ {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <span className="text-[9px] text-gray-500 font-bold uppercase text-center mt-1">Layers</span>
        </div>

        {/* PANEL 5: BLOCKS / SYMBOLS */}
        <div className="flex flex-col justify-between border-r border-[#3f3f3f] pr-3">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setShowBlockModal(true)}
              className="p-2 bg-[#222] hover:bg-[#383838] border border-[#444] rounded flex flex-col items-center justify-center min-w-[65px] text-gray-200 transition"
              title="Insert Architectural Block (INSERT)"
            >
              <Compass className="w-5 h-5 text-purple-400 mb-0.5" />
              <span className="text-[10px] font-bold">Insert Block</span>
            </button>
          </div>
          <span className="text-[9px] text-gray-500 font-bold uppercase text-center mt-1">Blocks</span>
        </div>

        {/* PANEL 6: 3D MODELING & SOLIDS */}
        <div className="flex flex-col justify-between border-r border-[#3f3f3f] pr-3">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                setViewMode('3D');
                logCommand('_EXTRUDE Auto-extruding 2D plan to 3D Architectural Model.');
              }}
              className="p-1.5 bg-gradient-to-r from-purple-700/50 to-indigo-700/50 border border-purple-400 hover:brightness-125 rounded flex flex-col items-center justify-center min-w-[65px] text-purple-200 transition"
              title="Extrude 2D Floor Plan to 3D Walls (EXT)"
            >
              <Box className="w-5 h-5 text-purple-300 mb-0.5" />
              <span className="text-[10px] font-bold">Extrude 3D</span>
            </button>

            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => add3DPrimitive('box')}
                className="p-1 rounded bg-[#222] hover:bg-[#333] border border-[#444] text-gray-300"
                title="3D Box Solid"
              >
                <span className="text-[10px] font-bold">Box</span>
              </button>
              <button
                onClick={() => add3DPrimitive('cylinder')}
                className="p-1 rounded bg-[#222] hover:bg-[#333] border border-[#444] text-gray-300"
                title="3D Cylinder Solid"
              >
                <span className="text-[10px] font-bold">Cyl</span>
              </button>
              <button
                onClick={() => add3DPrimitive('sphere')}
                className="p-1 rounded bg-[#222] hover:bg-[#333] border border-[#444] text-gray-300"
                title="3D Sphere Solid"
              >
                <span className="text-[10px] font-bold">Sph</span>
              </button>
            </div>
          </div>
          <span className="text-[9px] text-purple-400 font-bold uppercase text-center mt-1">3D Solids</span>
        </div>

        {/* PANEL 7: EXPORT & OUTPUT */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={exportDXF}
              className="px-3 py-2 bg-[#00ffff]/20 hover:bg-[#00ffff]/30 border border-[#00ffff] text-[#00ffff] rounded font-bold text-xs flex flex-col items-center justify-center transition"
              title="Export compliant AutoCAD ASCII DXF file"
            >
              <Download className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Export DXF</span>
            </button>

            <button
              onClick={exportPDF}
              className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500 text-yellow-300 rounded font-bold text-xs flex flex-col items-center justify-center transition"
              title="Plot Architectural Vector Blueprint PDF"
            >
              <Printer className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Plot PDF</span>
            </button>
          </div>
          <span className="text-[9px] text-gray-500 font-bold uppercase text-center mt-1">Output</span>
        </div>

      </div>
    </div>
  );
}
