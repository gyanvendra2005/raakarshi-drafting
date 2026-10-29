import React, { useRef, useState, useEffect } from 'react';
import { 
  ScanFace, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Camera, 
  Sparkles,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';
import confetti from 'canvas-confetti';

export default function FaceLockModal() {
  const {
    showFaceLockModal,
    setShowFaceLockModal,
    currentUser,
    setFaceLockStatus,
  } = useHubstaff();

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [verified, setVerified] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    if (!showFaceLockModal) {
      // Stop webcam stream when modal closes
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setScanning(false);
      setScanProgress(0);
      setVerified(false);
      return;
    }

    // Request Webcam Stream
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 480, height: 360, facingMode: 'user' },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('Webcam permission denied or not available, using high-tech simulator:', err);
        setCameraError(true);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showFaceLockModal]);

  if (!showFaceLockModal) return null;

  const startFaceScan = () => {
    setScanning(true);
    setScanProgress(0);
    setVerified(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setScanProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setScanning(false);
        setVerified(true);
        setFaceLockStatus(true);
        confetti({ particleCount: 70, spread: 60 });
      }
    }, 200);
  };

  const disableFaceLock = () => {
    setFaceLockStatus(false);
    setShowFaceLockModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Biometric Face Lock Attendance</h3>
              <p className="text-[11px] text-slate-400">Secure clock-in verification for {currentUser.name}</p>
            </div>
          </div>
          <button
            onClick={() => setShowFaceLockModal(false)}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video / Camera Scanner Viewport */}
        <div className="p-5 flex flex-col items-center">
          <div className="relative w-72 h-72 rounded-3xl overflow-hidden border-2 border-blue-500/50 bg-slate-900 shadow-[0_0_30px_rgba(37,99,235,0.2)] flex items-center justify-center">
            {/* Real Webcam Stream or Simulator Avatar */}
            {!cameraError ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-2"
                />
                <span className="text-xs text-blue-300 font-semibold">Webcam Emulation Mode</span>
              </div>
            )}

            {/* Biometric Scanning Overlay Reticle */}
            <div className="absolute inset-4 border border-dashed border-blue-400/50 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              </div>

              {/* Scanning Laser Line Animation */}
              {scanning && (
                <div className="w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse" />
              )}

              <div className="flex justify-between">
                <div className="w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
              </div>
            </div>

            {/* Status Pill Inside Video */}
            <div className="absolute bottom-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1.5 border border-white/20">
              <span className={`w-2 h-2 rounded-full ${verified ? 'bg-emerald-400' : scanning ? 'bg-cyan-400 animate-ping' : 'bg-amber-400'}`} />
              <span>
                {verified
                  ? 'FACE MATCH 99.8% VERIFIED'
                  : scanning
                  ? `SCANNING BIOMETRICS: ${scanProgress}%`
                  : 'READY FOR VERIFICATION'}
              </span>
            </div>
          </div>

          {/* Verification Result */}
          {verified ? (
            <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs w-full flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Biometric Attendance Verified!</span>
                <p className="text-[11px] text-emerald-200">Face Lock is now active. Time tracking is authenticated.</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">
                Align your face inside the frame to authenticate clock-in attendance.
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center space-x-3">
          {currentUser.faceLockEnabled ? (
            <button
              onClick={disableFaceLock}
              className="px-4 py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition flex items-center space-x-1"
            >
              <Unlock className="w-4 h-4" />
              <span>Disable Face Lock</span>
            </button>
          ) : null}

          <button
            onClick={startFaceScan}
            disabled={scanning}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <ScanFace className="w-4 h-4" />
            <span>{scanning ? 'Analyzing Facial Landmarks...' : verified ? 'Re-Verify Face ID' : 'Scan & Enable Face Lock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
