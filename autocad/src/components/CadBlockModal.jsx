import React from 'react';
import { Compass, X, Check, Box, Plus } from 'lucide-react';
import { useCad } from '../context/CadContext';

const ARCH_BLOCKS = [
  {
    id: 'block-door-90',
    name: 'Door Single Leaf (900mm)',
    category: 'Architectural',
    layer: 'doors',
    type: 'door',
    width: 90,
  },
  {
    id: 'block-window-sliding',
    name: 'Double Glazed Window (1500mm)',
    category: 'Architectural',
    layer: 'windows',
    type: 'window',
    width: 150,
    height: 20,
  },
  {
    id: 'block-column-r',
    name: 'RCC Column (300x300mm)',
    category: 'Structural',
    layer: 'walls',
    type: 'rect',
    width: 30,
    height: 30,
  },
  {
    id: 'block-bed-king',
    name: 'Master Bed (King 1800x2000mm)',
    category: 'Furniture',
    layer: 'furniture',
    type: 'rect',
    width: 180,
    height: 200,
  },
  {
    id: 'block-sofa-3',
    name: 'Sofa 3-Seater (2200x900mm)',
    category: 'Furniture',
    layer: 'furniture',
    type: 'rect',
    width: 220,
    height: 90,
  },
  {
    id: 'block-north',
    name: 'North Arrow Symbol',
    category: 'Annotation',
    layer: '0',
    type: 'text',
    text: '▲\nNORTH',
    size: 16,
  }
];

export default function CadBlockModal() {
  const {
    showBlockModal,
    setShowBlockModal,
    addEntity,
    logCommand,
  } = useCad();

  if (!showBlockModal) return null;

  const insertBlock = (block) => {
    addEntity({
      ...block,
      x: 350,
      y: 350,
      x1: 350,
      y1: 350,
      x2: 450,
      y2: 350,
    });
    logCommand(`_INSERT Block "${block.name}" placed into drawing.`);
    setShowBlockModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none font-mono">
      <div className="bg-[#222222] border border-[#383838] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl text-gray-200">
        {/* Header */}
        <div className="bg-[#1c1c1c] p-3 border-b border-[#333333] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-white">Architectural CAD Block Library</h3>
          </div>
          <button
            onClick={() => setShowBlockModal(false)}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Blocks Grid */}
        <div className="p-4 grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {ARCH_BLOCKS.map((blk) => (
            <div
              key={blk.id}
              onClick={() => insertBlock(blk)}
              className="p-3 bg-[#181818] hover:bg-[#282828] border border-[#333] hover:border-purple-400 rounded-lg cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-purple-400 font-bold uppercase">{blk.category}</span>
                <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-400" />
              </div>
              <div className="font-bold text-white text-xs truncate">{blk.name}</div>
              <div className="text-[10px] text-gray-500">Layer: {blk.layer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
