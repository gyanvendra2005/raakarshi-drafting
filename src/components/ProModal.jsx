import React from 'react';
import { 
  Crown, 
  Check, 
  Sparkles, 
  X, 
  Wand2, 
  Maximize2, 
  Download, 
  FileCheck 
} from 'lucide-react';
import { useDesign } from '../context/DesignContext';

export default function ProModal() {
  const { showProModal, setShowProModal, isPro, triggerProActivation } = useDesign();

  if (!showProModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-100 relative">
        {/* Close Button */}
        <button
          onClick={() => setShowProModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 w-44 h-44 bg-pink-500/20 rounded-full blur-2xl" />
          <div className="inline-flex p-3 bg-yellow-400/20 border border-yellow-300/30 rounded-2xl mb-3 shadow-inner">
            <Crown className="w-10 h-10 text-yellow-300 fill-yellow-300" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Canva Pro Lifetime</h2>
          <p className="text-purple-200 text-xs mt-1 max-w-sm mx-auto">
            Unlock all premium design tools, AI Magic Studio, transparent exports, and infinite brand kits.
          </p>
        </div>

        {/* Features List */}
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-gray-900">AI Background Remover:</span> 1-click clean cutout on any image.
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-gray-900">Magic Switch & Resize:</span> Auto-adapt any design to Instagram, YouTube, or TikTok.
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-gray-900">Pro Vector & Print Exports:</span> Transparent PNG, CMYK PDF, and SVG vectors.
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-gray-900">Unlimited Brand Kits:</span> Save corporate color schemes and brand typography.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
          <button
            onClick={triggerProActivation}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-purple-950 font-black text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isPro ? 'Pro Already Activated (Celebrate 🎉)' : 'Activate Canva Pro (Free Unlock)'}</span>
          </button>
          <div className="text-center text-[11px] text-gray-400 mt-2 font-medium">
            No credit card needed • Full Pro features enabled
          </div>
        </div>
      </div>
    </div>
  );
}
