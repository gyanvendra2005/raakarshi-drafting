import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  FileText,
  User,
  Filter,
  Lock
} from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function LeavePortalView() {
  const {
    currentUser,
    leaveBalances,
    leaveRequests,
    setShowApplyLeaveModal,
    approveLeave,
    rejectLeave,
  } = useHubstaff();

  const isAdmin = currentUser.role === 'admin';
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Fallback default balance if new employee
  const defaultBalance = {
    CL: { name: 'Casual Leave (CL)', total: 12, used: 0, available: 12, color: '#3b82f6' },
    SL: { name: 'Sick Leave (SL)', total: 8, used: 0, available: 8, color: '#10b981' },
    PL: { name: 'Privilege Leave (PL)', total: 15, used: 0, available: 15, color: '#8b5cf6' },
    CompOff: { name: 'Compensatory Off', total: 4, used: 0, available: 4, color: '#f59e0b' },
  };

  // Employee sees strictly their own balances
  const userBalance = leaveBalances[currentUser.id] || (isAdmin ? (leaveBalances['usr-admin'] || defaultBalance) : defaultBalance);

  // Filter requests: Employee strictly only sees their own requests
  const filteredRequests = leaveRequests.filter((r) => {
    const isOwner = isAdmin ? true : (r.memberId === currentUser.id);
    if (!isOwner) return false;
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. HEADER & APPLY BUTTON */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Leave Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'Review, approve, and manage company leave requests and balances'
              : 'Apply for leave, view available quotas, and track request status'}
          </p>
        </div>

        {/* Apply for Leave Button */}
        <button
          onClick={() => setShowApplyLeaveModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* 2. LEAVE BALANCE CARDS (ABACUS DESK HRMS QUOTAS) */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(userBalance).map(([key, item]) => {
          const percentUsed = Math.round((item.used / item.total) * 100);

          return (
            <div
              key={key}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{item.name}</span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-slate-900">{item.available}</span>
                <span className="text-xs text-slate-400 font-semibold">Available</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Used: {item.used} days</span>
                  <span>Total: {item.total} days</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentUsed}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. LEAVE REQUESTS & APPROVALS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {isAdmin ? 'Company Leave Applications & Approvals' : 'My Leave Application History'}
            </h3>
            <p className="text-xs text-slate-500">Track application status and manager decisions</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg transition ${
                  filterStatus === status
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                {isAdmin && <th className="py-3 px-5">Employee</th>}
                <th className="py-3 px-5">Leave Type</th>
                <th className="py-3 px-5">Duration (Dates)</th>
                <th className="py-3 px-5">Days</th>
                <th className="py-3 px-5">Nature</th>
                <th className="py-3 px-5">Reason</th>
                <th className="py-3 px-5">Applied On</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">{isAdmin ? 'Action' : 'Approved By'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition">
                  {isAdmin && (
                    <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                        {req.memberName.charAt(0)}
                      </div>
                      <span>{req.memberName}</span>
                    </td>
                  )}

                  <td className="py-3.5 px-5 font-semibold text-slate-800">
                    {req.leaveType}
                  </td>

                  <td className="py-3.5 px-5 font-mono text-slate-600">
                    {req.fromDate} → {req.toDate}
                  </td>

                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    {req.days} {req.days > 1 ? 'Days' : 'Day'}
                  </td>

                  <td className="py-3.5 px-5 text-slate-500">
                    {req.halfDay || 'Full Day'}
                  </td>

                  <td className="py-3.5 px-5 text-slate-600 max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </td>

                  <td className="py-3.5 px-5 text-slate-500 font-mono">
                    {req.appliedOn}
                  </td>

                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  {/* Actions column */}
                  <td className="py-3.5 px-5 text-right">
                    {isAdmin && req.status === 'Pending' ? (
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => approveLeave(req.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow transition"
                        >
                          Approve ✓
                        </button>
                        <button
                          onClick={() => rejectLeave(req.id)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] shadow transition"
                        >
                          Reject ✗
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-medium">
                        {req.actionBy}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
