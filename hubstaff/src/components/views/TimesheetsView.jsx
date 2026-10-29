import React, { useState } from 'react';
import { Clock, Plus, Check, Download, Filter, Calendar, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function TimesheetsView() {
  const {
    timeEntries,
    setShowManualTimeModal,
    approveTimeEntry,
    formatTime,
    currentUser,
  } = useHubstaff();

  const isAdmin = currentUser?.role === 'admin';
  const [filterProject, setFilterProject] = useState('ALL');

  // Strict Data Scoping: Employees ONLY see their own entries
  const scopedEntries = isAdmin
    ? timeEntries
    : timeEntries.filter((e) => e.memberId === currentUser?.id);

  const filtered = filterProject === 'ALL'
    ? scopedEntries
    : scopedEntries.filter((e) => e.projectName === filterProject);

  // Available projects for filter
  const uniqueProjects = Array.from(new Set(scopedEntries.map((e) => e.projectName)));

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isAdmin ? 'Timesheet Approvals' : 'My Timesheets'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'Review and manage recorded drafting team work logs'
              : 'Tracked work intervals and approval status'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Project Filter */}
          {uniqueProjects.length > 1 && (
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none shadow-sm cursor-pointer"
            >
              <option value="ALL">All My Projects</option>
              {uniqueProjects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}

          {/* Add Manual Time Button */}
          <button
            onClick={() => setShowManualTimeModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Time</span>
          </button>
        </div>
      </div>

      {/* Timesheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                {isAdmin && <th className="py-3 px-5">Team Member</th>}
                <th className="py-3 px-5">Project & Task</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Time Interval</th>
                <th className="py-3 px-5">Duration</th>
                <th className="py-3 px-5">Billable</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">
                  {isAdmin ? 'Action' : 'Manager Status'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 8 : 7}
                    className="py-12 text-center text-slate-400 font-semibold"
                  >
                    No timesheet logs found for your account.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition">
                    {isAdmin && (
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {entry.memberName}
                      </td>
                    )}
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-800">{entry.projectName}</div>
                      <div className="text-[11px] text-slate-500">{entry.task}</div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 font-medium">
                      {entry.date}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-500">
                      {entry.startTime} – {entry.endTime}
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                      {formatTime(entry.durationSeconds)}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        Yes ($)
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          entry.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {isAdmin ? (
                        entry.status === 'Pending' ? (
                          <button
                            onClick={() => approveTimeEntry(entry.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow transition"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Approved ✓</span>
                        )
                      ) : (
                        <span className="text-slate-500 text-[11px] font-semibold">
                          {entry.status === 'Approved' ? 'Verified by Admin ✓' : 'Awaiting HR Review ⏳'}
                        </span>
                      )}
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
