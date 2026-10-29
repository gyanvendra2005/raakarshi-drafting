import React from 'react';
import { CadProvider, useCad } from './context/CadContext';
import CadRibbon from './components/CadRibbon';
import CadViewport from './components/CadViewport';
import CadViewport3D from './components/CadViewport3D';
import CadCommandLine from './components/CadCommandLine';
import CadStatusBar from './components/CadStatusBar';
import CadLayerModal from './components/CadLayerModal';
import CadBlockModal from './components/CadBlockModal';

function CadMainArea() {
  const { viewMode } = useCad();

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {viewMode === '3D' ? <CadViewport3D /> : <CadViewport />}
    </div>
  );
}

export default function App() {
  return (
    <CadProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#212121] select-none text-white">
        {/* Top AutoCAD Ribbon Toolbar */}
        <CadRibbon />

        {/* Central Viewport: Dynamic Switch between 2D Drafting and 3D Modeling Engine */}
        <CadMainArea />

        {/* AutoCAD Command Line Console Prompt */}
        <CadCommandLine />

        {/* Bottom AutoCAD Status Bar (GRID, ORTHO, OSNAP, DYN) */}
        <CadStatusBar />

        {/* Global Modals */}
        <CadLayerModal />
        <CadBlockModal />
      </div>
    </CadProvider>
  );
}
