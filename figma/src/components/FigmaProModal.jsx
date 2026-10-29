import React from 'react';
import { Crown, Check, X, Sparkles, Layers, Code2, Play, History, Users } from 'lucide-react';
import { useFigma } from '../context/FigmaContext';
import confetti from 'canvas-confetti';

export default function FigmaProModal() {
  const { showProModal, setShowProModal, isPro } = useFigma();

  if (!showProModal) return null;

  const triggerCelebration = () => {
    confetti({ particleCount: 100, spread: 70 });
    setShowProModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#1e1e1e] border border-[#383838] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-white relative">
        <button
          onClick={() => setShowProModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#0d99ff]/20 via-[#7b61ff]/20 to-amber-500/10 p-6 text-center border-b border-[#333333]">
          <div className="inline-flex p-3 bg-amber-400/20 border border-amber-300/30 rounded-2xl mb-2">
            <Crown className="w-8 h-8 text-amber-300 fill-amber-300" />
          </div>
          <h2 className="text-xl font-black">Figma Professional Organization</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Everything you need to design, build design systems, test interactive prototypes, and inspect code.
          </p>
        </div>

        {/* Feature List */}
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-3 text-xs text-gray-300">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Dev Mode Inspect:</span> Instant React JSX, Tailwind CSS, & CSS code generator with box model.
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-gray-300">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Interactive Device Prototyping:</span> Test live mobile transitions with dynamic device simulators.
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-gray-300">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Auto Layout (Flexbox Engine):</span> Row/column directions, responsive padding & gap distribution.
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-gray-300">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Unlimited Pages & Projects:</span> No 3-page limitations, manage full enterprise files.
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-gray-300">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Unlimited Version History:</span> Create named milestones and snapshot backups forever.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 pt-0">
          <button
            onClick={triggerCelebration}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-black text-xs shadow-lg transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Figma Pro Features Active (Celebrate 🎉)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
