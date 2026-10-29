import React, { useState } from 'react';
import { Download, Crown, X, FileImage, FileText, Check, Sparkles } from 'lucide-react';
import { useDesign } from '../context/DesignContext';

export default function ExportModal() {
  const { showExportModal, setShowExportModal, exportCanvas, isPro, setShowProModal } = useDesign();
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [transparentBg, setTransparentBg] = useState(false);
  const [quality, setQuality] = useState(1.0);
  const [multiplier, setMultiplier] = useState(1.5);

  if (!showExportModal) return null;

  const handleExport = () => {
    if ((selectedFormat === 'pdf' || selectedFormat === 'svg' || transparentBg) && !isPro) {
      setShowExportModal(false);
      setShowProModal(true);
      return;
    }
    exportCanvas(selectedFormat, {
      transparent: transparentBg,
      quality,
      multiplier,
    });
  };

  const formats = [
    { id: 'png', name: 'PNG Image', desc: 'Best for complex images, illustrations & web', isPro: false },
    { id: 'jpeg', name: 'JPG Image', desc: 'Best for sharing with smaller file size', isPro: false },
    { id: 'pdf', name: 'PDF Document', desc: 'Best for high-quality printing & documents', isPro: true },
    { id: 'svg', name: 'SVG Vector', desc: 'Best for web design and infinite scaling', isPro: true },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Export / Download</h2>
              <p className="text-xs text-gray-500">Choose your format and export settings</p>
            </div>
          </div>
          <button
            onClick={() => setShowExportModal(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-5 space-y-3">
          <label className="text-xs font-bold text-gray-700 block">File Type:</label>
          <div className="space-y-2">
            {formats.map((fmt) => (
              <div
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  selectedFormat === fmt.id
                    ? 'border-purple-600 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs">{fmt.name}</span>
                    {fmt.isPro && (
                      <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center space-x-1">
                        <Crown className="w-2.5 h-2.5 fill-yellow-600" />
                        <span>PRO</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{fmt.desc}</div>
                </div>

                {selectedFormat === fmt.id && <Check className="w-4 h-4 text-purple-600" />}
              </div>
            ))}
          </div>

          {/* Options */}
          {selectedFormat === 'png' && (
            <div className="pt-2">
              <label className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                  className="rounded text-purple-600 accent-purple-600 w-4 h-4 cursor-pointer"
                />
                <div className="text-xs flex-1">
                  <span className="font-semibold text-gray-800">Transparent Background</span>
                  <div className="text-[10px] text-gray-400">Download without canvas background color</div>
                </div>
                <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              </label>
            </div>
          )}

          {/* Resolution Multiplier */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
              <span>Resolution / Scale:</span>
              <span className="text-purple-600">{multiplier}x Ultra HD</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.5"
              value={multiplier}
              onChange={(e) => setMultiplier(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Download Button */}
        <div className="p-5 pt-0">
          <button
            onClick={handleExport}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl hover:shadow-2xl transition flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download {selectedFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
