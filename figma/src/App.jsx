import React from 'react';
import { FigmaProvider } from './context/FigmaContext';
import FigmaTopNav from './components/FigmaTopNav';
import FigmaLeftPanel from './components/FigmaLeftPanel';
import FigmaCanvas from './components/FigmaCanvas';
import FigmaRightPanel from './components/FigmaRightPanel';
import FigmaPrototypeModal from './components/FigmaPrototypeModal';
import FigmaVersionHistoryModal from './components/FigmaVersionHistoryModal';
import FigmaProModal from './components/FigmaProModal';

export default function App() {
  return (
    <FigmaProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1e1e1e] select-none text-white">
        {/* Top Figma Navigation Bar */}
        <FigmaTopNav />

        {/* Main 3-Column Layout: Left Layers/Pages + Infinite Canvas + Right Properties/DevMode */}
        <div className="flex-1 flex overflow-hidden relative">
          <FigmaLeftPanel />
          <FigmaCanvas />
          <FigmaRightPanel />
        </div>

        {/* Global Figma Pro Modals */}
        <FigmaPrototypeModal />
        <FigmaVersionHistoryModal />
        <FigmaProModal />
      </div>
    </FigmaProvider>
  );
}
