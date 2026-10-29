import React from 'react';
import { DollarSign, Download, Receipt, CheckCircle, ArrowRight, IndianRupee, ShieldCheck } from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function PayrollView() {
  const { members, setShowInvoiceModal, formatHours } = useHubstaff();

  const totalMonthlyPayroll = members.reduce(
    (sum, m) => sum + (m.monthlySalary || 28000),
    0
  );

  const avgMonthlySalary = members.length > 0 
    ? Math.round(totalMonthlyPayroll / members.length)
    : 28000;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Monthly Drafting Payroll & Invoices</h2>
          <p className="text-xs text-slate-500">Corporate monthly salary compensation & client billing records</p>
        </div>

        <button
          onClick={() => setShowInvoiceModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
        >
          <Receipt className="w-4 h-4" />
          <span>Generate Client Invoice</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Monthly Payroll</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            ₹{totalMonthlyPayroll.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Fixed monthly commitment</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Monthly Drafter Salary</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            ₹{avgMonthlySalary.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ mo</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Across {members.length} team drafters</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Disbursement Cycle</span>
          <div className="text-2xl font-black text-slate-900 mt-1">Monthly</div>
          <div className="text-[11px] text-blue-600 font-bold mt-1">1st of Every Month via NEFT/IMPS</div>
        </div>
      </div>

      {/* Team Member Payroll Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Monthly Staff Salary Roster</h3>
          <span className="text-xs font-semibold text-slate-500">Raakarshi Drafting Solutions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Team Member</th>
                <th className="py-3 px-5">Designation</th>
                <th className="py-3 px-5">Monthly Fixed Salary</th>
                <th className="py-3 px-5">Shift Hours Logged</th>
                <th className="py-3 px-5">Net Monthly Payout</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                    No drafting staff enrolled yet. Go to "Team & Face Punches" to onboard employees.
                  </td>
                </tr>
              ) : (
                members.map((m) => {
                  const salary = m.monthlySalary || 28000;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-5 flex items-center space-x-3">
                        <img 
                          src={m.facePunchRecord || m.avatar} 
                          alt={m.name} 
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200" 
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{m.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{m.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-700">
                        {m.designation || m.role}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-800">
                        ₹{salary.toLocaleString()} / mo
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-600">
                        {formatHours(m.weeklySeconds || 0)}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-black text-emerald-700 text-sm">
                        ₹{salary.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          Ready for Payout ✓
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
