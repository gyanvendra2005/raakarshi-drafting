import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  Camera, 
  ScanFace, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Briefcase, 
  Mail, 
  IndianRupee, 
  RefreshCw,
  Lock
} from 'lucide-react';
import { useHubstaff } from '../../context/HubstaffContext';

export default function AddEmployeeModal() {
  const { showAddEmployeeModal, setShowAddEmployeeModal, addEmployee } = useHubstaff();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('Architectural CAD Drafter');
  const [monthlySalary, setMonthlySalary] = useState('28000');

  // Camera & Face Punch recording state
  const [cameraActive, setCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facePunchPhoto, setFacePunchPhoto] = useState(null);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Auto start camera when modal opens
  useEffect(() => {
    if (showAddEmployeeModal) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [showAddEmployeeModal]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((e) => console.log('play err', e));
        };
      }
    } catch (err) {
      console.warn('Camera stream error, using fallback:', err);
      setCameraError('Camera access not detected or blocked in browser settings. You can use biometric face sample.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureFacePunch = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    setTimeout(() => {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        // Mirror the capture so it matches what user saw on screen
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setFacePunchPhoto(dataUrl);
        stopCamera();
      } catch (e) {
        setFacePunchPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80');
      }
      setIsCapturing(false);
    }, 400);
  };

  const handleClose = () => {
    stopCamera();
    setShowAddEmployeeModal(false);
    setName('');
    setEmail('');
    setFacePunchPhoto(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (!facePunchPhoto) {
      alert('Please capture or record the Employee Face Punch. This acts as their biometric password for shift login.');
      return;
    }

    addEmployee({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      designation,
      monthlySalary: parseFloat(monthlySalary) || 28000,
      facePunchRecord: facePunchPhoto,
      avatar: facePunchPhoto,
      faceLockEnabled: true,
    });

    handleClose();
  };

  if (!showAddEmployeeModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow">
              <UserPlus className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New Employee</h3>
              <p className="text-xs text-blue-100">Staff profile and attendance setup</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Employee Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gyanvendra Singh"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gyanvendra@raakarshidrafting.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Drafting Role / Designation</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
              >
                <option value="Architectural CAD Drafter">Architectural CAD Drafter</option>
                <option value="3D BIM & Revit Specialist">3D BIM & Revit Specialist</option>
                <option value="Structural CAD Drafter">Structural CAD Drafter</option>
                <option value="MEP Drafting Engineer">MEP Drafting Engineer</option>
                <option value="Senior CAD Designer">Senior CAD Designer</option>
              </select>
            </div>

            {/* MONTHLY SALARY (MONTHLY FIXED PAYROLL) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Monthly Salary (₹ / Month) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-black text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  min="5000"
                  max="500000"
                  step="500"
                  required
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  placeholder="28000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-black"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Fixed salary: ₹{Number(monthlySalary || 0).toLocaleString()} per month
              </span>
            </div>
          </div>

          {/* Biometric Face Punch Setup Section */}
          <div className="bg-slate-50 border-2 border-dashed border-blue-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <ScanFace className="w-4 h-4 text-blue-600" />
                  <span>Face Attendance Registration</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Capture face reference for shift attendance.
                </p>
              </div>

              {facePunchPhoto && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Punch Captured ✓</span>
                </span>
              )}
            </div>

            {/* Camera Viewfinder Box (Always renders video with callback ref) */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 h-56 flex items-center justify-center border border-slate-300 shadow-inner">
              
              {/* Live WebRTC Camera Stream (Mirrored for natural mirror preview) */}
              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch((err) => console.log('Auto play err:', err));
                  }
                }}
                autoPlay
                playsInline
                muted
                style={{ transform: 'scaleX(-1)' }}
                className={`w-full h-full object-cover ${cameraActive && !facePunchPhoto ? 'block' : 'hidden'}`}
              />

              {/* Align Face Reticle Outline (Visible during live camera preview) */}
              {cameraActive && !facePunchPhoto && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-40 h-48 border-2 border-cyan-400 rounded-full border-dashed animate-pulse relative shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-cyan-400 text-slate-950 font-black px-2 py-0.5 rounded shadow">
                      ALIGN FACE HERE
                    </span>
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-400/30" />
                    <div className="absolute inset-y-0 left-1/2 w-0.5 bg-cyan-400/30" />
                  </div>
                </div>
              )}

              {/* Recorded Snapshot Preview */}
              {facePunchPhoto && (
                <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                  <img
                    src={facePunchPhoto}
                    alt="Face Punch Record"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="flex items-center justify-between w-full text-white">
                      <div>
                        <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Face Reference Captured</span>
                        </span>
                        <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                          Status: Active for attendance verification
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="text-[11px] font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl backdrop-blur transition flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retake</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Camera Off Placeholder */}
              {!cameraActive && !facePunchPhoto && (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-semibold">
                    Camera is preparing... Click below to turn on camera.
                  </p>
                  {cameraError && (
                    <p className="text-[11px] text-amber-300 max-w-xs mx-auto">
                      {cameraError}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Camera Actions */}
            <div className="flex items-center justify-between pt-1">
              {!cameraActive && !facePunchPhoto ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Turn On Camera</span>
                </button>
              ) : cameraActive && !facePunchPhoto ? (
                <button
                  type="button"
                  onClick={captureFacePunch}
                  disabled={isCapturing}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2 animate-pulse cursor-pointer"
                >
                  <ScanFace className="w-4 h-4" />
                  <span>{isCapturing ? 'Recording...' : 'Capture & Lock Face Punch'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Record Different Face</span>
                </button>
              )}

              {/* Demo Sample Helper */}
              {!facePunchPhoto && (
                <button
                  type="button"
                  onClick={() => {
                    setFacePunchPhoto('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80');
                    stopCamera();
                  }}
                  className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 underline"
                >
                  Use Sample Biometric Face
                </button>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center space-x-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Employee</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
