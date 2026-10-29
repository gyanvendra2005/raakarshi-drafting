import React from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Mail, 
  Briefcase
} from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function EmployeesAdminView() {
  const { members, setShowAddEmployeeModal, deleteEmployee, formatTime } = useHubstaff();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Employees & Attendance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage company drafters, monthly salary records, and face punch credentials.
          </p>
        </div>

        <button
          onClick={() => setShowAddEmployeeModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Employee</span>
        </button>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Staff Directory</h3>
          <span className="text-xs text-slate-500">
            Total Members: <b>{members.length}</b>
          </span>
        </div>

        {members.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <h4 className="text-sm font-bold text-slate-700">No Employees Enrolled Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click "+ Add Employee" above to onboard your drafting staff with their face punch credentials.
            </p>
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add First Employee</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Employee</th>
                  <th className="py-3 px-5">Designation</th>
                  <th className="py-3 px-5">Monthly Salary</th>
                  <th className="py-3 px-5">Today's Hours</th>
                  <th className="py-3 px-5">Attendance</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5 flex items-center space-x-3">
                      <img
                        src={member.facePunchRecord || member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{member.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{member.email}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 font-medium text-slate-700">
                      {member.designation || member.role}
                    </td>

                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                      ₹{Number(member.monthlySalary || 28000).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
                    </td>

                    <td className="py-3.5 px-5 font-mono text-slate-700">
                      {formatTime(member.todaySeconds || 0)}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        member.status === 'online'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span className="capitalize">{member.status || 'Offline'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => deleteEmployee(member.id)}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition"
                        title="Remove Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
