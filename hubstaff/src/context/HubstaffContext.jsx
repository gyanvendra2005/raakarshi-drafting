import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { 
  INITIAL_MEMBERS, 
  INITIAL_PROJECTS, 
  INITIAL_TIME_ENTRIES,
  INITIAL_LEAVE_BALANCES,
  INITIAL_LEAVE_REQUESTS 
} from '../data/hubstaffData';
import { generateJWT, decodeJWT, PRESET_USERS } from '../utils/jwt';

const HubstaffContext = createContext();

export const HubstaffProvider = ({ children }) => {
  // 1. MANDATORY AUTH GATE (Must Login first - does NOT open directly!)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Persistent members state for Raakarshi Drafting
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('raakarshi_members');
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch (e) {
      return INITIAL_MEMBERS;
    }
  });

  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [timeEntries, setTimeEntries] = useState(INITIAL_TIME_ENTRIES);

  // Leave Management State (Abacus Desk HRMS Architecture)
  const [leaveBalances, setLeaveBalances] = useState(INITIAL_LEAVE_BALANCES);
  const [leaveRequests, setLeaveRequests] = useState(INITIAL_LEAVE_REQUESTS);

  // Time Tracker Stopwatch State
  const [isTracking, setIsTracking] = useState(false);
  const [trackedSeconds, setTrackedSeconds] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState('p1');
  const [liveActivityRate, setLiveActivityRate] = useState(90);

  // Modals
  const [showManualTimeModal, setShowManualTimeModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showFaceLockModal, setShowFaceLockModal] = useState(false);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showFaceLoginModal, setShowFaceLoginModal] = useState(false);
  const [targetLoginEmployee, setTargetLoginEmployee] = useState(null);

  const [selectedInvoiceProject, setSelectedInvoiceProject] = useState('p1');

  const timerRef = useRef(null);

  // Sync members to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('raakarshi_members', JSON.stringify(members));
    } catch (e) {
      console.error(e);
    }
  }, [members]);

  // Admin Login Flow (requires Google Authenticator 2FA)
  const startAdminLoginFlow = () => {
    setShowGoogleAuthModal(true);
  };

  // Google Authenticator Verification Success
  const verifyAdmin2FA = () => {
    const adminUser = PRESET_USERS.admin;
    const token = generateJWT(adminUser);
    setJwtToken(token);
    setCurrentUser(decodeJWT(token));
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    setShowGoogleAuthModal(false);
  };

  // Direct login helper (fallback / test)
  const login = (role = 'admin') => {
    if (role === 'admin') {
      startAdminLoginFlow();
      return;
    }
    // If employee login requested directly, use first enrolled employee or prompt
    if (members.length > 0) {
      setTargetLoginEmployee(members[0]);
      setShowFaceLoginModal(true);
    } else {
      alert("No employees enrolled yet. Please login as Admin (Rahul Agrawal) to onboard your drafting team with their Face Punch records.");
    }
  };

  // Employee Login via Face Punch (Biometric Password)
  const loginWithFacePunch = (employee) => {
    const empUser = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: 'employee',
      designation: employee.designation,
      avatar: employee.avatar || employee.facePunchRecord,
      monthlySalary: employee.monthlySalary || 28000,
      facePunchRecord: employee.facePunchRecord,
      faceLockEnabled: true,
    };

    const token = generateJWT(empUser);
    setJwtToken(token);
    setCurrentUser(decodeJWT(token));
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    setShowFaceLoginModal(false);

    // Auto mark member as online & start shift
    setMembers((prev) =>
      prev.map((m) => (m.id === employee.id ? { ...m, status: 'online' } : m))
    );
    setIsTracking(true);
  };

  // Add / Onboard Employee with Face Punch Record
  const addEmployee = (employeeData) => {
    const newId = `emp-${Date.now()}`;
    const newMember = {
      id: newId,
      todaySeconds: 0,
      weeklySeconds: 0,
      status: 'offline',
      activityRate: 88,
      currentProject: projects[0]?.name || 'Architectural Layout & Floor Plans',
      currentTask: 'Initial Site Plan Drafting',
      ...employeeData,
    };

    const updated = [newMember, ...members];
    setMembers(updated);

    // Initialize leave balance for new employee
    setLeaveBalances((prev) => ({
      ...prev,
      [newId]: {
        CL: { name: 'Casual Leave (CL)', available: 12, used: 0, total: 12, color: '#3b82f6' },
        SL: { name: 'Sick Leave (SL)', available: 10, used: 0, total: 10, color: '#ef4444' },
        PL: { name: 'Privilege Leave (PL)', available: 15, used: 0, total: 15, color: '#10b981' },
        CompOff: { name: 'Compensatory Off', available: 4, used: 0, total: 4, color: '#8b5cf6' },
      }
    }));

    confetti({ particleCount: 60, spread: 60 });
  };

  // Delete Employee
  const deleteEmployee = (id) => {
    if (confirm("Are you sure you want to remove this employee from Raakarshi Drafting?")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // Logout handler
  const logout = () => {
    if (currentUser?.role === 'employee') {
      // Set employee offline upon logout
      setMembers((prev) =>
        prev.map((m) => (m.id === currentUser.id ? { ...m, status: 'offline' } : m))
      );
    }
    setIsAuthenticated(false);
    setJwtToken(null);
    setCurrentUser(null);
    setIsTracking(false);
    setActiveTab('dashboard');
  };

  // Safe tab change (Enforces role-based route protection)
  const handleSetActiveTab = (tab) => {
    if (currentUser?.role === 'employee' && (tab === 'activity' || tab === 'payroll' || tab === 'employees')) {
      console.warn(`[Security Guard] Access denied to tab '${tab}' for role 'employee'.`);
      return;
    }
    setActiveTab(tab);
  };

  // Toggle Face Lock Status
  const setFaceLockStatus = (enabled) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, faceLockEnabled: enabled };
    const newToken = generateJWT(updatedUser);
    setJwtToken(newToken);
    setCurrentUser(updatedUser);

    setMembers((prev) =>
      prev.map((m) =>
        m.id === currentUser.id ? { ...m, faceLockEnabled: enabled } : m
      )
    );
  };

  // Apply for Leave (Employee ESS Portal)
  const applyLeave = (leaveData) => {
    if (!currentUser) return;

    const newRequest = {
      id: `lr-${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      appliedOn: 'Today',
      status: 'Pending',
      actionBy: '-',
      ...leaveData,
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setShowApplyLeaveModal(false);
  };

  // Approve Leave (Manager / Admin ONLY)
  const approveLeave = (requestId) => {
    if (currentUser?.role !== 'admin') {
      console.warn('[Security Guard] Unauthorized: Only administrators can approve leaves');
      return;
    }

    const req = leaveRequests.find((r) => r.id === requestId);
    if (!req) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'Approved', actionBy: `Rahul Agrawal (Director)` }
          : r
      )
    );

    // Deduct leave days from balance
    const memId = req.memberId;
    const leaveKey = req.leaveType.includes('CL')
      ? 'CL'
      : req.leaveType.includes('SL')
      ? 'SL'
      : req.leaveType.includes('PL')
      ? 'PL'
      : 'CompOff';

    setLeaveBalances((prev) => {
      const userBal = prev[memId] || prev['usr-admin'];
      if (!userBal || !userBal[leaveKey]) return prev;

      return {
        ...prev,
        [memId]: {
          ...userBal,
          [leaveKey]: {
            ...userBal[leaveKey],
            used: userBal[leaveKey].used + (req.days || 1),
            available: Math.max(0, userBal[leaveKey].available - (req.days || 1)),
          },
        },
      };
    });
  };

  // Reject Leave (Manager / Admin ONLY)
  const rejectLeave = (requestId) => {
    if (currentUser?.role !== 'admin') {
      console.warn('[Security Guard] Unauthorized: Only administrators can reject leaves');
      return;
    }

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'Rejected', actionBy: `Rahul Agrawal (Director)` }
          : r
      )
    );
  };

  // Stopwatch timer
  useEffect(() => {
    if (isTracking && currentUser) {
      timerRef.current = setInterval(() => {
        setTrackedSeconds((prev) => prev + 1);

        setMembers((prev) =>
          prev.map((m) =>
            m.id === currentUser.id
              ? {
                  ...m,
                  todaySeconds: (m.todaySeconds || 0) + 1,
                  weeklySeconds: (m.weeklySeconds || 0) + 1,
                  status: 'online',
                }
              : m
          )
        );
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTracking, currentUser]);

  const toggleTimer = () => {
    if (!currentUser) return;

    if (isTracking) {
      const currProject = projects.find((p) => p.id === selectedProjectId);
      const newEntry = {
        id: `te-${Date.now()}`,
        memberId: currentUser.id,
        memberName: currentUser.name,
        projectName: currProject?.name || 'Architectural Layout & Floor Plans',
        task: 'CAD Elevation Review & Drafting',
        date: 'Today',
        startTime: '09:00 AM',
        endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationSeconds: trackedSeconds || 3600,
        activityRate: liveActivityRate,
        billable: true,
        status: currentUser.role === 'admin' ? 'Approved' : 'Pending',
      };
      setTimeEntries([newEntry, ...timeEntries]);
      setIsTracking(false);
    } else {
      setIsTracking(true);
    }
  };

  const formatTime = (totalSeconds = 0) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const formatHours = (totalSeconds = 0) => {
    return (totalSeconds / 3600).toFixed(1) + ' hrs';
  };

  const addManualTimeEntry = (entryData) => {
    const newEntry = {
      id: `te-${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      date: 'Today',
      activityRate: 90,
      status: currentUser.role === 'admin' ? 'Approved' : 'Pending',
      billable: true,
      ...entryData,
    };
    setTimeEntries([newEntry, ...timeEntries]);
    setShowManualTimeModal(false);
  };

  const approveTimeEntry = (id) => {
    if (currentUser?.role !== 'admin') return;
    setTimeEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Approved' } : e))
    );
  };

  const downloadClientInvoice = (projectId) => {
    if (currentUser?.role !== 'admin') return;
    const proj = projects.find((p) => p.id === projectId) || projects[0];
    const doc = new jsPDF();

    doc.setFillColor(32, 58, 143);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RAAKARSHI DRAFTING - CLIENT INVOICE', 14, 26);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Drafting Project: ${proj.name}`, 14, 55);
    doc.text(`Client: ${proj.client}`, 14, 63);
    doc.text(`Approved By: Rahul Agrawal (Director)`, 14, 71);
    doc.text(`Company: Raakarshi Drafting Solutions`, 14, 79);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 90, 196, 90);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 14, 100);
    doc.text('Hours Tracked', 100, 100);
    doc.text('Rate', 140, 100);
    doc.text('Amount ($)', 175, 100);
    doc.line(14, 105, 196, 105);

    doc.setFont('helvetica', 'normal');
    const billedHours = 40.0;
    const totalAmount = billedHours * proj.hourlyRate;
    doc.text(`2D/3D CAD & Architectural Drafting`, 14, 115);
    doc.text(`${billedHours} hrs`, 100, 115);
    doc.text(`$${proj.hourlyRate}/hr`, 140, 115);
    doc.text(`$${totalAmount.toLocaleString()}`, 175, 115);

    doc.line(14, 125, 196, 125);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Due: $${totalAmount.toLocaleString()} USD`, 130, 138);

    doc.save(`Invoice_Raakarshi_${proj.name.replace(/\s+/g, '_')}.pdf`);
    setShowInvoiceModal(false);
  };

  return (
    <HubstaffContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        jwtToken,
        currentUser,
        activeTab,
        setActiveTab: handleSetActiveTab,
        members,
        projects,
        timeEntries,
        isTracking,
        trackedSeconds,
        selectedProjectId,
        setSelectedProjectId,
        liveActivityRate,
        toggleTimer,
        formatTime,
        formatHours,
        showManualTimeModal,
        setShowManualTimeModal,
        showInvoiceModal,
        setShowInvoiceModal,
        showAddProjectModal,
        setShowAddProjectModal,
        showFaceLockModal,
        setShowFaceLockModal,
        showApplyLeaveModal,
        setShowApplyLeaveModal,
        showGoogleAuthModal,
        setShowGoogleAuthModal,
        showAddEmployeeModal,
        setShowAddEmployeeModal,
        showFaceLoginModal,
        setShowFaceLoginModal,
        targetLoginEmployee,
        setTargetLoginEmployee,
        startAdminLoginFlow,
        verifyAdmin2FA,
        addEmployee,
        deleteEmployee,
        loginWithFacePunch,
        selectedInvoiceProject,
        setSelectedInvoiceProject,
        setFaceLockStatus,
        addManualTimeEntry,
        approveTimeEntry,
        leaveBalances,
        leaveRequests,
        applyLeave,
        approveLeave,
        rejectLeave,
        downloadClientInvoice,
      }}
    >
      {children}
    </HubstaffContext.Provider>
  );
};

export const useHubstaff = () => useContext(HubstaffContext);
