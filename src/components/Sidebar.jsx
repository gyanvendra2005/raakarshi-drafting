import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Shapes, 
  Type, 
  Upload, 
  PenTool, 
  Sparkles, 
  Crown,
  Search,
  Plus,
  Image as ImageIcon,
  Flame,
  Star,
  CheckCircle,
  Wand2,
  Palette
} from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { TEMPLATES } from '../data/templates';
import { BRAND_KITS, STOCK_IMAGES } from '../data/brandKits';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    addShape,
    addText,
    addImage,
    loadTemplate,
    isPro,
    setShowProModal,
    isDrawing,
    toggleDrawingMode,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    fabricCanvas,
    saveHistoryState
  } = useDesign();

  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGeneratedText, setAiGeneratedText] = useState('');

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      addImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // AI Smart Text Generator (Marketing headlines, quotes, promo copy)
  const generateAiCopy = (theme) => {
    const samples = {
      sale: ['50% OFF EVERYTHING TODAY ONLY 🔥', 'FLASH SALE: CODE "PRO2026"', 'DON\'T MISS OUT ON DEALS'],
      motivation: ['DREAM BIG. WORK HARD. MAKE IT HAPPEN.', 'THE SECRET OF GETTING AHEAD IS GETTING STARTED.', 'DISCIPLINE BEATS MOTIVATION.'],
      tech: ['THE NEXT GENERATION OF INNOVATION 🚀', 'POWERED BY REVERSE ENGINEERING', 'BUILD FASTER WITH AI'],
      food: ['DELICIOUS CRAVINGS AWAIT 🍔', 'FRESH TASTE EVERY DAY', 'SWEET INDULGENCE FOR YOU']
    };
    const list = samples[theme] || samples.sale;
    const randomCopy = list[Math.floor(Math.random() * list.length)];
    setAiGeneratedText(randomCopy);
    addText('heading', randomCopy);
  };

  const navItems = [
    { id: 'templates', label: 'Design', icon: LayoutTemplate },
    { id: 'elements', label: 'Elements', icon: Shapes },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'uploads', label: 'Uploads', icon: Upload },
    { id: 'draw', label: 'Draw', icon: PenTool },
    { id: 'brand', label: 'Brand Kit', icon: Palette, isPro: true },
    { id: 'magic', label: 'AI Magic', icon: Sparkles, isPro: true },
  ];

  return (
    <div className="flex h-full select-none z-10 shrink-0">
      {/* Tab Navigation Rail */}
      <div className="w-18 bg-[#0e131f] text-gray-400 flex flex-col items-center py-3 space-y-4 shrink-0 border-r border-gray-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'draw') {
                  toggleDrawingMode(true);
                } else if (isDrawing) {
                  toggleDrawingMode(false);
                }
              }}
              className={`w-14 py-2.5 flex flex-col items-center justify-center rounded-xl transition relative ${
                isActive 
                  ? 'bg-white/10 text-white font-bold' 
                  : 'hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.isPro && (
                <Crown className="w-3 h-3 text-yellow-400 fill-yellow-400 absolute top-1.5 right-1.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded Sub-Panel */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm overflow-hidden shrink-0">
        {/* Panel Header */}
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-sm capitalize flex items-center space-x-1.5">
            <span>{navItems.find(i => i.id === activeTab)?.label}</span>
            {navItems.find(i => i.id === activeTab)?.isPro && (
              <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-1">
                <Crown className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span>PRO</span>
              </span>
            )}
          </h2>
        </div>

        {/* Panel Content based on Active Tab */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 font-medium">Click any template to apply:</div>
              <div className="grid grid-cols-1 gap-3">
                {TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => loadTemplate(tmpl)}
                    className="group relative rounded-xl overflow-hidden border border-gray-200 hover:border-purple-500 hover:shadow-md cursor-pointer transition bg-gray-50"
                  >
                    <img 
                      src={tmpl.thumbnail} 
                      alt={tmpl.name} 
                      className="w-full h-36 object-cover group-hover:scale-105 transition duration-300" 
                    />
                    <div className="p-2.5 bg-white flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-gray-900">{tmpl.name}</div>
                        <div className="text-[10px] text-gray-500">{tmpl.category} • {tmpl.canvasSize.width}x{tmpl.canvasSize.height}</div>
                      </div>
                      {tmpl.isPro && (
                        <div className="bg-gradient-to-r from-amber-400 to-yellow-400 p-1 rounded-full text-purple-950 shadow-sm" title="Canva Pro Template">
                          <Crown className="w-3 h-3 fill-purple-950" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ELEMENTS / SHAPES */}
          {activeTab === 'elements' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Basic Shapes</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => addShape('rect')}
                    className="h-20 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400 rounded-lg flex flex-col items-center justify-center transition"
                  >
                    <div className="w-9 h-7 bg-indigo-500 rounded-sm mb-1" />
                    <span className="text-[11px] font-medium text-gray-600">Rectangle</span>
                  </button>
                  <button
                    onClick={() => addShape('circle')}
                    className="h-20 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400 rounded-lg flex flex-col items-center justify-center transition"
                  >
                    <div className="w-8 h-8 bg-pink-500 rounded-full mb-1" />
                    <span className="text-[11px] font-medium text-gray-600">Circle</span>
                  </button>
                  <button
                    onClick={() => addShape('triangle')}
                    className="h-20 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400 rounded-lg flex flex-col items-center justify-center transition"
                  >
                    <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-amber-500 mb-1" />
                    <span className="text-[11px] font-medium text-gray-600">Triangle</span>
                  </button>
                  <button
                    onClick={() => addShape('star')}
                    className="h-20 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400 rounded-lg flex flex-col items-center justify-center transition"
                  >
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 mb-1" />
                    <span className="text-[11px] font-medium text-gray-600">Star</span>
                  </button>
                  <button
                    onClick={() => addShape('badge')}
                    className="h-20 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400 rounded-lg flex flex-col items-center justify-center transition"
                  >
                    <div className="w-12 h-6 bg-red-500 rounded-full mb-1" />
                    <span className="text-[11px] font-medium text-gray-600">Pill Badge</span>
                  </button>
                  <button
                    onClick={() => addShape('line')}
                    className="h-20 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400 rounded-lg flex flex-col items-center justify-center transition"
                  >
                    <div className="w-12 h-1 bg-gray-700 mb-1" />
                    <span className="text-[11px] font-medium text-gray-600">Line</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Stickers & Badges</span>
                  <span className="text-[10px] text-purple-600 font-semibold">Pro Unlocked</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => addText('neon', '🔥 50% OFF')}
                    className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer text-center font-black text-red-600 text-xs transition"
                  >
                    🔥 50% OFF
                  </div>
                  <div
                    onClick={() => addText('neon', '✨ BESTSELLER')}
                    className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg cursor-pointer text-center font-black text-amber-700 text-xs transition"
                  >
                    ✨ BESTSELLER
                  </div>
                  <div
                    onClick={() => addText('neon', '🚀 NEW ARRIVAL')}
                    className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer text-center font-black text-blue-700 text-xs transition"
                  >
                    🚀 NEW ARRIVAL
                  </div>
                  <div
                    onClick={() => addText('neon', '⭐ 5-STAR RATED')}
                    className="p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg cursor-pointer text-center font-black text-green-700 text-xs transition"
                  >
                    ⭐ 5-STAR RATED
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEXT */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <button
                  onClick={() => addText('heading')}
                  className="w-full py-3 px-4 bg-gray-100 hover:bg-purple-50 hover:border-purple-400 border border-gray-200 rounded-xl text-left font-extrabold text-xl text-gray-900 transition"
                >
                  Add a heading
                </button>
                <button
                  onClick={() => addText('subheading')}
                  className="w-full py-2.5 px-4 bg-gray-100 hover:bg-purple-50 hover:border-purple-400 border border-gray-200 rounded-xl text-left font-semibold text-sm text-gray-700 transition"
                >
                  Add a subheading
                </button>
                <button
                  onClick={() => addText('body')}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-purple-50 hover:border-purple-400 border border-gray-200 rounded-xl text-left font-normal text-xs text-gray-500 transition"
                >
                  Add a little bit of body text
                </button>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Font Combinations</span>
                  <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                </h3>
                <div className="space-y-2">
                  <div
                    onClick={() => addText('neon', 'CYBER GLOW')}
                    className="p-3 bg-slate-900 rounded-lg cursor-pointer text-center text-cyan-400 font-black tracking-widest hover:brightness-125 transition shadow-sm"
                  >
                    CYBER GLOW
                  </div>
                  <div
                    onClick={() => addText('vintage', 'ELEGANT LUXURY')}
                    className="p-3 bg-amber-50 rounded-lg cursor-pointer text-center text-amber-900 font-serif italic font-bold tracking-wider hover:bg-amber-100 transition border border-amber-200"
                  >
                    ELEGANT LUXURY
                  </div>
                  <div
                    onClick={() => addText('heading', 'BOLD IMPACT', { fontFamily: 'Anton', fill: '#dc2626' })}
                    className="p-3 bg-red-50 rounded-lg cursor-pointer text-center text-red-600 font-black text-xl hover:bg-red-100 transition border border-red-200"
                  >
                    BOLD IMPACT
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UPLOADS & STOCK IMAGES */}
          {activeTab === 'uploads' && (
            <div className="space-y-4">
              {/* Upload Button */}
              <label className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl cursor-pointer flex items-center justify-center space-x-2 font-bold text-xs shadow-md transition">
                <Upload className="w-4 h-4" />
                <span>Upload Media (PNG, JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Free Stock Photos */}
              <div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Free HD Stock Photos</span>
                  <span className="text-[10px] text-gray-400">Unsplash</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {STOCK_IMAGES.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => addImage(img.url)}
                      className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-purple-500 cursor-pointer aspect-square bg-gray-100"
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition">
                        Insert
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DRAW (FREEHAND BRUSH) */}
          {activeTab === 'draw' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                ✏️ <b>Drawing Mode Active:</b> Click and drag freely on the canvas to draw sketches or annotations.
              </div>

              <div>
                <span className="text-xs font-bold text-gray-700">Brush Color:</span>
                <div className="flex items-center space-x-2 mt-2">
                  {['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#0f172a', '#ffffff'].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setBrushColor(c);
                        if (fabricCanvas && fabricCanvas.freeDrawingBrush) {
                          fabricCanvas.freeDrawingBrush.color = c;
                        }
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition ${brushColor === c ? 'border-purple-600 scale-110 shadow' : 'border-gray-200'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => {
                      setBrushColor(e.target.value);
                      if (fabricCanvas && fabricCanvas.freeDrawingBrush) {
                        fabricCanvas.freeDrawingBrush.color = e.target.value;
                      }
                    }}
                    className="w-7 h-7 rounded-full cursor-pointer border border-gray-300"
                    title="Custom Color"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Brush Size:</span>
                  <span>{brushSize}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={brushSize}
                  onChange={(e) => {
                    const sz = parseInt(e.target.value);
                    setBrushSize(sz);
                    if (fabricCanvas && fabricCanvas.freeDrawingBrush) {
                      fabricCanvas.freeDrawingBrush.width = sz;
                    }
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 6: BRAND KIT (PRO) */}
          {activeTab === 'brand' && (
            <div className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                <Crown className="w-4 h-4 text-yellow-600 fill-yellow-500 shrink-0 mt-0.5" />
                <span><b>Canva Pro Brand Kits:</b> Apply curated designer color palettes to your document in 1 click.</span>
              </div>

              <div className="space-y-3">
                {BRAND_KITS.map((kit) => (
                  <div
                    key={kit.id}
                    onClick={() => {
                      if (!fabricCanvas) return;
                      // Apply first color as canvas background
                      fabricCanvas.backgroundColor = kit.colors[0];
                      fabricCanvas.renderAll();
                      saveHistoryState(fabricCanvas);
                    }}
                    className="p-3 border border-gray-200 hover:border-purple-500 rounded-xl cursor-pointer bg-gray-50 hover:bg-purple-50/40 transition space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span>{kit.name}</span>
                      {kit.isPro && <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <div className="flex rounded-lg overflow-hidden h-7 border border-gray-200">
                      {kit.colors.map((clr, idx) => (
                        <div
                          key={idx}
                          className="flex-1 hover:opacity-90"
                          style={{ backgroundColor: clr }}
                          title={`Color: ${clr}`}
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Recommended: {kit.headingFont} + {kit.bodyFont}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AI MAGIC STUDIO (PRO) */}
          {activeTab === 'magic' && (
            <div className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                <div className="font-bold flex items-center space-x-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Magic Studio Pro</span>
                </div>
                Generate marketing headlines, slogans, and copy directly into your canvas design.
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  1-Click AI Copy Presets:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => generateAiCopy('sale')}
                    className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-semibold text-red-700 transition"
                  >
                    🔥 Flash Sale Copy
                  </button>
                  <button
                    onClick={() => generateAiCopy('motivation')}
                    className="p-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700 transition"
                  >
                    💡 Motivation Quote
                  </button>
                  <button
                    onClick={() => generateAiCopy('tech')}
                    className="p-2.5 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg text-xs font-semibold text-cyan-800 transition"
                  >
                    🚀 Tech Launch
                  </button>
                  <button
                    onClick={() => generateAiCopy('food')}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800 transition"
                  >
                    🍔 Food & Cafe
                  </button>
                </div>
              </div>

              {aiGeneratedText && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-900 flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Added to canvas: <i>"{aiGeneratedText}"</i></span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
