import React from 'react';
import { Activity, Clock, Zap } from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function ActivityView() {
  const { members } = useHubstaff();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Team Activity</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Daily active focus intervals and project breakdown across drafting engineers.
        </p>
      </div>

      {/* Activity Breakdown per Member */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-sm">Productivity Rates by Member</h3>
          <span className="text-xs text-slate-500">10-Minute Activity Intervals</span>
        </div>

        <div className="space-y-3 pt-1">
          {members.length === 0 ? (
            <div className="p-10 text-center text-slate-400 font-semibold bg-slate-50/50 rounded-2xl">
              No drafting staff enrolled yet. Go to "Employees & Attendance" to onboard employees.
            </div>
          ) : (
            members.map((m) => (
              <div
                key={m.id}
                className="p-4 border border-slate-100 rounded-2xl hover:border-slate-200 bg-slate-50/50 flex items-center justify-between transition"
              >
                <div className="flex items-center space-x-3.5">
                  <img
                    src={m.facePunchRecord || m.avatar}
                    alt={m.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center space-x-2">
                      <span>{m.name}</span>
                      <span className="text-[11px] text-slate-400">({m.designation || m.role})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Working on: <b className="text-slate-700 font-semibold">{m.currentProject}</b>
                    </div>
                  </div>
                </div>

                {/* Activity Blocks Visualization */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[90, 85, 95, 80, 75, 90, 88, 92].map((val, idx) => (
                      <div
                        key={idx}
                        className="w-3.5 h-7 rounded bg-blue-600/80 hover:bg-blue-600 transition cursor-pointer"
                        style={{ opacity: (val / 100) }}
                        title={`Block ${idx + 1}: ${val}% active`}
                      />
                    ))}
                  </div>

                  <div className="text-right pl-4 border-l border-slate-200 min-w-[70px]">
                    <div className="text-base font-black text-slate-900">{m.activityRate || 85}%</div>
                    <span className="text-[10px] font-semibold text-slate-500">Active</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
