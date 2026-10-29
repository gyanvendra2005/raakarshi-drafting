import React, { useState } from 'react';
import { X, CalendarDays, Send, AlertCircle, FileText } from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function ApplyLeaveModal() {
  const { showApplyLeaveModal, setShowApplyLeaveModal, applyLeave, currentUser } = useHubstaff();

  const [leaveType, setLeaveType] = useState('Casual Leave (CL)');
  const [halfDay, setHalfDay] = useState('Full Day');
  const [fromDate, setFromDate] = useState('2026-11-04');
  const [toDate, setToDate] = useState('2026-11-05');
  const [reason, setReason] = useState('');
  const [handoverColleague, setHandoverColleague] = useState('');

  if (!showApplyLeaveModal) return null;

  // Calculate day difference
  const calculateDays = () => {
    if (halfDay !== 'Full Day') return 0.5;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
  };

  const daysCount = calculateDays();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    applyLeave({
      leaveType,
      fromDate,
      toDate,
      days: daysCount,
      halfDay,
      reason: reason.trim() + (handoverColleague ? ` (Handover: ${handoverColleague})` : ''),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Apply for Leave (HRMS Portal)</h3>
              <p className="text-xs text-slate-500">Submit time-off request for HR approval</p>
            </div>
          </div>
          <button
            onClick={() => setShowApplyLeaveModal(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Leave Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Leave Category:</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                <option value="Privilege Leave (PL)">Privilege Leave (PL)</option>
                <option value="Compensatory Off">Compensatory Off (Comp-Off)</option>
              </select>
            </div>

            {/* Leave Nature (Full vs Half) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Session / Half:</label>
              <select
                value={halfDay}
                onChange={(e) => setHalfDay(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="Full Day">Full Day</option>
                <option value="1st Half (Morning)">1st Half (Morning)</option>
                <option value="2nd Half (Afternoon)">2nd Half (Afternoon)</option>
              </select>
            </div>
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">From Date:</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">To Date:</label>
              <input
                type="date"
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Total Days Calculation Banner */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 font-semibold">
            <span>Calculated Leave Duration:</span>
            <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded shadow-sm">
              {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Leave:</label>
            <textarea
              required
              rows="2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State purpose of leave (e.g. medical appointment, family wedding)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
            />
          </div>

          {/* Handover Colleague */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Work Handover Colleague (Optional):</label>
            <input
              type="text"
              value={handoverColleague}
              onChange={(e) => setHandoverColleague(e.target.value)}
              placeholder="e.g. Sarah Chen (UI Designer)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Leave Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
