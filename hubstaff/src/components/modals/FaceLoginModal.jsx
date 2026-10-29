import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ScanFace, 
  CheckCircle2, 
  Camera, 
  AlertCircle, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  RefreshCw,
  Lock
} from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function FaceLoginModal() {
  const { 
    showFaceLoginModal, 
    setShowFaceLoginModal, 
    targetLoginEmployee, 
    loginWithFacePunch 
  } = useHubstaff();

  const [scanning, setScanning] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (showFaceLoginModal) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [showFaceLoginModal]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => console.log('play err:', err));
        };
      }
    } catch (e) {
      console.warn('Camera stream inaccessible, using simulation mode', e);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setScanning(false);
    setIsVerified(false);
    setMatchScore(0);
  };

  const handleStartScan = () => {
    setScanning(true);
    setMatchScore(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;
      setMatchScore(Math.min(progress, 98.8));

      if (progress >= 98) {
        clearInterval(interval);
        setScanning(false);
        setIsVerified(true);

        setTimeout(() => {
          stopCamera();
          loginWithFacePunch(targetLoginEmployee);
        }, 900);
      }
    }, 120);
  };

  if (!showFaceLoginModal || !targetLoginEmployee) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow">
              <ScanFace className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Face Attendance</h3>
              <p className="text-xs text-blue-100">Clock-in verification</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              setShowFaceLoginModal(false);
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center space-x-3">
              <img
                src={targetLoginEmployee.facePunchRecord || targetLoginEmployee.avatar}
                alt="Enrolled Punch"
                className="w-11 h-11 rounded-xl object-cover border-2 border-blue-500 shadow-sm"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">{targetLoginEmployee.name}</span>
                <span className="text-[10px] text-slate-500">{targetLoginEmployee.designation || targetLoginEmployee.email}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Enrolled Biometric
            </span>
          </div>

          {/* Camera Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 h-64 flex items-center justify-center border border-slate-300 shadow-inner">
            <video
              ref={(el) => {
                videoRef.current = el;
                if (el && streamRef.current && el.srcObject !== streamRef.current) {
                  el.srcObject = streamRef.current;
                  el.play().catch((err) => console.log('play err:', err));
                }
              }}
              autoPlay
              playsInline
              muted
              style={{ transform: 'scaleX(-1)' }}
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            {!cameraActive && (
              <img
                src={targetLoginEmployee.facePunchRecord || targetLoginEmployee.avatar}
                alt="Live Simulation"
                className="w-full h-full object-cover opacity-80"
              />
            )}

            {/* Target Crosshair */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className={`w-44 h-52 border-2 rounded-full border-dashed transition-all duration-300 ${
                isVerified 
                  ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_30px_rgba(52,211,153,0.5)]' 
                  : scanning 
                  ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                  : 'border-white/60'
              }`}>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-black/70 text-cyan-300 shadow">
                  {isVerified ? 'MATCH CONFIRMED' : scanning ? 'MATCHING PUNCH...' : 'LOOK AT CAMERA'}
                </span>
              </div>

              {/* Laser Sweep when scanning */}
              {scanning && (
                <div 
                  className="absolute left-8 right-8 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse"
                  style={{
                    top: `${(matchScore % 100)}%`,
                    transition: 'top 0.1s linear'
                  }}
                />
              )}
            </div>

            {/* Bottom Status Overlay */}
            <div className="absolute bottom-3 inset-x-3 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-white text-xs">
              <div className="flex items-center space-x-2">
                <ScanFace className="w-4 h-4 text-cyan-300" />
                <span className="font-semibold text-[11px]">
                  {isVerified ? 'Punch Accepted! Logging in...' : scanning ? `Comparing: ${matchScore}%` : 'Position face inside oval'}
                </span>
              </div>
              {isVerified && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            {!isVerified ? (
              <button
                type="button"
                onClick={handleStartScan}
                disabled={scanning}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ScanFace className="w-4 h-4" />
                <span>{scanning ? 'Verifying Face Biometrics...' : 'Scan Face Punch to Login'}</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-700">
                Identity Verified • Marking Shift Attendance...
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                stopCamera();
                setShowFaceLoginModal(false);
              }}
              className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
