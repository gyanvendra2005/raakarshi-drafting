import React, { useState } from 'react';
import { Layers, X, Plus, Trash2, Eye, EyeOff, Lock, Unlock, Check } from 'lucide-react';
import { useCad } from '../context/CadContext';

const CAD_PALETTE = [
  { name: 'Red', hex: '#ff0000', aci: 1 },
  { name: 'Yellow', hex: '#ffff00', aci: 2 },
  { name: 'Green', hex: '#00ff00', aci: 3 },
  { name: 'Cyan', hex: '#00ffff', aci: 4 },
  { name: 'Blue', hex: '#0000ff', aci: 5 },
  { name: 'Magenta', hex: '#ff00ff', aci: 6 },
  { name: 'White', hex: '#ffffff', aci: 7 },
  { name: 'Orange', hex: '#ff9900', aci: 30 },
];

export default function CadLayerModal() {
  const {
    showLayerModal,
    setShowLayerModal,
    layers,
    setLayers,
    currentLayerId,
    setCurrentLayerId,
    logCommand,
  } = useCad();

  const [newLayerName, setNewLayerName] = useState('');
  const [newLayerColor, setNewLayerColor] = useState('#00ffff');

  if (!showLayerModal) return null;

  const handleAddLayer = (e) => {
    e.preventDefault();
    if (!newLayerName.trim()) return;

    const newLayer = {
      id: `layer-${Date.now()}`,
      name: newLayerName.trim().toUpperCase(),
      color: newLayerColor,
      visible: true,
      locked: false,
      lineweight: '0.25',
    };

    setLayers([...layers, newLayer]);
    setCurrentLayerId(newLayer.id);
    logCommand(`_LAYER Created layer "${newLayer.name}".`);
    setNewLayerName('');
  };

  const toggleVisibility = (id) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  };

  const toggleLock = (id) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)));
  };

  const updateColor = (id, color) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, color } : l)));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none font-mono">
      <div className="bg-[#222222] border border-[#383838] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl text-gray-200">
        {/* Header */}
        <div className="bg-[#1c1c1c] p-3 border-b border-[#333333] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Layer Properties Manager</h3>
          </div>
          <button
            onClick={() => setShowLayerModal(false)}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create Layer Toolbar */}
        <form onSubmit={handleAddLayer} className="p-3 bg-[#191919] border-b border-[#333333] flex items-center space-x-3 text-xs">
          <input
            type="text"
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            placeholder="New Layer Name (e.g. 0_ELECTRICAL)..."
            className="flex-1 bg-[#252525] border border-[#444] rounded px-3 py-1.5 text-white outline-none focus:border-cyan-400 uppercase font-mono"
          />
          <div className="flex items-center space-x-1">
            <span className="text-gray-400 text-[11px]">Color:</span>
            <input
              type="color"
              value={newLayerColor}
              onChange={(e) => setNewLayerColor(e.target.value)}
              className="w-7 h-7 rounded border border-[#444] cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded flex items-center space-x-1 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Layer</span>
          </button>
        </form>

        {/* Layer Table */}
        <div className="max-h-80 overflow-y-auto p-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#333] text-gray-500 font-bold text-[10px] uppercase">
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">On/Off</th>
                <th className="py-2 px-2">Freeze/Lock</th>
                <th className="py-2 px-2">Color</th>
                <th className="py-2 px-2">Lineweight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {layers.map((layer) => {
                const isCurrent = currentLayerId === layer.id;

                return (
                  <tr
                    key={layer.id}
                    className={`hover:bg-white/5 transition ${isCurrent ? 'bg-cyan-950/30' : ''}`}
                  >
                    <td className="py-2 px-2">
                      <button
                        onClick={() => setCurrentLayerId(layer.id)}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isCurrent ? 'border-green-400 bg-green-500' : 'border-gray-500 hover:border-gray-300'
                        }`}
                        title="Set as Current Layer"
                      >
                        {isCurrent && <Check className="w-3 h-3 text-black stroke-[3]" />}
                      </button>
                    </td>

                    <td className="py-2 px-2 font-bold text-white flex items-center space-x-1.5">
                      <span>{layer.name}</span>
                      {isCurrent && (
                        <span className="text-[9px] bg-green-500/20 text-green-400 px-1 rounded">CURRENT</span>
                      )}
                    </td>

                    <td className="py-2 px-2">
                      <button
                        onClick={() => toggleVisibility(layer.id)}
                        className={`p-1 rounded ${layer.visible ? 'text-yellow-400' : 'text-gray-600'}`}
                        title="Toggle Layer Visibility"
                      >
                        {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>

                    <td className="py-2 px-2">
                      <button
                        onClick={() => toggleLock(layer.id)}
                        className={`p-1 rounded ${layer.locked ? 'text-red-400' : 'text-gray-400'}`}
                        title="Toggle Lock"
                      >
                        {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </td>

                    <td className="py-2 px-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded border border-[#555]"
                          style={{ backgroundColor: layer.color }}
                        />
                        <select
                          value={layer.color}
                          onChange={(e) => updateColor(layer.id, e.target.value)}
                          className="bg-[#1c1c1c] border border-[#444] rounded px-1.5 py-0.5 text-[11px] text-white outline-none"
                        >
                          {CAD_PALETTE.map((pal) => (
                            <option key={pal.hex} value={pal.hex}>
                              {pal.name} ({pal.aci})
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="py-2 px-2 text-gray-400 font-mono">
                      {layer.lineweight || '0.25'} mm
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
