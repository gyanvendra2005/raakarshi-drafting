// Raakarshi Drafting - Enterprise Data Store
// All dummy employee data wiped clean as per user instruction.

export const INITIAL_MEMBERS = [];

export const INITIAL_PROJECTS = [
  {
    id: 'p1',
    name: 'Architectural Layout & Floor Plans',
    client: 'Skyline Builders & Developers',
    color: '#2563eb', // Blue
    budgetHours: 250,
    hourlyRate: 65,
    tasks: ['2D Floor Plan Drafting', 'Site Boundary Measurement', 'Section & Elevation Sheets'],
  },
  {
    id: 'p2',
    name: '3D Elevation & BIM Modeling',
    client: 'Aura Heights Luxury Living',
    color: '#7c3aed', // Purple
    budgetHours: 180,
    hourlyRate: 75,
    tasks: ['Revit 3D Modeling', 'Exterior Facade Texturing', 'Photorealistic Lumion Render'],
  },
  {
    id: 'p3',
    name: 'Structural Steel Drafting',
    client: 'Apex Infrastructure Ltd.',
    color: '#059669', // Emerald
    budgetHours: 200,
    hourlyRate: 70,
    tasks: ['RCC Beam & Column Detailing', 'Steel Trusses Fabrication Drawings', 'Foundation Layout Plan'],
  },
  {
    id: 'p4',
    name: 'MEP CAD Coordination',
    client: 'Nexus Commercial Plaza',
    color: '#ea580c', // Orange
    budgetHours: 160,
    hourlyRate: 60,
    tasks: ['Electrical Lighting & Conduit Layout', 'HVAC Ducting Route', 'Plumbing & Drainage Schematics'],
  }
];

export const INITIAL_TIME_ENTRIES = [];

export const INITIAL_LEAVE_BALANCES = {
  'usr-admin': {
    CL: { name: 'Casual Leave (CL)', available: 12, used: 0, total: 12, color: '#3b82f6' },
    SL: { name: 'Sick Leave (SL)', available: 10, used: 0, total: 10, color: '#ef4444' },
    PL: { name: 'Privilege Leave (PL)', available: 15, used: 0, total: 15, color: '#10b981' },
    CompOff: { name: 'Compensatory Off', available: 4, used: 0, total: 4, color: '#8b5cf6' },
  }
};

export const INITIAL_LEAVE_REQUESTS = [];
