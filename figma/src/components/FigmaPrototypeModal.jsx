import React from 'react';
import { X, RotateCcw, Smartphone, Monitor, Globe, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useFigma } from '../context/FigmaContext';

export default function FigmaPrototypeModal() {
  const {
    showPrototypeModal,
    setShowPrototypeModal,
    prototypeCurrentFrameId,
    setPrototypeCurrentFrameId,
    currentPage,
  } = useFigma();

  if (!showPrototypeModal) return null;

  // Find the active frame to render inside the device simulator
  const activeFrame = currentPage.elements.find(
    (el) => el.id === prototypeCurrentFrameId && el.type === 'frame'
  ) || currentPage.elements.find((el) => el.type === 'frame');

  if (!activeFrame) return null;

  const isDesktop = (activeFrame.width || 375) > 600;

  const handleHotspotClick = (targetId) => {
    if (targetId) {
      setPrototypeCurrentFrameId(targetId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      {/* Top Floating Simulator Control Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#222222]/95 border border-[#383838] px-5 py-2 rounded-full flex items-center space-x-4 text-xs text-white shadow-2xl z-40">
        <div className="flex items-center space-x-2 font-bold">
          {isDesktop ? <Monitor className="w-4 h-4 text-[#0d99ff]" /> : <Smartphone className="w-4 h-4 text-[#0d99ff]" />}
          <span>Prototype: {activeFrame.name}</span>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <button
          onClick={() => setPrototypeCurrentFrameId(currentPage.elements.find(e => e.type === 'frame')?.id)}
          className="flex items-center space-x-1.5 hover:text-[#0d99ff] transition"
          title="Restart Prototype"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
        <button
          onClick={() => setShowPrototypeModal(false)}
          className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 1. DESKTOP SIMULATOR (If Website Frame) */}
      {isDesktop ? (
        <div className="w-[1080px] max-w-[95vw] h-[640px] max-h-[85vh] bg-[#111827] border border-[#374151] rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden mt-8 animate-in zoom-in-95 duration-200">
          {/* macOS / Chrome Window Header */}
          <div className="h-10 bg-[#1f2937] border-b border-[#374151] px-4 flex items-center justify-between shrink-0">
            {/* Traffic Light Window Buttons */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
            </div>

            {/* URL Omnibox */}
            <div className="flex items-center space-x-2 bg-[#111827] border border-[#374151] rounded-lg px-3 py-1 text-xs text-gray-300 w-96 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] text-gray-400">https://nova-ai.io/landing</span>
            </div>

            <div className="w-12" />
          </div>

          {/* Browser Viewport Area */}
          <div
            className="flex-1 overflow-y-auto p-8 flex flex-col relative transition-all duration-300"
            style={{
              backgroundColor: activeFrame.fill || '#090d16',
              gap: activeFrame.autoLayout?.gap ? `${activeFrame.autoLayout.gap}px` : '20px',
              padding: activeFrame.autoLayout?.padding ? `${activeFrame.autoLayout.padding}px` : '32px',
            }}
          >
            {activeFrame.children && activeFrame.children.map((child) => {
              const hasTarget = child.prototypeTarget;

              return (
                <div
                  key={child.id}
                  onClick={() => handleHotspotClick(child.prototypeTarget)}
                  style={{
                    width: child.width ? `${child.width}px` : '100%',
                    height: child.height ? `${child.height}px` : 'auto',
                    backgroundColor: child.fill || 'transparent',
                    borderRadius: child.borderRadius ? `${child.borderRadius}px` : '0px',
                    boxShadow: child.dropShadow ? `${child.dropShadow.x}px ${child.dropShadow.y}px ${child.dropShadow.blur}px ${child.dropShadow.color}` : undefined,
                    border: child.stroke ? `${child.strokeWidth || 1}px solid ${child.stroke}` : undefined,
                    cursor: hasTarget ? 'pointer' : 'default',
                  }}
                  className={`transition-all duration-200 select-none ${
                    hasTarget ? 'hover:scale-[1.01] active:scale-[0.99] ring-2 ring-[#0d99ff] ring-offset-2 ring-offset-[#090d16] animate-pulse' : ''
                  }`}
                >
                  {child.type === 'text' && (
                    <div
                      style={{
                        fontSize: `${child.fontSize || 16}px`,
                        fontWeight: child.fontWeight || 'normal',
                        color: child.fill || '#ffffff',
                        textAlign: child.textAlign || 'left',
                        whiteSpace: 'pre-line',
                        lineHeight: child.lineHeight || 1.3,
                      }}
                    >
                      {child.text}
                    </div>
                  )}

                  {child.type === 'component' && (
                    <div className="w-full h-full flex items-center justify-center font-bold text-white text-sm px-6">
                      {child.text || child.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. MOBILE SIMULATOR (If iPhone Frame) */
        <div className="relative mt-8">
          <div className="w-[395px] h-[720px] bg-black border-4 border-[#333333] rounded-[52px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col items-center relative overflow-hidden">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-4 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-end pr-3">
              <div className="w-3 h-3 rounded-full bg-[#111111] border border-[#222222]" />
            </div>

            {/* Device Viewport */}
            <div
              className="w-full h-full rounded-[44px] overflow-hidden flex flex-col relative transition-all duration-300"
              style={{
                backgroundColor: activeFrame.fill || '#0f172a',
                padding: activeFrame.autoLayout?.padding ? `${activeFrame.autoLayout.padding}px` : '24px',
                gap: activeFrame.autoLayout?.gap ? `${activeFrame.autoLayout.gap}px` : '16px',
              }}
            >
              {activeFrame.children && activeFrame.children.map((child) => {
                const hasTarget = child.prototypeTarget;

                return (
                  <div
                    key={child.id}
                    onClick={() => handleHotspotClick(child.prototypeTarget)}
                    style={{
                      width: child.width ? `${child.width}px` : '100%',
                      height: child.height ? `${child.height}px` : 'auto',
                      backgroundColor: child.fill || 'transparent',
                      borderRadius: child.borderRadius ? `${child.borderRadius}px` : '0px',
                      boxShadow: child.dropShadow ? `${child.dropShadow.x}px ${child.dropShadow.y}px ${child.dropShadow.blur}px ${child.dropShadow.color}` : undefined,
                      cursor: hasTarget ? 'pointer' : 'default',
                    }}
                    className={`transition-all duration-200 select-none ${
                      hasTarget ? 'hover:scale-[1.02] active:scale-[0.98] ring-2 ring-blue-400/50 hover:ring-blue-400 animate-pulse' : ''
                    }`}
                  >
                    {child.type === 'text' && (
                      <div
                        style={{
                          fontSize: `${child.fontSize || 16}px`,
                          fontWeight: child.fontWeight || 'normal',
                          color: child.fill || '#ffffff',
                          textAlign: child.textAlign || 'left',
                          whiteSpace: 'pre-line',
                          lineHeight: child.lineHeight || 1.3,
                        }}
                      >
                        {child.text}
                      </div>
                    )}

                    {child.type === 'component' && (
                      <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs px-4">
                        {child.text || child.name}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
