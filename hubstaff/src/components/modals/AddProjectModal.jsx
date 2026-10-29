import React, { useState } from 'react';
import { X, FolderGit2, Plus } from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function AddProjectModal() {
  const { showAddProjectModal, setShowAddProjectModal, addProject } = useHubstaff();

  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [budgetHours, setBudgetHours] = useState('150');
  const [hourlyRate, setHourlyRate] = useState('65');

  if (!showAddProjectModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name: name.trim(),
      client: client.trim() || 'Internal Company',
      budgetHours: parseInt(budgetHours) || 100,
      hourlyRate: parseInt(hourlyRate) || 50,
      tasks: ['Sprint 1 Architecture', 'Core Implementation', 'QA Testing'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Create New Project</h3>
              <p className="text-xs text-slate-500">Set budget and client billing</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddProjectModal(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Project Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Customer Support Bot"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Client Name:</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="e.g. Horizon Ventures"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Budget (Hours):</label>
              <input
                type="number"
                value={budgetHours}
                onChange={(e) => setBudgetHours(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Billable Rate ($/hr):</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
