export const INITIAL_LAYERS = [
  { id: '0', name: '0', color: '#ffffff', visible: true, locked: false, lineweight: '0.25' },
  { id: 'walls', name: '0_WALLS', color: '#00ffff', visible: true, locked: false, lineweight: '0.35' },
  { id: 'doors', name: '0_DOORS', color: '#00ff00', visible: true, locked: false, lineweight: '0.25' },
  { id: 'windows', name: '0_WINDOWS', color: '#00a8ff', visible: true, locked: false, lineweight: '0.20' },
  { id: 'dims', name: '0_DIMENSIONS', color: '#ffff00', visible: true, locked: false, lineweight: '0.18' },
  { id: 'furniture', name: '0_FURNITURE', color: '#ff00ff', visible: true, locked: false, lineweight: '0.20' },
  { id: 'text', name: '0_TEXT', color: '#ffffff', visible: true, locked: false, lineweight: '0.25' },
  { id: 'hatch', name: '0_HATCH', color: '#ff9900', visible: true, locked: false, lineweight: '0.13' },
];

export const INITIAL_ENTITIES = [
  // OUTER WALLS (2BHK Apartment Plan)
  { id: 'w1', type: 'line', layer: 'walls', x1: 100, y1: 100, x2: 900, y2: 100 },
  { id: 'w2', type: 'line', layer: 'walls', x1: 900, y1: 100, x2: 900, y2: 700 },
  { id: 'w3', type: 'line', layer: 'walls', x1: 900, y1: 700, x2: 100, y2: 700 },
  { id: 'w4', type: 'line', layer: 'walls', x1: 100, y1: 700, x2: 100, y2: 100 },

  // INTERIOR PARTITION WALLS
  // Living Room & Kitchen separator
  { id: 'w5', type: 'line', layer: 'walls', x1: 520, y1: 100, x2: 520, y2: 420 },
  // Master Bedroom separator
  { id: 'w6', type: 'line', layer: 'walls', x1: 100, y1: 420, x2: 520, y2: 420 },
  // Bedroom 2 separator
  { id: 'w7', type: 'line', layer: 'walls', x1: 520, y1: 420, x2: 900, y2: 420 },
  // Bathroom enclosure
  { id: 'w8', type: 'line', layer: 'walls', x1: 400, y1: 420, x2: 400, y2: 700 },

  // WALL THICKNESS OFFSET LINES (200mm walls)
  { id: 'wo1', type: 'line', layer: 'walls', x1: 120, y1: 120, x2: 880, y2: 120 },
  { id: 'wo2', type: 'line', layer: 'walls', x1: 880, y1: 120, x2: 880, y2: 680 },
  { id: 'wo3', type: 'line', layer: 'walls', x1: 880, y1: 680, x2: 120, y2: 680 },
  { id: 'wo4', type: 'line', layer: 'walls', x1: 120, y1: 680, x2: 120, y2: 120 },

  // DOORS WITH SWING ARCS
  // Main Entry Door
  { id: 'd1', type: 'door', layer: 'doors', x: 260, y: 100, width: 80, angle: 90 },
  // Master Bed Door
  { id: 'd2', type: 'door', layer: 'doors', x: 440, y: 420, width: 70, angle: 0 },
  // Bed 2 Door
  { id: 'd3', type: 'door', layer: 'doors', x: 600, y: 420, width: 70, angle: 180 },

  // WINDOWS (Double lines with sill)
  { id: 'win1', type: 'window', layer: 'windows', x: 200, y: 100, width: 120, height: 20 },
  { id: 'win2', type: 'window', layer: 'windows', x: 700, y: 100, width: 140, height: 20 },
  { id: 'win3', type: 'window', layer: 'windows', x: 900, y: 260, width: 20, height: 120 },
  { id: 'win4', type: 'window', layer: 'windows', x: 900, y: 520, width: 20, height: 100 },

  // FURNITURE & FIXTURES
  // Living Room Sofa & Table
  { id: 'f1', type: 'rect', layer: 'furniture', x: 160, y: 180, width: 180, height: 70 },
  { id: 'f2', type: 'rect', layer: 'furniture', x: 190, y: 270, width: 120, height: 60 },
  // Master Bed (King Size)
  { id: 'f3', type: 'rect', layer: 'furniture', x: 160, y: 480, width: 180, height: 160 },
  // Bed 2 (Queen Size)
  { id: 'f4', type: 'rect', layer: 'furniture', x: 680, y: 480, width: 160, height: 150 },
  // Dining Table in Kitchen / Dining
  { id: 'f5', type: 'circle', layer: 'furniture', cx: 720, cy: 260, r: 60 },

  // DIMENSIONS (Measurement Leaders with mm annotations)
  { id: 'dim1', type: 'dim', layer: 'dims', x1: 100, y1: 70, x2: 900, y2: 70, text: '8000 mm', offset: -30 },
  { id: 'dim2', type: 'dim', layer: 'dims', x1: 930, y1: 100, x2: 930, y2: 700, text: '6000 mm', offset: 30 },
  { id: 'dim3', type: 'dim', layer: 'dims', x1: 100, y1: 730, x2: 400, y2: 730, text: '3000 mm', offset: 30 },
  { id: 'dim4', type: 'dim', layer: 'dims', x1: 400, y1: 730, x2: 900, y2: 730, text: '5000 mm', offset: 30 },

  // ROOM TEXT LABELS
  { id: 't1', type: 'text', layer: 'text', x: 300, y: 320, text: 'LIVING ROOM\n18\'-0" x 14\'-0"', size: 16 },
  { id: 't2', type: 'text', layer: 'text', x: 710, y: 330, text: 'KITCHEN & DINING\n14\'-0" x 12\'-0"', size: 15 },
  { id: 't3', type: 'text', layer: 'text', x: 260, y: 620, text: 'MASTER BEDROOM\n14\'-0" x 11\'-0"', size: 15 },
  { id: 't4', type: 'text', layer: 'text', x: 470, y: 620, text: 'TOILET / BATH\n6\'-0" x 8\'-0"', size: 13 },
  { id: 't5', type: 'text', layer: 'text', x: 740, y: 620, text: 'BEDROOM 2\n13\'-0" x 11\'-0"', size: 15 },

  // ARCHITECTURAL TITLEBLOCK STAMP
  { id: 'tb1', type: 'rect', layer: '0', x: 620, y: 760, width: 340, height: 90 },
  { id: 'tb2', type: 'text', layer: 'text', x: 635, y: 785, text: 'PROJECT: 2BHK RESIDENTIAL FLOOR PLAN\nSCALE: 1:100 | UNIT: MILLIMETERS\nDRAWN BY: AUTOCAD PRO ENTERPRISE', size: 11 },
];
