import React, { createContext, useContext, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import { INITIAL_PAGES, DESIGN_TOKENS, VERSION_SNAPSHOTS } from '../data/initialProject';

const FigmaContext = createContext();

export const FigmaProvider = ({ children }) => {
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [activePageId, setActivePageId] = useState('page-website');
  const [selectedId, setSelectedId] = useState('frame-desktop-hero');
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'prototype' | 'inspect'
  const [isDevMode, setIsDevMode] = useState(false); // Pro Dev Mode toggle!
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'frame' | 'rect' | 'ellipse' | 'text' | 'hand'
  const [zoom, setZoom] = useState(0.65);
  const [pan, setPan] = useState({ x: 30, y: 20 });
  const [isPanning, setIsPanning] = useState(false);
  
  // Pro Modals
  const [showPrototypeModal, setShowPrototypeModal] = useState(false);
  const [prototypeCurrentFrameId, setPrototypeCurrentFrameId] = useState('frame-desktop-hero');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [isPro, setIsPro] = useState(true);
  const [historyList, setHistoryList] = useState(VERSION_SNAPSHOTS);

  // Undo / Redo history
  const [historyStack, setHistoryStack] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Helper to find selected element (can be root frame or child)
  const currentPage = pages.find((p) => p.id === activePageId) || pages[0];

  const findElementRecursive = (elements, id) => {
    for (const el of elements) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElementRecursive(el.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = findElementRecursive(currentPage.elements, selectedId);

  // Update properties of an element
  const updateSelected = (prop, value) => {
    if (!selectedId) return;

    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id !== activePageId) return page;

        const updateRecursive = (elements) => {
          return elements.map((el) => {
            if (el.id === selectedId) {
              return { ...el, [prop]: value };
            }
            if (el.children) {
              return { ...el, children: updateRecursive(el.children) };
            }
            return el;
          });
        };

        return { ...page, elements: updateRecursive(page.elements) };
      })
    );
  };

  // Update Auto Layout
  const updateAutoLayout = (prop, value) => {
    if (!selectedElement) return;
    const currentAutoLayout = selectedElement.autoLayout || {
      enabled: true,
      direction: 'column',
      gap: 16,
      padding: 16,
      justify: 'start',
      align: 'start',
    };
    updateSelected('autoLayout', { ...currentAutoLayout, [prop]: value });
  };

  // Add Page (Figma Pro Unlimited Pages)
  const addPage = (pageName) => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: pageName || `Page ${pages.length + 1}`,
      isProUnlimited: true,
      elements: [],
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
    setSelectedId(null);
  };

  // Add Frame (Presets: iPhone, Desktop, iPad)
  const addFrame = (preset = 'iphone') => {
    const presets = {
      iphone: { name: 'iPhone 16 Pro', width: 375, height: 680, radius: 44 },
      desktop: { name: 'Desktop 1440', width: 900, height: 600, radius: 12 },
      tablet: { name: 'iPad Pro 11"', width: 680, height: 500, radius: 20 },
      card: { name: 'Auto Layout Card', width: 340, height: 260, radius: 16 },
    };

    const cfg = presets[preset] || presets.iphone;
    const newFrame = {
      id: `frame-${Date.now()}`,
      type: 'frame',
      name: cfg.name,
      x: 100 + (currentPage.elements.length * 40),
      y: 100,
      width: cfg.width,
      height: cfg.height,
      fill: '#1e1e24',
      borderRadius: cfg.radius,
      stroke: '#334155',
      strokeWidth: 2,
      autoLayout: { enabled: true, direction: 'column', gap: 16, padding: 24, justify: 'start', align: 'stretch' },
      children: [],
    };

    setPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? { ...page, elements: [...page.elements, newFrame] }
          : page
      )
    );
    setSelectedId(newFrame.id);
  };

  // Add Shape to Canvas or to selected Frame
  const addShape = (shapeType) => {
    const newId = `shape-${Date.now()}`;
    const baseShape = {
      id: newId,
      type: shapeType,
      name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
      width: shapeType === 'circle' ? 80 : 120,
      height: shapeType === 'circle' ? 80 : 80,
      fill: shapeType === 'circle' ? '#ec4899' : '#0d99ff',
      borderRadius: shapeType === 'circle' ? 999 : 12,
    };

    // If a frame is selected, nest inside the frame
    if (selectedElement && selectedElement.type === 'frame') {
      const updatedChildren = [...(selectedElement.children || []), baseShape];
      updateSelected('children', updatedChildren);
      setSelectedId(newId);
      return;
    }

    // Otherwise add as root element
    baseShape.x = 200;
    baseShape.y = 200;
    setPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? { ...page, elements: [...page.elements, baseShape] }
          : page
      )
    );
    setSelectedId(newId);
  };

  // Add Text
  const addText = (textValue = 'Edit This Text') => {
    const newId = `text-${Date.now()}`;
    const textObj = {
      id: newId,
      type: 'text',
      name: 'Text Layer',
      text: textValue,
      fontSize: 20,
      fontWeight: '600',
      fontFamily: 'Inter',
      fill: '#ffffff',
      textAlign: 'left',
    };

    if (selectedElement && selectedElement.type === 'frame') {
      const updatedChildren = [...(selectedElement.children || []), textObj];
      updateSelected('children', updatedChildren);
      setSelectedId(newId);
      return;
    }

    textObj.x = 220;
    textObj.y = 220;
    setPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? { ...page, elements: [...page.elements, textObj] }
          : page
      )
    );
    setSelectedId(newId);
  };

  // Add Component (Figma Pro Master Component ❖)
  const addComponent = () => {
    const newId = `comp-${Date.now()}`;
    const compObj = {
      id: newId,
      type: 'component',
      name: 'Button Master ❖',
      width: 220,
      height: 48,
      fill: '#0d99ff',
      borderRadius: 14,
      text: 'Click Action ❖',
      dropShadow: { x: 0, y: 8, blur: 18, color: 'rgba(13, 153, 255, 0.4)' },
    };

    if (selectedElement && selectedElement.type === 'frame') {
      const updatedChildren = [...(selectedElement.children || []), compObj];
      updateSelected('children', updatedChildren);
      setSelectedId(newId);
      return;
    }

    compObj.x = 240;
    compObj.y = 240;
    setPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? { ...page, elements: [...page.elements, compObj] }
          : page
      )
    );
    setSelectedId(newId);
  };

  // Delete Selected Element
  const deleteSelected = () => {
    if (!selectedId) return;

    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id !== activePageId) return page;

        const deleteRecursive = (elements) => {
          return elements
            .filter((el) => el.id !== selectedId)
            .map((el) => {
              if (el.children) {
                return { ...el, children: deleteRecursive(el.children) };
              }
              return el;
            });
        };

        return { ...page, elements: deleteRecursive(page.elements) };
      })
    );
    setSelectedId(null);
  };

  // Duplicate Selected Element
  const duplicateSelected = () => {
    if (!selectedElement) return;
    const cloned = JSON.parse(JSON.stringify(selectedElement));
    cloned.id = `copy-${Date.now()}`;
    cloned.name = `${cloned.name} (Copy)`;
    if (cloned.x !== undefined) cloned.x += 30;
    if (cloned.y !== undefined) cloned.y += 30;

    // Check if it's a root element
    const isRoot = currentPage.elements.some((el) => el.id === selectedId);
    if (isRoot) {
      setPages((prev) =>
        prev.map((page) =>
          page.id === activePageId
            ? { ...page, elements: [...page.elements, cloned] }
            : page
        )
      );
    } else {
      // Find parent frame
      const addClonedToParent = (elements) => {
        return elements.map((el) => {
          if (el.children && el.children.some((c) => c.id === selectedId)) {
            return { ...el, children: [...el.children, cloned] };
          }
          if (el.children) {
            return { ...el, children: addClonedToParent(el.children) };
          }
          return el;
        });
      };

      setPages((prev) =>
        prev.map((page) =>
          page.id === activePageId
            ? { ...page, elements: addClonedToParent(page.elements) }
            : page
        )
      );
    }
    setSelectedId(cloned.id);
  };

  // Launch Interactive Prototype runner
  const startInteractivePrototype = (startFrameId = null) => {
    const target = startFrameId || (selectedElement?.type === 'frame' ? selectedElement.id : currentPage.elements.find(e => e.type === 'frame')?.id);
    if (target) {
      setPrototypeCurrentFrameId(target);
      setShowPrototypeModal(true);
    }
  };

  // Create Snapshot Version (Figma Pro Version History)
  const createVersionSnapshot = (title) => {
    const newVersion = {
      id: `v-${Date.now()}`,
      name: title || `Snapshot ${new Date().toLocaleTimeString()}`,
      timestamp: 'Just now',
      author: 'Alex (Lead Designer)',
      active: true,
    };
    setHistoryList((prev) => [newVersion, ...prev.map((v) => ({ ...v, active: false }))]);
    confetti({ particleCount: 50, spread: 60 });
  };

  // Export element code or asset
  const exportElement = (format = 'png') => {
    if (!selectedElement) return;

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text(`Figma Pro Export: ${selectedElement.name}`, 14, 20);
      doc.text(`Type: ${selectedElement.type} | Dimensions: ${selectedElement.width || 0}x${selectedElement.height || 0}`, 14, 30);
      doc.save(`${selectedElement.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } else if (format === 'svg') {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${selectedElement.width || 100}" height="${selectedElement.height || 100}"><rect width="100%" height="100%" fill="${selectedElement.fill || '#0d99ff'}" rx="${selectedElement.borderRadius || 0}" /></svg>`;
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedElement.name}.svg`;
      link.click();
    } else {
      // Notification
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  return (
    <FigmaContext.Provider
      value={{
        pages,
        activePageId,
        setActivePageId,
        currentPage,
        selectedId,
        setSelectedId,
        selectedElement,
        activeTab,
        setActiveTab,
        isDevMode,
        setIsDevMode,
        activeTool,
        setActiveTool,
        zoom,
        setZoom,
        pan,
        setPan,
        isPanning,
        setIsPanning,
        showPrototypeModal,
        setShowPrototypeModal,
        prototypeCurrentFrameId,
        setPrototypeCurrentFrameId,
        showVersionHistory,
        setShowVersionHistory,
        showProModal,
        setShowProModal,
        isPro,
        setIsPro,
        historyList,
        createVersionSnapshot,
        updateSelected,
        updateAutoLayout,
        addPage,
        addFrame,
        addShape,
        addText,
        addComponent,
        deleteSelected,
        duplicateSelected,
        startInteractivePrototype,
        exportElement,
      }}
    >
      {children}
    </FigmaContext.Provider>
  );
};

export const useFigma = () => useContext(FigmaContext);
