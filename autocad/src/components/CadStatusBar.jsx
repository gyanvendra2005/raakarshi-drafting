import React from 'react';
import { 
  Grid, 
  Magnet, 
  CornerDownRight, 
  CircleDot, 
  Crosshair, 
  Layers, 
  Sliders, 
  Maximize2 
} from 'lucide-react';
import { useCad } from '../context/CadContext';

export default function CadStatusBar() {
  const {
    workspaceTab,
    setWorkspaceTab,
    cursorPos,
    gridOn,
    setGridOn,
    snapOn,
    setSnapOn,
    orthoOn,
    setOrthoOn,
    polarOn,
    setPolarOn,
    osnapOn,
    setOsnapOn,
    dynOn,
    setDynOn,
    lwtOn,
    setLwtOn,
    scale,
    setScale,
    logCommand,
  } = useCad();

  const toggleStatus = (name, val, setter) => {
    setter(!val);
    logCommand(`${name} <${!val ? 'ON' : 'OFF'}>`);
  };

  return (
    <div className="h-7 bg-[#1c1c1c] border-t border-[#292929] px-3 flex items-center justify-between text-[11px] text-gray-400 select-none shrink-0 z-30 font-mono">
      {/* 1. LEFT: MODEL vs LAYOUT TABS */}
      <div className="flex items-center space-x-1 h-full">
        <button
          onClick={() => setWorkspaceTab('MODEL')}
          className={`h-full px-3 font-bold transition flex items-center ${
            workspaceTab === 'MODEL'
              ? 'bg-[#2b2b2b] text-white border-b-2 border-cyan-400'
              : 'hover:bg-white/5 text-gray-500'
          }`}
        >
          MODEL
        </button>
        <button
          onClick={() => setWorkspaceTab('LAYOUT1')}
          className={`h-full px-3 font-bold transition flex items-center ${
            workspaceTab === 'LAYOUT1'
              ? 'bg-[#2b2b2b] text-white border-b-2 border-cyan-400'
              : 'hover:bg-white/5 text-gray-500'
          }`}
        >
          LAYOUT 1
        </button>
      </div>

      {/* 2. CENTER: LIVE CARTESIAN COORDINATE READOUT */}
      <div className="bg-[#111111] px-3 py-0.5 rounded border border-[#2d2d2d] text-cyan-400 font-bold">
        {cursorPos.x.toFixed(2)}, {cursorPos.y.toFixed(2)}, 0.00
      </div>

      {/* 3. RIGHT: AUTOCAD STATUS BUTTONS (F3, F7, F8, F9, F12) */}
      <div className="flex items-center space-x-1">
        {/* GRID (F7) */}
        <button
          onClick={() => toggleStatus('GRID', gridOn, setGridOn)}
          className={`px-2 py-0.5 rounded transition font-bold ${
            gridOn ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-white/5 text-gray-600'
          }`}
          title="Display Drawing Grid (F7)"
        >
          GRID
        </button>

        {/* SNAP (F9) */}
        <button
          onClick={() => toggleStatus('SNAP', snapOn, setSnapOn)}
          className={`px-2 py-0.5 rounded transition font-bold ${
            snapOn ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-white/5 text-gray-600'
          }`}
          title="Snap Mode (F9)"
        >
          SNAP
        </button>

        {/* ORTHO (F8) */}
        <button
          onClick={() => toggleStatus('ORTHOMODE', orthoOn, setOrthoOn)}
          className={`px-2 py-0.5 rounded transition font-bold ${
            orthoOn ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-white/5 text-gray-600'
          }`}
          title="Restrict Cursor Orthogonally (F8)"
        >
          ORTHO
        </button>

        {/* POLAR (F10) */}
        <button
          onClick={() => toggleStatus('POLAR', polarOn, setPolarOn)}
          className={`px-2 py-0.5 rounded transition font-bold ${
            polarOn ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-white/5 text-gray-600'
          }`}
          title="Polar Tracking (F10)"
        >
          POLAR
        </button>

        {/* OSNAP (F3) */}
        <button
          onClick={() => toggleStatus('OSNAP', osnapOn, setOsnapOn)}
          className={`px-2 py-0.5 rounded transition font-bold ${
            osnapOn ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-white/5 text-gray-600'
          }`}
          title="2D Object Snap (F3)"
        >
          OSNAP
        </button>

        {/* DYN (F12) */}
        <button
          onClick={() => toggleStatus('DYNMODE', dynOn, setDynOn)}
          className={`px-2 py-0.5 rounded transition font-bold ${
            dynOn ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-white/5 text-gray-600'
          }`}
          title="Dynamic Input (F12)"
        >
          DYN
        </button>

        {/* LWT (Lineweight) */}
        <button
          onClick={() => toggleStatus('LINEWEIGHT', lwtOn, setLwtOn)}
          className={`px-2 py-0.5 rounded transition font-bold ${
            lwtOn ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-white/5 text-gray-600'
          }`}
          title="Show/Hide Lineweight"
        >
          LWT
        </button>

        {/* Scale */}
        <select
          value={scale}
          onChange={(e) => setScale(e.target.value)}
          className="bg-[#111] border border-[#333] rounded px-1 text-gray-300 text-[10px] outline-none"
        >
          <option value="1:1">1:1</option>
          <option value="1:50">1:50</option>
          <option value="1:100">1:100</option>
          <option value="1:200">1:200</option>
        </select>
      </div>
    </div>
  );
}
