import React, { useState } from 'react';
import { 
  Layers, 
  Component, 
  Plus, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Frame, 
  Square, 
  Circle, 
  Type, 
  ChevronRight, 
  ChevronDown,
  Crown
} from 'lucide-react';
import { useFigma } from '../context/FigmaContext';

export default function FigmaLeftPanel() {
  const {
    pages,
    activePageId,
    setActivePageId,
    addPage,
    currentPage,
    selectedId,
    setSelectedId,
    addComponent,
  } = useFigma();

  const [panelTab, setPanelTab] = useState('layers'); // 'layers' | 'assets'
  const [newPageName, setNewPageName] = useState('');
  const [showAddPageInput, setShowAddPageInput] = useState(false);

  const handleCreatePage = (e) => {
    e.preventDefault();
    if (!newPageName.trim()) return;
    addPage(newPageName.trim());
    setNewPageName('');
    setShowAddPageInput(false);
  };

  const getElementIcon = (type) => {
    switch (type) {
      case 'frame': return <Frame className="w-3.5 h-3.5 text-gray-400" />;
      case 'component': return <Component className="w-3.5 h-3.5 text-purple-400" />;
      case 'text': return <Type className="w-3.5 h-3.5 text-gray-400" />;
      case 'circle': return <Circle className="w-3.5 h-3.5 text-gray-400" />;
      default: return <Square className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <aside className="w-64 bg-[#222222] border-r border-[#333333] flex flex-col h-full select-none text-gray-300 text-xs shrink-0 z-10">
      {/* 1. PAGES SECTION (Figma Pro Unlimited Pages) */}
      <div className="border-b border-[#333333] p-2.5">
        <div className="flex items-center justify-between text-gray-400 font-bold text-[11px] uppercase tracking-wider mb-2">
          <div className="flex items-center space-x-1">
            <span>Pages</span>
            <span className="bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded text-[9px] font-bold">PRO</span>
          </div>
          <button
            onClick={() => setShowAddPageInput(!showAddPageInput)}
            className="p-1 hover:bg-white/10 rounded text-gray-300 hover:text-white"
            title="Add Page (Figma Pro Unlimited)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Page List */}
        <div className="space-y-1">
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={`px-2.5 py-1.5 rounded-md cursor-pointer transition flex items-center justify-between ${
                activePageId === page.id
                  ? 'bg-[#0d99ff] text-white font-semibold'
                  : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <span className="truncate">{page.name}</span>
            </div>
          ))}
        </div>

        {/* Add Page Input */}
        {showAddPageInput && (
          <form onSubmit={handleCreatePage} className="mt-2 flex items-center space-x-1">
            <input
              type="text"
              autoFocus
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="New Page Name..."
              className="w-full bg-[#1e1e1e] border border-[#444] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#0d99ff]"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-[#0d99ff] text-white font-bold rounded text-xs"
            >
              Add
            </button>
          </form>
        )}
      </div>

      {/* 2. TAB TOGGLE (Layers vs Assets) */}
      <div className="flex border-b border-[#333333]">
        <button
          onClick={() => setPanelTab('layers')}
          className={`flex-1 py-2 font-semibold text-center transition ${
            panelTab === 'layers'
              ? 'text-white border-b-2 border-[#0d99ff] bg-white/5'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Layers
        </button>
        <button
          onClick={() => setPanelTab('assets')}
          className={`flex-1 py-2 font-semibold text-center transition flex items-center justify-center space-x-1 ${
            panelTab === 'assets'
              ? 'text-white border-b-2 border-[#0d99ff] bg-white/5'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>Assets</span>
          <Crown className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        </button>
      </div>

      {/* 3. LAYERS TREE VIEW */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {panelTab === 'layers' && (
          <div>
            {currentPage.elements.map((element) => {
              const isSelected = selectedId === element.id;
              return (
                <div key={element.id} className="space-y-0.5">
                  {/* Root Element / Frame */}
                  <div
                    onClick={() => setSelectedId(element.id)}
                    className={`px-2 py-1.5 rounded-md cursor-pointer flex items-center justify-between group transition ${
                      isSelected ? 'bg-[#0d99ff] text-white font-semibold' : 'hover:bg-white/5 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {getElementIcon(element.type)}
                      <span className="truncate">{element.name}</span>
                    </div>
                  </div>

                  {/* Nested Children (if Frame) */}
                  {element.children && (
                    <div className="pl-4 space-y-0.5 border-l border-[#333333] ml-2">
                      {element.children.map((child) => {
                        const isChildSelected = selectedId === child.id;
                        return (
                          <div
                            key={child.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(child.id);
                            }}
                            className={`px-2 py-1 rounded-md cursor-pointer flex items-center justify-between text-[11px] transition ${
                              isChildSelected ? 'bg-[#0d99ff] text-white font-semibold' : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              {getElementIcon(child.type)}
                              <span className="truncate">{child.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 4. ASSETS / COMPONENT LIBRARY (PRO) */}
        {panelTab === 'assets' && (
          <div className="space-y-3 p-1">
            <div className="text-[11px] text-gray-400 font-medium">
              Reusable Design System Components:
            </div>

            <div
              onClick={addComponent}
              className="p-3 bg-[#1e1e1e] hover:bg-[#282828] border border-[#383838] hover:border-purple-500 rounded-xl cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                  <Component className="w-3.5 h-3.5 text-purple-400" />
                  <span>Button / Primary ❖</span>
                </span>
                <span className="text-[10px] text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded">Master</span>
              </div>
              <div className="h-9 bg-[#0d99ff] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md">
                Insert Instance
              </div>
            </div>

            <div
              onClick={addComponent}
              className="p-3 bg-[#1e1e1e] hover:bg-[#282828] border border-[#383838] hover:border-purple-500 rounded-xl cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                  <Component className="w-3.5 h-3.5 text-purple-400" />
                  <span>Card / Metric Metric ❖</span>
                </span>
                <span className="text-[10px] text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded">Master</span>
              </div>
              <div className="h-16 bg-[#27272a] rounded-lg border border-[#3f3f46] p-2 flex flex-col justify-between">
                <div className="w-16 h-3 bg-gray-600 rounded" />
                <div className="w-24 h-4 bg-purple-400 rounded" />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
