import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-black text-slate-900">Privacy & Monitoring Policies</h2>
        <p className="text-xs text-slate-500">Corporate configuration ensuring 100% employee trust</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        {/* Policy Item 1: Screenshots */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-sm">Automated Desktop Screen Capture</h3>
              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                LOCKED OFF
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Prevents the application from taking periodic screen grabs, recording video feeds, or capturing sensitive confidential customer data.
            </p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
            <Lock className="w-3.5 h-3.5" />
            <span>Strictly Disabled</span>
          </div>
        </div>

        {/* Policy Item 2: Keystroke */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-sm">Keystroke Logging (Keylogger)</h3>
              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                LOCKED OFF
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Individual keyboard characters, passwords, or typed messages are never recorded or logged under any circumstances.
            </p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
            <Lock className="w-3.5 h-3.5" />
            <span>Strictly Disabled</span>
          </div>
        </div>

        {/* Policy Item 3: Activity Level */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Macro Activity Percentage Sampling</h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Measures percentage of time during an interval where input was detected (e.g. 85% active during a 10-minute block).
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
            Active (Anonymous)
          </span>
        </div>

        {/* Policy Item 4: Idle Timeout */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">Idle Timeout Stop Prompt</h3>
            <p className="text-xs text-slate-500 max-w-xl">
              If an employee steps away from their desk for more than 10 minutes, the timer prompts to discard or keep idle time.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            10 Minutes
          </span>
        </div>
      </div>
    </div>
  );
}
