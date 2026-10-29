import React from 'react';
import { 
  Clock, 
  DollarSign, 
  Users, 
  Zap, 
  TrendingUp, 
  FolderGit2, 
  ScanFace,
  CheckCircle2, 
  ArrowRight,
  IndianRupee
} from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function DashboardView() {
  const {
    currentUser,
    members,
    projects,
    timeEntries,
    formatHours,
    formatTime,
    trackedSeconds,
    liveActivityRate,
    setShowFaceLockModal,
  } = useHubstaff();

  const isAdmin = currentUser.role === 'admin';

  // Stats for Admin
  const totalTodaySeconds = members.reduce((sum, m) => sum + (m.todaySeconds || 0), 0);
  const activeMembersOnline = members.filter((m) => m.status === 'online').length;
  const avgActivity = members.length > 0
    ? Math.round(members.reduce((sum, m) => sum + (m.activityRate || 85), 0) / members.length)
    : 0;

  // Employee Personalized View
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        {/* Employee Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 text-white shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black">Welcome Back, {currentUser.name}</h2>
            <p className="text-xs text-blue-100">
              Shift tracking and timesheet overview for today.
            </p>
          </div>

          {/* Biometric Status Card */}
          <div
            onClick={() => setShowFaceLockModal(true)}
            className="bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur p-4 rounded-2xl cursor-pointer transition text-left space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-blue-200 font-semibold uppercase">Face Attendance</span>
              <ScanFace className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>{currentUser.faceLockEnabled ? 'Active' : 'Not Set'}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-cyan-200 flex items-center space-x-1">
              <span>Verify Face</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </span>
          </div>
        </div>

        {/* Employee Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracked Time (Today)</span>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{formatTime(trackedSeconds)}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Shift active</div>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Productivity Score</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{liveActivityRate}%</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Active input rate</div>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weekly Target</span>
              <div className="text-2xl font-black text-slate-900 mt-1">34.2 <span className="text-sm text-slate-400">/ 40h</span></div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">85% achieved</div>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* My Recent Timesheet Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Recent Timesheet Entries</h3>
            <span className="text-xs text-slate-400">Today</span>
          </div>
          <div className="space-y-2">
            {timeEntries
              .filter((e) => e.memberId === currentUser.id)
              .slice(0, 5)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{entry.projectName}</span>
                    <span className="text-slate-500 ml-2">({entry.task})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-slate-800">{formatTime(entry.durationSeconds)}</span>
                    <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Admin View (Company Overview)
  return (
    <div className="space-y-6">
      {/* 1. ADMIN METRIC STATS */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Time Today</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{formatHours(totalTodaySeconds)}</div>
            <div className="flex items-center text-[11px] text-emerald-600 font-medium mt-1 space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Normal shift tracking</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Staff Online</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {activeMembersOnline} <span className="text-sm font-semibold text-slate-400">/ {members.length}</span>
            </div>
            <div className="flex items-center text-[11px] text-emerald-600 font-medium mt-1 space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Drafters clocked in</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Team Productivity</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{avgActivity}%</div>
            <div className="flex items-center text-[11px] text-slate-500 font-medium mt-1 space-x-1">
              <span>Overall studio pace</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Projects</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{projects.length}</div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">
              In progress
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <FolderGit2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME TEAM ACTIVITY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Staff Attendance & Shift Logs</h3>
            <p className="text-xs text-slate-500">Real-time status of drafting team</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Member</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Active Project</th>
                <th className="py-3 px-5">Today's Hours</th>
                <th className="py-3 px-5">Productivity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 font-semibold">
                    No employees enrolled yet. Use "Employees & Attendance" to onboard staff.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5 flex items-center space-x-3">
                      <img
                        src={member.facePunchRecord || member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{member.name}</div>
                        <div className="text-[11px] text-slate-500">{member.designation || member.role}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          member.status === 'online'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.status === 'online'
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="capitalize">{member.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-5 font-medium text-slate-800">
                      {member.currentProject}
                    </td>

                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                      {formatTime(member.todaySeconds || 0)}
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${member.activityRate || 85}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700 text-[11px]">
                          {member.activityRate || 85}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
