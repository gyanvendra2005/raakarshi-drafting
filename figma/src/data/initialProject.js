export const INITIAL_PAGES = [
  {
    id: 'page-website',
    name: '🌐 SaaS Website Landing Page (Desktop 1440)',
    isProUnlimited: true,
    elements: [
      {
        id: 'frame-desktop-hero',
        type: 'frame',
        name: 'Desktop 1440 - SaaS Landing Page',
        x: 60,
        y: 60,
        width: 1080,
        height: 720,
        fill: '#090d16',
        borderRadius: 20,
        stroke: '#1e293b',
        strokeWidth: 2,
        autoLayout: { enabled: true, direction: 'column', gap: 24, padding: 36, justify: 'start', align: 'stretch' },
        prototypeTarget: 'frame-desktop-pricing',
        children: [
          {
            id: 'web-nav-bar',
            type: 'rect',
            name: 'Navigation Bar Row',
            width: 1008,
            height: 52,
            fill: '#111827',
            borderRadius: 16,
            stroke: '#1f2937',
            strokeWidth: 1,
            autoLayout: { enabled: true, direction: 'row', gap: 20, padding: 16, justify: 'between', align: 'center' },
          },
          {
            id: 'web-badge-pill',
            type: 'rect',
            name: 'Announcement Pill',
            width: 320,
            height: 34,
            fill: '#1e1b4b',
            borderRadius: 17,
            stroke: '#4338ca',
            strokeWidth: 1,
          },
          {
            id: 'web-hero-title',
            type: 'text',
            name: 'Hero H1 Heading',
            text: 'Build Intelligent Software\n10x Faster with Agentic AI',
            fontSize: 44,
            fontWeight: '900',
            fontFamily: 'Inter',
            fill: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.15
          },
          {
            id: 'web-hero-sub',
            type: 'text',
            name: 'Hero Subtitle',
            text: 'Reverse engineer APIs, generate production-ready React components, and deploy scalable cloud agents with zero lock-in.',
            fontSize: 16,
            fontWeight: '400',
            fontFamily: 'Inter',
            fill: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.6
          },
          {
            id: 'web-cta-row',
            type: 'component',
            name: 'CTA Button: Get Started Free ❖',
            width: 340,
            height: 54,
            fill: '#0d99ff',
            borderRadius: 16,
            prototypeTarget: 'frame-desktop-pricing',
            dropShadow: { x: 0, y: 12, blur: 28, color: 'rgba(13, 153, 255, 0.45)' },
            text: 'Get Started Free (View Pricing) →'
          },
          {
            id: 'web-preview-card',
            type: 'rect',
            name: 'Live App Terminal Preview Card',
            width: 1008,
            height: 280,
            fill: '#0f172a',
            borderRadius: 18,
            stroke: '#334155',
            strokeWidth: 2,
            dropShadow: { x: 0, y: 20, blur: 40, color: 'rgba(0, 0, 0, 0.6)' },
          }
        ]
      },
      {
        id: 'frame-desktop-pricing',
        type: 'frame',
        name: 'Desktop 1440 - Pricing Plans Modal',
        x: 1200,
        y: 60,
        width: 1080,
        height: 720,
        fill: '#0b0f19',
        borderRadius: 20,
        stroke: '#1e293b',
        strokeWidth: 2,
        autoLayout: { enabled: true, direction: 'column', gap: 28, padding: 40, justify: 'start', align: 'stretch' },
        prototypeTarget: 'frame-desktop-hero',
        children: [
          {
            id: 'pricing-title',
            type: 'text',
            name: 'Pricing Heading',
            text: 'Simple, Transparent Pricing for Teams',
            fontSize: 36,
            fontWeight: '800',
            fontFamily: 'Inter',
            fill: '#ffffff',
            textAlign: 'center'
          },
          {
            id: 'pricing-sub',
            type: 'text',
            name: 'Pricing Subtitle',
            text: 'Choose the plan that fits your growth. Upgrade or cancel anytime.',
            fontSize: 16,
            fontWeight: '400',
            fontFamily: 'Inter',
            fill: '#94a3b8',
            textAlign: 'center'
          },
          {
            id: 'pricing-tier-card',
            type: 'rect',
            name: 'Pro Tier Feature Card',
            width: 1000,
            height: 380,
            fill: '#1e1e24',
            borderRadius: 24,
            stroke: '#0d99ff',
            strokeWidth: 2,
            dropShadow: { x: 0, y: 16, blur: 32, color: 'rgba(13, 153, 255, 0.2)' },
          },
          {
            id: 'btn-back-to-home',
            type: 'component',
            name: 'Back to Hero Button ❖',
            width: 320,
            height: 50,
            fill: '#334155',
            borderRadius: 14,
            prototypeTarget: 'frame-desktop-hero',
            text: '← Back to Website Homepage'
          }
        ]
      }
    ]
  },
  {
    id: 'page-mobile',
    name: '📱 Mobile App Screens',
    isProUnlimited: true,
    elements: [
      {
        id: 'frame-welcome',
        type: 'frame',
        name: 'iPhone 16 - Welcome Screen',
        x: 80,
        y: 80,
        width: 375,
        height: 680,
        fill: '#0f172a',
        borderRadius: 44,
        stroke: '#334155',
        strokeWidth: 2,
        autoLayout: { enabled: true, direction: 'column', gap: 24, padding: 32, justify: 'between', align: 'center' },
        prototypeTarget: 'frame-dashboard',
        children: [
          {
            id: 'brand-badge',
            type: 'rect',
            name: 'Logo Pill',
            width: 72,
            height: 72,
            fill: '#0d99ff',
            borderRadius: 24,
            dropShadow: { x: 0, y: 12, blur: 24, color: 'rgba(13, 153, 255, 0.4)' },
          },
          {
            id: 'text-hero-title',
            type: 'text',
            name: 'Hero Title',
            text: 'Design in\nNext Gen UI',
            fontSize: 32,
            fontWeight: '800',
            fontFamily: 'Inter',
            fill: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2
          },
          {
            id: 'text-hero-sub',
            type: 'text',
            name: 'Hero Subtitle',
            text: 'Experience Figma Pro with Auto Layout, Dev Mode, & Interactive Prototypes.',
            fontSize: 14,
            fontWeight: '400',
            fontFamily: 'Inter',
            fill: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.5
          },
          {
            id: 'btn-get-started',
            type: 'component',
            name: 'Primary Button ❖',
            width: 310,
            height: 54,
            fill: '#0d99ff',
            borderRadius: 16,
            prototypeTarget: 'frame-dashboard',
            dropShadow: { x: 0, y: 8, blur: 20, color: 'rgba(13, 153, 255, 0.4)' },
            text: 'Get Started →'
          }
        ]
      },
      {
        id: 'frame-dashboard',
        type: 'frame',
        name: 'iPhone 16 - Home Dashboard',
        x: 520,
        y: 80,
        width: 375,
        height: 680,
        fill: '#18181b',
        borderRadius: 44,
        stroke: '#27272a',
        strokeWidth: 2,
        autoLayout: { enabled: true, direction: 'column', gap: 20, padding: 28, justify: 'start', align: 'stretch' },
        prototypeTarget: 'frame-welcome',
        children: [
          {
            id: 'dash-header-row',
            type: 'rect',
            name: 'Profile Header Bar',
            width: 319,
            height: 48,
            fill: '#27272a',
            borderRadius: 24,
          },
          {
            id: 'text-dash-greeting',
            type: 'text',
            name: 'Welcome Back Header',
            text: 'Hello, Alex! 👋',
            fontSize: 24,
            fontWeight: '700',
            fontFamily: 'Inter',
            fill: '#ffffff',
            textAlign: 'left'
          },
          {
            id: 'card-balance',
            type: 'rect',
            name: 'Gradient Balance Card',
            width: 319,
            height: 140,
            fill: '#7b61ff',
            borderRadius: 20,
            dropShadow: { x: 0, y: 10, blur: 25, color: 'rgba(123, 97, 255, 0.35)' },
          },
          {
            id: 'card-analytics',
            type: 'rect',
            name: 'Analytics Metric Card',
            width: 319,
            height: 180,
            fill: '#27272a',
            borderRadius: 20,
            stroke: '#3f3f46',
            strokeWidth: 1,
          },
          {
            id: 'btn-back-welcome',
            type: 'component',
            name: 'Back Button ❖',
            width: 319,
            height: 48,
            fill: '#3f3f46',
            borderRadius: 14,
            prototypeTarget: 'frame-welcome',
            text: '← Back to Welcome Screen'
          }
        ]
      }
    ]
  },
  {
    id: 'page-tokens',
    name: '🎨 Design System & UI Kit',
    isProUnlimited: true,
    elements: [
      {
        id: 'frame-components',
        type: 'frame',
        name: 'Master Components Library',
        x: 80,
        y: 80,
        width: 800,
        height: 500,
        fill: '#1e1e24',
        borderRadius: 16,
        stroke: '#2e2e38',
        strokeWidth: 2,
        autoLayout: { enabled: true, direction: 'column', gap: 32, padding: 40, justify: 'start', align: 'start' },
        children: [
          {
            id: 'title-ds',
            type: 'text',
            name: 'Design System Heading',
            text: '❖ Master Components & Design Tokens',
            fontSize: 28,
            fontWeight: '800',
            fill: '#0d99ff'
          },
          {
            id: 'btn-variant-primary',
            type: 'component',
            name: 'Button / Primary ❖',
            width: 220,
            height: 48,
            fill: '#0d99ff',
            borderRadius: 12,
            text: 'Primary Action'
          },
          {
            id: 'btn-variant-secondary',
            type: 'component',
            name: 'Button / Secondary ❖',
            width: 220,
            height: 48,
            fill: '#7b61ff',
            borderRadius: 12,
            text: 'Secondary Action'
          },
          {
            id: 'badge-pro',
            type: 'rect',
            name: 'Status Badge ❖',
            width: 140,
            height: 36,
            fill: '#22c55e',
            borderRadius: 18,
          }
        ]
      }
    ]
  }
];

export const DESIGN_TOKENS = {
  colors: [
    { name: 'Primary / Blue 500', value: '#0D99FF' },
    { name: 'Accent / Purple 500', value: '#7B61FF' },
    { name: 'Success / Green 500', value: '#00C853' },
    { name: 'Warning / Amber 500', value: '#FFB300' },
    { name: 'Danger / Red 500', value: '#F24822' },
    { name: 'Dark / Surface 900', value: '#0F172A' },
    { name: 'Dark / Surface 800', value: '#1E1E24' },
    { name: 'Light / Text 100', value: '#F8FAFC' },
  ],
  typography: [
    { name: 'Display / Large', font: 'Inter', size: 36, weight: '800' },
    { name: 'Heading / H1', font: 'Inter', size: 28, weight: '700' },
    { name: 'Heading / H2', font: 'Inter', size: 20, weight: '600' },
    { name: 'Body / Medium', font: 'Inter', size: 14, weight: '400' },
    { name: 'Caption / Small', font: 'Inter', size: 12, weight: '500' },
  ]
};

export const VERSION_SNAPSHOTS = [
  { id: 'v-3', name: 'v2.0 - SaaS Landing Page & Pricing Modal', timestamp: 'Just now', author: 'Alex (Lead Designer)', active: true },
  { id: 'v-2', name: 'v1.5 - Interactive Prototyping Connections', timestamp: '1 hour ago', author: 'Alex (Lead Designer)', active: false },
  { id: 'v-1', name: 'v1.0 - Initial Wireframes & Design Tokens', timestamp: 'Yesterday', author: 'Alex (Lead Designer)', active: false }
];
