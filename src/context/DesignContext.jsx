import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { TEMPLATES } from '../data/templates';

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [activeTab, setActiveTab] = useState('templates');
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080, name: 'Instagram Post' });
  const [zoom, setZoom] = useState(0.45);
  const [isPro, setIsPro] = useState(true); // Default enabled so user has all Canva Pro features right away
  const [showProModal, setShowProModal] = useState(false);
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(5);
  const [projectName, setProjectName] = useState('My Awesome Design');
  
  // History for Undo / Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isHistoryAction = useRef(false);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selectionColor: 'rgba(99, 102, 241, 0.15)',
      selectionBorderColor: '#6366f1',
      selectionLineWidth: 1.5,
    });

    // Custom control styling (Canva style purple controls)
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = '#6366f1';
    fabric.Object.prototype.cornerStrokeColor = '#ffffff';
    fabric.Object.prototype.borderColor = '#6366f1';
    fabric.Object.prototype.cornerSize = 10;
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderScaleFactor = 2;

    // Selection event listeners
    canvas.on('selection:created', (e) => setActiveObject(e.selected[0]));
    canvas.on('selection:updated', (e) => setActiveObject(e.selected[0]));
    canvas.on('selection:cleared', () => setActiveObject(null));

    // History tracking
    canvas.on('object:modified', () => saveHistoryState(canvas));
    canvas.on('object:added', () => {
      if (!isHistoryAction.current) saveHistoryState(canvas);
    });

    setFabricCanvas(canvas);

    // Initial default template load
    setTimeout(() => {
      loadTemplateData(canvas, TEMPLATES[0]);
    }, 100);

    return () => {
      canvas.dispose();
    };
  }, []);

  // History State Saver
  const saveHistoryState = (canvas) => {
    if (!canvas || isHistoryAction.current) return;
    const json = JSON.stringify(canvas.toJSON());
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      return [...updated, json];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const undo = () => {
    if (!fabricCanvas || historyIndex <= 0) return;
    isHistoryAction.current = true;
    const prevIndex = historyIndex - 1;
    const json = history[prevIndex];
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll();
      setHistoryIndex(prevIndex);
      isHistoryAction.current = false;
    });
  };

  const redo = () => {
    if (!fabricCanvas || historyIndex >= history.length - 1) return;
    isHistoryAction.current = true;
    const nextIndex = historyIndex + 1;
    const json = history[nextIndex];
    fabricCanvas.loadFromJSON(json, () => {
      fabricCanvas.renderAll();
      setHistoryIndex(nextIndex);
      isHistoryAction.current = false;
    });
  };

  // Template loader
  const loadTemplateData = (canvas, template) => {
    if (!canvas || !template) return;
    canvas.clear();
    setCanvasSize({ ...template.canvasSize, name: template.name });
    canvas.setWidth(template.canvasSize.width);
    canvas.setHeight(template.canvasSize.height);

    template.elements.forEach((el) => {
      if (el.type === 'rect') {
        const rect = new fabric.Rect({
          left: el.left,
          top: el.top,
          width: el.width,
          height: el.height,
          fill: el.fill || 'transparent',
          stroke: el.stroke,
          strokeWidth: el.strokeWidth || 0,
          rx: el.rx || 0,
          ry: el.ry || 0,
          angle: el.angle || 0,
        });
        canvas.add(rect);
      } else if (el.type === 'circle') {
        const circle = new fabric.Circle({
          left: el.left,
          top: el.top,
          radius: el.radius,
          fill: el.fill,
          originX: 'center',
          originY: 'center',
        });
        canvas.add(circle);
      } else if (el.type === 'i-text') {
        const text = new fabric.IText(el.text, {
          left: el.left,
          top: el.top,
          fontSize: el.fontSize || 36,
          fill: el.fill || '#000000',
          fontWeight: el.fontWeight || 'normal',
          fontFamily: el.fontFamily || 'Inter',
          textAlign: el.textAlign || 'left',
          originX: el.originX || 'left',
          charSpacing: el.letterSpacing ? el.letterSpacing * 10 : 0,
        });
        canvas.add(text);
      } else if (el.type === 'line') {
        const line = new fabric.Line([el.x1, el.y1, el.x2, el.y2], {
          stroke: el.stroke || '#000000',
          strokeWidth: el.strokeWidth || 2,
        });
        canvas.add(line);
      }
    });

    canvas.renderAll();
    saveHistoryState(canvas);
  };

  const loadTemplate = (template) => {
    if (!fabricCanvas) return;
    if (template.isPro && !isPro) {
      setShowProModal(true);
      return;
    }
    loadTemplateData(fabricCanvas, template);
  };

  // Add Elements
  const addShape = (shapeType) => {
    if (!fabricCanvas) return;
    let shape;
    const center = fabricCanvas.getCenter();

    switch (shapeType) {
      case 'rect':
        shape = new fabric.Rect({
          left: center.left,
          top: center.top,
          width: 200,
          height: 140,
          fill: '#6366f1',
          originX: 'center',
          originY: 'center',
          rx: 8,
          ry: 8,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: center.left,
          top: center.top,
          radius: 90,
          fill: '#ec4899',
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          left: center.left,
          top: center.top,
          width: 180,
          height: 160,
          fill: '#f59e0b',
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'star':
        // Star polygon
        const points = [
          { x: 100, y: 10 }, { x: 120, y: 70 }, { x: 180, y: 70 },
          { x: 130, y: 110 }, { x: 150, y: 170 }, { x: 100, y: 130 },
          { x: 50, y: 170 }, { x: 70, y: 110 }, { x: 20, y: 70 }, { x: 80, y: 70 }
        ];
        shape = new fabric.Polygon(points, {
          left: center.left,
          top: center.top,
          fill: '#fbbf24',
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'badge':
        shape = new fabric.Rect({
          left: center.left,
          top: center.top,
          width: 180,
          height: 60,
          fill: '#ef4444',
          rx: 30,
          ry: 30,
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'line':
        shape = new fabric.Line([center.left - 120, center.top, center.left + 120, center.top], {
          stroke: '#64748b',
          strokeWidth: 4,
          originX: 'center',
          originY: 'center',
        });
        break;
      default:
        break;
    }

    if (shape) {
      fabricCanvas.add(shape);
      fabricCanvas.setActiveObject(shape);
      fabricCanvas.renderAll();
      saveHistoryState(fabricCanvas);
    }
  };

  // Add Text
  const addText = (preset = 'heading', customText = null, customProps = {}) => {
    if (!fabricCanvas) return;
    const center = fabricCanvas.getCenter();
    let textStr = customText || 'Add a Heading';
    let fontSize = 48;
    let fontWeight = 'bold';
    let fontFamily = 'Montserrat';
    let fill = '#0f172a';

    if (preset === 'subheading') {
      textStr = customText || 'Add a Subheading';
      fontSize = 32;
      fontWeight = '600';
      fontFamily = 'Inter';
      fill = '#334155';
    } else if (preset === 'body') {
      textStr = customText || 'Add a little bit of body text. Click here to edit anything.';
      fontSize = 20;
      fontWeight = 'normal';
      fontFamily = 'Inter';
      fill = '#64748b';
    } else if (preset === 'neon') {
      textStr = customText || 'GLOW EFFECT';
      fontSize = 54;
      fontWeight = 'bold';
      fontFamily = 'Anton';
      fill = '#06b6d4';
      customProps.shadow = new fabric.Shadow({
        color: '#06b6d4',
        blur: 25,
        offsetX: 0,
        offsetY: 0,
      });
    } else if (preset === 'vintage') {
      textStr = customText || 'ESTABLISHED 2026';
      fontSize = 40;
      fontWeight = 'bold';
      fontFamily = 'Playfair Display';
      fill = '#b45309';
    }

    const textObj = new fabric.IText(textStr, {
      left: center.left,
      top: center.top,
      fontSize,
      fontWeight,
      fontFamily,
      fill,
      originX: 'center',
      originY: 'center',
      ...customProps,
    });

    fabricCanvas.add(textObj);
    fabricCanvas.setActiveObject(textObj);
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
  };

  // Add Image from URL or uploaded file
  const addImage = (url) => {
    if (!fabricCanvas) return;
    fabric.Image.fromURL(url, (img) => {
      const center = fabricCanvas.getCenter();
      // Scale image to fit nicely within canvas
      const maxDim = Math.min(fabricCanvas.width, fabricCanvas.height) * 0.55;
      const scale = Math.min(maxDim / img.width, maxDim / img.height);
      
      img.set({
        left: center.left,
        top: center.top,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        crossOrigin: 'anonymous',
      });

      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      saveHistoryState(fabricCanvas);
    }, { crossOrigin: 'anonymous' });
  };

  // AI Magic Background Remover (Client-side Alpha Keying / Pro Feature)
  const removeImageBackground = () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    if (!activeObject || activeObject.type !== 'image') return;

    const img = activeObject;
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    const element = img.getElement();
    tempCanvas.width = element.naturalWidth || element.width;
    tempCanvas.height = element.naturalHeight || element.height;
    ctx.drawImage(element, 0, 0);

    const imgData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imgData.data;

    // Detect corner pixel as background color reference
    const r0 = data[0], g0 = data[1], b0 = data[2];
    const tolerance = 45;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const dist = Math.sqrt(
        (r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2
      );
      // Also remove pure white or ultra-light backgrounds
      const isWhite = r > 235 && g > 235 && b > 235;
      if (dist < tolerance || isWhite) {
        data[i + 3] = 0; // Transparent alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const newUrl = tempCanvas.toDataURL('image/png');

    fabric.Image.fromURL(newUrl, (newImg) => {
      newImg.set({
        left: img.left,
        top: img.top,
        scaleX: img.scaleX,
        scaleY: img.scaleY,
        originX: img.originX,
        originY: img.originY,
        angle: img.angle,
      });
      fabricCanvas.remove(img);
      fabricCanvas.add(newImg);
      fabricCanvas.setActiveObject(newImg);
      fabricCanvas.renderAll();
      saveHistoryState(fabricCanvas);
    });
  };

  // Image Filters (Brightness, Contrast, Grayscale, Sepia, Invert, Blur)
  const applyImageFilter = (filterName, value) => {
    if (!activeObject || activeObject.type !== 'image') return;
    
    // Clear old filter of same type if any
    activeObject.filters = activeObject.filters.filter(f => f.type.toLowerCase() !== filterName.toLowerCase());

    if (filterName === 'grayscale' && value) {
      activeObject.filters.push(new fabric.Image.filters.Grayscale());
    } else if (filterName === 'sepia' && value) {
      activeObject.filters.push(new fabric.Image.filters.Sepia());
    } else if (filterName === 'invert' && value) {
      activeObject.filters.push(new fabric.Image.filters.Invert());
    } else if (filterName === 'brightness') {
      activeObject.filters.push(new fabric.Image.filters.Brightness({ brightness: value }));
    } else if (filterName === 'contrast') {
      activeObject.filters.push(new fabric.Image.filters.Contrast({ contrast: value }));
    } else if (filterName === 'blur') {
      activeObject.filters.push(new fabric.Image.filters.Blur({ blur: value }));
    }

    activeObject.applyFilters();
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
  };

  // Pro Magic Resize (Auto-scales and re-centers all objects to new dimensions)
  const resizeCanvas = (newWidth, newHeight, name) => {
    if (!fabricCanvas) return;
    if (!isPro) {
      setShowProModal(true);
      return;
    }

    const scaleX = newWidth / fabricCanvas.width;
    const scaleY = newHeight / fabricCanvas.height;

    const objects = fabricCanvas.getObjects();
    objects.forEach((obj) => {
      obj.left = obj.left * scaleX;
      obj.top = obj.top * scaleY;
      obj.scaleX = obj.scaleX * scaleX;
      obj.scaleY = obj.scaleY * scaleY;
      obj.setCoords();
    });

    fabricCanvas.setWidth(newWidth);
    fabricCanvas.setHeight(newHeight);
    setCanvasSize({ width: newWidth, height: newHeight, name });
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
    setShowResizeModal(false);
  };

  // Delete Object
  const deleteActiveObject = () => {
    if (!fabricCanvas || !activeObject) return;
    fabricCanvas.remove(activeObject);
    fabricCanvas.discardActiveObject();
    setActiveObject(null);
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
  };

  // Duplicate Object
  const duplicateActiveObject = () => {
    if (!fabricCanvas || !activeObject) return;
    activeObject.clone((cloned) => {
      fabricCanvas.discardActiveObject();
      cloned.set({
        left: cloned.left + 25,
        top: cloned.top + 25,
        evented: true,
      });
      if (cloned.type === 'activeSelection') {
        cloned.canvas = fabricCanvas;
        cloned.forEachObject((obj) => fabricCanvas.add(obj));
        cloned.setCoords();
      } else {
        fabricCanvas.add(cloned);
      }
      fabricCanvas.setActiveObject(cloned);
      fabricCanvas.renderAll();
      saveHistoryState(fabricCanvas);
    });
  };

  // Layer Ordering
  const bringToFront = () => {
    if (!fabricCanvas || !activeObject) return;
    activeObject.bringToFront();
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
  };

  const sendToBack = () => {
    if (!fabricCanvas || !activeObject) return;
    activeObject.sendToBack();
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
  };

  const bringForward = () => {
    if (!fabricCanvas || !activeObject) return;
    activeObject.bringForward();
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
  };

  const sendBackward = () => {
    if (!fabricCanvas || !activeObject) return;
    activeObject.sendBackwards();
    fabricCanvas.renderAll();
    saveHistoryState(fabricCanvas);
  };

  // Toggle Freehand Drawing Mode
  const toggleDrawingMode = (enable = !isDrawing) => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = enable;
    setIsDrawing(enable);
    if (enable) {
      fabricCanvas.freeDrawingBrush.color = brushColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  };

  // Export functions (PNG, Transparent PNG, JPG, PDF, SVG)
  const exportCanvas = (format = 'png', options = {}) => {
    if (!fabricCanvas) return;

    if ((format === 'pdf' || format === 'svg' || options.transparent) && !isPro) {
      setShowProModal(true);
      return;
    }

    const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    if (format === 'png' || format === 'jpeg') {
      const originalBg = fabricCanvas.backgroundColor;
      if (options.transparent) {
        fabricCanvas.backgroundColor = null;
        fabricCanvas.renderAll();
      }

      const dataUrl = fabricCanvas.toDataURL({
        format: format === 'jpeg' ? 'jpeg' : 'png',
        quality: options.quality || 1.0,
        multiplier: options.multiplier || 1.0,
      });

      if (options.transparent) {
        fabricCanvas.backgroundColor = originalBg;
        fabricCanvas.renderAll();
      }

      const link = document.createElement('a');
      link.download = `${fileName}.${format === 'jpeg' ? 'jpg' : 'png'}`;
      link.href = dataUrl;
      link.click();
    } else if (format === 'svg') {
      const svg = fabricCanvas.toSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.svg`;
      link.click();
    } else if (format === 'pdf') {
      const dataUrl = fabricCanvas.toDataURL({ format: 'png', multiplier: 2.0 });
      const orientation = canvasSize.width >= canvasSize.height ? 'l' : 'p';
      const doc = new jsPDF(orientation, 'pt', [canvasSize.width, canvasSize.height]);
      doc.addImage(dataUrl, 'PNG', 0, 0, canvasSize.width, canvasSize.height);
      doc.save(`${fileName}.pdf`);
    }

    setShowExportModal(false);
  };

  // Pro Upgrade Trigger with Confetti Celebration
  const triggerProActivation = () => {
    setIsPro(true);
    setShowProModal(false);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <DesignContext.Provider
      value={{
        canvasRef,
        fabricCanvas,
        activeObject,
        setActiveObject,
        activeTab,
        setActiveTab,
        canvasSize,
        zoom,
        setZoom,
        isPro,
        setIsPro,
        showProModal,
        setShowProModal,
        showResizeModal,
        setShowResizeModal,
        showExportModal,
        setShowExportModal,
        isDrawing,
        brushColor,
        setBrushColor,
        brushSize,
        setBrushSize,
        toggleDrawingMode,
        projectName,
        setProjectName,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        addShape,
        addText,
        addImage,
        loadTemplate,
        deleteActiveObject,
        duplicateActiveObject,
        bringForward,
        sendBackward,
        bringToFront,
        sendToBack,
        resizeCanvas,
        exportCanvas,
        removeImageBackground,
        applyImageFilter,
        triggerProActivation,
        saveHistoryState,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => useContext(DesignContext);
