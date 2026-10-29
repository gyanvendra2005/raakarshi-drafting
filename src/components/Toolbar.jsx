import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2, 
  Copy, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Wand2, 
  Crown,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useDesign } from '../context/DesignContext';

const FONTS = [
  'Inter', 
  'Montserrat', 
  'Playfair Display', 
  'Anton', 
  'Pacifico', 
  'Roboto'
];

export default function Toolbar() {
  const {
    activeObject,
    fabricCanvas,
    deleteActiveObject,
    duplicateActiveObject,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    removeImageBackground,
    applyImageFilter,
    saveHistoryState,
  } = useDesign();

  if (!activeObject) {
    return (
      <div className="h-11 bg-white border-b border-gray-200 px-4 flex items-center justify-between text-xs text-gray-500 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-600">Canvas Background:</span>
          <input
            type="color"
            defaultValue="#ffffff"
            onChange={(e) => {
              if (!fabricCanvas) return;
              fabricCanvas.backgroundColor = e.target.value;
              fabricCanvas.renderAll();
              saveHistoryState(fabricCanvas);
            }}
            className="w-6 h-6 rounded cursor-pointer border border-gray-300"
            title="Change canvas background color"
          />
        </div>
        <div className="text-gray-400 italic">
          Click any element on canvas to edit text, colors, layers, or apply AI tools
        </div>
      </div>
    );
  }

  const isText = activeObject.type === 'i-text' || activeObject.type === 'text';
  const isImage = activeObject.type === 'image';
  const isShape = !isText && !isImage;

  // Text property changers
  const updateTextProp = (prop, value) => {
    activeObject.set(prop, value);
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
  };

  // Shape property changers
  const updateShapeProp = (prop, value) => {
    activeObject.set(prop, value);
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
  };

  return (
    <div className="h-11 bg-white border-b border-gray-200 px-4 flex items-center justify-between text-xs shrink-0 select-none overflow-x-auto z-20">
      {/* Element-specific controls */}
      <div className="flex items-center space-x-3">
        {/* TEXT CONTROLS */}
        {isText && (
          <>
            {/* Font family */}
            <select
              value={activeObject.fontFamily || 'Inter'}
              onChange={(e) => updateTextProp('fontFamily', e.target.value)}
              className="h-8 px-2 border border-gray-300 rounded font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 outline-none"
            >
              {FONTS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>

            {/* Font size */}
            <div className="flex items-center border border-gray-300 rounded bg-gray-50 h-8">
              <button
                onClick={() => updateTextProp('fontSize', Math.max(10, (activeObject.fontSize || 36) - 4))}
                className="px-2 py-1 hover:bg-gray-200 text-gray-700 font-bold"
              >
                -
              </button>
              <span className="px-2 font-semibold text-gray-800">{Math.round(activeObject.fontSize || 36)}</span>
              <button
                onClick={() => updateTextProp('fontSize', (activeObject.fontSize || 36) + 4)}
                className="px-2 py-1 hover:bg-gray-200 text-gray-700 font-bold"
              >
                +
              </button>
            </div>

            {/* Font color */}
            <div className="flex items-center space-x-1" title="Text Color">
              <input
                type="color"
                value={typeof activeObject.fill === 'string' ? activeObject.fill : '#000000'}
                onChange={(e) => updateTextProp('fill', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-gray-300"
              />
            </div>

            {/* Bold / Italic / Underline */}
            <div className="flex items-center border border-gray-300 rounded h-8 bg-gray-50">
              <button
                onClick={() => updateTextProp('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold')}
                className={`p-1.5 hover:bg-gray-200 ${activeObject.fontWeight === 'bold' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateTextProp('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic')}
                className={`p-1.5 hover:bg-gray-200 ${activeObject.fontStyle === 'italic' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateTextProp('underline', !activeObject.underline)}
                className={`p-1.5 hover:bg-gray-200 ${activeObject.underline ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center border border-gray-300 rounded h-8 bg-gray-50">
              <button
                onClick={() => updateTextProp('textAlign', 'left')}
                className={`p-1.5 hover:bg-gray-200 ${activeObject.textAlign === 'left' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateTextProp('textAlign', 'center')}
                className={`p-1.5 hover:bg-gray-200 ${activeObject.textAlign === 'center' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateTextProp('textAlign', 'right')}
                className={`p-1.5 hover:bg-gray-200 ${activeObject.textAlign === 'right' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {/* SHAPE CONTROLS */}
        {isShape && (
          <>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 font-medium">Color:</span>
              <input
                type="color"
                value={typeof activeObject.fill === 'string' ? activeObject.fill : '#6366f1'}
                onChange={(e) => updateShapeProp('fill', e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-gray-300"
                title="Fill Color"
              />
            </div>

            <div className="flex items-center space-x-2 pl-2">
              <span className="text-gray-600 font-medium">Border:</span>
              <input
                type="color"
                value={activeObject.stroke || '#000000'}
                onChange={(e) => {
                  updateShapeProp('stroke', e.target.value);
                  if (!activeObject.strokeWidth) updateShapeProp('strokeWidth', 2);
                }}
                className="w-7 h-7 rounded cursor-pointer border border-gray-300"
                title="Stroke Color"
              />
              <input
                type="range"
                min="0"
                max="20"
                value={activeObject.strokeWidth || 0}
                onChange={(e) => updateShapeProp('strokeWidth', parseInt(e.target.value))}
                className="w-16 accent-purple-600 cursor-pointer"
                title="Border Width"
              />
            </div>
          </>
        )}

        {/* IMAGE CONTROLS & AI MAGIC (PRO) */}
        {isImage && (
          <div className="flex items-center space-x-2">
            <button
              onClick={removeImageBackground}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow hover:brightness-110 transition"
              title="Remove background using smart AI algorithm"
            >
              <Wand2 className="w-3.5 h-3.5 text-yellow-300" />
              <span>AI BG Remover</span>
              <Crown className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            </button>

            <div className="h-5 w-px bg-gray-300 mx-1" />

            <span className="text-gray-600 font-medium">Filter:</span>
            <button
              onClick={() => applyImageFilter('grayscale', true)}
              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            >
              B&W
            </button>
            <button
              onClick={() => applyImageFilter('sepia', true)}
              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            >
              Sepia
            </button>
            <button
              onClick={() => applyImageFilter('invert', true)}
              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            >
              Invert
            </button>
          </div>
        )}

        {/* Opacity slider */}
        <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
          <span className="text-gray-500 font-medium">Opacity:</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={activeObject.opacity || 1}
            onChange={(e) => {
              activeObject.set('opacity', parseFloat(e.target.value));
              fabricCanvas.renderAll();
              saveHistoryState(fabricCanvas);
            }}
            className="w-16 accent-purple-600 cursor-pointer"
            title="Opacity"
          />
        </div>
      </div>

      {/* Universal Controls: Layers, Duplicate, Delete */}
      <div className="flex items-center space-x-2 pl-4">
        {/* Layer reordering */}
        <div className="flex items-center border border-gray-300 rounded h-8 bg-gray-50">
          <button
            onClick={bringForward}
            className="p-1.5 hover:bg-gray-200 text-gray-700"
            title="Bring Forward"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={sendBackward}
            className="p-1.5 hover:bg-gray-200 text-gray-700"
            title="Send Backward"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={bringToFront}
            className="px-2 py-1 hover:bg-gray-200 text-[10px] font-bold text-gray-700"
            title="Bring to Front"
          >
            TOP
          </button>
          <button
            onClick={sendToBack}
            className="px-2 py-1 hover:bg-gray-200 text-[10px] font-bold text-gray-700"
            title="Send to Back"
          >
            BOTTOM
          </button>
        </div>

        {/* Duplicate */}
        <button
          onClick={duplicateActiveObject}
          className="p-2 border border-gray-300 rounded h-8 hover:bg-gray-100 text-gray-700"
          title="Duplicate Element"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          onClick={deleteActiveObject}
          className="p-2 border border-red-200 bg-red-50 hover:bg-red-100 rounded h-8 text-red-600"
          title="Delete Element"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
