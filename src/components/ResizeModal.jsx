import React, { useState } from 'react';
import { Crown, X, Check, Smartphone, Square, Tv, Monitor, FileText, ArrowRight } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { CANVAS_SIZES } from '../data/brandKits';

const ICON_MAP = {
  Square: Square,
  Smartphone: Smartphone,
  Tv: Tv,
  Monitor: Monitor,
  FileText: FileText,
};

export default function ResizeModal() {
  const { showResizeModal, setShowResizeModal, resizeCanvas, canvasSize, isPro, setShowProModal } = useDesign();
  const [customWidth, setCustomWidth] = useState(canvasSize.width);
  const [customHeight, setCustomHeight] = useState(canvasSize.height);

  if (!showResizeModal) return null;

  const handleResize = (w, h, name) => {
    if (!isPro) {
      setShowResizeModal(false);
      setShowProModal(true);
      return;
    }
    resizeCanvas(w, h, name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-yellow-100 text-yellow-800 rounded-xl">
              <Crown className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Magic Switch & Resize</h2>
              <p className="text-xs text-gray-500">Auto-scale all elements to a new aspect ratio</p>
            </div>
          </div>
          <button
            onClick={() => setShowResizeModal(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset list */}
        <div className="p-5 space-y-2 max-h-72 overflow-y-auto">
          {CANVAS_SIZES.map((preset) => {
            const Icon = ICON_MAP[preset.icon] || Square;
            const isCurrent = canvasSize.width === preset.width && canvasSize.height === preset.height;

            return (
              <div
                key={preset.id}
                onClick={() => handleResize(preset.width, preset.height, preset.name)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  isCurrent
                    ? 'border-purple-600 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-gray-900">{preset.name}</div>
                    <div className="text-[11px] text-gray-400">{preset.width} × {preset.height} px</div>
                  </div>
                </div>

                {isCurrent ? (
                  <Check className="w-4 h-4 text-purple-600" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Dimensions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50">
          <div className="text-xs font-bold text-gray-700 mb-2">Custom Dimensions (px):</div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium outline-none focus:border-purple-500"
              placeholder="Width"
            />
            <span className="text-gray-400 font-bold">×</span>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium outline-none focus:border-purple-500"
              placeholder="Height"
            />
            <button
              onClick={() => handleResize(customWidth, customHeight, 'Custom Size')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shrink-0 transition"
            >
              Resize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
