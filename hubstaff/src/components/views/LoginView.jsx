import React, { useState } from 'react';
import { 
  Clock, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Shield, 
  UserCheck, 
  Sparkles,
  Building,
  KeyRound,
  ScanFace,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function LoginView() {
  const { 
    startAdminLoginFlow, 
    members, 
    setTargetLoginEmployee, 
    setShowFaceLoginModal 
  } = useHubstaff();

  const [selectedEmpId, setSelectedEmpId] = useState(members[0]?.id || '');
  const [customEmail, setCustomEmail] = useState('');

  const handleEmployeeFaceLogin = (emp) => {
    setTargetLoginEmployee(emp);
    setShowFaceLoginModal(true);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const email = customEmail.trim().toLowerCase();

    if (email.includes('admin') || email.includes('rahul')) {
      startAdminLoginFlow();
    } else {
      const found = members.find((m) => m.email.toLowerCase() === email);
      if (found) {
        handleEmployeeFaceLogin(found);
      } else {
        alert(`Employee with email "${customEmail}" not found. Please ask Rahul Agrawal to onboard you with your Face Punch record.`);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0c183a] via-[#162758] to-[#091124] flex items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Background architectural grid elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Branding */}
        <div className="p-7 text-center bg-slate-50/80 border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1e3a8a] text-white shadow-md mb-2.5">
            <Building className="w-6 h-6 text-cyan-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center space-x-2">
            <span>Raakarshi Drafting</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Architectural CAD & BIM Workforce Portal
          </p>
        </div>

        {/* 2 Roles Access Sections */}
        <div className="p-6 space-y-5">
          
          {/* 1. ADMIN LOGIN WITH GOOGLE AUTHENTICATOR */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-900 text-white rounded-xl shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Administrator Portal</span>
                <span className="text-[11px] text-slate-500">Rahul Agrawal • Protected with 2FA</span>
              </div>
            </div>

            <button
              onClick={startAdminLoginFlow}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Login with Google Authenticator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. EMPLOYEE FACE ATTENDANCE LOGIN */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
                <ScanFace className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Employee Attendance Sign-In</span>
                <span className="text-[11px] text-slate-500">
                  Select your profile and verify your face
                </span>
              </div>
            </div>

            {members.length > 0 ? (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {members.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => handleEmployeeFaceLogin(emp)}
                      className="p-2.5 bg-white border border-slate-200 hover:border-blue-500 rounded-xl flex items-center justify-between cursor-pointer transition shadow-sm hover:shadow"
                    >
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={emp.facePunchRecord || emp.avatar}
                          alt={emp.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{emp.name}</div>
                          <div className="text-[10px] text-slate-500">{emp.designation || emp.role}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                        <ScanFace className="w-3 h-3" />
                        <span>Clock In</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-700">
                  No staff members enrolled yet.
                </p>
                <p className="text-[11px] text-slate-500">
                  Log in as Administrator to add drafters to the company directory.
                </p>
              </div>
            )}
          </div>

          {/* Quick email lookup form */}
          <div className="pt-1 border-t border-slate-100">
            <form onSubmit={handleCustomSubmit} className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600 block">
                Or Enter Registered Work Email:
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="name@raakarshidrafting.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
