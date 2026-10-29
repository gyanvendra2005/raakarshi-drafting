// Standard AutoCAD ASCII DXF Exporter
export function exportToDXF(entities, layers, projectName = 'CAD_DRAWING') {
  let dxf = '';

  // 1. HEADER SECTION
  dxf += '0\nSECTION\n2\nHEADER\n';
  dxf += '9\n$ACADVER\n1\nAC1009\n'; // AutoCAD R12 DXF format (universally supported by all CAD tools)
  dxf += '9\n$INSUNITS\n70\n4\n'; // Millimeters
  dxf += '0\nENDSEC\n';

  // 2. TABLES SECTION (LAYERS)
  dxf += '0\nSECTION\n2\nTABLES\n';
  dxf += '0\nTABLE\n2\nLAYER\n70\n' + layers.length + '\n';
  layers.forEach((layer) => {
    dxf += '0\nLAYER\n';
    dxf += '2\n' + layer.name + '\n';
    dxf += '70\n0\n'; // Flags
    dxf += '62\n' + getAciColor(layer.color) + '\n'; // AutoCAD Color Index
    dxf += '6\nCONTINUOUS\n'; // Linetype
  });
  dxf += '0\nENDTAB\n';
  dxf += '0\nENDSEC\n';

  // 3. BLOCKS SECTION
  dxf += '0\nSECTION\n2\nBLOCKS\n';
  dxf += '0\nENDSEC\n';

  // 4. ENTITIES SECTION
  dxf += '0\nSECTION\n2\nENTITIES\n';

  entities.forEach((el) => {
    const layerName = layers.find((l) => l.id === el.layer)?.name || '0';

    if (el.type === 'line') {
      dxf += '0\nLINE\n';
      dxf += '8\n' + layerName + '\n';
      dxf += '10\n' + el.x1 + '\n20\n' + el.y1 + '\n30\n0.0\n';
      dxf += '11\n' + el.x2 + '\n21\n' + el.y2 + '\n31\n0.0\n';
    } else if (el.type === 'circle') {
      dxf += '0\nCIRCLE\n';
      dxf += '8\n' + layerName + '\n';
      dxf += '10\n' + el.cx + '\n20\n' + el.cy + '\n30\n0.0\n';
      dxf += '40\n' + el.r + '\n';
    } else if (el.type === 'rect') {
      // Decompose rectangle into 4 LINEs
      const x1 = el.x, y1 = el.y;
      const x2 = el.x + el.width, y2 = el.y + el.height;
      const lines = [
        { x1, y1, x2, y2: y1 },
        { x1: x2, y1, x2, y2 },
        { x1: x2, y1: y2, x2: x1, y2 },
        { x1, y1: y2, x2: x1, y2: y1 }
      ];
      lines.forEach(l => {
        dxf += '0\nLINE\n';
        dxf += '8\n' + layerName + '\n';
        dxf += '10\n' + l.x1 + '\n20\n' + l.y1 + '\n30\n0.0\n';
        dxf += '11\n' + l.x2 + '\n21\n' + l.y2 + '\n31\n0.0\n';
      });
    } else if (el.type === 'dim') {
      // Dimension representation in DXF
      dxf += '0\nLINE\n';
      dxf += '8\n' + layerName + '\n';
      dxf += '10\n' + el.x1 + '\n20\n' + el.y1 + '\n30\n0.0\n';
      dxf += '11\n' + el.x2 + '\n21\n' + el.y2 + '\n31\n0.0\n';

      dxf += '0\nTEXT\n';
      dxf += '8\n' + layerName + '\n';
      dxf += '10\n' + ((el.x1 + el.x2) / 2) + '\n20\n' + (el.y1 - 10) + '\n30\n0.0\n';
      dxf += '40\n14.0\n';
      dxf += '1\n' + el.text + '\n';
    } else if (el.type === 'text') {
      dxf += '0\nTEXT\n';
      dxf += '8\n' + layerName + '\n';
      dxf += '10\n' + el.x + '\n20\n' + el.y + '\n30\n0.0\n';
      dxf += '40\n' + (el.size || 14) + '\n';
      dxf += '1\n' + el.text.replace(/\n/g, ' ') + '\n';
    }
  });

  dxf += '0\nENDSEC\n';
  dxf += '0\nEOF\n';

  // Trigger file download
  const blob = new Blob([dxf], { type: 'application/dxf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.dxf`;
  a.click();
}

// Convert Hex color to nearest AutoCAD ACI Color
function getAciColor(hex) {
  const map = {
    '#ff0000': 1, // Red
    '#ffff00': 2, // Yellow
    '#00ff00': 3, // Green
    '#00ffff': 4, // Cyan
    '#00a8ff': 4, // Cyan / Light Blue
    '#0000ff': 5, // Blue
    '#ff00ff': 6, // Magenta
    '#ffffff': 7, // White / Black
    '#ff9900': 30, // Orange
  };
  return map[hex?.toLowerCase()] || 7;
}
