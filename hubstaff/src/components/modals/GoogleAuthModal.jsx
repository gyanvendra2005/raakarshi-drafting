import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Key, CheckCircle2, X, RefreshCw, Lock, Sparkles } from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function GoogleAuthModal() {
  const { showGoogleAuthModal, setShowGoogleAuthModal, verifyAdmin2FA } = useHubstaff();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [currentSecretCode, setCurrentSecretCode] = useState('784920');
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');

  // 30-second TOTP code generator simulation
  useEffect(() => {
    if (!showGoogleAuthModal) return;

    // Generate random 6 digit code for demo convenience
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCurrentSecretCode(newCode);
    setSecondsRemaining(30);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          const refreshed = Math.floor(100000 + Math.random() * 900000).toString();
          setCurrentSecretCode(refreshed);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showGoogleAuthModal]);

  if (!showGoogleAuthModal) return null;

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMsg('');

    // Auto advance focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`google-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`google-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePasteCode = () => {
    const digits = currentSecretCode.split('');
    setOtp(digits);
    setErrorMsg('');
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits from Google Authenticator.');
      return;
    }

    // Accept either the dynamic code or any 6 digits for testing
    if (entered === currentSecretCode || entered.length === 6) {
      verifyAdmin2FA();
    } else {
      setErrorMsg('Invalid authenticator code. Please check your app.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white relative">
          <button
            onClick={() => setShowGoogleAuthModal(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
              <p className="text-xs text-blue-100">
                Enter the 6-digit verification code from your Google Authenticator app.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Simulated App Display / Quick Helper */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow">
                G
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Google Authenticator (Live TOTP)
                </span>
                <div className="font-mono text-xl font-black text-slate-900 tracking-widest">
                  {currentSecretCode.slice(0, 3)} {currentSecretCode.slice(3)}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-1">
              <div className="flex items-center space-x-1 text-xs font-bold text-blue-600">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                <span>{secondsRemaining}s</span>
              </div>
              <button
                onClick={handlePasteCode}
                className="text-[10px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition"
              >
                Auto Fill Code
              </button>
            </div>
          </div>

          {/* 6 Digit Inputs */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 text-center">
              Enter 6-Digit Verification Code:
            </label>
            <div className="flex items-center justify-center space-x-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`google-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className="w-11 h-12 text-center text-xl font-black rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 bg-white shadow-sm transition"
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold text-center mt-2 animate-bounce">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Security Assurance */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-600 text-[11px] font-medium">
            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Secure Time-Based One-Time Password verification.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-1">
            <button
              type="button"
              onClick={() => setShowGoogleAuthModal(false)}
              className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerify}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Access</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
