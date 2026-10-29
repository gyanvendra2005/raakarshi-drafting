export const TEMPLATES = [
  {
    id: 't-modern-sale',
    name: 'Flash Sale Promo',
    category: 'Social Media',
    isPro: false,
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80',
    canvasSize: { width: 1080, height: 1080 },
    elements: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#0f172a' },
      { type: 'circle', left: 540, top: 380, radius: 260, fill: '#ff007f' },
      { type: 'i-text', text: 'MEGA SALE', left: 540, top: 220, fontSize: 88, fill: '#ffffff', fontWeight: 'bold', fontFamily: 'Montserrat', originX: 'center' },
      { type: 'i-text', text: 'UP TO 70% OFF', left: 540, top: 340, fontSize: 52, fill: '#facc15', fontWeight: 'bold', fontFamily: 'Montserrat', originX: 'center' },
      { type: 'rect', left: 340, top: 680, width: 400, height: 90, rx: 45, ry: 45, fill: '#ffffff' },
      { type: 'i-text', text: 'SHOP NOW', left: 540, top: 705, fontSize: 32, fill: '#0f172a', fontWeight: 'bold', fontFamily: 'Montserrat', originX: 'center' },
      { type: 'i-text', text: 'Limited time offer • Free shipping included', left: 540, top: 880, fontSize: 24, fill: '#94a3b8', fontFamily: 'Inter', originX: 'center' }
    ]
  },
  {
    id: 't-youtube-thumb',
    name: 'Tech Video Thumbnail',
    category: 'YouTube',
    isPro: true,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
    canvasSize: { width: 1280, height: 720 },
    elements: [
      { type: 'rect', left: 0, top: 0, width: 1280, height: 720, fill: '#1e1b4b' },
      { type: 'rect', left: 0, top: 0, width: 680, height: 720, fill: '#4338ca' },
      { type: 'i-text', text: 'AI IN 2026', left: 60, top: 140, fontSize: 92, fill: '#38bdf8', fontWeight: 'bold', fontFamily: 'Anton' },
      { type: 'i-text', text: 'IS INSANE! 🔥', left: 60, top: 260, fontSize: 80, fill: '#ffffff', fontWeight: 'bold', fontFamily: 'Anton' },
      { type: 'rect', left: 60, top: 400, width: 420, height: 70, rx: 12, ry: 12, fill: '#ef4444' },
      { type: 'i-text', text: 'MUST WATCH REVIEW', left: 270, top: 418, fontSize: 28, fill: '#ffffff', fontWeight: 'bold', fontFamily: 'Inter', originX: 'center' }
    ]
  },
  {
    id: 't-motivational-quote',
    name: 'Minimalist Quote Poster',
    category: 'Posters',
    isPro: false,
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80',
    canvasSize: { width: 1080, height: 1350 },
    elements: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1350, fill: '#f8fafc' },
      { type: 'rect', left: 80, top: 80, width: 920, height: 1190, stroke: '#0f172a', strokeWidth: 4, fill: 'transparent' },
      { type: 'i-text', text: '“', left: 540, top: 280, fontSize: 160, fill: '#6366f1', fontFamily: 'Playfair Display', originX: 'center' },
      { type: 'i-text', text: 'DO WHAT YOU CAN,\nWITH WHAT YOU HAVE,\nWHERE YOU ARE.', left: 540, top: 460, fontSize: 44, fill: '#1e293b', fontWeight: 'bold', fontFamily: 'Playfair Display', textAlign: 'center', originX: 'center' },
      { type: 'line', x1: 440, y1: 720, x2: 640, y2: 720, stroke: '#6366f1', strokeWidth: 4 },
      { type: 'i-text', text: 'THEODORE ROOSEVELT', left: 540, top: 760, fontSize: 22, fill: '#64748b', fontFamily: 'Inter', letterSpacing: 4, originX: 'center' }
    ]
  },
  {
    id: 't-food-menu',
    name: 'Gourmet Burger Special',
    category: 'Food & Dining',
    isPro: true,
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    canvasSize: { width: 1080, height: 1080 },
    elements: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#18181b' },
      { type: 'circle', left: 540, top: 420, radius: 280, fill: '#27272a' },
      { type: 'i-text', text: 'ARTISAN SMASH BURGER', left: 540, top: 120, fontSize: 62, fill: '#f59e0b', fontWeight: 'bold', fontFamily: 'Anton', originX: 'center' },
      { type: 'i-text', text: 'Fresh Angus Beef • Brioche Bun • Truffle Mayo', left: 540, top: 210, fontSize: 24, fill: '#a1a1aa', fontFamily: 'Inter', originX: 'center' },
      { type: 'rect', left: 410, top: 740, width: 260, height: 80, rx: 20, ry: 20, fill: '#ef4444' },
      { type: 'i-text', text: '$12.99 ONLY', left: 540, top: 762, fontSize: 32, fill: '#ffffff', fontWeight: 'bold', fontFamily: 'Montserrat', originX: 'center' }
    ]
  },
  {
    id: 't-conference-banner',
    name: 'Tech Summit 2026',
    category: 'Business',
    isPro: true,
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
    canvasSize: { width: 1200, height: 630 },
    elements: [
      { type: 'rect', left: 0, top: 0, width: 1200, height: 630, fill: '#030712' },
      { type: 'rect', left: 800, top: -100, width: 500, height: 800, fill: '#7c3aed', angle: 25 },
      { type: 'i-text', text: 'GLOBAL TECH SUMMIT', left: 80, top: 120, fontSize: 56, fill: '#ffffff', fontWeight: 'bold', fontFamily: 'Montserrat' },
      { type: 'i-text', text: 'THE FUTURE OF ARTIFICIAL INTELLIGENCE', left: 80, top: 200, fontSize: 28, fill: '#c084fc', fontFamily: 'Inter' },
      { type: 'i-text', text: '📅 NOV 15-18 • SAN FRANCISCO & VIRTUAL', left: 80, top: 320, fontSize: 22, fill: '#9ca3af', fontFamily: 'Inter' },
      { type: 'rect', left: 80, top: 410, width: 280, height: 60, rx: 30, ry: 30, fill: '#22c55e' },
      { type: 'i-text', text: 'REGISTER FREE', left: 220, top: 428, fontSize: 22, fill: '#052e16', fontWeight: 'bold', fontFamily: 'Inter', originX: 'center' }
    ]
  }
];
