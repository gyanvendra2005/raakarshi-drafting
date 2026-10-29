import React, { useState } from 'react';
import { X, Clock, Plus } from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function ManualTimeModal() {
  const { showManualTimeModal, setShowManualTimeModal, addManualTimeEntry, projects } = useHubstaff();

  const [projectName, setProjectName] = useState(projects[0]?.name || 'Fintech Mobile App');
  const [task, setTask] = useState('');
  const [durationHours, setDurationHours] = useState('2.0');
  const [reason, setReason] = useState('');

  if (!showManualTimeModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    const hours = parseFloat(durationHours) || 1;
    addManualTimeEntry({
      projectName,
      task: task.trim() + (reason ? ` (${reason})` : ''),
      startTime: '02:00 PM',
      endTime: '04:00 PM',
      durationSeconds: Math.round(hours * 3600),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add Manual Time Entry</h3>
              <p className="text-xs text-slate-500">Subject to manager approval</p>
            </div>
          </div>
          <button
            onClick={() => setShowManualTimeModal(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Project:</label>
            <select
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Task Description:</label>
            <input
              type="text"
              required
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Architecture review with client..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Hours:</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date:</label>
              <input
                type="text"
                disabled
                value="Today"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Manual Entry:</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Offline meeting / Traveling"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Submit Time for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
