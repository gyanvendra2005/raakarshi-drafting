import React from 'react';
import { X, Receipt, Download, ShieldCheck } from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function InvoiceModal() {
  const {
    showInvoiceModal,
    setShowInvoiceModal,
    projects,
    selectedInvoiceProject,
    setSelectedInvoiceProject,
    downloadClientInvoice,
  } = useHubstaff();

  if (!showInvoiceModal) return null;

  const currentProj = projects.find((p) => p.id === selectedInvoiceProject) || projects[0];
  const billedHours = 48.5;
  const totalDue = Math.round(billedHours * currentProj.hourlyRate);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Generate Client Invoice</h3>
              <p className="text-xs text-slate-500">Auto-calculate from tracked billable hours</p>
            </div>
          </div>
          <button
            onClick={() => setShowInvoiceModal(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Project:</label>
            <select
              value={selectedInvoiceProject}
              onChange={(e) => setSelectedInvoiceProject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.client})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Client:</span>
              <span className="font-bold text-slate-900">{currentProj.client}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tracked Billable Hours:</span>
              <span className="font-bold text-slate-900">{billedHours} hrs</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Hourly Rate:</span>
              <span className="font-bold text-slate-900">${currentProj.hourlyRate} / hr</span>
            </div>
            <div className="h-px bg-slate-200 my-1" />
            <div className="flex justify-between text-sm font-black text-slate-900">
              <span>Total Invoice Amount:</span>
              <span className="text-emerald-600">${totalDue.toLocaleString()} USD</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Includes 100% Privacy Compliance Stamp on the invoice</span>
          </div>

          <button
            onClick={() => downloadClientInvoice(selectedInvoiceProject)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
