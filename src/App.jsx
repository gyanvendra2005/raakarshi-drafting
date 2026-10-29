import React from 'react';
import { DesignProvider } from './context/DesignContext';
import Navbar from './components/Navbar';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';
import ProModal from './components/ProModal';
import ResizeModal from './components/ResizeModal';
import ExportModal from './components/ExportModal';

export default function App() {
  return (
    <DesignProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 select-none">
        {/* Top Header Navbar */}
        <Navbar />

        {/* Dynamic Contextual Toolbar */}
        <Toolbar />

        {/* Main Work Area: Left Sidebar + Central Interactive Canvas */}
        <div className="flex-1 flex overflow-hidden relative">
          <Sidebar />
          <CanvasArea />
        </div>

        {/* Global Canva Pro Modals */}
        <ProModal />
        <ResizeModal />
        <ExportModal />
      </div>
    </DesignProvider>
  );
}
