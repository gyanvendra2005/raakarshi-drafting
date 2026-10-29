import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Clock, 
  Receipt, 
  ShieldCheck, 
  ScanFace, 
  Shield, 
  UserCheck, 
  CalendarDays,
  Users
} from 'lucide-react';
import { useHubstaff } from '../context/HubstaffContext';

export default function HubstaffSidebar() {
  const { activeTab, setActiveTab, currentUser, setShowFaceLockModal } = useHubstaff();

  const isAdmin = currentUser.role === 'admin';

  // Navigation Items for Raakarshi Drafting
  const navItems = isAdmin
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees & Attendance', icon: Users },
        { id: 'leave', label: 'Leave Management', icon: CalendarDays },
        { id: 'activity', label: 'Team Activity', icon: Activity },
        { id: 'timesheets', label: 'Timesheets', icon: Clock },
        { id: 'payroll', label: 'Payroll & Invoices', icon: Receipt },
        { id: 'settings', label: 'Settings', icon: ShieldCheck },
      ]
    : [
        { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        { id: 'leave', label: 'Leave Requests', icon: CalendarDays },
        { id: 'timesheets', label: 'My Timesheets', icon: Clock },
        { id: 'facelock', label: 'Face Attendance', icon: ScanFace, isAction: true },
        { id: 'settings', label: 'Settings', icon: ShieldCheck },
      ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between py-4 select-none shrink-0 z-20">
      <div className="space-y-1 px-3">
        {/* User Identity Header */}
        <div className="px-3 py-2 mb-2 flex items-center space-x-2.5 border-b border-slate-100 pb-3">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 capitalize">
              {isAdmin ? 'Administrator' : 'Employee'}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAction) {
                  setShowFaceLockModal(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Subtle Corporate Footer */}
      <div className="px-4 py-2 border-t border-slate-100">
        <div className="text-[11px] text-slate-400 font-medium">
          Raakarshi Drafting Portal
        </div>
      </div>
    </aside>
  );
}
