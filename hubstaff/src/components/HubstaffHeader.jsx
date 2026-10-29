import React from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  ChevronDown, 
  ScanFace,
  Zap,
  Building,
  LogOut
} from 'lucide-react';
import { useHubstaff } from '../context/HubstaffContext';

export default function HubstaffHeader() {
  const {
    currentUser,
    logout,
    isTracking,
    trackedSeconds,
    toggleTimer,
    formatTime,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    liveActivityRate,
    setShowFaceLockModal,
  } = useHubstaff();

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <header className="h-16 bg-[#1b327b] text-white px-6 flex items-center justify-between shadow-sm select-none shrink-0 z-30">
      {/* 1. BRAND */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <Building className="w-5 h-5 text-[#1b327b]" />
          </div>
          <span className="text-white font-black">Raakarshi Drafting</span>
        </div>
      </div>

      {/* 2. TIME TRACKER WIDGET */}
      <div className="flex items-center bg-[#132357] border border-blue-400/20 rounded-2xl p-1.5 px-3.5 shadow-inner space-x-4">
        {/* Play / Stop Button */}
        <button
          onClick={toggleTimer}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition shadow ${
            isTracking
              ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          {isTracking ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          <span>{isTracking ? 'STOP TIMER' : 'START TIMER'}</span>
        </button>

        {/* Stopwatch Display */}
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-blue-300 font-semibold">Today's Shift</span>
          <span className="font-mono text-base font-bold text-white tracking-wide">
            {formatTime(trackedSeconds)}
          </span>
        </div>

        <div className="h-7 w-px bg-white/10" />

        {/* Project Selector */}
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-blue-300 font-semibold">Current Project</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-transparent text-white text-xs font-semibold outline-none cursor-pointer max-w-[180px] truncate"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="text-gray-900 bg-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-7 w-px bg-white/10" />

        {/* Live Activity Rate Gauge */}
        <div className="flex items-center space-x-1.5 bg-white/10 px-2 py-1 rounded-lg">
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-blue-200">Activity</span>
            <span className="text-xs font-bold text-yellow-300">{isTracking ? `${liveActivityRate}%` : 'Idle'}</span>
          </div>
        </div>
      </div>

      {/* 3. CURRENT USER & LOGOUT */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5 text-right">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">
              {currentUser.name}
            </span>
            <span className="text-[11px] text-blue-200 capitalize">
              {currentUser.role === 'admin' ? 'Administrator' : (currentUser.designation || 'Drafter')}
            </span>
          </div>
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-white/30"
            />
            <span className={`w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 border-2 border-[#1b327b] ${isTracking ? 'bg-emerald-400' : 'bg-slate-400'}`} />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 hover:bg-white/10 rounded-xl text-blue-200 hover:text-white transition flex items-center space-x-1"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
