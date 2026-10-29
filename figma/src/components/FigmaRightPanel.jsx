import React, { useState } from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  CornerDownRight, 
  Maximize, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  Download, 
  Crown, 
  Code2, 
  Columns, 
  Rows, 
  LayoutGrid
} from 'lucide-react';
import { useFigma } from '../context/FigmaContext';

export default function FigmaRightPanel() {
  const {
    selectedElement,
    updateSelected,
    updateAutoLayout,
    activeTab,
    setActiveTab,
    isDevMode,
    startInteractivePrototype,
    exportElement,
    currentPage,
  } = useFigma();

  const [codeType, setCodeType] = useState('css'); // 'css' | 'tailwind' | 'react'
  const [copied, setCopied] = useState(false);

  // If no element selected
  if (!selectedElement) {
    return (
      <aside className="w-72 bg-[#222222] border-l border-[#333333] p-4 text-xs text-gray-400 select-none">
        <div className="font-semibold text-white mb-2">Design Properties</div>
        <p className="text-gray-500">Select any layer or frame on the canvas to configure Auto Layout, Colors, Dev Mode Code, or Prototype interactions.</p>
      </aside>
    );
  }

  // Generate Dev Mode Code Snippets
  const generateCssCode = () => {
    return `/* Figma Pro Generated CSS */
.${selectedElement.name.toLowerCase().replace(/[^a-z0-9]/g, '-')} {
  width: ${selectedElement.width || 0}px;
  height: ${selectedElement.height || 0}px;
  background-color: ${selectedElement.fill || 'transparent'};
  border-radius: ${selectedElement.borderRadius || 0}px;
  ${selectedElement.stroke ? `border: ${selectedElement.strokeWidth || 1}px solid ${selectedElement.stroke};` : ''}
  ${selectedElement.autoLayout?.enabled ? `display: flex;
  flex-direction: ${selectedElement.autoLayout.direction === 'row' ? 'row' : 'column'};
  gap: ${selectedElement.autoLayout.gap || 0}px;
  padding: ${selectedElement.autoLayout.padding || 0}px;` : ''}
}`;
  };

  const generateTailwindCode = () => {
    const isCol = selectedElement.autoLayout?.direction !== 'row';
    return `<!-- Figma Pro Generated Tailwind -->
<div className="${selectedElement.autoLayout?.enabled ? `flex ${isCol ? 'flex-col' : 'flex-row'} gap-[${selectedElement.autoLayout.gap || 0}px] p-[${selectedElement.autoLayout.padding || 0}px]` : ''} w-[${selectedElement.width || 0}px] min-h-[${selectedElement.height || 0}px] rounded-[${selectedElement.borderRadius || 0}px]" style={{ backgroundColor: '${selectedElement.fill || '#1e1e1e'}' }}>
  {/* Children layers */}
</div>`;
  };

  const handleCopyCode = () => {
    const text = codeType === 'tailwind' ? generateTailwindCode() : generateCssCode();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-72 bg-[#222222] border-l border-[#333333] flex flex-col h-full select-none text-gray-300 text-xs shrink-0 z-10">
      {/* 1. TOP TAB BAR (Design vs Prototype vs Dev Mode) */}
      <div className="flex border-b border-[#333333]">
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-2.5 font-semibold text-center transition ${
            activeTab === 'design'
              ? 'text-white border-b-2 border-[#0d99ff] bg-white/5'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Design
        </button>
        <button
          onClick={() => setActiveTab('prototype')}
          className={`flex-1 py-2.5 font-semibold text-center transition ${
            activeTab === 'prototype'
              ? 'text-white border-b-2 border-[#0d99ff] bg-white/5'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Prototype
        </button>
        <button
          onClick={() => setActiveTab('inspect')}
          className={`flex-1 py-2.5 font-bold text-center transition flex items-center justify-center space-x-1 ${
            activeTab === 'inspect' || isDevMode
              ? 'text-[#10b981] border-b-2 border-[#10b981] bg-[#10b981]/10'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Dev</span>
        </button>
      </div>

      {/* 2. TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">

        {/* TAB A: DESIGN INSPECTOR */}
        {activeTab === 'design' && !isDevMode && (
          <>
            {/* Dimensions & Position */}
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Position & Dimensions</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-[#1e1e1e] border border-[#383838] rounded px-2 py-1">
                  <span className="text-gray-500 mr-2 font-mono">W</span>
                  <input
                    type="number"
                    value={selectedElement.width || 0}
                    onChange={(e) => updateSelected('width', parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
                <div className="flex items-center bg-[#1e1e1e] border border-[#383838] rounded px-2 py-1">
                  <span className="text-gray-500 mr-2 font-mono">H</span>
                  <input
                    type="number"
                    value={selectedElement.height || 0}
                    onChange={(e) => updateSelected('height', parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
                <div className="flex items-center bg-[#1e1e1e] border border-[#383838] rounded px-2 py-1">
                  <span className="text-gray-500 mr-2 font-mono">X</span>
                  <input
                    type="number"
                    value={selectedElement.x || 0}
                    onChange={(e) => updateSelected('x', parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
                <div className="flex items-center bg-[#1e1e1e] border border-[#383838] rounded px-2 py-1">
                  <span className="text-gray-500 mr-2 font-mono">Y</span>
                  <input
                    type="number"
                    value={selectedElement.y || 0}
                    onChange={(e) => updateSelected('y', parseInt(e.target.value) || 0)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
              </div>

              {/* Corner Radius */}
              <div className="mt-2 flex items-center bg-[#1e1e1e] border border-[#383838] rounded px-2 py-1">
                <span className="text-gray-500 mr-2 font-mono text-xs">Radius</span>
                <input
                  type="number"
                  value={selectedElement.borderRadius || 0}
                  onChange={(e) => updateSelected('borderRadius', parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-white outline-none"
                />
              </div>
            </div>

            {/* AUTO LAYOUT (Flexbox Pro Feature) */}
            <div className="border-t border-[#333333] pt-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-[#0d99ff]" />
                  <span>Auto Layout</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedElement.autoLayout?.enabled || false}
                  onChange={(e) => updateAutoLayout('enabled', e.target.checked)}
                  className="rounded accent-[#0d99ff] cursor-pointer"
                />
              </div>

              {selectedElement.autoLayout?.enabled && (
                <div className="space-y-2 bg-[#1a1a1a] p-2.5 rounded-lg border border-[#333333]">
                  {/* Direction buttons */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Direction:</span>
                    <div className="flex border border-[#444] rounded overflow-hidden">
                      <button
                        onClick={() => updateAutoLayout('direction', 'row')}
                        className={`p-1.5 ${selectedElement.autoLayout?.direction === 'row' ? 'bg-[#0d99ff] text-white' : 'hover:bg-white/10 text-gray-400'}`}
                        title="Horizontal Direction (Row)"
                      >
                        <Columns className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateAutoLayout('direction', 'column')}
                        className={`p-1.5 ${selectedElement.autoLayout?.direction !== 'row' ? 'bg-[#0d99ff] text-white' : 'hover:bg-white/10 text-gray-400'}`}
                        title="Vertical Direction (Column)"
                      >
                        <Rows className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Gap between items */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Item Spacing (Gap):</span>
                    <input
                      type="number"
                      value={selectedElement.autoLayout?.gap || 0}
                      onChange={(e) => updateAutoLayout('gap', parseInt(e.target.value) || 0)}
                      className="w-16 bg-[#252525] border border-[#444] rounded px-1.5 py-0.5 text-right text-white"
                    />
                  </div>

                  {/* Padding */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Padding:</span>
                    <input
                      type="number"
                      value={selectedElement.autoLayout?.padding || 0}
                      onChange={(e) => updateAutoLayout('padding', parseInt(e.target.value) || 0)}
                      className="w-16 bg-[#252525] border border-[#444] rounded px-1.5 py-0.5 text-right text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* FILL / COLOR */}
            <div className="border-t border-[#333333] pt-3">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Fill</div>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={selectedElement.fill || '#1e1e24'}
                  onChange={(e) => updateSelected('fill', e.target.value)}
                  className="w-7 h-7 rounded border border-[#444] cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedElement.fill || '#1e1e24'}
                  onChange={(e) => updateSelected('fill', e.target.value)}
                  className="w-24 bg-[#1e1e1e] border border-[#383838] rounded px-2 py-1 text-white font-mono uppercase"
                />
              </div>
            </div>

            {/* STROKE / BORDER */}
            <div className="border-t border-[#333333] pt-3">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Stroke</div>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={selectedElement.stroke || '#334155'}
                  onChange={(e) => updateSelected('stroke', e.target.value)}
                  className="w-7 h-7 rounded border border-[#444] cursor-pointer"
                />
                <input
                  type="number"
                  value={selectedElement.strokeWidth || 1}
                  onChange={(e) => updateSelected('strokeWidth', parseInt(e.target.value) || 1)}
                  className="w-16 bg-[#1e1e1e] border border-[#383838] rounded px-2 py-1 text-white"
                  placeholder="Width"
                />
              </div>
            </div>

            {/* EXPORT OPTIONS */}
            <div className="border-t border-[#333333] pt-3">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Export Asset</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportElement('png')}
                  className="flex-1 py-1.5 bg-[#2c2c2c] hover:bg-[#383838] text-white font-bold rounded border border-[#444] transition"
                >
                  PNG
                </button>
                <button
                  onClick={() => exportElement('svg')}
                  className="flex-1 py-1.5 bg-[#2c2c2c] hover:bg-[#383838] text-white font-bold rounded border border-[#444] transition"
                >
                  SVG
                </button>
                <button
                  onClick={() => exportElement('pdf')}
                  className="flex-1 py-1.5 bg-[#2c2c2c] hover:bg-[#383838] text-white font-bold rounded border border-[#444] transition"
                >
                  PDF
                </button>
              </div>
            </div>
          </>
        )}

        {/* TAB B: PROTOTYPING TAB (Figma Pro Interaction Flow) */}
        {activeTab === 'prototype' && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-blue-200 text-xs">
              🔗 <b>Interactive Prototype:</b> Connect this element to another frame for seamless interactive screen navigation.
            </div>

            <div>
              <label className="text-gray-400 font-bold block mb-1">Trigger Event:</label>
              <div className="p-2 bg-[#1e1e1e] border border-[#383838] rounded font-semibold text-white">
                On Click (Tap)
              </div>
            </div>

            <div>
              <label className="text-gray-400 font-bold block mb-1">Navigate To Target Frame:</label>
              <select
                value={selectedElement.prototypeTarget || ''}
                onChange={(e) => updateSelected('prototypeTarget', e.target.value)}
                className="w-full bg-[#1e1e1e] border border-[#383838] rounded px-2 py-2 text-white outline-none font-medium"
              >
                <option value="">None (No Connection)</option>
                {currentPage.elements.filter(e => e.type === 'frame').map((frame) => (
                  <option key={frame.id} value={frame.id}>
                    {frame.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-400 font-bold block mb-1">Animation Transition:</label>
              <div className="p-2 bg-[#1e1e1e] border border-[#383838] rounded text-white flex items-center justify-between">
                <span>Smart Animate (Ease-out 300ms)</span>
                <Crown className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>

            <button
              onClick={() => startInteractivePrototype(selectedElement.id)}
              className="w-full py-2.5 bg-[#0d99ff] hover:bg-[#008ae6] text-white font-bold rounded-lg shadow-md transition flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Device Simulator</span>
            </button>
          </div>
        )}

        {/* TAB C: DEV MODE / CODE INSPECTOR (Figma Pro Signature Feature) */}
        {(activeTab === 'inspect' || isDevMode) && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-700/60 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><b>Dev Mode Active:</b> Ready-to-copy code for React, Tailwind, and CSS.</span>
            </div>

            {/* Code Language Switch */}
            <div className="flex border border-[#444] rounded-lg overflow-hidden bg-[#1e1e1e]">
              <button
                onClick={() => setCodeType('css')}
                className={`flex-1 py-1.5 font-bold ${codeType === 'css' ? 'bg-[#10b981] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                CSS
              </button>
              <button
                onClick={() => setCodeType('tailwind')}
                className={`flex-1 py-1.5 font-bold ${codeType === 'tailwind' ? 'bg-[#10b981] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Tailwind
              </button>
            </div>

            {/* Code Output Box */}
            <div className="relative">
              <pre className="p-3 bg-[#111111] border border-[#333333] rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-56">
                {codeType === 'tailwind' ? generateTailwindCode() : generateCssCode()}
              </pre>

              <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 px-2 py-1 bg-[#222222] hover:bg-[#333333] border border-[#444] rounded text-white text-[10px] font-bold flex items-center space-x-1 shadow transition"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Box Model Metrics */}
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Box Model Inspection</div>
              <div className="p-3 bg-[#18181b] border border-[#333333] rounded-xl text-center space-y-1">
                <div className="text-[10px] text-gray-500">PADDING: {selectedElement.autoLayout?.padding || 0}px</div>
                <div className="font-bold text-white text-sm">{selectedElement.width || 0} × {selectedElement.height || 0} px</div>
                <div className="text-[10px] text-gray-500">GAP: {selectedElement.autoLayout?.gap || 0}px</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
