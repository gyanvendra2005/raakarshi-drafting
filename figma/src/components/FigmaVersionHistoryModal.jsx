import React, { useState } from 'react';
import { History, X, Plus, Check, Clock, User, Crown } from 'lucide-react';
import { useFigma } from '../context/FigmaContext';

export default function FigmaVersionHistoryModal() {
  const {
    showVersionHistory,
    setShowVersionHistory,
    historyList,
    createVersionSnapshot,
  } = useFigma();

  const [versionTitle, setVersionTitle] = useState('');

  if (!showVersionHistory) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!versionTitle.trim()) return;
    createVersionSnapshot(versionTitle.trim());
    setVersionTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#222222] border border-[#383838] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-[#383838] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center space-x-1.5">
                <span>Version History</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded">PRO UNLIMITED</span>
              </h3>
              <p className="text-[11px] text-gray-400">Restore or snapshot your designs at any moment</p>
            </div>
          </div>
          <button
            onClick={() => setShowVersionHistory(false)}
            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create Snapshot Form */}
        <form onSubmit={handleSave} className="p-4 border-b border-[#383838] bg-[#1a1a1a] flex items-center space-x-2">
          <input
            type="text"
            value={versionTitle}
            onChange={(e) => setVersionTitle(e.target.value)}
            placeholder="Name this milestone (e.g., v2.1 Ready for Dev)..."
            className="flex-1 bg-[#252525] border border-[#444] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#0d99ff]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#0d99ff] hover:bg-[#008ae6] text-white font-bold rounded-lg text-xs flex items-center space-x-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </form>

        {/* Snapshots List */}
        <div className="p-4 space-y-2.5 max-h-72 overflow-y-auto">
          {historyList.map((ver) => (
            <div
              key={ver.id}
              className={`p-3 rounded-xl border transition flex items-center justify-between ${
                ver.active
                  ? 'border-[#0d99ff] bg-[#0d99ff]/10 text-white'
                  : 'border-[#333333] hover:border-[#444] bg-[#1e1e1e] text-gray-300'
              }`}
            >
              <div>
                <div className="font-bold text-xs flex items-center space-x-1.5">
                  <span>{ver.name}</span>
                  {ver.active && (
                    <span className="text-[9px] bg-[#0d99ff] text-white px-1.5 py-0.2 rounded font-bold">CURRENT</span>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-[10px] text-gray-400 mt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{ver.timestamp}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{ver.author}</span>
                  </span>
                </div>
              </div>

              {ver.active ? (
                <Check className="w-4 h-4 text-[#0d99ff]" />
              ) : (
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="px-2.5 py-1 bg-[#2a2a2a] hover:bg-[#333] rounded text-[11px] text-gray-300 hover:text-white"
                >
                  Restore
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
