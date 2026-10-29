import React from 'react';
import { FolderGit2, Plus, Users, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function ProjectsView() {
  const { projects, setShowAddProjectModal } = useHubstaff();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Projects & Budgets</h2>
          <p className="text-xs text-slate-500">Manage client billable rates, budgets, and tasks</p>
        </div>

        <button
          onClick={() => setShowAddProjectModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">{proj.name}</h3>
                <span className="text-xs text-slate-500 font-medium">Client: {proj.client}</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                ${proj.hourlyRate} / hr
              </span>
            </div>

            {/* Budget Bar */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Budget Allocated:</span>
                <span className="font-bold text-slate-900">{proj.budgetHours} Hours</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full bg-blue-600" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Tasks List */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Active Tasks:
              </span>
              <div className="space-y-1.5">
                {proj.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50/70 p-2 rounded-xl"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
